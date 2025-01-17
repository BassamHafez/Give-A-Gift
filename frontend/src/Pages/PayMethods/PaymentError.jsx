import React from "react";
import styles from "./MyPay.module.css";
import { useNavigate } from "react-router-dom";
import MainButton from "../../Components/Ui/MainButton";
import { useTranslation } from "react-i18next";

const PaymentError = () => {
  const { t: key } = useTranslation();
  const navigate = useNavigate();

  const navigateToHome = () => {
    navigate("/");
  };

  return (
    <div className={styles.payment_body}>
      <div className={styles.error_content}>
        <h1 className="my-4">{key("paymentFailTitle")}</h1>
        <p>{key("paymentFailDesc")}</p>
        <p>{key("paymentFailDesc2")}</p>
        <div className="mt-5">
          <MainButton onClick={navigateToHome} text={key("homePageTitle")} />
        </div>
      </div>
    </div>
  );
};

export default PaymentError;
