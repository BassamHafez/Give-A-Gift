import React, { useEffect, useState } from "react";
import styles from "./LogoutModal.module.css";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { useTranslation } from "react-i18next";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCoins,
  faFileInvoiceDollar,
  faGift,
  faMoneyBill,
  faPalette,
  faPercent,
  faQrcode,
  faReceipt,
} from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

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
  ProPrice,
  isCelebrateIcon,
  isCelebrateQR,
  shapePrice,
  isRecPage,
}) => {
  const { t: key } = useTranslation();
  let isArLang = localStorage.getItem("i18nextLng") === "ar";
  const token = JSON.parse(localStorage.getItem("token"));
  const navigate = useNavigate();

  const notifySuccess = (message) => {
    toast.success((t) => (
      <div onClick={() => toast.dismiss(t.id)}>{message}</div>
    ));
  };

  const notifyError = (message) => {
    toast.error((t) => (
      <div onClick={() => toast.dismiss(t.id)}>{message}</div>
    ));
  };
  const [priceAfterDisc, setPriceAfterDisc] = useState("");
  const [paymentWay, setPaymentWay] = useState("payment");
  const [isBalanced, setIsBalanced] = useState(true);
  const [isChargeList, setISChargeList] = useState(false);
  const [totalPrice, setTotalPrice] = useState(0);
  const [totalPurePrice, setTotalPurePrice] = useState(0);

  const VAT = useSelector((state) => state.configs.VAT);
  const celebrateIconPrice = useSelector(
    (state) => state.configs.celebrateIconPrice
  );

  const celebrateLinkPrice = useSelector(
    (state) => state.configs.celebrateLinkPrice
  );

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
        console.log(response);
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
        } else if (error?.response?.data?.message === "Card is already paid") {
          notifyError(key("cardPaid"));
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

  useEffect(() => {
    const totalNumber =
      Number(cardPrice) +
      (ProPrice ? Number(ProPrice) : 0) +
      (isCelebrateIcon ? Number(celebrateIconPrice) : 0) +
      (isCelebrateQR ? Number(celebrateLinkPrice) : 0) +
      (shapePrice ? Number(shapePrice) : 0);

    setTotalPurePrice(totalNumber);

    if (priceAfterDisc !== "") {
      setTotalPrice(Number(priceAfterDisc));
    } else {
      setTotalPrice((Number(VAT) / 100) * totalNumber + totalNumber);
    }
  }, [
    priceAfterDisc,
    cardPrice,
    VAT,
    balance,
    ProPrice,
    isCelebrateQR,
    isCelebrateIcon,
    balanceCase,
    celebrateIconPrice,
    celebrateLinkPrice,
    cardId,
    chargeCase,
    choosePaymentWay,
    paymentWay,
    key,
    shapePrice,
  ]);

  useEffect(() => {
    if (Number(totalPrice) > Number(balance)) {
      setISChargeList(true);
    } else {
      setISChargeList(false);
    }
  }, [totalPrice, setISChargeList, balance]);

  const checkBalance = () => {
    if (!isChargeList) {
      if (balanceCase) {
        setISChargeList(true);
        chargeCase(Number(totalPrice) - Number(balance), cardId);
        return;
      }

      if (Number(cardPrice) === 0) {
        if (ProPrice || isCelebrateIcon || isCelebrateQR) {
          if (Number(totalPrice) > Number(balance)) {
            notifyError(key("insuffBalance"));
            setIsBalanced(false);
            choosePaymentWay(paymentWay, "noBalance", cardPrice, totalPrice);
          } else {
            setIsBalanced(true);
            choosePaymentWay("wallet", "balanced", cardPrice, totalPrice);
          }
        } else {
          setIsBalanced(true);
          choosePaymentWay("wallet", "balanced", cardPrice, totalPrice);
        }
        return;
      }

      if (paymentWay === "wallet") {
        if (Number(totalPrice) > Number(balance)) {
          notifyError(key("insuffBalance"));
          setIsBalanced(false);
          choosePaymentWay(paymentWay, "noBalance", cardPrice, totalPrice);
        } else {
          setIsBalanced(true);
          choosePaymentWay(paymentWay, "balanced", cardPrice, totalPrice);
        }
      } else {
        setIsBalanced(true);
        choosePaymentWay(paymentWay, "balanced", totalPrice, totalPrice);
      }
    }
  };

  const checkRec = () => {
    if (isRecPage) {
      onHide();
      navigate(`/user-orders`);
    } else {
      onHide();
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
      backdrop="static"
    >
      <Modal.Body className={`${styles.modal_body} text-center`}>
        <h4>{message}</h4>
        {balance !== null &&
          balance !== undefined &&
          cardPrice !== null &&
          cardPrice !== undefined && (
            <ul className={styles.details_list}>
              {isChargeList ? (
                <>
                  <li>
                    <FontAwesomeIcon
                      className={styles.list_icon}
                      icon={faMoneyBill}
                    />
                    {key("cardPrice")}: {Number(cardPrice).toFixed(2)}{" "}
                    {key("sar")}{" "}
                  </li>
                  {ProPrice && (
                    <li>
                      <FontAwesomeIcon
                        className={styles.list_icon}
                        icon={faPalette}
                      />
                      {key("colorPrice")}: {ProPrice} {key("sar")}
                    </li>
                  )}
                  {isCelebrateIcon && (
                    <li>
                      <FontAwesomeIcon
                        className={styles.list_icon}
                        icon={faGift}
                      />
                      {key("celebrateIcon")}: {celebrateIconPrice} {key("sar")}
                    </li>
                  )}
                  {isCelebrateQR && (
                    <li>
                      <FontAwesomeIcon
                        className={styles.list_icon}
                        icon={faQrcode}
                      />
                      {key("celebrateLink")}: {celebrateLinkPrice} {key("sar")}
                    </li>
                  )}

                  {(shapePrice ? Number(shapePrice) : 0) > 0 && (
                    <li>
                      <FontAwesomeIcon
                        className={styles.list_icon}
                        icon={faCoins}
                      />
                      {key("shapePrice")}: {shapePrice} {key("sar")}
                    </li>
                  )}

                  <li>
                    <FontAwesomeIcon
                      className={styles.list_icon}
                      icon={faPercent}
                    />
                    {key("Vatvalue")}:{" "}
                    {priceAfterDisc !== ""
                      ? Number(priceAfterDisc).toFixed(2)
                      : ((Number(VAT) / 100) * Number(totalPurePrice)).toFixed(
                          2
                        )}{" "}
                    {key("sar")}
                  </li>
                  {paymentWay === "wallet" && (
                    <li>
                      <FontAwesomeIcon
                        className={styles.list_icon}
                        icon={faFileInvoiceDollar}
                      />
                      {key("wallet")}: {-Number(balance).toFixed(2)}{" "}
                      {key("sar")}
                    </li>
                  )}
                  <li>
                    <FontAwesomeIcon
                      className={styles.list_icon}
                      icon={faFileInvoiceDollar}
                    />
                    {key("totalPrice")}:{" "}
                    {(Number(totalPrice) - Number(balance)).toFixed(2)}{" "}
                    {key("sar")}
                  </li>
                </>
              ) : (
                <>
                  <li>
                    <FontAwesomeIcon
                      className={styles.list_icon}
                      icon={faMoneyBill}
                    />
                    {key("cardPrice")}: {cardPrice.toFixed(2)} {key("sar")}
                  </li>
                  {ProPrice && (
                    <li>
                      <FontAwesomeIcon
                        className={styles.list_icon}
                        icon={faPalette}
                      />
                      {key("colorPrice")}: {ProPrice} {key("sar")}
                    </li>
                  )}
                  {(shapePrice ? Number(shapePrice) : 0) > 0 && (
                    <li>
                      <FontAwesomeIcon
                        className={styles.list_icon}
                        icon={faCoins}
                      />
                      {key("shapePrice")}: {shapePrice} {key("sar")}
                    </li>
                  )}
                  {isCelebrateIcon && (
                    <li>
                      <FontAwesomeIcon
                        className={styles.list_icon}
                        icon={faGift}
                      />
                      {key("celebrateIcon")}: {celebrateIconPrice} {key("sar")}
                    </li>
                  )}
                  {isCelebrateQR && (
                    <li>
                      <FontAwesomeIcon
                        className={styles.list_icon}
                        icon={faQrcode}
                      />
                      {key("celebrateLink")}: {celebrateLinkPrice} {key("sar")}
                    </li>
                  )}
                  <li>
                    <FontAwesomeIcon
                      className={styles.list_icon}
                      icon={faPercent}
                    />
                    {key("Vatvalue")}:{" "}
                    {priceAfterDisc !== ""
                      ? Number(priceAfterDisc).toFixed(2)
                      : ((Number(VAT) / 100) * Number(totalPurePrice)).toFixed(
                          2
                        )}{" "}
                    {key("sar")}
                  </li>
                  {paymentWay === "wallet" && (
                    <li>
                      <FontAwesomeIcon
                        className={styles.list_icon}
                        icon={faPercent}
                      />
                      {key("wallet")}: {-Number(totalPrice).toFixed(2)}{" "}
                      {key("sar")}
                    </li>
                  )}

                  <li>
                    <FontAwesomeIcon
                      className={styles.list_icon}
                      icon={faFileInvoiceDollar}
                    />
                    {key("totalPrice")}:{" "}
                    {paymentWay === "wallet"
                      ? 0
                      : Number(totalPrice).toFixed(2) + " " + key("sar")}{" "}
                  </li>
                </>
              )}
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
                  <div className="d-flex align-items-center">
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
                        className={`form-check-label  mx-1`}
                        htmlFor="choosePaymentWay2"
                      >
                        {key("wallet")}{" "}
                      </label>
                    </div>
                    <span className={`mini_word mx-2`}>
                      ({balance.toFixed(2)} {key("sar")})
                    </span>
                  </div>
                </li>
              )}
              <li>
                <FontAwesomeIcon
                  className={styles.list_icon}
                  icon={faReceipt}
                />{" "}
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
          onClick={checkRec}
        >
          {key("cancel")}
        </Button>
        {isChargeList ? (
          <Button
            variant="danger"
            className={isArLang ? styles.logout_btn_ar : styles.logout_btn}
            onClick={() =>
              chargeCase(Number(totalPrice) - Number(balance), cardId)
            }
          >
            {key("charge")}
          </Button>
        ) : (
          <Button
            variant="danger"
            className={isArLang ? styles.logout_btn_ar : styles.logout_btn}
            onClick={choosePaymentWay ? checkBalance : func}
          >
            {btnMsg ? btnMsg : key("continue")}
          </Button>
        )}
      </Modal.Footer>
    </Modal>
  );
};

export default ConfirmationModal;
