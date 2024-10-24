import React from "react";
import styles from "./SingleReadyCard.module.css";
import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useTranslation } from "react-i18next";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { cartActions } from "../../Store/cartCounter-slice";
import { useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

const SingleReadyCard = ({ card, isStoreProfile }) => {
  let isArLang = localStorage.getItem("i18nextLng") === "ar";
  const { t: key } = useTranslation();
  const token = JSON.parse(localStorage.getItem("token"));
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const notifyError = (message) => toast.error(message);
  const Msg = ({ closeToast, toastProps }) => (
    <span>
      {key("loginFirst")}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          marginTop: "10px",
        }}
      >
        <div style={{ display: "flex", gap: "10px" }}>
          <button
            onClick={closeToast}
            style={{
              borderRadius: "1.5625rem",
              fontWeight: "700",
              boxShadow: "0 0 0.1875rem rgba(0, 0, 0, 0.5)",
              padding: "0.625rem 0.9375rem",
              marginRight: "auto",
            }}
          >
            {key("later")}
          </button>

          <button
            onClick={() => {
              navigate(`/login`);
            }}
            style={{
              borderRadius: "1.5625rem",
              minWidth: "5rem",
              fontWeight: "700",
              boxShadow: "0 0 3px rgba(0, 0, 0, 0.5)",
              padding: "0.625rem",
              marginLeft: "auto",
              backgroundColor: "red",
              color: "#FFF",
            }}
          >
            {key("login")}
          </button>
        </div>
      </div>
    </span>
  );

  const notifyLoginError = () => toast.info(<Msg />);
  const isLogin = useSelector((state) => state.userInfo.isLogin);

  const buyCard = async (shopId, price) => {
    const formData = {
      isSpecial: true,
      shop: shopId,
      price: { value: price },
    };
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_Base_API_URl}cards`,
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const res = response.data;
      if (res.status === "success") {
        dispatch(cartActions.addItem());
        queryClient.invalidateQueries(["getMyCards", token]);
        navigate(`/recipient-information/${res.data?._id}`);
      } else {
        notifyError(key("purchaseFaild"));
      }
    } catch (error) {
      notifyError(key("purchaseFaild"));
    }
  };

  const checkLogin = (shopId, price) => {
    if (!isLogin) {
      notifyLoginError();
    } else {
      buyCard(shopId, price);
    }
  };

  return (
    <Col key={card._id} lg={6} xl={4} className="d-flex justify-content-center">
      <div className={styles.store_card}>
        <Card className={styles.card_body}>
          <div className={styles.card_img_div}>
            <Card.Img
              className={styles.front_img}
              variant="top"
              src={`${process.env.REACT_APP_Host}specialCards/front-shape.webp`}
            />
            <div className={styles.card_img_div_layer}>
              <Card.Img
                className={styles.back_img}
                variant="top"
                src={`${process.env.REACT_APP_Host}specialCards/back-shape.webp`}
              />
            </div>
          </div>

          <Card.Body>
            <div className="d-flex align-items-center position-relative p-3">
              <div className="d-flex align-items-center">
                {!isStoreProfile && (
                  <div title={card.shop?.name} className={styles.store_logo}>
                    <img
                      src={`${process.env.REACT_APP_Host}shops/${card.shop?.logo}`}
                      alt={card.shop?.name}
                      className="w-100"
                    />
                  </div>
                )}
                <h5 className={`${!isArLang?styles.card_price_en:styles.card_price} m-3`}>
                  {card.price} {key("sar")}
                </h5>
              </div>

              <div
                className={`${isArLang ? "me-4  me-auto" : "me-4  ms-auto"} `}
              >
                <FontAwesomeIcon
                  title="Buy card"
                  icon={faPlus}
                  className={styles.arrow_icon}
                  onClick={() => checkLogin(isStoreProfile?card._id:card.shop._id, card.price)}
                />
              </div>
            </div>
          </Card.Body>
        </Card>
      </div>
    </Col>
  );
};

export default SingleReadyCard;
