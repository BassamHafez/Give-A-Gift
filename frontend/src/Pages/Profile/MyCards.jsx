import React, { useState, useEffect } from "react";
import { Stage, Layer, Rect, Text, Image } from "react-konva";
import useImage from "use-image";
import { useQuery } from "@tanstack/react-query";
import { getMyCards } from "../../util/Http";
import Row from "react-bootstrap/esm/Row";
import Col from "react-bootstrap/esm/Col";
import styles from "./MyCards.module.css";
import mainLogo from "../../Images/logo_rem.png";
import MainButton from "../../Components/Ui/MainButton";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTruck } from "@fortawesome/free-solid-svg-icons";

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
  const [mainLogoImage] = useImage(mainLogo);

  const [shapeImage] = useImage(
    `http://127.0.0.1:3001/shapes/${card.shape?.image}`
  );
  const [logoImage] = useImage(
    `http://127.0.0.1:3001/shops/${card.shop?.logo}`
  );

  const [cardWidth, setCardWidth] = useState(480);
  const [cardHeight, setCardHeight] = useState(270);

  useEffect(() => {
    const handleResize = () => {
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

  if (imageAspectRatio > cardAspectRatio) {
    scaledHeight = cardHeight;
    scaledWidth = cardHeight * imageAspectRatio;
    offsetX = (cardWidth - scaledWidth) / 2;
  } else {
    scaledWidth = cardWidth;
    scaledHeight = cardWidth / imageAspectRatio;
    offsetY = (cardHeight - scaledHeight) / 2;
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

          {shapeImage && showBack && (
            <Image
              image={shapeImage}
              width={scaledWidth || cardWidth}
              height={scaledHeight || cardHeight}
              x={offsetX}
              y={offsetY}
              cornerRadius={10}
            />
          )}
          <Image
            image={mainLogoImage}
            x={20}
            y={cardHeight - 50}
            width={40}
            height={30}
            visible={true}
          />

          {card.text && !showBack && (
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

          {card.price && !showBack && (
            <Text
              text={`${card.price.value} SAR`}
              fontSize={Number(card.price.fontSize)}
              fontFamily={card.price.fontFamily}
              fill={card.price.fontColor}
              x={10}
              y={10}
            />
          )}

          {logoImage && (
            <Image
              image={logoImage}
              x={cardWidth - 70}
              y={10}
              width={60}
              height={60}
              cornerRadius={30}
            />
          )}
        </Layer>
      </Stage>
      <div className="my-4 px-3">
        <h5><FontAwesomeIcon icon={faTruck} className={styles.truc_icon}/>{card.isDelivered?"Card delivered":"Didn't delivered yet"}</h5>
        <span className="mini_word"> Receive Time : {card.receiveAt?card.receiveAt:"Fill Recipient Information"}</span>
       
        <div className={`${styles.btns_group} mt-3 justify-content-between align-items-center`}>
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
        <div className={`${styles.responsive_btns_group} mt-3 justify-content-center align-items-center`}>
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
