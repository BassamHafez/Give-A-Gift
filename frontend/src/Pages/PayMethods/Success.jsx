import React, { useEffect } from "react";
import styles from "./Payment.module.css";
import successImg from "../../Images/Successful purchase-cuate.png";
import { useTranslation } from "react-i18next";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHourglassHalf } from "@fortawesome/free-solid-svg-icons";

const Success = () => {
  const { t: key } = useTranslation();
  const { cardId } = useParams();
  const token = JSON.parse(localStorage.getItem("token"));
  const notifySuccess = (message) => toast.success(message);
  const notifyError = (message) => toast.error(message);
  const navigate = useNavigate();

  useEffect(() => {
    const getCard = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_Base_API_URl}cards/${cardId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const res = response.data;
        if (res.status === "success") {
          if (res.data?.isPaid === true) {
            notifySuccess(key("successMsg"));
            clearInterval(intervalId);
            navigate("/user-orders");
          }
        }
      } catch (error) {
        notifyError(key("errorMsg"));
      }
    };

    const intervalId = setInterval(getCard, 15000);
    return () => clearInterval(intervalId);
  }, [cardId, token, key, navigate]);

  return (
    <>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
        }}
      />
      <div className={styles.success_body}>
        <div className={styles.success_img}>
          <img src={successImg} alt="payment success" />
        </div>
        <span className="fs-5 text-center">
          <FontAwesomeIcon
            className=" fa-spin mx-2 text-secondary text-danger"
            icon={faHourglassHalf}
          />
          {key("successMsg")}
        </span>
      </div>
    </>
  );
};

export default Success;
