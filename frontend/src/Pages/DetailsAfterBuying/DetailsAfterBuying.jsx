import React from "react";
import styles from "./DetailsAfterBuying.module.css";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { useQueryClient } from "@tanstack/react-query";
import { Toaster } from "react-hot-toast";

const DetailsAfterBuying = ({ show, onHide, cardDetails, walletDetails,totalPrice }) => {
  const { t: key } = useTranslation();
  const navigate = useNavigate();
  const profileData = useSelector((state) => state.userInfo.data);
  let isArLang = localStorage.getItem("i18nextLng") === "ar";
  const queryClient=useQueryClient();
  const token = JSON.parse(localStorage.getItem("token"));

  const navigateToProfile = () => {
    queryClient.invalidateQueries(["walletBalance", token])
    navigate(`/wallet/${profileData?._id}`);
    onHide();
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
              {totalPrice.toFixed(2)}
            </li>
            <li>
              <span className="fw-bold text-secondary">{key("recName")}: </span>{" "}
              {cardDetails?.recipient?.name}
            </li>
            <li>
              <span className="fw-bold text-secondary">
                {key("whatsAppNum2")}:{" "}
              </span>{" "}
              {cardDetails?.recipient?.whatsappNumber}
            </li>
            <li>
              <span className="fw-bold text-secondary">
                {key("dateTime")}:{" "}
              </span>{" "}
              {cardDetails?.receiveAt}
            </li>
          </ul>

          <ul className={styles.sub_details_list}>
            <li>
              <span className="fw-bold text-secondary">{key("userId")}: </span>{" "}
              {walletDetails?.user}
            </li>
            <li>
              <span className="fw-bold text-secondary">
                {key("walletId")}:{" "}
              </span>{" "}
              {walletDetails?._id}
            </li>
            <li>
              <span className="fw-bold text-secondary">{key("cardId")}: </span>{" "}
              {cardDetails?._id}
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
    <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
        }}
      />
    </>

  );
};

export default DetailsAfterBuying;
