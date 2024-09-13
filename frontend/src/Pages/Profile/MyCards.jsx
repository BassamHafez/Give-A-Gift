import React, { useState, useEffect } from "react";
import { Stage, Layer, Rect, Text, Image } from "react-konva";
import useImage from "use-image";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getMyCards, getMyWallet } from "../../util/Http";
import Row from "react-bootstrap/esm/Row";
import Col from "react-bootstrap/esm/Col";
import styles from "./MyCards.module.css";
import mainLogo from "../../Images/logo.png";
import MainButton from "../../Components/Ui/MainButton";
import Placeholders from "../../Components/Ui/Placeholders";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCalendarDay,
  faClock,
  faComment,
  faCommentSlash,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import { useTranslation } from "react-i18next";
import axios from "axios";
import giveGiftImg from "../../Images/giveGift.jpg";
import { Link, useNavigate, useParams } from "react-router-dom";
import ConfirmationModal from "../../Components/Ui/ConfirmationModal";
import toast from "react-hot-toast";

const token = JSON.parse(localStorage.getItem("token"));
const notifySuccess = (message) => toast.success(message);
const notifyError = (message) => toast.error(message);

const MyCards = () => {

  const { data, refetch, isFetching } = useQuery({
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

  return (
    <>
      <Row>
        {!isFetching ? (
          data?.data?.length > 0 ? (
            data?.data?.map(
              (card) =>
                !card.isPaid && (
                  <Col
                    className="d-flex justify-content-center align-items-center"
                    xlg={6}
                    key={card._id}
                  >
                    <div className={styles.card_body}>
                      <KonvaCard
                        walletBalance={walletBalance}
                        card={card}
                        refetch={refetch}
                        notifySuccess={notifySuccess}
                        notifyError={notifyError}
                      />
                    </div>
                  </Col>
                )
            )
          ) : (
            <div className={styles.noCards}>
              <div className={styles.noCards_img}>
                <img className="w-100" src={giveGiftImg} alt="giveGiftImg" />
              </div>
              <div>
                <span className="mini_word">
                  You don't have any cards right now. Get one{" "}
                  <Link className="text-primary" to={"/special-cards"}>
                    here
                  </Link>
                </span>
              </div>
            </div>
          )
        ) : (
          <Placeholders />
        )}
      </Row>
    </>
  );
};

const KonvaCard = ({
  card,
  refetch,
  walletBalance,
  notifySuccess,
  notifyError,
}) => {
  const [showBack, setShowBack] = useState(true);
  const [isSmalogo, setIsSmalogo] = useState(false);
  const [modalShow, setModalShow] = useState(false);
  const [confirmFunc, setConfirmFunc] = useState("");
  const [confirmMsg, setConfirmMsg] = useState("");
  const [btnMsg, setBtnMsg] = useState("");
  const { userId } = useParams();

  const [mainLogoImage] = useImage(mainLogo);
  const navigate = useNavigate();
  const { t: key } = useTranslation();
  let isArLang = localStorage.getItem("i18nextLng") === "ar";
  const queryClient = useQueryClient();

  const [shapeImage] = useImage(
    card.isSpecial
      ? `${process.env.REACT_APP_Host}shapes/back-shape.png`
      : `${process.env.REACT_APP_Host}shapes/${card.shape?.image}`
  );
  const [shapeImageFront] = useImage(
    `${process.env.REACT_APP_Host}shapes/front-shape.png`
  );
  const [logoImage] = useImage(
    `${process.env.REACT_APP_Host}shops/${card.shop?.logo}`
  );

  const formatDateTime = (dateTimeString) => {
    const date = new Date(dateTimeString);
    const formattedDate = date.toLocaleDateString("en-GB");
    const formattedTime = date.toLocaleTimeString("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
    });
    return { formattedDate, formattedTime };
  };

  const receiveAtFormatted = card.receiveAt
    ? formatDateTime(card.receiveAt)
    : {
        formattedDate: key("recDataInComplete"),
        formattedTime: key("recDataInComplete"),
      };
  const [cardWidth, setCardWidth] = useState(480);
  const [cardHeight, setCardHeight] = useState(270);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 480) {
        setIsSmalogo(true);
      } else {
        setIsSmalogo(false);
      }
      const width = window.innerWidth < 500 ? window.innerWidth * 0.9 : 480;
      setCardWidth(width);
      setCardHeight((width * 9) / 16);
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const imageAspectRatio = shapeImage?.width / shapeImage?.height;
  const cardAspectRatio = cardWidth / cardHeight;

  let scaledWidth,
    scaledHeight,
    offsetX = 0,
    offsetY = 0;

  let scaledWidth2,
    scaledHeight2,
    offsetX2 = 0,
    offsetY2 = 0;

  //special
  if (imageAspectRatio > cardAspectRatio) {
    scaledHeight = cardHeight;
    scaledWidth = cardHeight * imageAspectRatio;
    offsetX = (cardWidth - scaledWidth) / 2;
  } else {
    scaledWidth = cardWidth;
    scaledHeight = cardWidth / imageAspectRatio;
    offsetY = (cardHeight - scaledHeight) / 2;
  }

  //not special
  if (imageAspectRatio > cardAspectRatio) {
    scaledWidth2 = cardWidth;
    scaledHeight2 = cardWidth / imageAspectRatio;
    offsetX2 = 0;
    offsetY2 = (cardHeight - scaledHeight2) / 2;
  } else {
    scaledHeight2 = cardHeight;
    scaledWidth2 = cardHeight * imageAspectRatio;
    offsetX2 = (cardWidth - scaledWidth2) / 2;
    offsetY2 = 0;
  }

  const confirmMethod = (method) => {
    if (method === "delete") {
      setModalShow(true);
      setConfirmFunc("delete");
      setConfirmMsg(key("confirmDelete"));
      setBtnMsg(key("delete"));
    } else if (method === "pay") {
      setModalShow(true);
      setConfirmFunc("pay");
      setConfirmMsg(
        `${key("purchase")} at ${card?.price?.value} ${key("sendTo")} ${
          card?.recipient?.name
        } ${key("whatsAppNum")} ${card?.recipient?.whatsappNumber}. ${key(
          "purchaseQuestion"
        )}`
      );
      setBtnMsg(key("confirm"));
    } else {
      setModalShow(true);
      setConfirmFunc("charge");
      setConfirmMsg(`charge your wallet to continue`);
      setBtnMsg(key("charge"));
    }
  };

  const deleteCard = async () => {
    setModalShow(false);
    if (card._id && token) {
      try {
        const response = await axios.delete(
          `${process.env.REACT_APP_Base_API_URl}cards/${card._id}`,
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
          notifyError("something went wrong please try again later!");
        }
      } catch (error) {
        notifyError("something went wrong please try again later!");
        console.error(error);
      }
    } else {
      notifyError(
        "The card no longer exists, or something went wrong. Unable to delete."
      );
    }
  };

  const payCard = async () => {
    if (Number(card.price?.value) > Number(walletBalance)) {
      setModalShow(false);
      notifyError(key("insuffBalance"));
      confirmMethod(key("charge"));
    } else {
      try {
        const response = await axios.post(
          `${process.env.REACT_APP_Base_API_URl}wallets/buy-card`,
          { cardId: card._id },
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
    setModalShow(false);
    navigate(`/payment/payment/${userId}`);
  };

  return (
    <>
      <Stage
        className={styles.card_stage}
        width={cardWidth}
        height={cardHeight}
      >
        <Layer>
          <Rect
            width={cardWidth}
            height={cardHeight}
            fill={card.color?.hex || "#FFFFFF"}
            cornerRadius={10}
            className={styles.rect_card}
          />

          {shapeImage &&
            showBack &&
            (card.isSpecial ? (
              <Image
                image={shapeImage}
                width={scaledWidth || cardWidth}
                height={scaledHeight || cardHeight}
                x={offsetX}
                y={offsetY}
                cornerRadius={10}
              />
            ) : (
              <Image
                image={shapeImage}
                width={scaledWidth2 || cardWidth}
                height={scaledHeight2 || cardHeight}
                x={offsetX2}
                y={offsetY2}
                cornerRadius={10}
              />
            ))}
          {card.isSpecial && !showBack && (
            <Image
              image={shapeImageFront}
              width={scaledWidth || cardWidth}
              height={scaledHeight || cardHeight}
              x={offsetX}
              y={offsetY}
              cornerRadius={10}
            />
          )}

          {!card.isSpecial && (
            <Image
              image={mainLogoImage}
              x={isSmalogo ? 15 : 20}
              y={isSmalogo ? cardHeight - 30 : cardHeight - 50}
              width={isSmalogo ? 50 : 100}
              height={isSmalogo ? 18 : 35}
              visible={true}
            />
          )}

          {card.text && !card.isSpecial && !showBack && (
            <Text
              text={card.text.message}
              fontSize={Number(card.text.fontSize)}
              fontFamily={card.text.fontFamily}
              fill={card.text.fontColor}
              x={card.text.xPosition || 0}
              y={card.text.yPosition || 0}
              align="center"
              wrap="char"
              width={cardWidth * 0.8}
            />
          )}

          {card.price && !card.isSpecial && !showBack && (
            <Text
              text={`${card.price.value} SAR`}
              fontSize={Number(card.price.fontSize)}
              fontFamily={card.price.fontFamily}
              fill={card.price.fontColor}
              x={10}
              y={10}
            />
          )}

          {card.isSpecial && !showBack && (
            <Text
              text={`${card.price.value} SAR`}
              fontSize={25}
              fontFamily={"Arial, Helvetica, sans-serif"}
              fill="#FFFFFF"
              x={10}
              y={10}
            />
          )}

          {logoImage && (
            <Image
              image={logoImage}
              x={isSmalogo ? cardWidth - 50 : cardWidth - 70}
              y={10}
              width={isSmalogo ? 40 : 60}
              height={isSmalogo ? 40 : 60}
              cornerRadius={30}
            />
          )}
        </Layer>
      </Stage>
      <div className="my-4 px-3  position-relative">
        <FontAwesomeIcon
          onClick={() => {
            confirmMethod("delete");
          }}
          title={`${key("delete")} ${key("card")}`}
          className={`${
            !isArLang ? styles.delete_icon : styles.delete_icon_ar
          } `}
          icon={faTrash}
        />
        <ul className={styles.list}>
          <li
            className={`${styles.list_item} ${
              isArLang ? styles.list_item_ar : styles.list_item_en
            }`}
          >
            {card.isDelivered ? (
              <span>
                <FontAwesomeIcon
                  className={styles.list_icon}
                  icon={faComment}
                />{" "}
                {key("cardReceived")}
              </span>
            ) : (
              <span>
                <FontAwesomeIcon
                  className={styles.list_icon}
                  icon={faCommentSlash}
                />
                {key("didnotReceive")}
              </span>
            )}
          </li>
          <li
            className={`${styles.list_item} ${
              isArLang ? styles.list_item_ar : styles.list_item_en
            }`}
          >
            <span>
              <FontAwesomeIcon
                icon={faCalendarDay}
                className={`${styles.list_icon}`}
              />{" "}
              {key("date")}: {receiveAtFormatted.formattedDate}
            </span>
          </li>
          <li
            className={`${styles.list_item} ${
              isArLang ? styles.list_item_ar : styles.list_item_en
            }`}
          >
            <span>
              <FontAwesomeIcon
                icon={faClock}
                className={`${styles.list_icon}`}
              />{" "}
              {key("time")}: {receiveAtFormatted.formattedTime}
            </span>
          </li>
        </ul>

        <div
          className={`${styles.btns_group} mt-3 justify-content-between align-items-center`}
        >
          <MainButton
            onClick={() => setShowBack(!showBack)}
            className={styles.toggle_btn}
            type={"white"}
            text={
              showBack
                ? `${key("show")} ${key("front")}`
                : `${key("show")} ${key("back")}`
            }
          />
          <MainButton
            onClick={() =>
              card.isPaid
                ? card.receiveAt
                  ? console.log("show")
                  : navigate(`/recipient-information/${card._id}`)
                : card.receiveAt
                ? confirmMethod("pay")
                : navigate(`/recipient-information/${card._id}`)
            }
            text={
              card.isPaid
                ? card.receiveAt
                  ? `${key("show")} ${key("card")}`
                  : key("completeData")
                : card.receiveAt
                ? key("payment")
                : key("completeData")
            }
          />
        </div>
        <div
          className={`${styles.responsive_btns_group} mt-3 justify-content-center align-items-center`}
        >
          <MainButton
            onClick={() =>
              card.isPaid
                ? card.receiveAt
                  ? console.log("show")
                  : navigate(`/recipient-information/${card._id}`)
                : card.receiveAt
                ? confirmMethod("pay")
                : navigate(`/recipient-information/${card._id}`)
            }
            className={styles.show_card_bt}
            text={
              card.isPaid
                ? card.receiveAt
                  ? `${key("show")} ${key("card")}`
                  : key("completeData")
                : card.receiveAt
                ? key("payment")
                : key("completeData")
            }
          />
        </div>
      </div>
      {modalShow && (
        <ConfirmationModal
          show={modalShow}
          onHide={() => setModalShow(false)}
          func={
            confirmFunc === "delete"
              ? deleteCard
              : confirmFunc === "pay"
              ? payCard
              : goToChargeMethods
          }
          message={confirmMsg}
          smallSize={confirmFunc === "pay" ? true : false}
          btnMsg={btnMsg}
        />
      )}
    </>
  );
};

export default MyCards;
