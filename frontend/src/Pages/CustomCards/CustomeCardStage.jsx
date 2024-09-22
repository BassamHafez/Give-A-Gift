import React, { useEffect, useState, useRef } from "react";
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
  cardText,
  textFont,
  textFontFamily,
  textColor,
  textPosition,
  setTextPosition,
  priceSafeY,
  cardPrice,
  logo,
  mainLogoImage,
  scale,
  shapePosition,
  setShapePosition,
}) => {
  const isSmallScreen = useMediaQuery({ query: "(max-width: 400px)" });
  const { t: key } = useTranslation();
  const [hasDraggedText, setHasDraggedText] = useState(false);
  const initialTextPosition = useRef(null);

  useEffect(() => {
    const centeredX = (cardWidth - scaledWidth * scale) / 2;
    const centeredY = (cardHeight - scaledHeight * scale) / 2;
    setShapePosition({ x: centeredX, y: centeredY });
  }, [scaledWidth, scaledHeight, scale, cardWidth, cardHeight, setShapePosition]);

  const handleTextDragStart = () => {
    setHasDraggedText(true);
  };

  const handleTextDragMove = (e) => {
    setTextPosition({ x: e.target.x(), y: e.target.y() });
  };

  const handleShapeDragMove = (e) => {
    setShapePosition({ x: e.target.x(), y: e.target.y() });
  };

  return (
    <Stage className={styles.card} width={cardWidth} height={cardHeight} cornerRadius={30}>
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
          <Rect width={cardWidth} height={cardHeight} fill={cardColor} cornerRadius={30} />
        )}

        {shapeImage && showBack && (
          <Image
            image={shapeImage}
            width={scaledWidth * scale || cardWidth * scale}
            height={scaledHeight * scale || cardHeight * scale}
            x={shapePosition.x || 0}
            y={shapePosition.y || 0}
            draggable
            onDragMove={handleShapeDragMove}
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
                onDragStart={handleTextDragStart}
                onDragMove={handleTextDragMove}
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
                  if (node && !hasDraggedText && initialTextPosition.current === null) {
                    const textWidth = node.getClientRect().width;
                    const textHeight = node.getClientRect().height;
                    const centeredX = cardWidth / 2 - textWidth / 2;
                    let centeredY = cardHeight / 2 - textHeight / 2;

                    if (centeredY + textHeight > priceSafeY) {
                      centeredY = priceSafeY - textHeight;
                    }

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
