import React from "react";
import { getAllOrders } from "../../../../util/Http";
import { useQuery } from "@tanstack/react-query";
import LoadingOne from "../../../../Components/Ui/LoadingOne";
import { useTranslation } from "react-i18next";
import styles from "./Orders.module.css";
import noData from "../../../../Images/noData.jpg";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCaretLeft,
  faCaretRight,
  faDownload,
} from "@fortawesome/free-solid-svg-icons";
import * as XLSX from "xlsx";

const OrdersDataView = () => {
  const token = JSON.parse(localStorage.getItem("token"));
  const { t: key } = useTranslation();
  let isArLang = localStorage.getItem("i18nextLng") === "ar";

  const { data } = useQuery({
    queryKey: ["orders", token],
    queryFn: () => getAllOrders({ token }),
    staleTime: Infinity,
    enabled: !!token,
  });

  const handleDownloadExcelSheet = () => {
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(data?.data);
    XLSX.utils.book_append_sheet(wb, ws, key("orderData"));

    XLSX.writeFile(wb, `${key("orderData")}.xlsx`);
  };

  return (
    <Row className={styles.order_col}>
      {data ? (
        data.data?.length > 0 ? (
          <>
            <h4 className="text-secondary mt-2 mb-0">
              {key("downloadExell")}{" "}
              <FontAwesomeIcon
                style={{ cursor: "pointer" }}
                onClick={handleDownloadExcelSheet}
                className="mx-2"
                icon={faDownload}
              />
            </h4>
            {data.data?.map((order) => (
              <Col
                className={styles.order_col}
                key={order.order_id}
                md={6}
                lg={4}
              >
                <div
                  className={`${styles.order_item} ${
                    isArLang && styles.order_item_ar
                  }`}
                >
                  <h4 className={styles.main_title}>{key("orderData")}</h4>
                  <ul>
                    <li>
                      <FontAwesomeIcon
                        className={
                          isArLang ? styles.arrow_icon_ar : styles.arrow_icon_en
                        }
                        icon={isArLang ? faCaretLeft : faCaretRight}
                      />
                      {key("price")}: {order.value}
                    </li>
                    <li>
                      <FontAwesomeIcon
                        className={
                          isArLang ? styles.arrow_icon_ar : styles.arrow_icon_en
                        }
                        icon={isArLang ? faCaretLeft : faCaretRight}
                      />
                      {key("afterDisc")}: {order.price_after_discount}
                    </li>
                    <li>
                      <FontAwesomeIcon
                        className={
                          isArLang ? styles.arrow_icon_ar : styles.arrow_icon_en
                        }
                        icon={isArLang ? faCaretLeft : faCaretRight}
                      />
                      {key("colorPrice")}: {order.color_price}
                    </li>
                    <li>
                      <FontAwesomeIcon
                        className={
                          isArLang ? styles.arrow_icon_ar : styles.arrow_icon_en
                        }
                        icon={isArLang ? faCaretLeft : faCaretRight}
                      />
                      {key("celebrateIcon")} {key("price")}:{" "}
                      {order.celebrate_icon_price}
                    </li>
                    <li>
                      <FontAwesomeIcon
                        className={
                          isArLang ? styles.arrow_icon_ar : styles.arrow_icon_en
                        }
                        icon={isArLang ? faCaretLeft : faCaretRight}
                      />
                      {key("celebrateLink")} {key("price")}:{" "}
                      {order.celebrate_qr_link_price}
                    </li>
                    <li>
                      <FontAwesomeIcon
                        className={
                          isArLang ? styles.arrow_icon_ar : styles.arrow_icon_en
                        }
                        icon={isArLang ? faCaretLeft : faCaretRight}
                      />
                      {key("Vatvalue")}: {order.VAT}
                    </li>
                  </ul>
                  <hr />
                  <h4>{key("customerRec")}</h4>
                  <ul>
                    <li>
                      <FontAwesomeIcon
                        className={
                          isArLang ? styles.arrow_icon_ar : styles.arrow_icon_en
                        }
                        icon={isArLang ? faCaretLeft : faCaretRight}
                      />
                      {key("customer")}: {order.customer}
                    </li>
                    <li>
                      <FontAwesomeIcon
                        className={
                          isArLang ? styles.arrow_icon_ar : styles.arrow_icon_en
                        }
                        icon={isArLang ? faCaretLeft : faCaretRight}
                      />
                      {key("email")}: {order.email}
                    </li>

                    <li>
                      <FontAwesomeIcon
                        className={
                          isArLang ? styles.arrow_icon_ar : styles.arrow_icon_en
                        }
                        icon={isArLang ? faCaretLeft : faCaretRight}
                      />
                      {key("recipient")}: {order.recipient}
                    </li>
                    <li>
                      <FontAwesomeIcon
                        className={
                          isArLang ? styles.arrow_icon_ar : styles.arrow_icon_en
                        }
                        icon={isArLang ? faCaretLeft : faCaretRight}
                      />
                      {key("recipientWhatsapp")}: {order.recipient}
                    </li>
                  </ul>
                  <hr />
                  <h4>{key("idAndDate")}</h4>
                  <ul>
                    <li>
                      <FontAwesomeIcon
                        className={
                          isArLang ? styles.arrow_icon_ar : styles.arrow_icon_en
                        }
                        icon={isArLang ? faCaretLeft : faCaretRight}
                      />
                      {key("orderId")}: {order.order_id}
                    </li>
                    <li>
                      <FontAwesomeIcon
                        className={
                          isArLang ? styles.arrow_icon_ar : styles.arrow_icon_en
                        }
                        icon={isArLang ? faCaretLeft : faCaretRight}
                      />
                      {key("orderDate")}: {order.order_date}
                    </li>
                  </ul>
                </div>
              </Col>
            ))}
          </>
        ) : (
          <div className={styles.noData}>
            <div className={styles.noData_img}>
              <img src={noData} alt="noData" />
            </div>
            <span>{key("noOrders")}</span>
          </div>
        )
      ) : (
        <LoadingOne />
      )}
    </Row>
  );
};

export default OrdersDataView;
