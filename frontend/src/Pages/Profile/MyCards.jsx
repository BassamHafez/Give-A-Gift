import React, { useState, useEffect } from "react";
import { Stage, Layer, Rect, Text, Image } from "react-konva";
import useImage from "use-image";
import { useQuery } from "@tanstack/react-query";
import { getMyCards } from "../../util/Http";
import Row from "react-bootstrap/esm/Row";
import Col from "react-bootstrap/esm/Col";
import styles from "./MyCards.module.css";
import mainLogo from "../../Images/logo.png";
import MainButton from "../../Components/Ui/MainButton";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCalendarDay,
  faClock,
  faComment,
  faCommentSlash,
} from "@fortawesome/free-solid-svg-icons";

const MyCards = () => {
  const token = JSON.parse(localStorage.getItem("token"));

  const { data } = useQuery({
    queryKey: ["getCard", token],
    queryFn: () => getMyCards(token),
    enabled: !!token,
    staleTime: 300000,
  });

  return (
    <div>
      <Row>
        {data?.data?.map((card) => (
          <Col
            className="d-flex justify-content-center align-items-center"
            xlg={6}
            key={card._id}
          >
            <div className={styles.card_body}>
              <KonvaCard card={card} />
            </div>
          </Col>
        ))}
      </Row>
    </div>
  );
};

const KonvaCard = ({ card }) => {
  const [showBack, setShowBack] = useState(true);
  const [isSmalogo, setIsSmalogo] = useState(false);
  const [mainLogoImage] = useImage(mainLogo);

  const [shapeImage] = useImage(
    card.isSpecial
      ? `http://127.0.0.1:3001/shapes/back-shape.png`
      : `http://127.0.0.1:3001/shapes/${card.shape?.image}`
  );
  const [shapeImageFront] = useImage(
    `http://127.0.0.1:3001/shapes/front-shape.png`
  );
  const [logoImage] = useImage(
    `http://127.0.0.1:3001/shops/${card.shop?.logo}`
  );

  const formatDateTime = (dateTimeString) => {
    const date = new Date(dateTimeString);
    const formattedDate = date.toLocaleDateString("en-GB"); // or "en-US" for a different format
    const formattedTime = date.toLocaleTimeString("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
    });
    return { formattedDate, formattedTime };
  };

  const receiveAtFormatted = card.receiveAt
    ? formatDateTime(card.receiveAt)
    : { formattedDate: "N/A", formattedTime: "N/A" };
  const [cardWidth, setCardWidth] = useState(480);
  const [cardHeight, setCardHeight] = useState(270);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 480) {
        setIsSmalogo(true)
      } else {
        setIsSmalogo(false)
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
            fill={card.color || "#FFFFFF"}
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
              x={isSmalogo?15:20}
              y={isSmalogo?cardHeight - 30:cardHeight - 50}
              width={isSmalogo?50: 100}
              height={isSmalogo?18:35}
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
              x={ isSmalogo?cardWidth-50:cardWidth - 70}
              y={10}
              width={isSmalogo?40: 60}
              height={isSmalogo?40: 60}
              cornerRadius={30}
            />
          )}
        </Layer>
      </Stage>
      <div className="my-4 px-3">
        <ul className={styles.list}>
          <li className={styles.list_item}>
            {card.isDelivered ? (
              <span>
                <FontAwesomeIcon
                  className={styles.list_icon}
                  icon={faComment}
                />{" "}
                Card Recieved
              </span>
            ) : (
              <span>
                <FontAwesomeIcon
                  className={styles.list_icon}
                  icon={faCommentSlash}
                />
                Didno't revieve
              </span>
            )}
          </li>
          <li className={styles.list_item}>
            <span>
              <FontAwesomeIcon
                icon={faCalendarDay}
                className={`${styles.list_icon}`}
              />{" "}
              Date: {receiveAtFormatted.formattedDate}
            </span>
          </li>
          <li className={styles.list_item}>
            <span>
              <FontAwesomeIcon
                icon={faClock}
                className={`${styles.list_icon}`}
              />{" "}
              Time: {receiveAtFormatted.formattedTime}
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
            text={showBack ? "Show Front" : "Show Back"}
          />
          <MainButton
            onClick={() => setShowBack(!showBack)}
            text={card.isPaid ? "Show Card" : "Buy Card"}
          />
        </div>
        <div
          className={`${styles.responsive_btns_group} mt-3 justify-content-center align-items-center`}
        >
          <MainButton
            onClick={() => setShowBack(!showBack)}
            className={styles.show_card_bt}
            text={card.isPaid ? "Show Card" : "Buy Card"}
          />
        </div>
      </div>
    </>
  );
};

export default MyCards;
