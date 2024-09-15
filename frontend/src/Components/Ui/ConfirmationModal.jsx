import React, { useState } from "react";
import styles from "./LogoutModal.module.css";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { useTranslation } from "react-i18next";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCoins,
  faMoneyBill,
  faReceipt,
} from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import toast from "react-hot-toast";

const ConfirmationModal = ({
  show,
  onHide,
  func,
  message,
  btnMsg,
  balance,
  cardPrice,
  cardId,
  choosePaymentWay,
  chargeCase,
  balanceCase,
}) => {
  const { t: key } = useTranslation();
  let isArLang = localStorage.getItem("i18nextLng") === "ar";
  const token = JSON.parse(localStorage.getItem("token"));
  const notifySuccess = (message) => toast.success(message);
  const notifyError = (message) => toast.error(message);
  const [priceAfterDisc, setPriceAfterDisc] = useState("");
  const [paymentWay, setPaymentWay] = useState("wallet");
  const [isBalanced, setIsBalanced] = useState(true);

  const applyCoupon = async (e) => {
    e.preventDefault();
    const couponCode = e.target.elements.coupon.value;
    if (cardId && token) {
      try {
        const response = await axios.put(
          `${process.env.REACT_APP_Base_API_URl}cards/${cardId}/apply-coupon`,
          { couponCode: couponCode },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const res = response.data;
        console.log(res);
        if (res?.status === "success") {
          notifySuccess(key("couponSuccess"));
          setPriceAfterDisc(res.data?.priceAfterDiscount);
        } else {
          notifyError(key("couponFaild"));
          setPriceAfterDisc("");
        }
      } catch (error) {
        console.log(error);
        if (error.response?.data?.message === "Coupon is invalid or expired") {
          notifyError(key("invalidCoupon"));
        } else {
          notifyError(key("wrong"));
        }
        setPriceAfterDisc("");
      }
    } else {
      notifyError(key("wrong"));
      setPriceAfterDisc("");
    }
  };

  const handlePaymentChange = (e) => {
    setPaymentWay(e.target.value);
  };

  const checkBalance = () => {
    if (paymentWay === "wallet") {
      if (balanceCase) {
        if(priceAfterDisc!==""){
          chargeCase(priceAfterDisc);

        }else{
          chargeCase(cardPrice);

        }
      } else {
        if(priceAfterDisc!==""){
          if (Number(priceAfterDisc) > Number(balance)) {
            notifyError(key("insuffBalance"));
            setIsBalanced(false);
            choosePaymentWay(paymentWay, "noBalance",priceAfterDisc);
          } else {
            setIsBalanced(true);
            choosePaymentWay(paymentWay, "balanced",priceAfterDisc);
          }
        }else{
          if (Number(cardPrice) > Number(balance)) {
            notifyError(key("insuffBalance"));
            setIsBalanced(false);
            choosePaymentWay(paymentWay, "noBalance",cardPrice);
          } else {
            setIsBalanced(true);
            choosePaymentWay(paymentWay, "balanced",cardPrice);
          }
        }
       
      }
    } else {
      if(priceAfterDisc!==""){
        setIsBalanced(true);
        choosePaymentWay(paymentWay, "balanced",priceAfterDisc);
      }else{
        setIsBalanced(true);
        choosePaymentWay(paymentWay, "balanced",cardPrice);
      }

    }
  };

  return (
    <Modal
      show={show}
      onHide={onHide}
      size="md"
      aria-labelledby="contained-modal-title-vcenter"
      centered
      className={styles.modal_container}
    >
      <Modal.Body className={`${styles.modal_body} text-center`}>
        <h4>{message}</h4>
        {balance && cardPrice && (
          <ul className={styles.details_list}>
            <li className={`${isBalanced ? "" : "text-danger"}`}>
              <FontAwesomeIcon className={styles.list_icon} icon={faCoins} />
              {key("currentBalance")}: {balance} {key("sar")}
            </li>
            <li>
              <FontAwesomeIcon
                className={styles.list_icon}
                icon={faMoneyBill}
              />{" "}
              {key("cardPrice")}:{" "}
              {priceAfterDisc === "" ? (
                <>
                  {cardPrice} {key("sar")}
                </>
              ) : (
                <>
                  {priceAfterDisc} {key("sar")}{" "}
                  <del className="mx-2">
                    {cardPrice} {key("sar")}{" "}
                  </del>
                </>
              )}{" "}
            </li>

            {choosePaymentWay && (
              <li className="flex-column align-items-start my-4">
                <h4>{key("choosePay")}</h4>
                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="choosePaymentWay"
                    id="choosePaymentWay1"
                    value="payment"
                    onChange={handlePaymentChange}
                    checked={paymentWay === "payment" || !isBalanced}
                  />
                  <label
                    className="form-check-label mx-1"
                    htmlFor="choosePaymentWay1"
                  >
                    {key("payment")}
                  </label>
                </div>
                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="choosePaymentWay"
                    id="choosePaymentWay2"
                    value="wallet"
                    onChange={handlePaymentChange}
                    checked={paymentWay === "wallet" && isBalanced}
                    disabled={!isBalanced}
                  />
                  <label
                    className="form-check-label  mx-1"
                    htmlFor="choosePaymentWay2"
                  >
                    {key("wallet")}
                  </label>
                </div>
              </li>
            )}
            <li>
              <FontAwesomeIcon className={styles.list_icon} icon={faReceipt} />{" "}
              {key("applyCoupon")}
            </li>
            <form onSubmit={applyCoupon} className={styles.coupon_form}>
              <input className="form-control" type="text" name="coupon" />{" "}
              <button type="submit">{key("appy")}</button>
            </form>
          </ul>
        )}
      </Modal.Body>
      <Modal.Footer className={styles.modal_footer}>
        <Button
          variant="primary"
          className={isArLang ? styles.close_btn_ar : styles.close_btn}
          onClick={onHide}
        >
          {key("cancel")}
        </Button>
        <Button
          variant="danger"
          className={isArLang ? styles.logout_btn_ar : styles.logout_btn}
          onClick={choosePaymentWay ? checkBalance : func}
        >
          {btnMsg ? btnMsg : key("continue")}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ConfirmationModal;
