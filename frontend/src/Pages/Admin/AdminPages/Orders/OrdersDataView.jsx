import React, { useState } from "react";
import { getAllOrders } from "../../../../util/Http";
import { useQuery, useQueryClient } from "@tanstack/react-query";
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
  faEye,
} from "@fortawesome/free-solid-svg-icons";
import * as XLSX from "xlsx";
import ConfirmationModal from "../../../../Components/Ui/ConfirmationModal";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import SearchField from "../../../../Components/Ui/SearchField";
import { toast } from "react-toastify";

const OrdersDataView = ({ isUser }) => {
  const notifySuccess = (message) => toast.success(message);
  const notifyError = (message) => toast.error(message);
  const [modalShow, setModalShow] = useState(false);
  const [searchInput, setSearchInput] = useState("");

  const token = JSON.parse(localStorage.getItem("token"));
  const { t: key } = useTranslation();
  let isArLang = localStorage.getItem("i18nextLng") === "ar";
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data, refetch } = useQuery({
    queryKey: ["orders", token],
    queryFn: () => getAllOrders({ token }),
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

  const cancelOrder = async (oderId) => {
    if (oderId && token) {
      try {
        const response = await axios.delete(
          `${process.env.REACT_APP_Base_API_URl}orders/${oderId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        if (response.status === 204) {
          queryClient.invalidateQueries(["walletBalance", token]);
          notifySuccess(key("orderDeleted"));
          refetch();
        } else {
          notifyError(key("wrong"));
        }
      } catch (error) {
        notifyError(key("wrong"));
      }
    } else {
      notifyError(key("deleteOrderWrong"));
    }
  };

  const handleSearch = (e, searchTerm) => {
    e.preventDefault();
    if (searchTerm !== "" && searchTerm !== searchInput) {
      setSearchInput(searchTerm);
      notifySuccess(key("searchFilterApplied"));
    }
  };

  const filteredDisc =
    data?.data?.filter((order) => {
      const searchValue = searchInput.trim().toLowerCase();

      return (
        order?.shop?.toLowerCase().includes(searchValue) ||
        order?.card_id === searchValue ||
        order?.customer_name?.toLowerCase().includes(searchValue) ||
        order?.recipient_name?.toLowerCase().includes(searchValue) ||
        order?.customer_email === searchValue ||
        order?.recipient_whatsapp === searchValue ||
        order?.customer_phone === searchValue ||
        order.order_number === Number(searchValue)
      );
    }) || [];

  return (
    <>
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
              <div className="d-flex flex-wrap justify-content-end my-4">
                <button
                  onClick={() => setSearchInput("")}
                  className="btn btn-outline-danger"
                >
                  {key("default")}
                </button>
                <SearchField onSearch={handleSearch} text={key("search")} />
              </div>
              {filteredDisc?.map((order, index) => (
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
                            isArLang
                              ? styles.arrow_icon_ar
                              : styles.arrow_icon_en
                          }
                          icon={isArLang ? faCaretLeft : faCaretRight}
                        />
                        {key("price")}: {order.value}
                      </li>
                      <li>
                        <FontAwesomeIcon
                          className={
                            isArLang
                              ? styles.arrow_icon_ar
                              : styles.arrow_icon_en
                          }
                          icon={isArLang ? faCaretLeft : faCaretRight}
                        />
                        {key("shapePrice")}: {order.shape_price}
                      </li>
                      <li>
                        <FontAwesomeIcon
                          className={
                            isArLang
                              ? styles.arrow_icon_ar
                              : styles.arrow_icon_en
                          }
                          icon={isArLang ? faCaretLeft : faCaretRight}
                        />
                        {key("colorPrice")}: {order.color_price}
                      </li>
                      <li>
                        <FontAwesomeIcon
                          className={
                            isArLang
                              ? styles.arrow_icon_ar
                              : styles.arrow_icon_en
                          }
                          icon={isArLang ? faCaretLeft : faCaretRight}
                        />
                        {key("celebrateIcon")} {key("price")}:{" "}
                        {order.celebrate_icon_price}
                      </li>
                      <li>
                        <FontAwesomeIcon
                          className={
                            isArLang
                              ? styles.arrow_icon_ar
                              : styles.arrow_icon_en
                          }
                          icon={isArLang ? faCaretLeft : faCaretRight}
                        />
                        {key("celebrateLink")} {key("price")}:{" "}
                        {order.celebrate_qr_link_price}
                      </li>
                      <li>
                        <FontAwesomeIcon
                          className={
                            isArLang
                              ? styles.arrow_icon_ar
                              : styles.arrow_icon_en
                          }
                          icon={isArLang ? faCaretLeft : faCaretRight}
                        />
                        {key("Vatvalue")}: {order.VAT}
                      </li>
                      <li>
                        <FontAwesomeIcon
                          className={
                            isArLang
                              ? styles.arrow_icon_ar
                              : styles.arrow_icon_en
                          }
                          icon={isArLang ? faCaretLeft : faCaretRight}
                        />
                        {key("totalPrice")}: {order.total_paid}
                      </li>
                      <li>
                        <FontAwesomeIcon
                          className={
                            isArLang
                              ? styles.arrow_icon_ar
                              : styles.arrow_icon_en
                          }
                          icon={isArLang ? faCaretLeft : faCaretRight}
                        />
                        {key("store")}: {order.shop}
                      </li>
                    </ul>
                    <hr />
                    <h4>{key("customerRec")}</h4>
                    <ul>
                      <li>
                        <FontAwesomeIcon
                          className={
                            isArLang
                              ? styles.arrow_icon_ar
                              : styles.arrow_icon_en
                          }
                          icon={isArLang ? faCaretLeft : faCaretRight}
                        />
                        {key("customer")}: {order.customer_name}
                      </li>
                      <li>
                        <FontAwesomeIcon
                          className={
                            isArLang
                              ? styles.arrow_icon_ar
                              : styles.arrow_icon_en
                          }
                          icon={isArLang ? faCaretLeft : faCaretRight}
                        />
                        {key("email")}: {order.customer_email}
                      </li>
                      <li>
                        <FontAwesomeIcon
                          className={
                            isArLang
                              ? styles.arrow_icon_ar
                              : styles.arrow_icon_en
                          }
                          icon={isArLang ? faCaretLeft : faCaretRight}
                        />
                        {key("phone")}: {order.customer_phone}
                      </li>

                      <li>
                        <FontAwesomeIcon
                          className={
                            isArLang
                              ? styles.arrow_icon_ar
                              : styles.arrow_icon_en
                          }
                          icon={isArLang ? faCaretLeft : faCaretRight}
                        />
                        {key("recipient")}: {order.recipient_name}
                      </li>
                      <li>
                        <FontAwesomeIcon
                          className={
                            isArLang
                              ? styles.arrow_icon_ar
                              : styles.arrow_icon_en
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
                            isArLang
                              ? styles.arrow_icon_ar
                              : styles.arrow_icon_en
                          }
                          icon={isArLang ? faCaretLeft : faCaretRight}
                        />
                        {key("orderNumber")}: {`${order.order_number}`}
                      </li>
                      {!isUser && (
                        <li>
                          <FontAwesomeIcon
                            className={
                              isArLang
                                ? styles.arrow_icon_ar
                                : styles.arrow_icon_en
                            }
                            icon={isArLang ? faCaretLeft : faCaretRight}
                          />
                          {key("cardId")}: {order.card_id}
                        </li>
                      )}
                      <li>
                        <FontAwesomeIcon
                          className={
                            isArLang
                              ? styles.arrow_icon_ar
                              : styles.arrow_icon_en
                          }
                          icon={isArLang ? faCaretLeft : faCaretRight}
                        />
                        {key("date")}:{" "}
                        {formatDateTime(order.order_date).formattedDate}
                      </li>
                      <li>
                        <FontAwesomeIcon
                          className={
                            isArLang
                              ? styles.arrow_icon_ar
                              : styles.arrow_icon_en
                          }
                          icon={isArLang ? faCaretLeft : faCaretRight}
                        />
                        {key("time")}:{" "}
                        {formatDateTime(order.order_date).formattedTime}
                      </li>
                    </ul>
                    <div
                      className={`d-flex justify-content-end align-items-center mt-3`}
                    >
                      {isUser ? (
                        <button
                          onClick={() => {
                            navigate(`/view-card/${order.card_id}`);
                          }}
                          className="btn btn-danger p-2"
                        >
                          {key("viewCard")}{" "}
                          <FontAwesomeIcon
                            title={key("viewCard")}
                            className="mx-1"
                            icon={faEye}
                          />
                        </button>
                      ) : (
                        <button
                          onClick={() => cancelOrder(order._id)}
                          className="btn btn-secondary"
                        >
                          {key("cancelOrder")}
                        </button>
                      )}
                    </div>
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
      {modalShow && (
        <ConfirmationModal
          show={modalShow}
          onHide={() => setModalShow(false)}
          func={cancelOrder}
          message={key("confirmCancel")}
          btnMsg={key("cancel")}
        />
      )}
    </>
  );
};

export default OrdersDataView;
