import React, { useEffect, useState } from "react";
import styles from "./Discount.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faWandMagicSparkles } from "@fortawesome/free-solid-svg-icons";
import MainButton from "../../Components/Ui/MainButton";
import logo from "../../Images/logo.png";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";

const Discount = () => {
  const { t: key } = useTranslation();
  const { discountId } = useParams();
  const [isDiscValue, setIsDiscValue] = useState(false);
  const [discoutValue, setDiscountValue] = useState(25);
  const [recipientName, setRecipientName] = useState("");
  const navigate = useNavigate();

  const token = JSON.parse(localStorage.getItem("token"));
  const notifyError = (message) => toast.error(message);

  const role = useSelector((state) => state.userInfo.role);
  const profileData = useSelector((state) => state.profileInfo.data);

  useEffect(() => {
    if (role === "admin") {
      navigate(`/admin/${profileData?._id}`);
    } else if (role === "user") {
      navigate(`/`);
    }
  }, [role, navigate, profileData]);

  const getDiscountValue = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_Base_API_URl}discount-codes/${discountId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const res = response.data;
      if (res.status === "success") {
        setIsDiscValue(true);
        setDiscountValue(res.data?.value);
        setRecipientName(res.data?.recipient);
      } else {
        setIsDiscValue(false);
        notifyError(key("wrong"));
      }
    } catch (error) {
      setIsDiscValue(false);
      if (error.response.data.message === "Discount code already used") {
        notifyError(key("discUsed"));
      }
    }
  };

  return (
    <>
      <div className={styles.discount_body}>
        <div className={styles.click_div}>
          <div className={styles.logo_img}>
            <img src={logo} alt="logo" />
          </div>
          <div className={` ${isDiscValue ? styles.hide : styles.reveal}`}>
            <h3 className="mb-3 fw-bolder text-center">
              {key("clickReveal")}{" "}
              <FontAwesomeIcon
                className={styles.magic_icon}
                icon={faWandMagicSparkles}
              />
            </h3>
            <div className="text-center">
              <MainButton
                onClick={getDiscountValue}
                // onClick={() => setIsDiscValue(!isDiscValue)}
                className="mb-3"
                text={key("reveal")}
              />
            </div>
          </div>
          <div
            className={`${isDiscValue ? styles.disc_reveal : styles.disc_hide}`}
          >
            <h3 className="mb-3 fw-bolder text-center">
              {key("discValue")} {recipientName}{" "}
            </h3>
            <h2 className={styles.disc_value}>
              {discoutValue} <span className={styles.sar}>{key("sar")}</span>
            </h2>
          </div>
        </div>
      </div>
    </>
  );
};

export default Discount;
