import React, { useState } from "react";
import styles from "./Cart.module.css";
import Offcanvas from "react-bootstrap/Offcanvas";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeft,
  faArrowRight,
  faComment,
  faCommentSlash,
  faDollar,
  faStore,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import { faTrashCan, faEye } from "@fortawesome/free-regular-svg-icons";
import { useQuery } from "@tanstack/react-query";
import { getMyCards, getMyWallet } from "../../util/Http";
import Placeholders from "../Ui/Placeholders";
import ConfirmationModal from "../Ui/ConfirmationModal";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";
import { cartActions } from "../../Store/cartCounter-slice";
import DetailsAfterBuying from "../../Pages/DetailsAfterBuying/DetailsAfterBuying";
import { toast } from "react-toastify";

const Cart = ({ onClose, show }) => {
  const notifySuccess = (message) => toast.success(message);
  const notifyError = (message) => toast.error(message);

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
  const [totalShapesPrice, setTotalShapesPrice] = useState(0);
  const [proColorPrice, setProColorPrice] = useState("");
  const { t: key } = useTranslation();
  let isArLang = localStorage.getItem("i18nextLng") === "ar";
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

        if (response.status === 204) {
          dispatch(cartActions.removeItem());
          refetch();
        } else {
          notifyError(key("wrong"));
        }
      } catch (error) {
        notifyError(key("wrong"));
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
    isLinkCelebrate,
    shapesPrice,
    proColorPrice
  ) => {
    setCardPrice(cardPriceValue);
    setCardId(cardID);
    setIsCelebrateIcon(isIconCelebrate);
    setIsCelebrateQR(isLinkCelebrate);
    setTotalShapesPrice(shapesPrice);
    if (proColorPrice) {
      setProColorPrice(proColorPrice);
    } else {
      setProColorPrice("");
    }
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
      if (error?.response?.data?.message === "Card already paid") {
        notifyError(key("cardPaid"));
      } else {
        notifyError(key("wrong"));
      }
    }
  };

  const goToChargeMethods = (price, cardId) => {
    setConfirmModalShow(false);
    navigate(`/payment/payment/${cardId}/${price}`);
    onClose();
  };

  const choosePaymentWay = (way, isBalanced, price, totalPrice) => {
    setTotalPrice(totalPrice);
    if (isBalanced === "balanced") {
      if (way === "wallet") {
        payCard();
      } else if (way === "payment") {
        goToChargeMethods(price, cardId);
      }
    } else {
      setBtnMsg(key("charge"));
      setBalanceCase(true);
    }
  };

  const goToBuyingPhases = (
    recipient,
    price,
    cardId,
    celebrateIcon,
    celebrateQR,
    shapes,
    proColorPrice
  ) => {
    if (recipient) {
      let totalPrice;
      if (shapes.length > 0) {
        totalPrice = shapes.reduce((sum, shape) => {
          const price = shape.shape?.price || 0;
          return sum + price;
        }, 0);
      }
      confirmMethod(
        "pay",
        price,
        cardId,
        celebrateIcon,
        celebrateQR,
        totalPrice,
        proColorPrice
      );
    } else {
      navigate(`/recipient-information/${cardId}`);
      onClose();
    }
  };

  const isColorDark = (color) => {
    color = color.replace("#", "");
    const r = parseInt(color.substring(0, 2), 16);
    const g = parseInt(color.substring(2, 4), 16);
    const b = parseInt(color.substring(4, 6), 16);

    const luminance = 0.299 * r + 0.587 * g + 0.114 * b;
    return luminance < 128;
  };

  const getTextColor = (color) => {
    if (color) {
      return isColorDark(color) ? "#ffffff" : "#000000";
    }
    return "#ffffff";
  };

  return (
    <>
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
                  !card.isPaid &&
                  !card.isDelivered && (
                    <li
                      key={card._id}
                      className={`${styles.list_item} ${
                        !card.isSpecial &&
                        card.proColor &&
                        styles.pro_color_item
                      }`}
                      style={{
                        backgroundColor: card.color
                          ? card.color.hex
                          : undefined,
                        backgroundImage: card.proColor?.image
                          ? `url(${process.env.REACT_APP_Host}colors/${card.proColor.image})`
                          : undefined,
                        color: card.isSpecial
                          ? "#000000"
                          : card.color
                          ? getTextColor(card.color.hex)
                          : "#ffffff",
                      }}
                    >
                      <div className={styles.item}>
                        <h4>
                          {card.isSpecial
                            ? key("readyCard")
                            : key("customCards")}
                        </h4>
                        <div className={styles.item_content}>
                          <ul className="p-0">
                            <li className={`${styles.sub_list_item}`}>
                              <div className="d-flex align-items-center">
                                <FontAwesomeIcon
                                  className={
                                    isArLang
                                      ? styles.sub_list_icon_ar
                                      : styles.sub_list_icon
                                  }
                                  icon={faStore}
                                />
                                <span>{key("store")}: </span>
                              </div>

                              <span>{card.shop?.name}</span>
                            </li>
                            <li className={`${styles.sub_list_item}`}>
                              <div className="d-flex align-items-center">
                                <FontAwesomeIcon
                                  className={
                                    isArLang
                                      ? styles.sub_list_icon_ar
                                      : styles.sub_list_icon
                                  }
                                  icon={faDollar}
                                />
                                <span>{key("price")}:</span>
                              </div>

                              <span>
                                {card.price?.value} {key("sar")}
                              </span>
                            </li>
                            <li className={`${styles.sub_list_item}`}>
                              {card.isDelivered ? (
                                <div className="d-flex align-items-center">
                                  <FontAwesomeIcon
                                    className={
                                      isArLang
                                        ? styles.sub_list_icon_ar
                                        : styles.sub_list_icon
                                    }
                                    icon={faComment}
                                  />{" "}
                                  <span>{key("cardReceived")}</span>
                                </div>
                              ) : (
                                <div className="d-flex align-items-center">
                                  <FontAwesomeIcon
                                    className={
                                      isArLang
                                        ? styles.sub_list_icon_ar
                                        : styles.sub_list_icon
                                    }
                                    icon={faCommentSlash}
                                  />
                                  <span>{key("didnotReceive")}</span>
                                </div>
                              )}
                            </li>
                          </ul>
                          <div className={styles.controllers}>
                            <FontAwesomeIcon
                              className={styles.trash_icon}
                              icon={faTrashCan}
                              onClick={() => {
                                setCardId(card._id);
                                setModalShow(true);
                              }}
                            />
                            <button
                              onClick={() => {
                                navigate(`/view-card/${card._id}`);
                                onClose();
                              }}
                              className={styles.view_btn}
                            >
                              <FontAwesomeIcon
                                className={styles.eye}
                                icon={faEye}
                              />
                              <span>{key("viewCard")}</span>
                            </button>

                            <FontAwesomeIcon
                              className={styles.arrow_right_icon}
                              icon={!isArLang ? faArrowRight : faArrowLeft}
                              onClick={() =>
                                goToBuyingPhases(
                                  card?.recipient,
                                  card?.price?.value,
                                  card?._id,
                                  card?.celebrateIcon,
                                  card?.celebrateQR,
                                  card?.shapes,
                                  card?.proColor ? card.proColor.price : null
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
          choosePaymentWay={choosePaymentWay}
          message={confirmMsg}
          btnMsg={btnMsg}
          balance={walletBalance && walletBalance}
          cardPrice={cardPrice}
          ProPrice={proColorPrice !== "" ? proColorPrice : undefined}
          cardId={cardId}
          balanceCase={balanceCase}
          chargeCase={goToChargeMethods}
          isCelebrateIcon={isCelebrateIcon}
          isCelebrateQR={isCelebrateQR}
          shapePrice={totalShapesPrice}
        />
      )}
      {detailsShow && (
        <DetailsAfterBuying
          show={detailsShow}
          onHide={() => setDetailsShow(false)}
          cardDetails={cardDetails}
          walletDetails={walletDetails}
          totalPrice={totalPrice}
          onClose={onClose}
        />
      )}
    </>
  );
};

export default Cart;
