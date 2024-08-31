import React, { useState } from "react";
import { Stage, Layer, Rect, Text, Image } from "react-konva";
import useImage from "use-image";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import styles from "./CustomCards.module.css";
import cardbg from "../../Images/customGiftCard-removebg-preview.png";
import cardbg2 from "../../Images/registerImg.jpg";
import cardbg3 from "../../Images/cardWithDetails.jpg";
import shop1 from "../../Images/Stores/shop1.png";
import shop2 from "../../Images/Stores/shop2.png";
import shop3 from "../../Images/Stores/shop3.png";
import shop4 from "../../Images/Stores/shop4.png";
import shop5 from "../../Images/Stores/shop5.png";
import shop6 from "../../Images/Stores/shop6.jpg";
import shop7 from "../../Images/Stores/shop7.jpg";
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

  // Load images
  const [shapeImage] = useImage(selectedShape);
  const [logo] = useImage(logoImage);
  const [mainLogoImage] = useImage(mainLogo);

  // Card dimensions
  const CARD_WIDTH = 480;
  const CARD_HEIGHT = 270;

  // Example shapes and logos
  const shapes = [
    cardbg,
    cardbg2,
    cardbg3,
    cardbg,
    cardbg2,
    cardbg3,
    cardbg,
    cardbg2,
    cardbg3,
  ];

  const logos = [shop1, shop2, shop3, shop4, shop5, shop6, shop7];

  return (
    <div className={styles.canva_body}>
      <h1 className="my-2">Build Your Own Card</h1>
      <div className={styles.content}>
        <Row className="w-100 h-75">
          <Col md={5} className={styles.card_side_container}>
            <div className={styles.card_side_header}>
              <h3>Card Display ({showBack ? "Back" : "Front"})</h3>

              <FontAwesomeIcon
                icon={faRotate}
                onClick={() => setShowBack(!showBack)}
                className={styles.rotate_icon}
                title="rotate card"
              />
            </div>
            {/* Konva Canvas */}
            <div>
              <Stage
                className={styles.card}
                width={CARD_WIDTH}
                height={CARD_HEIGHT}
              >
                <Layer>
                  {/* Card Background */}
                  <Rect
                    width={CARD_WIDTH}
                    height={CARD_HEIGHT}
                    fill={cardColor}
                    cornerRadius={10}
                  />

                  {/* Shape and Logo */}
                  {shapeImage && showBack && (
                    <Image
                      image={shapeImage}
                      width={CARD_WIDTH}
                      height={CARD_HEIGHT}
                      opacity={1}
                      visible={true}
                      cornerRadius={10}
                    />
                  )}

                  {/* Front Side */}
                  {!showBack && (
                    <>
                      {/* Card Text */}
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

                      {/* Card Price */}
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
                  {/* Selected Logo */}
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

                  {/* my logo */}
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
          <Col md={7} className={styles.control_side_container}>
            {/* Color Selection */}

            <div className={styles.choose_color}>
              <h4>Card Color</h4>
              <input
                type="color"
                value={cardColor}
                onChange={(e) => setCardColor(e.target.value)}
                className={`${styles.color_input} me-5`}
              />
            </div>

            {/* Shape Selection */}

            <div
              className={`${styles.choose_shape} ${!showBack && "disabled"}`}
            >
              <h4 className="text-start mb-3">Card Background</h4>
              <Row className={styles.shapes_container}>
                {shapes.map((shape, index) => (
                  <Col
                    md={4}
                    className="d-flex justify-content-center"
                    onClick={() => setSelectedShape(shape)}
                    key={index}
                  >
                    <div className={styles.shape_div}>
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

            {/* Logo Selection */}
            <div
              className={`${styles.choose_shape}  d-flex mx-4`}
            >
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

            {/* Text and Price Input */}

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
