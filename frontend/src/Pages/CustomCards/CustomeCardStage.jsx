import React, { useEffect, useState } from "react";
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
  showBack,
  cardText,
  textFont,
  textFontFamily,
  textColor,
  textPosition,
  setTextPosition,
  cardPrice,
  logo,
  mainLogoImage,
  shapesArray,
  updateShape,
  priceSafeY,
  removeShape,
  currentStep,
}) => {
  const isSmallScreen = useMediaQuery({ query: "(max-width: 400px)" });
  const { t: key } = useTranslation();
  const [hasDraggedText, setHasDraggedText] = useState(false);

  const [loadedImages, setLoadedImages] = useState([]);
  const [selectedShapeIndex, setSelectedShapeIndex] = useState(null);

  useEffect(() => {
    const loadImages = async () => {
      const images = await Promise.all(
        shapesArray.map((shape) => {
          return new Promise((resolve) => {
            const img = new window.Image();
            img.src = `${process.env.REACT_APP_Host}shapes/${shape.image}`;
            img.onload = () => {
              // Store original dimensions
              resolve({ img, width: img.width, height: img.height });
            };
            img.onerror = () => resolve(null);
          });
        })
      );
      setLoadedImages(images);
    };

    loadImages();
  }, [shapesArray]);

  const handleTextDragStart = () => {
    setHasDraggedText(true);
  };

  const handleTextDragMove = (e) => {
    setTextPosition({ x: e.target.x(), y: e.target.y() });
  };

  const handleDragMove = (index, e) => {
    const newPos = { x: e.target.x(), y: e.target.y() };
    updateShape(index, { ...shapesArray[index], position: newPos });
  };

  const handleScaleChange = (index, e) => {
    const newScale = parseFloat(e.target.value);
    updateShape(index, { ...shapesArray[index], scale: newScale });
  };

  const handleWheel = (index) => (e) => {
    e.evt.preventDefault();
    const delta = e.evt.deltaY;
    const scaleChange = delta > 0 ? 0.95 : 1.05;
    updateShape(index, {
      ...shapesArray[index],
      scale: shapesArray[index].scale * scaleChange,
    });
  };

  const handleRotationChange = (index, e) => {
    const newRotation = parseFloat(e.target.value);
    updateShape(index, { ...shapesArray[index], rotation: newRotation });
  };

  const handleShapeClick = (index) => {
    setSelectedShapeIndex(selectedShapeIndex === index ? null : index);
  };

  const handleRemoveShape = () => {
    if (selectedShapeIndex !== null) {
      const shapeId = shapesArray[selectedShapeIndex].id;
      removeShape(shapeId);
      setSelectedShapeIndex(null);
    }
  };

  return (
    <>
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

          {showBack &&
            shapesArray.map((shape, index) => {
              const {
                img,
                width: originalWidth = 0,
                height: originalHeight = 0,
              } = loadedImages[index] || {};

              const displayWidth = originalWidth * shape.scale || 0;
              const displayHeight = originalHeight * shape.scale || 0;

              return (
                <Image
                  key={`${shape.id}_${index}`}
                  image={img}
                  x={shape.position.x}
                  y={shape.position.y}
                  width={displayWidth}
                  height={displayHeight}
                  rotation={shape.rotation}
                  draggable
                  onClick={() => handleShapeClick(index)}
                  onDragMove={(e) => handleDragMove(index, e)}
                  onWheel={handleWheel(index)}
                  offsetX={displayWidth / 2}
                  offsetY={displayHeight / 2}
                  onTap={() => handleShapeClick(index)}
                />
              );
            })}

          {!showBack && (
            <>
              {cardText && (
                <Text
                  text={`${cardText}`}
                  fontSize={
                    isSmallScreen ? Number(textFont) / 2 : Number(textFont)
                  }
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
                    if (node && !hasDraggedText) {
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
                        setTextPosition((prevPosition) => {
                          if (
                            prevPosition.x !== centeredX ||
                            prevPosition.y !== centeredY
                          ) {
                            return { x: centeredX, y: centeredY };
                          }
                          return prevPosition;
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
                  y={cardHeight / 2 + Number(textFont) / 2}
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
      {currentStep === 1 && selectedShapeIndex !== null && (
        <div className="mt-3">
          <div className="d-flex align-items-center justify-content-center">
            <label className="mx-2 ">{key("scale")}</label>
            <input
              type="range"
              min="0.1"
              max="2"
              step="0.01"
              value={shapesArray[selectedShapeIndex]?.scale || 1}
              onChange={(e) => handleScaleChange(selectedShapeIndex, e)}
              style={{ cursor: "pointer" }}
              disabled={selectedShapeIndex === null}
            />
          </div>
          <div className="d-flex align-items-center justify-content-center">
            <label className="mx-2">{key("rotate")}</label>
            <input
              type="range"
              min="0"
              max="360"
              step="1"
              value={shapesArray[selectedShapeIndex]?.rotation || 0}
              onChange={(e) => handleRotationChange(selectedShapeIndex, e)}
              style={{ cursor: "pointer" }}
              disabled={selectedShapeIndex === null}
            />
          </div>
          <button
            className="btn btn-danger mx-2"
            onClick={handleRemoveShape}
            disabled={selectedShapeIndex === null}
          >
            {key("removeShape")}
          </button>
        </div>
      )}
    </>
  );
};

export default CustomeCardStage;
