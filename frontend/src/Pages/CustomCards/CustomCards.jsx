import React, { useEffect, useState } from "react";
import { Stage, Layer, Rect, Text, Image } from "react-konva";
import useImage from "use-image";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import styles from "./CustomCards.module.css";
import {useQuery} from "@tanstack/react-query";
import LoadingOne from "../../Components/Ui/LoadingOne";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRotate } from "@fortawesome/free-solid-svg-icons";
import mainLogo from "../../Images/logo_rem.png";
import { getShapes, getShops } from "../../util/Http";

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



  const {data:shapes}=useQuery({
    queryKey:['shapes'],
    queryFn:getShapes
  })

  const {data:shops}=useQuery({
    queryKey:['shops'],
    queryFn:getShops
  })

console.log(shops)
  const CARD_WIDTH = 480;
  const CARD_HEIGHT = 270;


  const imageAspectRatio = shapeImage?.width / shapeImage?.height;
  const cardAspectRatio = CARD_WIDTH / CARD_HEIGHT;

  let scaledWidth,
    scaledHeight,
    offsetX = 0,
    offsetY = 0;

  if (imageAspectRatio > cardAspectRatio) {
    scaledHeight = CARD_HEIGHT;
    scaledWidth = CARD_HEIGHT * imageAspectRatio;
    offsetX = (CARD_WIDTH - scaledWidth) / 2;
  } else {
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
              className={`${styles.choose_shape} ${!showBack && "disabled"} position-relative`}
            >
              <h4 className="text-start mb-3">Card Background</h4>
              <Row className={styles.shapes_container}>
                {shapes?shapes?.data.map((shape) => (
                  <Col
                    xs={12}
                    sm={6}
                    md={4}
                    className="d-flex justify-content-center"
                    onClick={() => setSelectedShape(`http://127.0.0.1:3001/shapes/${shape.image}`)}
                    key={shape._id}
                  >
                    <div
                      style={{
                        backgroundColor: cardColor ? cardColor : "#FFFFFF",
                      }}
                      className={styles.shape_div}
                    >
                      <img
                        src={`http://127.0.0.1:3001/shapes/${shape.image}`}
                        alt={`${shape}_${shape._id}`}
                        className="w-100"
                      />
                    </div>
                  </Col>
                )):<LoadingOne/>}
              </Row>
            </div>

            <div className={`${styles.choose_shape}  d-flex mx-4`}>
              <h4 className="text-start mb-3">Choose Store</h4>
              <Row className={styles.logo_container}>
                {shops&&shops.data.map((shop) => (
                  <Col
                    md={4}
                    className="d-flex justify-content-center"
                    onClick={() => setLogoImage(`http://127.0.0.1:3001/shops/${shop.logo}`)}
                    key={shop._id}
                  >
                    <div className={styles.logo_div}>
                      <img
                        src={`http://127.0.0.1:3001/shops/${shop.logo}`}
                        alt={`${shop.name}`}
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
