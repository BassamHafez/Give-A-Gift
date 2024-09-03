import React, { useEffect, useState } from "react";
import { Stage, Layer, Rect, Text, Image } from "react-konva";
import useImage from "use-image";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import styles from "./CustomCards.module.css";

import svg6 from "../../Images/bg/svg1.svg";
import svg5 from "../../Images/bg/svg2.svg";
import svg1 from "../../Images/bg/svg3.svg";
import svg2 from "../../Images/bg/svg4.svg";
import svg3 from "../../Images/bg/svg5.svg";
import svg4 from "../../Images/bg/svg6.svg";

import cardbg1 from "../../Images/bg/bg1.jpg";
import cardbg2 from "../../Images/bg/bg2.jpg";
import cardbg4 from "../../Images/bg/bg4.jpg";
import cardbg5 from "../../Images/bg/bg5.jpg";
import cardbg6 from "../../Images/bg/bg6.jpg";
import cardbg7 from "../../Images/bg/bg7.jpg";
import cardbg8 from "../../Images/bg/bg8.jpg";
import cardbg9 from "../../Images/bg/bg9.jpg";
import cardbg10 from "../../Images/bg/bg10.jpg";

import r1 from "../../Images/bg/removebg1.png";
import r2 from "../../Images/bg/removebg2.png";

import shop1 from "../../Images/Stores/shop1.png";
import shop2 from "../../Images/Stores/shop2.png";
import shop3 from "../../Images/Stores/shop3.png";
import shop4 from "../../Images/Stores/shop4.png";
import shop5 from "../../Images/Stores/shop5.png";
import shop6 from "../../Images/Stores/shop6.jpg";
import shop7 from "../../Images/Stores/shop7.jpg";
import shop8 from "../../Images/Stores/shop8.jpg";
import shop9 from "../../Images/Stores/shop9.jpg";
import shop10 from "../../Images/Stores/shop10.jpg";
import shop11 from "../../Images/Stores/shop11.png";
import shop12 from "../../Images/Stores/shop12.jpeg";
import shop13 from "../../Images/Stores/shop13.jpeg";
import shop14 from "../../Images/Stores/shop14.png";
import shop15 from "../../Images/Stores/shop15.png";
import shop16 from "../../Images/Stores/shop16.png";
import shop17 from "../../Images/Stores/shop17.png";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRotate } from "@fortawesome/free-solid-svg-icons";
import mainLogo from "../../Images/logo_rem.png";

const CustomCards = () => {
  const [cardColor, setCardColor] = useState("#FFFFFF");
  const [textColor, setTextColor] = useState("#000000");
  const [priceColor, setPriceColor] = useState("#000000");
  const [selectedShape, setSelectedShape] = useState(null);
  const [logoImage, setLogoImage] = useState(null);
  const [cardText, setCardText] = useState("");
  const [cardPrice, setCardPrice] = useState("");
  const [showBack, setShowBack] = useState(true);

  const [shapeImage] = useImage(selectedShape);
  const [logo] = useImage(logoImage);
  const [mainLogoImage] = useImage(mainLogo);

  const CARD_WIDTH = 480;
  const CARD_HEIGHT = 270;

  const shapes = [
    cardbg1,
    cardbg2,
    cardbg4,
    cardbg5,
    cardbg6,
    cardbg7,
    cardbg8,
    cardbg9,
    cardbg10,
    r1,
    r2,
    svg1,
    svg2,
    svg3,
    svg4,
    svg5,
    svg6,
  ];

  const logos = [
    shop1,
    shop2,
    shop8,
    shop9,
    shop10,
    shop11,
    shop12,
    shop13,
    shop14,
    shop15,
    shop16,
    shop17,
    shop3,
    shop4,
    shop5,
    shop6,
    shop7,
  ];

  const imageAspectRatio = shapeImage?.width / shapeImage?.height;
  const cardAspectRatio = CARD_WIDTH / CARD_HEIGHT;

  let scaledWidth,
    scaledHeight,
    offsetX = 0,
    offsetY = 0;

  if (imageAspectRatio > cardAspectRatio) {
    // Image is wider than the card, scale by height
    scaledHeight = CARD_HEIGHT;
    scaledWidth = CARD_HEIGHT * imageAspectRatio;
    offsetX = (CARD_WIDTH - scaledWidth) / 2;
  } else {
    // Image is taller than the card, scale by width
    scaledWidth = CARD_WIDTH;
    scaledHeight = CARD_WIDTH / imageAspectRatio;
    offsetY = (CARD_HEIGHT - scaledHeight) / 2;
  }

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className={styles.canva_body}>
      <div className={styles.content}>
        <Row className="w-100 h-75 justify-content-between">
          <Col lg={6} xl={5} className={styles.card_side_container}>
            <div className={styles.card_side_header}>
              <h3>Card Display ({showBack ? "Back" : "Front"})</h3>

              <FontAwesomeIcon
                icon={faRotate}
                onClick={() => setShowBack(!showBack)}
                className={styles.rotate_icon}
                title="rotate card"
              />
            </div>

            <div>
              <Stage
                className={styles.card}
                width={CARD_WIDTH}
                height={CARD_HEIGHT}
              >
                <Layer>
                  <Rect
                    width={CARD_WIDTH}
                    height={CARD_HEIGHT}
                    fill={cardColor}
                    cornerRadius={10}
                  />

                  {shapeImage && showBack && (
                    <Image
                      image={shapeImage}
                      width={scaledWidth || CARD_WIDTH}
                      height={scaledHeight || CARD_HEIGHT}
                      x={offsetX}
                      y={offsetY}
                      opacity={1}
                      visible={true}
                      cornerRadius={10}
                    />
                  )}

                  {!showBack && (
                    <>
                      <Text
                        text={cardText}
                        fontSize={20}
                        fontFamily="Playfair Display"
                        fill={textColor}
                        width={CARD_WIDTH * 0.8}
                        height={CARD_HEIGHT / 2}
                        x={CARD_WIDTH * 0.1}
                        y={CARD_HEIGHT / 2 - 10}
                        align="center"
                        wrap="char"
                      />

                      {cardPrice && (
                        <Text
                          text={`${cardPrice} SAR`}
                          fontSize={40}
                          fontFamily="Playfair Display"
                          fill={priceColor}
                          x={10}
                          y={10}
                        />
                      )}
                    </>
                  )}

                  {logo && (
                    <Image
                      image={logo}
                      x={CARD_WIDTH - 70}
                      y={10}
                      width={60}
                      height={60}
                      visible={true}
                      cornerRadius={30}
                    />
                  )}

                  <Image
                    image={mainLogoImage}
                    x={20}
                    y={CARD_HEIGHT - 50}
                    width={40}
                    height={30}
                    visible={true}
                  />
                </Layer>
              </Stage>
            </div>
          </Col>
          <Col
            lg={0}
            xl={1}
            className="d-flex justify-content-center d-lg-none"
          >
            <div
              style={{ borderLeft: "1px solid #0000009b", height: "100%" }}
            ></div>
          </Col>
          <Col lg={6} xl={6} className={styles.control_side_container}>
            <div className={styles.choose_color}>
              <h4>Card Color</h4>
              <input
                type="color"
                value={cardColor}
                onChange={(e) => setCardColor(e.target.value)}
                className={`${styles.color_input} me-5`}
              />
            </div>

            <div
              className={`${styles.choose_shape} ${!showBack && "disabled"}`}
            >
              <h4 className="text-start mb-3">Card Background</h4>
              <Row className={styles.shapes_container}>
                {shapes.map((shape, index) => (
                  <Col
                    xs={12}
                    sm={6}
                    md={4}
                    className="d-flex justify-content-center"
                    onClick={() => setSelectedShape(shape)}
                    key={index}
                  >
                    <div
                      style={{
                        backgroundColor: cardColor ? cardColor : "#FFFFFF",
                      }}
                      className={styles.shape_div}
                    >
                      <img
                        src={shape}
                        alt={`${shape}_${index}`}
                        className="w-100"
                      />
                    </div>
                  </Col>
                ))}
              </Row>
            </div>

            <div className={`${styles.choose_shape}  d-flex mx-4`}>
              <h4 className="text-start mb-3">Choose Company</h4>
              <Row className={styles.logo_container}>
                {logos.map((logo, index) => (
                  <Col
                    md={4}
                    className="d-flex justify-content-center"
                    onClick={() => setLogoImage(logo)}
                    key={index}
                  >
                    <div className={styles.logo_div}>
                      <img
                        src={logo}
                        alt={`${logo}_${index}`}
                        className="w-100"
                      />
                    </div>
                  </Col>
                ))}
              </Row>
            </div>

            <div className={`${showBack && "disabled"} text-start`}>
              <div className="my-4">
                <h4>Card Message</h4>

                <div className="input-group mb-3">
                  <input
                    type="text"
                    value={cardText}
                    onChange={(e) => setCardText(e.target.value)}
                    placeholder="Enter card text"
                    className="form-control"
                  />
                  <input
                    type="color"
                    value={textColor}
                    onChange={(e) => setTextColor(e.target.value)}
                    className={styles.color_input}
                  />
                </div>
              </div>

              <div className="my-4">
                <h4>Card Price</h4>
                <div className="input-group mb-3">
                  <input
                    type="text"
                    value={cardPrice}
                    onChange={(e) => setCardPrice(e.target.value)}
                    placeholder="Enter card price"
                    className="form-control"
                  />
                  <input
                    type="color"
                    value={priceColor}
                    onChange={(e) => setPriceColor(e.target.value)}
                    className={styles.color_input}
                  />
                </div>
              </div>
            </div>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default CustomCards;
