import React, { useEffect, useState } from "react";
import styles from "./MyPay.module.css";
import { useNavigate } from "react-router-dom";
import MainButton from "../../Components/Ui/MainButton";
import { useTranslation } from "react-i18next";

const PaymentSuccess = () => {
  const { t: key } = useTranslation();
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  const navigateToOrders = () => {
    navigate("/user-orders");
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 10000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className={styles.payment_body}>
      <div className={styles.success_content}>
        {isLoading ? (
          <>
            <h3 className="my-4 fa-fade">{key("processingOrder")}</h3>
            <p>{key("processingOrderDesc")}</p>
          </>
        ) : (
          <>
            <h1 className="mb-4">{key("paymentSuccessTitle")}</h1>
            <p>{key("paymentSuccessDesc")}</p>
            <p>{key("paymentSuccessDesc2")}</p>
            <div className="mt-5">
              <MainButton onClick={navigateToOrders} text={key("viewOrders")} />
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default PaymentSuccess;
