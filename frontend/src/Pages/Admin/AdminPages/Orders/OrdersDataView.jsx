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

  const formatDateTime = (dateTimeString) => {
    const date = new Date(dateTimeString);
    const formattedDate = date.toLocaleDateString("en-GB");
    const formattedTime = date.toLocaleTimeString("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
    });
    return { formattedDate, formattedTime };
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
            {data.data?.map((order,index) => (
              <Col
                className={styles.order_col}
                key={`${order.order_id}_${index}`}  
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
                      {key("shapePrice")}: {order.shape_price}
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
                    <li>
                      <FontAwesomeIcon
                        className={
                          isArLang ? styles.arrow_icon_ar : styles.arrow_icon_en
                        }
                        icon={isArLang ? faCaretLeft : faCaretRight}
                      />
                      {key("totalPrice")}: {order.total_paid}
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
                      {key("customer")}: {order.customer_name}
                    </li>
                    <li>
                      <FontAwesomeIcon
                        className={
                          isArLang ? styles.arrow_icon_ar : styles.arrow_icon_en
                        }
                        icon={isArLang ? faCaretLeft : faCaretRight}
                      />
                      {key("email")}: {order.customer_email}
                    </li>

                    <li>
                      <FontAwesomeIcon
                        className={
                          isArLang ? styles.arrow_icon_ar : styles.arrow_icon_en
                        }
                        icon={isArLang ? faCaretLeft : faCaretRight}
                      />
                      {key("recipient")}: {order.recipient_name}
                    </li>
                    <li>
                      <FontAwesomeIcon
                        className={
                          isArLang ? styles.arrow_icon_ar : styles.arrow_icon_en
                        }
                        icon={isArLang ? faCaretLeft : faCaretRight}
                      />
                      {key("recipientWhatsapp")}: {order.recipient_whatsapp}
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
                      {key("orderId")}: {order._id}
                    </li>
                    <li>
                      <FontAwesomeIcon
                        className={
                          isArLang ? styles.arrow_icon_ar : styles.arrow_icon_en
                        }
                        icon={isArLang ? faCaretLeft : faCaretRight}
                      />
                      {key("cardId")}: {order.card_id}
                    </li>
                    <li>
                      <FontAwesomeIcon
                        className={
                          isArLang ? styles.arrow_icon_ar : styles.arrow_icon_en
                        }
                        icon={isArLang ? faCaretLeft : faCaretRight}
                      />
                      {key("date")}: {formatDateTime(order.order_date).formattedDate}
                    </li>
                    <li>
                      <FontAwesomeIcon
                        className={
                          isArLang ? styles.arrow_icon_ar : styles.arrow_icon_en
                        }
                        icon={isArLang ? faCaretLeft : faCaretRight}
                      />
                      {key("time")}: {formatDateTime(order.order_date).formattedTime}
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
