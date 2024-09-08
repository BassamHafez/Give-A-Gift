import React, { useEffect, useState } from "react";
import { Stage, Layer, Rect, Text, Image } from "react-konva";
import useImage from "use-image";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import styles from "./CustomCards.module.css";
import { useQuery } from "@tanstack/react-query";
import LoadingOne from "../../Components/Ui/LoadingOne";
import mainLogo from "../../Images/logo_rem.png";
import { getShapes, getShops } from "../../util/Http";
import Select from "react-select";
import { FontsFamilies } from "../../Components/Logic/Logic";
import MainButton from "../../Components/Ui/MainButton";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const notifySuccess = (message) => toast.success(message);
const notifyError = (message) => toast.error(message);

const CustomCards = () => {
  const baseServerUrl = process.env.REACT_APP_Base_API_URl;
  const [cardWidth, setCardWidth] = useState(480);
  const [cardHeight, setCardHeight] = useState(270);
  const [cardColor, setCardColor] = useState("#FFFFFF");
  const [textColor, setTextColor] = useState("#000000");
  const [priceColor, setPriceColor] = useState("#000000");
  const [selectedShape, setSelectedShape] = useState(null);
  const [selectedShapeId, setSelectedShapeId] = useState("");
  const [selectedShopId, setSelectedShopId] = useState("");
  const [logoImage, setLogoImage] = useState(null);
  const [cardText, setCardText] = useState("");
  const [cardPrice, setCardPrice] = useState("");
  const [showBack, setShowBack] = useState(true);
  const [textPosition, setTextPosition] = useState({
    x: cardWidth/2 - cardWidth/2 * .8,
    y: cardHeight/2,
  });
  const [textFontFamily, setTextFontFamily] = useState("Playfair Display");
  const [textFont, setTextFont] = useState(20);

  const [priceFontFamily, setPriceFontFamily] = useState(
    "'Times New Roman', Times, serif"
  );
  const [priceFont, setPriceFont] = useState(50);

  const [shapeImage] = useImage(selectedShape);
  const [logo] = useImage(logoImage);
  const [mainLogoImage] = useImage(mainLogo);
  const token = JSON.parse(localStorage.getItem("token"));
  const navigate = useNavigate();

  const { data: shapes } = useQuery({
    queryKey: ["shapes"],
    queryFn: getShapes,
    staleTime: 300000,
  });

  const { data: shops } = useQuery({
    queryKey: ["shops"],
    queryFn: getShops,
    staleTime: 300000,
  });



  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth < 500 ? window.innerWidth * 0.9 : 480;
      setCardWidth(width);
      setCardHeight((width * 9) / 16);
    };

    window.addEventListener("resize", handleResize);
    handleResize(); // Initial resize

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const imageAspectRatio = shapeImage?.width / shapeImage?.height;
  const cardAspectRatio = cardWidth / cardHeight;

  let scaledWidth,
    scaledHeight,
    offsetX = 0,
    offsetY = 0;

  if (imageAspectRatio > cardAspectRatio) {
    scaledHeight = cardHeight;
    scaledWidth = cardHeight * imageAspectRatio;
    offsetX = (cardWidth - scaledWidth) / 2;
  } else {
    scaledWidth = cardWidth;
    scaledHeight = cardWidth / imageAspectRatio;
    offsetY = (cardHeight - scaledHeight) / 2;
  }

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const createCard = async () => {
    let formData = {
      price: {
        value: cardPrice,
        fontFamily: priceFontFamily,
        fontSize: priceFont,
        fontColor: priceColor,
        fontWeight: 600,
      },
      color: cardColor,
      shop: selectedShopId,
      shape: selectedShapeId,
      text: {
        message: cardText,
        fontFamily: textFontFamily,
        fontSize: textFont,
        fontColor: textColor,
        fontWeight: 600,
        xPosition: textPosition.x,
        yPosition: textPosition.y,
      },
    };
    console.log(formData);

    try {
      const response = await axios.post(`${baseServerUrl}cards`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log(response.data);
      const res = response.data;
      if (res?.status === "success") {
        notifySuccess("Card Saved Successfully");
        navigate(`/recipient-information/${res.data?._id}`);
      }
    } catch (error) {
      notifyError("Something went wrong. Please try again.");
      console.error(error);
    }
  };

  return (
    <>
      <Toaster position="top-right" />
      <div className={styles.canva_body}>
        <div className={styles.content}>
          <Row className="w-100 h-75 justify-content-between">
            <Col lg={6} xl={5} className={styles.card_side_container}>
              <div className={styles.card_side_header}>
                <h3>Card Display ({showBack ? "Back" : "Front"})</h3>
              </div>

              <div>
                <Stage
                  className={styles.card}
                  width={cardWidth}
                  height={cardHeight}
                >
                  <Layer>
                    <Rect
                      width={cardWidth}
                      height={cardHeight}
                      fill={cardColor}
                      cornerRadius={10}
                    />

                    {shapeImage && showBack && (
                      <Image
                        image={shapeImage}
                        width={scaledWidth || cardWidth}
                        height={scaledHeight || cardHeight}
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
                          fontSize={Number(textFont)}
                          fontFamily={textFontFamily}
                          fill={textColor}
                          width={cardWidth * 0.8}
                          height={cardHeight / 2}
                          x={textPosition.x}
                          y={textPosition.y}
                          draggable
                          onDragEnd={(e) => {
                            setTextPosition({
                              x: e.target.x(),
                              y: e.target.y(),
                            });
                          }}
                          align="center"
                          wrap="char"
                        />

                        {cardPrice && (
                          <Text
                            text={`${cardPrice} SAR`}
                            fontSize={Number(priceFont)}
                            fontFamily={priceFontFamily}
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
                        x={cardWidth - 70}
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
                      y={cardHeight - 50}
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

              <div className={`${styles.choose_shape}  position-relative`}>
                <h4 className="text-start mb-3">Card Background</h4>
                <Row className={styles.shapes_container}>
                  {shapes ? (
                    shapes?.data.map((shape) => (
                      <Col
                        xs={12}
                        sm={6}
                        md={4}
                        className="d-flex justify-content-center"
                        onClick={() => {
                          setSelectedShape(
                            `http://127.0.0.1:3001/shapes/${shape.image} `
                          );
                          setShowBack(true);
                          setSelectedShapeId(shape._id);
                        }}
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
                    ))
                  ) : (
                    <LoadingOne />
                  )}
                </Row>
              </div>

              <div className={`${styles.choose_shape}  d-flex mx-4`}>
                <h4 className="text-start mb-3">Choose Store</h4>
                <Row className={styles.logo_container}>
                  {shops &&
                    shops.data.map((shop) => (
                      <Col
                        md={4}
                        className="d-flex justify-content-center"
                        onClick={() => {
                          setLogoImage(
                            `http://127.0.0.1:3001/shops/${shop.logo}`
                          );
                          setSelectedShopId(shop._id);
                        }}
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

              <div className={`text-start`}>
                <div className={`${styles.text_container} my-`}>
                  <h4>Card Message</h4>

                  <div className="input-group mb-3">
                    <input
                      type="text"
                      value={cardText}
                      onChange={(e) => setCardText(e.target.value)}
                      onClick={() => setShowBack(false)}
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
                  <div className={styles.text_editors}>
                    <Select
                      className={styles.select_input}
                      classNamePrefix="FontFamily"
                      isClearable={false}
                      isSearchable={true}
                      name="fontFamily"
                      placeholder="Font Family"
                      options={FontsFamilies}
                      onChange={(value) => setTextFontFamily(value.value)}
                    />

                    <input
                      type="number"
                      placeholder="size"
                      onChange={(e) => setTextFont(e.target.value)}
                      className={styles.fontSize_input}
                    />
                  </div>
                </div>

                <div className={`${styles.text_container} my-5`}>
                  <h4>Card Price</h4>
                  <div className="input-group mb-3">
                    <input
                      type="number"
                      value={cardPrice}
                      onChange={(e) => setCardPrice(e.target.value)}
                      onClick={() => setShowBack(false)}
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
                  <div className={styles.text_editors}>
                    <Select
                      className={styles.select_input}
                      classNamePrefix="FontFamily"
                      placeholder="Font Family"
                      isClearable={false}
                      isSearchable={true}
                      name="priceFontFamily"
                      options={FontsFamilies}
                      onChange={(value) => setPriceFontFamily(value.value)}
                    />

                    <input
                      type="number"
                      placeholder="font size"
                      onChange={(e) => setPriceFont(e.target.value)}
                      className={styles.fontSize_input}
                    />
                  </div>
                </div>
              </div>
              <div className="my-5">
                <MainButton onClick={createCard} text={`Save Changes`} />
              </div>
            </Col>
          </Row>
        </div>
      </div>
    </>
  );
};

export default CustomCards;
