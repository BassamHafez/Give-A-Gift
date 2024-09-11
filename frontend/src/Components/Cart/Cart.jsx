import React, { useState } from "react";
import styles from "./Cart.module.css";
import Offcanvas from "react-bootstrap/Offcanvas";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeft,
  faArrowRight,
  faHandHoldingDollar,
  faStore,
  faTrash,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getMyCards, getMyWallet } from "../../util/Http";
import Placeholders from "../Ui/Placeholders";
import ConfirmationModal from "../Ui/ConfirmationModal";
import toast, { Toaster } from "react-hot-toast";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";

const notifySuccess = (message) => toast.success(message);
const notifyError = (message) => toast.error(message);

const Cart = ({ onClose, show }) => {
  const [modalShow, setModalShow] = useState(false);
  const [confirmModalShow, setConfirmModalShow] = useState(false);
  const [confirmFunc, setConfirmFunc] = useState("");
  const [confirmMsg, setConfirmMsg] = useState("");
  const [btnMsg, setBtnMsg] = useState("");
  const [cardPrice, setCardPrice] = useState("");
  const profileData = useSelector((state) => state.userInfo.data);
  const { t: key } = useTranslation();
  let isArLang = localStorage.getItem("i18nextLng") === "ar";

  const [cardId, setCardId] = useState("");
  const token = JSON.parse(localStorage.getItem("token"));
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { data, isFetching, refetch } = useQuery({
    queryKey: ["getCard", token],
    queryFn: () => getMyCards(token),
    enabled: !!token,
    staleTime: 300000,
  });
  const { data: walletBalance } = useQuery({
    queryKey: ["walletBalance", token],
    queryFn: () => getMyWallet(token),
    enabled: !!token,
    staleTime: 300000,
    select: (data) => data.data?.balance,
  });

  const deleteCard = async () => {
    setModalShow(false);
    if (cardId && token) {
      try {
        const response = await axios.delete(
          `${process.env.REACT_APP_Base_API_URl}cards/${cardId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        console.log(response);
        if (response.status === 204) {
          queryClient.invalidateQueries(["getCards", token]);
          notifySuccess("Card deleted successfully.");
          refetch();
        } else {
          notifyError(key("wrong"));
        }
      } catch (error) {
        notifyError(key("wrong"));
        console.error(error);
      }
    } else {
      notifyError(key("deleteWrong"));
    }
  };

  const confirmMethod = (method, cardPriceValue) => {
    setCardPrice(cardPriceValue);
    if (method === "pay") {
      setConfirmModalShow(true);
      setConfirmFunc("pay");
      setConfirmMsg(`${key("purchase")} ${key("purchaseQuestion")}`);
      setBtnMsg(key("confirm"));
    } else {
      setConfirmModalShow(true);
      setConfirmFunc("charge");
      setConfirmMsg(`charge your wallet to continue`);
      setBtnMsg(key("charge"));
    }
  };

  const payCard = async () => {
    if (Number(cardPrice) > Number(walletBalance)) {
      setConfirmModalShow(false);
      notifyError(key("insuffBalance"));
      confirmMethod("charge");
    } else {
      try {
        const response = await axios.post(
          `${process.env.REACT_APP_Base_API_URl}wallets/buy-card`,
          { cardId: cardId },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (response.status === 200 || response.status === 201) {
          notifySuccess("Card purchased successfully.");
          refetch();
        } else {
          notifyError(key("wrong"));
        }
      } catch (error) {
        notifyError(key("wrong"));
        console.error("Payment error:", error);
      }
    }
  };

  const goToChargeMethods = () => {
    setConfirmModalShow(false);
    navigate(`/payment/payment/${profileData._id}`);
  };

  return (
    <>
      <Toaster position="top-right" />

      <Offcanvas
        show={show}
        onHide={onClose}
        placement="end"
        className={styles.side_bar}
      >
        <Offcanvas.Header className={styles.header}>
          <div className="d-flex justify-content-between align-items-center w-100">
            <h2>{key("cart")}</h2>
            <FontAwesomeIcon
              className={styles.close_icon}
              onClick={onClose}
              icon={faXmark}
            />
          </div>
        </Offcanvas.Header>

        <Offcanvas.Body>
          <ul className={styles.list}>
            {isFetching ? (
              <Placeholders isList={true} />
            ) : (
              data?.data?.map(
                (card) =>
                  !card.isPaid && (
                    <li key={card._id} className={styles.list_item}>
                      <div className={styles.item}>
                        <h4>
                          {card.isSpecial
                            ? key("readyCard")
                            : key("customCards")}
                        </h4>
                        <div className={styles.item_content}>
                          <ul className="p-0">
                            <li className={styles.sub_list_item}>
                              <FontAwesomeIcon
                                className={
                                  isArLang
                                    ? styles.sub_list_icon_ar
                                    : styles.sub_list_icon
                                }
                                icon={faStore}
                              />
                              <span className="fw-bold">{key("store")}: </span>
                              {card.shop?.name}
                            </li>
                            <li className={styles.sub_list_item}>
                              <FontAwesomeIcon
                                className={
                                  isArLang
                                    ? styles.sub_list_icon_ar
                                    : styles.sub_list_icon
                                }
                                icon={faHandHoldingDollar}
                              />
                              <span className="fw-bold">{key("price")}: </span>
                              {card.price?.value} {key("sar")}
                            </li>
                          </ul>
                          <div className={styles.controllers}>
                            <FontAwesomeIcon
                              className={styles.trash_icon}
                              icon={faTrash}
                              onClick={() => {
                                setCardId(card._id);
                                setModalShow(true);
                              }}
                            />
                            <FontAwesomeIcon
                              className={styles.arrow_right_icon}
                              icon={!isArLang ? faArrowRight : faArrowLeft}
                              onClick={() =>
                                card.isPaid
                                  ? card.receiveAt
                                    ? console.log("paid")
                                    : navigate(
                                        `/recipient-information/${card._id}`
                                      )
                                  : card.receiveAt
                                  ? confirmMethod("pay", card?.price?.value)
                                  : navigate(
                                      `/recipient-information/${card._id}`
                                    )
                              }
                            />
                          </div>
                        </div>
                      </div>
                    </li>
                  )
              )
            )}
          </ul>
        </Offcanvas.Body>
      </Offcanvas>
      {modalShow && (
        <ConfirmationModal
          show={modalShow}
          onHide={() => setModalShow(false)}
          func={deleteCard}
          message={key("confirmDelete")}
          btnMsg={key("delete")}
        />
      )}
      {confirmModalShow && (
        <ConfirmationModal
          show={confirmModalShow}
          onHide={() => setConfirmModalShow(false)}
          func={confirmFunc === "pay" ? payCard : goToChargeMethods}
          message={confirmMsg}
          smallSize={confirmFunc === "pay" ? true : false}
          btnMsg={btnMsg}
        />
      )}
    </>
  );
};

export default Cart;
