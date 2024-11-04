import {
  faClock,
  faComment,
} from "@fortawesome/free-solid-svg-icons";
import { faCalendar } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Image, Layer, Rect, Stage, Text } from "react-konva";
import useImage from "use-image";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import mainLogo from "../../Images/logo.png";
import styles from "./ViewCard.module.css";
import useIsSmallScreen from "./useIsSmallScreen";
import useCardSize from "./useCardSize";
import { Link } from "react-router-dom";

const KonvaCard = ({ card, isPaid, isFrontShape }) => {
  const isSmallScreen = useIsSmallScreen(480);
  const { cardWidth, cardHeight } = useCardSize(480);
  const [loadedImages, setLoadedImages] = useState([]);

  useEffect(() => {
    const loadImages = async () => {
      if (!card?.shapes || !Array.isArray(card.shapes)) {
        setLoadedImages([]);
        return;
      }

      const images = await Promise.all(
        card?.shapes?.map((shape) => {
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

  const [mainLogoImage] = useImage(mainLogo);
  const { t: key } = useTranslation();
  const isArLang = localStorage.getItem("i18nextLng") === "ar";

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

  const formatDateTime = (dateTimeString) => {
    const date = new Date(dateTimeString);
    const formattedDate = date.toLocaleDateString("en-GB");
    const formattedTime = date.toLocaleTimeString("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
    });
    return { formattedDate, formattedTime };
  };

  const receiveAtFormatted = card?.receiveAt
    ? formatDateTime(card?.receiveAt)
    : {
        formattedDate: key("payFirst"),
        formattedTime: key("payFirst"),
      };

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

          {isFrontShape === "front" &&
            (card.isSpecial && shapeImageBack ? (
              <Image
                image={shapeImageFront}
                width={cardWidth}
                height={cardHeight}
                x={offsetX}
                y={offsetY}
                cornerRadius={30}
              />
            ) : (
              <>
                {card?.shapes?.map((shape, index) => {
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

          {card.isSpecial && isFrontShape === "back" && (
            <Image
              image={shapeImageBack}
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

          {card.text && !card.isSpecial && isFrontShape === "back" && (
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

      <div className="mt-1 px-2 position-relative d-flex justify-content-center flex-column">
        <Link
          className="text-primary fw-bold"
          target="_blank"
          to={card?.shop?.link}
        >
          <div className={styles.shop_logo}>
            <img
              src={`${process.env.REACT_APP_Host}shops/${card?.shop?.logo}`}
              alt="shop_logo"
            />
          </div>
        </Link>
        <ul className={styles.list}>
          {isPaid ? (
            <>
              <li
                className={`${styles.list_item} ${styles.price_value} text-center`}
              >
                {card?.price?.value} {key("sar")}
              </li>
              {isFrontShape === "back" ? (
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
                      </li>
                      <li
                        className={`${styles.list_item} ${
                          isArLang ? styles.list_item_ar : styles.list_item_en
                        } mini_word text-center`}
                      >
                        {key("exploreScan")}
                      </li>
                    </>
                  ) : (
                    <li
                      className={`${styles.list_item} ${
                        isArLang ? styles.list_item_ar : styles.list_item_en
                      } ${
                        card?.discountCode?.isUsed
                          ? "text-danger"
                          : "text-success"
                      }  text-center`}
                    >
                      {`${
                        card?.discountCode?.isUsed
                          ? key("cardUsed")
                          : key("cardReady")
                      }`}
                    </li>
                  )}
                </>
              ) : (
                isFrontShape === "front" && (
                  <>
                    <li
                      className={`${styles.list_item} ${
                        isArLang ? styles.list_item_ar : styles.list_item_en
                      } ${
                        card?.discountCode?.isUsed
                          ? "text-danger"
                          : "text-success"
                      }  text-center`}
                    >
                      {`${
                        card?.discountCode?.isUsed
                          ? key("cardUsed")
                          : key("cardReady")
                      }`}
                    </li>
                  </>
                )
              )}
            </>
          ) : (
            <>
              <li
                className={`${styles.list_item} ${styles.price_value} text-center`}
              >
                {card.price?.value} {key("sar")}
              </li>

              <div
                className="d-flex justify-content-between align-items-center px-2"
                dir={`${isArLang ? "rtl" : "rtl"}`}
              >
                <li
                  className={`${styles.list_item} ${
                    isArLang ? styles.list_item_ar : styles.list_item_en
                  } px-3`}
                >
                  <FontAwesomeIcon
                    icon={faCalendar}
                    className={`${styles.list_icon} text-danger ms-3`}
                  />
                  <span>{receiveAtFormatted.formattedDate}</span>
                </li>
                {card.receiveAt && (
                  <li
                    className={` ${styles.list_item} ${
                      isArLang ? styles.list_item_ar : styles.list_item_en
                    } px-3`}
                  >
                    <FontAwesomeIcon
                      icon={card.receiveAt ? faClock : faComment}
                      className={`${styles.list_icon} text-danger ms-3`}
                    />
                    <span>{receiveAtFormatted.formattedTime}</span>
                  </li>
                )}
              </div>
            </>
          )}
        </ul>
      </div>
    </>
  );
};

export default KonvaCard;
