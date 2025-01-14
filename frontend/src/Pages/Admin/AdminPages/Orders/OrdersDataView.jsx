import React, { useState } from "react";
import { getAllOrders } from "../../../../util/Http";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import LoadingOne from "../../../../Components/Ui/LoadingOne";
import { useTranslation } from "react-i18next";
import styles from "./Orders.module.css";
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
import Container from "react-bootstrap/esm/Container";
import NoDataPage from "../../../../Components/Ui/NoDataPage";
import ScrollTopButton from "../../../../Components/Ui/ScrollTopButton";

const OrdersDataView = ({ isUser }) => {
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

  const generatePDF = (orderId) => {
    const element = document.getElementById(`${orderId}`);
    html2pdf(element);
  };

  const toggleShowMore = (orderId) => {
    setExpandedOrderId(expandedOrderId === orderId ? null : orderId);
  };

  return (
    <>
      <ScrollTopButton />

      <Row className={styles.order_col}>
        {data ? (
          data.data?.length > 0 ? (
            <>
              <h4 className="text-secondary mt-2 mb-0">
                {key("downloadExell")}
                <FontAwesomeIcon
                  style={{ cursor: "pointer" }}
                  onClick={handleDownloadExcelSheet}
                  className="mx-2"
                  icon={faDownload}
                />
              </h4>
              <div className="d-flex flex-wrap justify-content-between align-items-center my-4">
                <button
                  onClick={() => setSearchInput("")}
                  className="btn btn-outline-danger my-2"
                >
                  {key("default")}
                </button>
                <SearchField
                  className="my-2"
                  onSearch={handleSearch}
                  text={key("search")}
                />
              </div>
              {filteredDisc?.map((order, index) => (
                <Col
                  className={styles.order_col}
                  key={`${order._id}_${index}`}
                  md={6}
                  lg={4}
                >
                  <div className="d-none">
                    <Container
                      id={`${order._id}`}
                      className="d-flex justify-content-center align-items-center flex-column my-4"
                    >
                      <OrderPdfContent order={order} isUser={isUser} />
                    </Container>
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
                          <span>
                            <FontAwesomeIcon
                              className={
                                isArLang
                                  ? styles.arrow_icon_ar
                                  : styles.arrow_icon_en
                              }
                              icon={faDollar}
                            />
                            {key("price")}
                          </span>

                          <span>
                            {order.value} {key("sar")}
                          </span>
                        </li>
                        <li>
                          <span>
                            <FontAwesomeIcon
                              className={
                                isArLang
                                  ? styles.arrow_icon_ar
                                  : styles.arrow_icon_en
                              }
                              icon={faDollar}
                            />
                            {key("shapePrice")}
                          </span>

                          <span>
                            {order.shapes_price} {key("sar")}
                          </span>
                        </li>
                        <li>
                          <span>
                            <FontAwesomeIcon
                              className={
                                isArLang
                                  ? styles.arrow_icon_ar
                                  : styles.arrow_icon_en
                              }
                              icon={faDollar}
                            />
                            {key("colorPrice")}
                          </span>

                          <span>
                            {order.color_price} {key("sar")}
                          </span>
                        </li>
                        <li>
                          <span>
                            <FontAwesomeIcon
                              className={
                                isArLang
                                  ? styles.arrow_icon_ar
                                  : styles.arrow_icon_en
                              }
                              icon={faDollar}
                            />
                            {key("celebrateIcon")}
                          </span>

                          <span>
                            {order.celebrate_icon_price} {key("sar")}
                          </span>
                        </li>
                        <li>
                          <span>
                            <FontAwesomeIcon
                              className={
                                isArLang
                                  ? styles.arrow_icon_ar
                                  : styles.arrow_icon_en
                              }
                              icon={faDollar}
                            />
                            {key("celebrateLink")}
                          </span>

                          <span>
                            {order.celebrate_qr_link_price} {key("sar")}
                          </span>
                        </li>
                        <li>
                          <span>
                            <FontAwesomeIcon
                              className={
                                isArLang
                                  ? styles.arrow_icon_ar
                                  : styles.arrow_icon_en
                              }
                              icon={faDollar}
                            />
                            {key("Vatvalue")}
                          </span>

                          <span>{order.VAT}</span>
                        </li>
                        <li>
                          <span>
                            <FontAwesomeIcon
                              className={
                                isArLang
                                  ? styles.arrow_icon_ar
                                  : styles.arrow_icon_en
                              }
                              icon={faDollar}
                            />
                            {key("totalPrice")}
                          </span>

                          <span>
                            {order.total_paid} {key("sar")}
                          </span>
                        </li>
                        <li>
                          <span>
                            <FontAwesomeIcon
                              className={
                                isArLang
                                  ? styles.arrow_icon_ar
                                  : styles.arrow_icon_en
                              }
                              icon={faDollar}
                            />
                            {key("store")}
                          </span>

                          <span>{order.shop}</span>
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
                            <FontAwesomeIcon
                              className="mx-1"
                              icon={faCaretUp}
                            />
                          ) : (
                            <FontAwesomeIcon
                              className="mx-1"
                              icon={faCaretDown}
                            />
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
                              <span>
                                <FontAwesomeIcon
                                  className={
                                    isArLang
                                      ? styles.arrow_icon_ar
                                      : styles.arrow_icon_en
                                  }
                                  icon={faDollar}
                                />
                                {key("customer")}
                              </span>

                              <span>{order.customer_name}</span>
                            </li>
                            <li>
                              <span>
                                <FontAwesomeIcon
                                  className={
                                    isArLang
                                      ? styles.arrow_icon_ar
                                      : styles.arrow_icon_en
                                  }
                                  icon={faDollar}
                                />
                                {key("email")}
                              </span>

                              <span>{order.customer_email}</span>
                            </li>
                            <li>
                              <span>
                                <FontAwesomeIcon
                                  className={
                                    isArLang
                                      ? styles.arrow_icon_ar
                                      : styles.arrow_icon_en
                                  }
                                  icon={faDollar}
                                />
                                {key("phone")}
                              </span>

                              <span>{order.customer_phone}</span>
                            </li>

                            <li>
                              <span>
                                <FontAwesomeIcon
                                  className={
                                    isArLang
                                      ? styles.arrow_icon_ar
                                      : styles.arrow_icon_en
                                  }
                                  icon={faDollar}
                                />
                                {key("recipient")}
                              </span>

                              <span>{order.recipient_name}</span>
                            </li>
                            <li>
                              <span>
                                <FontAwesomeIcon
                                  className={
                                    isArLang
                                      ? styles.arrow_icon_ar
                                      : styles.arrow_icon_en
                                  }
                                  icon={faDollar}
                                />
                                {key("recipientWhatsapp")}
                              </span>

                              <span>{order.recipient_whatsapp}</span>
                            </li>
                          </ul>
                          <hr />
                          <h4 className={styles.main_title}>
                            {key("idAndDate")}
                          </h4>
                          <ul>
                            <li>
                              <span>
                                <FontAwesomeIcon
                                  className={
                                    isArLang
                                      ? styles.arrow_icon_ar
                                      : styles.arrow_icon_en
                                  }
                                  icon={faDollar}
                                />
                                {key("orderNumber")}
                              </span>

                              <span>{`${order.order_number}`}</span>
                            </li>
                            {!isUser && (
                              <li>
                                <span>
                                  <FontAwesomeIcon
                                    className={
                                      isArLang
                                        ? styles.arrow_icon_ar
                                        : styles.arrow_icon_en
                                    }
                                    icon={faDollar}
                                  />
                                  {key("cardId")}
                                </span>

                                <span>{order.card_id}</span>
                              </li>
                            )}
                            <li>
                              <span>
                                <FontAwesomeIcon
                                  className={
                                    isArLang
                                      ? styles.arrow_icon_ar
                                      : styles.arrow_icon_en
                                  }
                                  icon={faDollar}
                                />
                                {key("date")}
                              </span>

                              <span>
                                {formatDateTime(order.order_date).formattedDate}
                              </span>
                            </li>
                            <li>
                              <span>
                                <FontAwesomeIcon
                                  className={
                                    isArLang
                                      ? styles.arrow_icon_ar
                                      : styles.arrow_icon_en
                                  }
                                  icon={faDollar}
                                />
                                {key("time")}
                              </span>

                              <span>
                                {formatDateTime(order.order_date).formattedTime}
                              </span>
                            </li>
                          </ul>
                        </div>
                      )}
                      <hr />
                    </div>

                    <div
                      className={`${styles.btn_gr} d-flex justify-content-between align-items-center mt-3 flex-wrap`}
                    >
                      <div className="my-2">
                        <MainButton
                          onClick={() => generatePDF(order._id)}
                          type="white"
                          text={`${key("downloadPdf")}`}
                        />
                      </div>
                      <div className="my-2">
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
                  </div>
                </Col>
              ))}
            </>
          ) : (
            <NoDataPage text={`${key("noOrders")}`} />
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
