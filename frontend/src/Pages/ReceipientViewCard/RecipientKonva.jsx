import React, { useEffect, useState } from "react";
import styles from "./RecipientViewCard.module.css";
import { faGift } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Image, Layer, Rect, Stage, Text } from "react-konva";
import useImage from "use-image";
import { useTranslation } from "react-i18next";
import mainLogo from "../../Images/logo.png";
import useIsSmallScreen from "../ViewCard/useIsSmallScreen";
import useCardSize from "../ViewCard/useCardSize";

const RecipientKonva = ({ card, isFrontShape }) => {
  const isSmallScreen = useIsSmallScreen(480);
  const { cardWidth, cardHeight } = useCardSize(480);
  const [mainLogoImage] = useImage(mainLogo);
  const { t: key } = useTranslation();
  const isArLang = localStorage.getItem("i18nextLng") === "ar";
  const [loadedImages, setLoadedImages] = useState([]);

  useEffect(() => {
    const loadImages = async () => {
      if (!card?.shapes || !Array.isArray(card.shapes)) {
        setLoadedImages([]);
        return;
      }

      const images = await Promise.all(
        card.shapes.map((shape) => {
          const imageUrl = `${process.env.REACT_APP_Host}shapes/${shape.shape?.image}`;
          return new Promise((resolve) => {
            const img = new window.Image();
            img.src = imageUrl;
            img.onload = () => {
              resolve(img);
            };
            img.onerror = (error) => {
              resolve(null);
            };
          });
        })
      );
      setLoadedImages(images);
    };

    loadImages();
  }, [card]);

  const [shapeImageFront] = useImage(
    card?.isSpecial
      ? `${process.env.REACT_APP_Host}specialCards/front-shape.webp`
      : ""
  );
  const [shapeImageBack] = useImage(
    card?.isSpecial
      ? `${process.env.REACT_APP_Host}specialCards/back-shape.webp`
      : ""
  );
  const [proColorImage] = useImage(
    card?.proColor
      ? `${process.env.REACT_APP_Host}colors/${card?.proColor?.image}`
      : ""
  );

  let offsetX = 0,
    offsetY = 0;

  return (
    <>
      <Stage
        className={styles.card_stage}
        width={cardWidth}
        height={cardHeight}
      >
        <Layer>
          {card?.proColor ? (
            <Image
              image={proColorImage}
              width={cardWidth}
              height={cardHeight}
              opacity={1}
              visible={true}
              cornerRadius={30}
            />
          ) : (
            <Rect
              width={cardWidth}
              height={cardHeight}
              fill={card?.color?.hex || "#FFFFFF"}
              cornerRadius={30}
              className={styles.rect_card}
            />
          )}

          {!isFrontShape &&
            (card.isSpecial ? (
              <Image
                image={shapeImageBack}
                width={cardWidth}
                height={cardHeight}
                x={offsetX}
                y={offsetY}
                cornerRadius={30}
              />
            ) : (
              <>
                {card?.shapes.map((shape, index) => {
                  const img = loadedImages[index];
                  if (!img) {
                    return null;
                  }

                  const displayWidth = img.width * shape.scale || 0;
                  const displayHeight = img.height * shape.scale || 0;

                  return (
                    <Image
                    key={`${shape._id}_${index}`}
                    image={img}
                    x={shape.position.x}
                    y={shape.position.y}
                    rotation={shape.rotation}
                    width={displayWidth}
                    height={displayHeight}
                    offsetX={displayWidth / 2}
                    offsetY={displayHeight / 2}
                    />
                  );
                })}
              </>
            ))}

          {card.isSpecial && !!isFrontShape && (
            <Image
              image={shapeImageFront}
              width={cardWidth}
              height={cardHeight}
              x={offsetX}
              y={offsetY}
              cornerRadius={10}
            />
          )}

          {!card.isSpecial && (
            <Image
              image={mainLogoImage}
              x={isSmallScreen ? 15 : 20}
              y={isSmallScreen ? cardHeight - 30 : cardHeight - 50}
              width={isSmallScreen ? 50 : 100}
              height={isSmallScreen ? 18 : 35}
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
        </Layer>
      </Stage>
      <div className="mt-1 px-2  position-relative d-flex justify-content-center flex-column">
        <div className={styles.shop_logo}>
          <img
            src={`${process.env.REACT_APP_Host}shops/${card?.shop?.logo}`}
            alt="shop_logo"
          />
        </div>
        <ul className={styles.list}>
          <li
            className={`${styles.list_item} ${styles.price_value} text-center`}
          >
            {card.price.value} {key("sar")}
          </li>
          {isFrontShape ? (
            <>
              {card.celebrateQR ? (
                <>
                  <li
                    className={`${styles.list_item} ${
                      isArLang ? styles.list_item_ar : styles.list_item_en
                    } text-center`}
                  >
                    <img
                      src={card?.celebrateQR}
                      className={styles.scanner}
                      alt="celebrate QR"
                    />
                  </li>{" "}
                  <li
                    className={`${styles.list_item} ${
                      isArLang ? styles.list_item_ar : styles.list_item_en
                    } mini_word text-center`}
                  >
                    {key("exploreScan")}
                  </li>
                </>
              ) : (
                <>
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
                      {key("forYou")}
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
              )}
            </>
          ) : (
            <>
              <li
                className={`${styles.list_item} ${
                  isArLang ? styles.list_item_ar : styles.list_item_en
                } text-center`}
              >
                {card.discountCode?.qrCode ? (
                  <img
                    src={card.discountCode?.qrCode}
                    className={styles.scanner}
                    alt="physical store QR"
                  />
                ) : (
                  <span>
                    <FontAwesomeIcon
                      icon={faGift}
                      className={`${styles.list_icon} ${styles.gift_icon}`}
                    />
                    4b0b5dd8508484a33hb
                  </span>
                )}
              </li>
              <li
                className={`${styles.list_item} ${
                  isArLang ? styles.list_item_ar : styles.list_item_en
                } text-success text-center`}
              >
                {key("cardReady")}
              </li>
            </>
          )}
        </ul>
      </div>
    </>
  );
};

export default RecipientKonva;
