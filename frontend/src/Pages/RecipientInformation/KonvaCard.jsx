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

  const imageUrl =
    !isSpecial && canvaCard?.shape?.image
      ? `${process.env.REACT_APP_Host}shapes/${canvaCard.shape.image}`
      : null;

  const [shapeImage] = useImage(imageUrl);
  const [shapeImageFront] = useImage(
    `${process.env.REACT_APP_Host}shapes/front-shape.png`
  );

  const [logoImage] = useImage(
    canvaCard?.shop?.logo
      ? `${process.env.REACT_APP_Host}shops/${canvaCard.shop.logo}`
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

  const imageAspectRatio =
    shapeImage?.width && shapeImage?.height
      ? shapeImage.width / shapeImage.height
      : 1;
  const cardAspectRatio = cardWidth / cardHeight;

  let scaledWidth, scaledHeight, offsetX, offsetY;

  if (imageAspectRatio > cardAspectRatio) {
    scaledWidth = cardWidth;
    scaledHeight = cardWidth / imageAspectRatio;
    offsetX = 0;
    offsetY = (cardHeight - scaledHeight) / 2;
  } else {
    scaledWidth = cardHeight * imageAspectRatio;
    scaledHeight = cardHeight;
    offsetX = (cardWidth - scaledWidth) / 2;
    offsetY = 0;
  }

  return (
    <>
      {canvaCard && (
        <Stage
          className={styles.card_stage}
          width={cardWidth}
          height={cardHeight}
        >
          <Layer>
            {/* work here */}
            <Rect
              width={cardWidth}
              height={cardHeight}
              fill={canvaCard?.color?.hex || "#FFFFFF"}
              cornerRadius={30}
              className={styles.rect_canvaCard}
            />

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
              <Image
                image={shapeImage}
                width={scaledWidth || cardWidth}
                height={scaledHeight || cardHeight}
                x={offsetX}
                y={offsetY}
                cornerRadius={10}
              />
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
