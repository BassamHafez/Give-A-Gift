import React from "react";
import styles from "./DetailsAfterBuying.module.css";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { useQueryClient } from "@tanstack/react-query";
import fetchCartCounter from "../../Store/cartCounter-actions";

const DetailsAfterBuying = ({
  show,
  onHide,
  cardDetails,
  walletDetails,
  totalPrice,
}) => {
  const { t: key } = useTranslation();
  const navigate = useNavigate();
  let isArLang = localStorage.getItem("i18nextLng") === "ar";
  const queryClient = useQueryClient();
  const token = JSON.parse(localStorage.getItem("token"));
  const dispatch = useDispatch();

  const navigateToProfile = () => {
    queryClient.invalidateQueries(["walletBalance", token]);
    dispatch(fetchCartCounter(token));
    navigate(`/user-orders`);
    onHide();
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

  const receiveAtFormatted = cardDetails?.receiveAt
    ? formatDateTime(cardDetails?.receiveAt)
    : {
        formattedDate: key("payFirst"),
        formattedTime: key("payFirst"),
      };

  return (
    <>
      <Modal
        show={show}
        onHide={onHide}
        size="md"
        aria-labelledby="contained-modal-title-vcenter"
        centered
        backdrop="static"
        className={styles.modal_container}
      >
        <Modal.Body className={`${styles.modal_body} text-center`}>
          <div className={styles.details_body}>
            <h4 className="text-center fw-bold">{key("thanks")}</h4>
            <hr />
            <div className={styles.wallet_balance}>
              <span className="mini_word">{key("currentBalance")}</span>
              <h2>{walletDetails?.balance?.toFixed(2)}</h2>
            </div>
            <hr />

            <ul className={styles.details_list}>
              <li>
                <span className="fw-bold text-secondary">
                  {key("cardPrice")}:{" "}
                </span>{" "}
                {cardDetails?.price?.value.toFixed(2)}
              </li>
              <li>
                <span className="fw-bold text-secondary">
                  {key("totalPrice")}:{" "}
                </span>{" "}
                {cardDetails.priceAfterDiscount
                  ? cardDetails.priceAfterDiscount.toFixed(2)
                  : cardDetails.totalPricePaid
                  ? cardDetails.totalPrice?.toFixed(2)
                  : totalPrice.toFixed(2)}
              </li>
              <li>
                <span className="fw-bold text-secondary">{key("store")}: </span>{" "}
                {cardDetails.shop?.name} (
                {cardDetails.shop.isOnline
                  ? key("onlineStore")
                  : key("physicalStore")}
                )
              </li>
              <li>
                <span className="fw-bold text-secondary">
                  {key("recName")}:{" "}
                </span>{" "}
                {cardDetails?.recipient?.name}
              </li>
              <li>
                <span className="fw-bold text-secondary">
                  {key("recipientWhatsapp")}:{" "}
                </span>{" "}
                {cardDetails?.recipient?.whatsappNumber}
              </li>
              <li>
                <span className="fw-bold text-secondary">{key("date")}: </span>{" "}
                {receiveAtFormatted.formattedDate}
              </li>
              <li>
                <span className="fw-bold text-secondary">{key("time")}: </span>{" "}
                {receiveAtFormatted.formattedTime}
              </li>
            </ul>
          </div>
        </Modal.Body>
        <Modal.Footer className={styles.modal_footer}>
          <Button
            variant="danger"
            className={isArLang ? styles.logout_btn_ar : styles.logout_btn}
            onClick={navigateToProfile}
          >
            {key("continue")}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default DetailsAfterBuying;
