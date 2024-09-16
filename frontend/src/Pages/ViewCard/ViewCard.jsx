import { useQuery } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import { getCard } from "../../util/Http";
import Placeholder from "react-bootstrap/Placeholder";
import Card from "react-bootstrap/Card";
import styles from "./ViewCard.module.css";
import useImage from "use-image";
import { useTranslation } from "react-i18next";
import mainLogo from "../../Images/logo.png";
import { Image, Layer, Rect, Stage, Text } from "react-konva";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCalendarDay,
  faClock,
  faComment,
  faCommentSlash,
  faGift,
} from "@fortawesome/free-solid-svg-icons";
import { useParams } from "react-router-dom";
import confetti from "canvas-confetti";

const ViewCard = () => {
  const token = JSON.parse(localStorage.getItem("token"));
  const { cardId } = useParams();
  const [isFirstVisit, setIsFirstVisit] = useState(true);
  const [isFrontShape, setIsFrontShape] = useState(false);
  const { t: key } = useTranslation();

  const { data: myCard, isFetching } = useQuery({
    queryKey: ["viewCard", token],
    queryFn: () => getCard(token, cardId),
    enabled: !!token,
  });

  useEffect(() => {
    if (isFirstVisit) {
      setTimeout(() => {
        setIsFirstVisit(false);
      }, 5000);
    }
  }, [isFirstVisit]);

  var scalar = 2;
  var heart = confetti.shapeFromText({ text: "❤️", scalar });
  var triangle = confetti.shapeFromPath({ path: "M0 10 L5 0 L10 10z" });

  isFirstVisit &&
    confetti({
      particleCount: 400,
      spread: 200,
      origin: { y: 0.6 },
      shapes: ["circle", triangle, "square"],
    });
  isFirstVisit &&
    confetti({
      particleCount: 400,
      spread: 200,
      origin: { x: 1, y: 1 },
      shapes: [heart],
    });
  isFirstVisit &&
    confetti({
      particleCount: 400,
      spread: 200,
      origin: { x: 0, y: 1 },
      shapes: [heart],
    });

  const loadingCard = (
    <Card style={{ width: "18rem" }}>
      <Card.Body>
        <Placeholder as={Card.Title} animation="glow">
          <Placeholder xs={6} />
        </Placeholder>
        <Placeholder as={Card.Text} animation="glow">
          <Placeholder xs={7} /> <Placeholder xs={4} /> <Placeholder xs={4} />{" "}
          <Placeholder xs={6} /> <Placeholder xs={8} />
        </Placeholder>
        <Placeholder.Button variant="danger" xs={6} />
      </Card.Body>
    </Card>
  );

  return (
    <div className="d-flex justify-content-center align-items-center vh-100">
      {!isFetching ? (
        myCard ? (
          <div
            className="d-flex flex-column justify-content-center align-items-center"
            xlg={6}
            key={myCard.data._id}
          >
            <div className={styles.header}>
              <ul className={styles.header_list}>
                <li
                  className={`${styles.header_list_item} ${
                    isFrontShape && styles.active
                  }`}
                  onClick={() => setIsFrontShape(true)}
                >
                  {key("previewFront")}
                </li>
                <li
                  className={`${styles.header_list_item} ${
                    !isFrontShape && styles.active
                  }`}
                  onClick={() => setIsFrontShape(false)}
                >
                  {key("previewBack")}
                </li>
              </ul>
            </div>
            <div className={styles.card_body}>
              <KonvaCard
                isPaid={myCard.data.isPaid}
                isFrontShape={isFrontShape}
                card={myCard.data}
              />
            </div>
          </div>
        ) : (
          loadingCard
        )
      ) : (
        loadingCard
      )}
    </div>
  );
};

const KonvaCard = ({ card, isPaid, isFrontShape }) => {
  const [isSmalogo, setIsSmalogo] = useState(false);

  const [mainLogoImage] = useImage(mainLogo);
  const { t: key } = useTranslation();
  let isArLang = localStorage.getItem("i18nextLng") === "ar";

  const [shapeImage] = useImage(
    card.isSpecial
      ? `${process.env.REACT_APP_Host}shapes/back-shape.png`
      : `${process.env.REACT_APP_Host}shapes/${card.shape?.image}`
  );
  const [shapeImageFront] = useImage(
    `${process.env.REACT_APP_Host}shapes/front-shape.png`
  );
  // const [logoImage] = useImage(
  //   `${process.env.REACT_APP_Host}shops/${card.shop?.logo}`
  // );

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
            cornerRadius={30}
            className={styles.rect_card}
          />

          {shapeImage &&
            !isFrontShape &&
            (card.isSpecial ? (
              <Image
                image={shapeImage}
                width={scaledWidth || cardWidth}
                height={scaledHeight || cardHeight}
                x={offsetX}
                y={offsetY}
                cornerRadius={30}
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
          {card.isSpecial && !!isFrontShape && (
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

          {card.text && !card.isSpecial && !!isFrontShape && (
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

          {card.isSpecial && !!isFrontShape && (
            <Text
              text={`${card.price.value} SAR`}
              fontSize={25}
              fontFamily={"Arial, Helvetica, sans-serif"}
              fill="#FFFFFF"
              x={20}
              y={20}
            />
          )}
    
        </Layer>
      </Stage>
      <div className="mt-1 px-2  position-relative d-flex justify-content-center flex-column">
        <div className={styles.shop_logo}>
          <img
            src={`${process.env.REACT_APP_Host}shops/${card.shop?.logo}`}
            alt="shopp_logo"
          />
        </div>
        <ul className={styles.list}>
          {isPaid ? (
            <>
              <li className={`${styles.list_item} ${styles.price_value} text-center`}>
                {card.price.value} {key("sar")}
              </li>
              <li
                className={`${styles.list_item} ${
                  isArLang ? styles.list_item_ar : styles.list_item_en
                } text-center`}
              >
                <span>
                  <FontAwesomeIcon
                    icon={faGift}
                    className={`${styles.list_icon} ${styles.gift_icon}`}
                  />
                  4b0b5dd8508484a33hb
                </span>
              </li>
              <li
                className={`${styles.list_item} ${
                  isArLang ? styles.list_item_ar : styles.list_item_en
                } text-success text-center`}
              >
                {key("cardReady")}
              </li>
            </>
          ) : (
            <>
              <li className={`${styles.list_item} ${styles.price_value} text-center`}>
                {card.price.value} {key("sar")}
              </li>
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
            </>
          )}
        </ul>
      </div>
    </>
  );
};

export default ViewCard;
