import React from "react";
import { useMediaQuery } from "react-responsive";
import { Stage, Layer, Rect, Text, Image } from "react-konva";
import styles from "./CustomCards.module.css";
import { useTranslation } from "react-i18next";

const CustomeCardStage = ({
  cardWidth,
  cardHeight,
  isProColor,
  colorShape,
  cardColor,
  shapeImage,
  showBack,
  scaledWidth,
  scaledHeight,
  offsetX,
  offsetY,
  cardText,
  textFont,
  textFontFamily,
  textColor,
  textPosition,
  setTextPosition,
  setIsDragged,
  isDragged,
  priceSafeY,
  cardPrice,
  logo,
  mainLogoImage,
}) => {
  const isSmallScreen = useMediaQuery({ query: "(max-width: 400px)" });
  const { t: key } = useTranslation();

  return (
    <Stage
      className={styles.card}
      width={cardWidth}
      height={cardHeight}
      cornerRadius={30}
    >
      <Layer>
        {isProColor ? (
          <Image
            image={colorShape}
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
            fill={cardColor}
            cornerRadius={30}
          />
        )}

        {shapeImage && showBack && (
          <Image
            image={shapeImage}
            width={scaledWidth || cardWidth}
            height={scaledHeight || cardHeight}
            x={offsetX}
            y={offsetY}
            opacity={1}
            visible={true}
            cornerRadius={30}
          />
        )}

        {!showBack && (
          <>
            {cardText && (
              <Text
                text={cardText}
                fontSize={isSmallScreen ? textFont / 2 : Number(textFont)}
                fontFamily={textFontFamily}
                fill={textColor}
                width={cardWidth * 0.8}
                x={textPosition.x}
                y={textPosition.y}
                align="center"
                wrap="char"
                draggable
                onDragEnd={(e) => {
                  setTextPosition({
                    x: e.target.x(),
                    y: e.target.y(),
                  });
                  setIsDragged(true);
                }}
                onMouseEnter={(e) => {
                  const container = e.target.getStage().container();
                  container.style.cursor = "grab";
                }}
                onMouseLeave={(e) => {
                  const container = e.target.getStage().container();
                  container.style.cursor = "default";
                }}
                onMouseDown={(e) => {
                  const container = e.target.getStage().container();
                  container.style.cursor = "grabbing";
                }}
                onMouseUp={(e) => {
                  const container = e.target.getStage().container();
                  container.style.cursor = "grab";
                }}
                ref={(node) => {
                  if (node && !isDragged) {
                    const textWidth = node.getClientRect().width;
                    const textHeight = node.getClientRect().height;

                    // Calculate centered x position
                    const centeredX = cardWidth / 2 - textWidth / 2;

                    // Calculate centered y position, ensure text doesn't overlap with the price
                    let centeredY = cardHeight / 2 - textHeight / 2;

                    // If text would overlap priceSafeY, adjust position
                    if (centeredY + textHeight > priceSafeY) {
                      centeredY = priceSafeY - textHeight; // Move text up to avoid price
                    }

                    // Only update position if it's different from the current position
                    if (
                      textPosition.x !== centeredX ||
                      textPosition.y !== centeredY
                    ) {
                      setTextPosition({
                        x: centeredX,
                        y: centeredY,
                      });
                    }
                  }
                }}
              />
            )}

            {cardPrice && (
              <Text
                text={`${cardPrice} ${key("sar")}`}
                fontSize={20}
                fontFamily={"'Times New Roman', Times, serif"}
                fill={textColor}
                x={cardWidth / 2 - 30}
                y={cardHeight / 2 + textFont / 2}
              />
            )}
          </>
        )}

        {logo && (
          <Image
            image={logo}
            x={isSmallScreen ? cardWidth - 60 : cardWidth - 70}
            y={10}
            width={isSmallScreen ? 40 : 60}
            height={isSmallScreen ? 40 : 60}
            visible={true}
            cornerRadius={30}
          />
        )}

        <Image
          image={mainLogoImage}
          x={20}
          y={isSmallScreen ? cardHeight - 30 : cardHeight - 50}
          width={isSmallScreen ? 50 : 100}
          height={isSmallScreen ? 17.5 : 35}
          visible={true}
        />
      </Layer>
    </Stage>
  );
};

export default CustomeCardStage;
