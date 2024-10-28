import React, { useEffect, useState } from "react";
import useImage from "use-image";
import { Image, Layer, Rect, Stage } from "react-konva";
import mainLogo from "../../Images/logo.png";
import styles from "./RecipientInformation.module.css";

const KonvaCard = ({ canvaCard, isSpecial }) => {
  const [isSmalogo, setIsSmalogo] = useState(false);
  const [mainLogoImage] = useImage(mainLogo);
  const [cardWidth, setCardWidth] = useState(480);
  const [cardHeight, setCardHeight] = useState(270);
  const [loadedImages, setLoadedImages] = useState([]);

  useEffect(() => {
    const loadImages = async () => {
      if (!canvaCard?.shapes || !Array.isArray(canvaCard.shapes)) {
        setLoadedImages([]);
        return;
      }

      const images = await Promise.all(
        canvaCard?.shapes?.map((shape) => {
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
  }, [canvaCard]);

  const [shapeImageFront] = useImage(
    isSpecial
      ? `${process.env.REACT_APP_Host}specialCards/front-shape.webp`
      : ""
  );

  const [proColorImage] = useImage(
    canvaCard?.proColor
      ? `${process.env.REACT_APP_Host}colors/${canvaCard?.proColor?.image}`
      : ""
  );

  const [logoImage] = useImage(
    canvaCard?.shop?.logo
      ? `${process.env.REACT_APP_Host}shops/${
          canvaCard.shop.cardLogo
            ? canvaCard.shop.cardLogo
            : canvaCard.shop.logo
        }`
      : null
  );

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

  return (
    <>
      {canvaCard && (
        <Stage
          className={styles.card_stage}
          width={cardWidth}
          height={cardHeight}
        >
          <Layer>
            {canvaCard?.proColor ? (
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
                fill={canvaCard?.color?.hex || "#FFFFFF"}
                cornerRadius={30}
                className={styles.rect_canvaCard}
              />
            )}

            {isSpecial ? (
              <Image
                image={shapeImageFront}
                width={cardWidth}
                height={cardHeight}
                x={0}
                y={0}
                cornerRadius={10}
              />
            ) : (
              <>
                {canvaCard?.shapes?.map((shape, index) => {
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
                      width={displayWidth}
                      height={displayHeight}
                      rotation={shape.rotation}
                      offsetX={displayWidth / 2}
                      offsetY={displayHeight / 2}
                    />
                  );
                })}
              </>
            )}

            {!isSpecial && (
              <Image
                image={mainLogoImage}
                x={isSmalogo ? 15 : 20}
                y={isSmalogo ? cardHeight - 30 : cardHeight - 50}
                width={isSmalogo ? 50 : 100}
                height={isSmalogo ? 18 : 35}
                visible={true}
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
      )}
    </>
  );
};

export default KonvaCard;
