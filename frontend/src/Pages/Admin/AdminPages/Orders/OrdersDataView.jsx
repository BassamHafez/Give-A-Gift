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
  faCaretDown,
  faCaretUp,
  faDollar,
  faDownload,
} from "@fortawesome/free-solid-svg-icons";
import * as XLSX from "xlsx";
import ConfirmationModal from "../../../../Components/Ui/ConfirmationModal";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import SearchField from "../../../../Components/Ui/SearchField";
import MainButton from "../../../../Components/Ui/MainButton";
import { toast } from "react-toastify";
import html2pdf from "html2pdf.js";
import OrderPdfContent from "../../../../Components/OrderPdfContent/OrderPdfContent";

const OrdersDataView = ({ isUser }) => {
  const notifySuccess = (message) => toast.success(message);
  const notifyError = (message) => toast.error(message);
  const [modalShow, setModalShow] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const [expandedOrderId, setExpandedOrderId] = useState(null);

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

  const generatePDF = () => {
    const element = document.getElementById("content");
    html2pdf(element);
  };

  const toggleShowMore = (orderId) => {
    setExpandedOrderId(expandedOrderId === orderId ? null : orderId);
  };

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
                  key={`${order._id}_${index}`}
                  md={6}
                  lg={4}
                >
                  <div className="d-none">
                    <div id="content">
                      <OrderPdfContent order={order} isUser={isUser} />
                    </div>
                  </div>

                  <div
                    className={`${styles.order_item} ${
                      isArLang && styles.order_item_ar
                    }`}
                  >
                    <div>
                      <h4 className={styles.main_title}>{key("orderData")}</h4>
                      <ul>
                        <li>
                          <FontAwesomeIcon
                            className={
                              isArLang
                                ? styles.arrow_icon_ar
                                : styles.arrow_icon_en
                            }
                            icon={faDollar}
                          />
                          {key("price")}: {order.value} {key("sar")}
                        </li>
                        <li>
                          <FontAwesomeIcon
                            className={
                              isArLang
                                ? styles.arrow_icon_ar
                                : styles.arrow_icon_en
                            }
                            icon={faDollar}
                          />
                          {key("shapePrice")}: {order.shape_price} {key("sar")}
                        </li>
                        <li>
                          <FontAwesomeIcon
                            className={
                              isArLang
                                ? styles.arrow_icon_ar
                                : styles.arrow_icon_en
                            }
                            icon={faDollar}
                          />
                          {key("colorPrice")}: {order.color_price} {key("sar")}
                        </li>
                        <li>
                          <FontAwesomeIcon
                            className={
                              isArLang
                                ? styles.arrow_icon_ar
                                : styles.arrow_icon_en
                            }
                            icon={faDollar}
                          />
                          {key("celebrateIcon")} {key("price")}:{" "}
                          {order.celebrate_icon_price} {key("sar")}
                        </li>
                        <li>
                          <FontAwesomeIcon
                            className={
                              isArLang
                                ? styles.arrow_icon_ar
                                : styles.arrow_icon_en
                            }
                            icon={faDollar}
                          />
                          {key("celebrateLink")} {key("price")}:{" "}
                          {order.celebrate_qr_link_price} {key("sar")}
                        </li>
                        <li>
                          <FontAwesomeIcon
                            className={
                              isArLang
                                ? styles.arrow_icon_ar
                                : styles.arrow_icon_en
                            }
                            icon={faDollar}
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
                            icon={faDollar}
                          />
                          {key("totalPrice")}: {order.total_paid} {key("sar")}
                        </li>
                        <li>
                          <FontAwesomeIcon
                            className={
                              isArLang
                                ? styles.arrow_icon_ar
                                : styles.arrow_icon_en
                            }
                            icon={faDollar}
                          />
                          {key("store")}: {order.shop}
                        </li>
                      </ul>
                      <div className="text-end">
                        <p
                          onClick={() => toggleShowMore(order._id)}
                          className={styles.show_more}
                        >
                          {expandedOrderId === order._id
                            ? key("showLess")
                            : key("showMore")}

                          {expandedOrderId === order._id ? (
                            <FontAwesomeIcon className="mx-1" icon={faCaretUp} />
                          ) : (
                            <FontAwesomeIcon className="mx-1" icon={faCaretDown} />
                          )}
                        </p>
                      </div>
                      {expandedOrderId === order._id && (
                        <div>
                          <h4 className={styles.main_title}>
                            {key("customerRec")}
                          </h4>
                          <ul>
                            <li>
                              <FontAwesomeIcon
                                className={
                                  isArLang
                                    ? styles.arrow_icon_ar
                                    : styles.arrow_icon_en
                                }
                                icon={faDollar}
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
                                icon={faDollar}
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
                                icon={faDollar}
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
                                icon={faDollar}
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
                                icon={faDollar}
                              />
                              {key("recipientWhatsapp")}:{" "}
                              {order.recipient_whatsapp}
                            </li>
                          </ul>
                          <hr />
                          <h4 className={styles.main_title}>
                            {key("idAndDate")}
                          </h4>
                          <ul>
                            <li>
                              <FontAwesomeIcon
                                className={
                                  isArLang
                                    ? styles.arrow_icon_ar
                                    : styles.arrow_icon_en
                                }
                                icon={faDollar}
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
                                  icon={faDollar}
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
                                icon={faDollar}
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
                                icon={faDollar}
                              />
                              {key("time")}:{" "}
                              {formatDateTime(order.order_date).formattedTime}
                            </li>
                          </ul>
                        </div>
                      )}{" "}
                      <hr />
                    </div>

                    <div
                      className={`d-flex justify-content-between align-items-center mt-3`}
                    >
                      <MainButton
                        onClick={generatePDF}
                        type="white"
                        text={`${key("downloadPdf")}`}
                      />
                      {isUser ? (
                        <MainButton
                          type="blue"
                          onClick={() => {
                            navigate(`/view-card/${order.card_id}`);
                          }}
                        >
                          {key("viewCard")}
                        </MainButton>
                      ) : (
                        <MainButton
                          type="blue"
                          onClick={() => cancelOrder(order._id)}
                        >
                          {key("cancelOrder")}
                        </MainButton>
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
