import React from "react";
import styles from "./MyPay.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheckCircle } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import MainButton from "../../Components/Ui/MainButton";
import { useTranslation } from "react-i18next";

const PaymentSuccess = () => {
  const { t: key } = useTranslation();
  const navigate = useNavigate();

  const navigateToOrders = () => {
    navigate("/user-orders");
  };

  return (
    <div className={styles.payment_body}>
      <div className={styles.success_content}>
        <div>
          <FontAwesomeIcon icon={faCheckCircle} />
        </div>
        <h1>{key("paymentSuccessTitle")}</h1>
        <span>{key("paymentSuccessDesc")}</span>
        <div className="mt-5">
          <MainButton onClick={navigateToOrders} text={key("viewOrders")} />
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;
