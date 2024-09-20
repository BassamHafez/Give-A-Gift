import React, { useState } from "react";
import styles from "./Cart.module.css";
import Offcanvas from "react-bootstrap/Offcanvas";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeft,
  faArrowRight,
  faComment,
  faCommentSlash,
  faEye,
  faHandHoldingDollar,
  faStore,
  faTrash,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import { useQuery } from "@tanstack/react-query";
import { getMyCards, getMyWallet } from "../../util/Http";
import Placeholders from "../Ui/Placeholders";
import ConfirmationModal from "../Ui/ConfirmationModal";
import toast, { Toaster } from "react-hot-toast";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { cartActions } from "../../Store/cartCounter-slice";
import DetailsAfterBuying from "../../Pages/DetailsAfterBuying/DetailsAfterBuying";

const notifySuccess = (message) => toast.success(message);
const notifyError = (message) => toast.error(message);

const Cart = ({ onClose, show }) => {
  const [modalShow, setModalShow] = useState(false);
  const [confirmModalShow, setConfirmModalShow] = useState(false);
  const [confirmMsg, setConfirmMsg] = useState("");
  const [btnMsg, setBtnMsg] = useState("");
  const [cardPrice, setCardPrice] = useState("");
  const [balanceCase, setBalanceCase] = useState(false);
  const [detailsShow, setDetailsShow] = useState(false);
  const [cardDetails, setCardDetails] = useState({});
  const [walletDetails, setWalletDetails] = useState({});
  const [isCelebrateIcon, setIsCelebrateIcon] = useState(false);
  const [isCelebrateQR, setIsCelebrateQR] = useState(false);

  const profileData = useSelector((state) => state.userInfo.data);
  const { t: key } = useTranslation();
  let isArLang = localStorage.getItem("i18nextLng") === "ar";
  const [isPaidCard, setIsPaidCard] = useState(false);
  const [totalPrice, setTotalPrice] = useState(0);
  const [cardId, setCardId] = useState("");
  const token = JSON.parse(localStorage.getItem("token"));
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { data, isFetching, refetch } = useQuery({
    queryKey: ["getMyCards", token],
    queryFn: () => getMyCards(token),
    enabled: !!token,
  });

  const { data: walletBalance } = useQuery({
    queryKey: ["walletBalance", token],
    queryFn: () => getMyWallet(token),
    enabled: !!token,
    select: (data) => data.data?.balance,
    staleTime: Infinity,
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
          dispatch(cartActions.removeItem());
          notifySuccess(key("cardDeleted"));
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

  const confirmMethod = (
    method,
    cardPriceValue,
    cardID,
    isIconCelebrate,
    isLinkCelebrate
  ) => {
    setCardPrice(cardPriceValue);
    setCardId(cardID);
    setIsCelebrateIcon(isIconCelebrate);
    setIsCelebrateQR(isLinkCelebrate);
    if (method === "pay") {
      setConfirmModalShow(true);
      setConfirmMsg(key("purchase"));
      setBtnMsg(key("confirm"));
    } else {
      setConfirmModalShow(true);
      setConfirmMsg(`charge your wallet to continue`);
      setBtnMsg(key("charge"));
    }
  };

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
        setCardDetails(response.data?.data?.card);
        setWalletDetails(response.data?.data?.wallet);
        setConfirmModalShow(false);
        setDetailsShow(true);
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

  const goToChargeMethods = (price) => {
    setConfirmModalShow(false);
    navigate(`/payment/payment/${profileData?._id}/${price}`);
  };

  const choosePaymentWay = (way, isBalanced, price, totalPrice) => {
    setTotalPrice(totalPrice);
    if (isBalanced === "balanced") {
      if (way === "wallet") {
        payCard();
      } else if (way === "payment") {
        goToChargeMethods(price);
      }
    } else {
      setBtnMsg(key("charge"));
      setBalanceCase(true);
    }
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
          <div className={styles.header}>
            <ul className={styles.header_list}>
              <li
                className={`${styles.header_list_item} ${
                  isPaidCard && styles.active
                }`}
                onClick={() => setIsPaidCard(true)}
              >
                {key("paid")}
              </li>
              <li
                className={`${styles.header_list_item} ${
                  !isPaidCard && styles.active
                }`}
                onClick={() => setIsPaidCard(false)}
              >
                {key("nonPaid")}
              </li>
            </ul>
          </div>
          <ul className={styles.list}>
            {isFetching ? (
              <Placeholders isList={true} />
            ) : (
              data?.data?.map(
                (card) =>
                  (isPaidCard ? card.isPaid : !card.isPaid) &&
                  !card?.isDelivered && (
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
                            <li className={styles.sub_list_item}>
                              {card.isDelivered ? (
                                <span>
                                  <FontAwesomeIcon
                                    className={
                                      isArLang
                                        ? styles.sub_list_icon_ar
                                        : styles.sub_list_icon
                                    }
                                    icon={faComment}
                                  />{" "}
                                  {key("cardReceived")}
                                </span>
                              ) : (
                                <span>
                                  <FontAwesomeIcon
                                    className={
                                      isArLang
                                        ? styles.sub_list_icon_ar
                                        : styles.sub_list_icon
                                    }
                                    icon={faCommentSlash}
                                  />
                                  {key("didnotReceive")}
                                </span>
                              )}
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
                              title="view card"
                              className={styles.eye}
                              icon={faEye}
                              onClick={() => {
                                navigate(`/view-card/${card._id}`);
                                onClose();
                              }}
                            />
                            {!card.isPaid && (
                              <FontAwesomeIcon
                                className={styles.arrow_right_icon}
                                icon={!isArLang ? faArrowRight : faArrowLeft}
                                onClick={() =>
                                  card.receiveAt
                                    ? confirmMethod(
                                        "pay",
                                        card?.price?.value,
                                        card._id,
                                        card?.celebrateIcon,
                                        card?.celebrateIcon
                                      )
                                    : navigate(
                                        `/recipient-information/${card._id}`
                                      )
                                }
                              />
                            )}
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
          choosePaymentWay={choosePaymentWay}
          message={confirmMsg}
          btnMsg={btnMsg}
          balance={walletBalance && walletBalance}
          cardPrice={cardPrice}
          ProPrice={
            data?.data?.proColor ? data?.data?.proColor?.price : undefined
          }
          cardId={cardId}
          balanceCase={balanceCase}
          chargeCase={goToChargeMethods}
          isCelebrateIcon={isCelebrateIcon}
          isCelebrateQR={isCelebrateQR}
        />
      )}
      {detailsShow && (
        <DetailsAfterBuying
          show={detailsShow}
          onHide={() => setDetailsShow(false)}
          cardDetails={cardDetails}
          walletDetails={walletDetails}
          totalPrice={totalPrice}
        />
      )}
    </>
  );
};

export default Cart;
