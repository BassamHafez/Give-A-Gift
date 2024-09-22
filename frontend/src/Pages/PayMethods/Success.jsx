import React, { useEffect } from "react";
import styles from "./Payment.module.css";
import successImg from "../../Images/Successful purchase-cuate.png";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";

const Success = () => {
  const { t: key } = useTranslation();
  const { cardId } = useParams();
  const token = JSON.parse(localStorage.getItem("token"));
  const notifySuccess = (message) => toast.success(message);
  const notifyError = (message) => toast.error(message);

  useEffect(() => {
    if (cardId !== "charge") {
      const payCard = async () => {
        try {
          const response = await axios.post(
            `${process.env.REACT_APP_Base_API_URl}wallets/buy-card`,
            { cardId: cardId },
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );

          if (response.status === 200 || response.status === 201) {
            notifySuccess(key("cardPurchased"));
          } else {
            notifyError(key("wrong"));
          }
        } catch (error) {
          console.error("Payment error:", error);

          if (error?.response?.data?.message === "Card already paid") {
            notifyError(key("cardPaid"));
          } else {
            notifyError(key("wrong"));
          }
        }
      };
      payCard();
    }
  }, [cardId, token, key]);

  return (
    <>
      <Toaster position="top-right" />
      <div className={styles.success_body}>
        <div className={styles.success_img}>
          <img src={successImg} alt="payment success" />
        </div>
        <span className="fs-5 text-center">{key("successMsg")}</span>
      </div>
    </>
  );
};

export default Success;
