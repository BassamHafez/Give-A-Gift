import React, { useEffect, useState } from "react";
import { Stage, Layer, Rect, Text, Image } from "react-konva";
import useImage from "use-image";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import styles from "./CustomCards.module.css";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import LoadingOne from "../../Components/Ui/LoadingOne";
import mainLogo from "../../Images/logo.png";
import { getColors, getShapes, getShops } from "../../util/Http";
import Select from "react-select";
import { FontsFamilies } from "../../Components/Logic/Logic";
import MainButton from "../../Components/Ui/MainButton";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import Carousel from "react-bootstrap/Carousel";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import ConfirmationModal from "../../Components/Ui/ConfirmationModal";

const notifySuccess = (message) => toast.success(message);
const notifyError = (message) => toast.error(message);

const CustomCards = () => {
  const baseServerUrl = process.env.REACT_APP_Base_API_URl;
  const [cardWidth, setCardWidth] = useState(480);
  const [cardHeight, setCardHeight] = useState(270);
  const [cardColor, setCardColor] = useState("#FFFFFF");
  const [cardColorId, setCardColorId] = useState("");
  const [textColor, setTextColor] = useState("#000000");
  const [selectedShape, setSelectedShape] = useState(null);
  const [selectedShapeId, setSelectedShapeId] = useState("");
  const [selectedShopId, setSelectedShopId] = useState("");
  const [logoImage, setLogoImage] = useState(null);
  const [cardText, setCardText] = useState("");
  const [cardPrice, setCardPrice] = useState("");
  const [showBack, setShowBack] = useState(true);
  const [textPosition, setTextPosition] = useState({
    x: cardWidth / 2 - (cardWidth / 2) * 0.8,
    y: cardHeight / 2,
  });
  const [textFontFamily, setTextFontFamily] = useState("Playfair Display");
  const [textFont, setTextFont] = useState(40);
  const [shapeImage] = useImage(selectedShape);
  const [logo] = useImage(logoImage);
  const [mainLogoImage] = useImage(mainLogo);
  const [modalShow, setModalShow] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  const token = JSON.parse(localStorage.getItem("token"));
  const navigate = useNavigate();
  const { t: key } = useTranslation();
  let isArLang = localStorage.getItem("i18nextLng") === "ar";
  const isLogin = useSelector((state) => state.userInfo.isLogin);
  const queryClient = useQueryClient();

  const { data: shapes } = useQuery({
    queryKey: ["shapes", token],
    queryFn: getShapes,
    staleTime: 300000,
  });

  const { data: shops } = useQuery({
    queryKey: ["shops", token],
    queryFn: getShops,
    staleTime: 300000,
  });

  const { data: colors } = useQuery({
    queryKey: ["colors"],
    queryFn: getColors,
    staleTime: 300000,
  });

  const navigateToLogin = () => {
    navigate("/login");
  };

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth < 500 ? window.innerWidth * 0.9 : 480;
      setCardWidth(width);
      setCardHeight((width * 9) / 16);
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const imageAspectRatio = shapeImage?.width / shapeImage?.height;
  const cardAspectRatio = cardWidth / cardHeight;

  let scaledWidth,
    scaledHeight,
    offsetX = 0,
    offsetY = 0;

  if (imageAspectRatio > cardAspectRatio) {
    scaledWidth = cardWidth;
    scaledHeight = cardWidth / imageAspectRatio;
    offsetX = 0;
    offsetY = (cardHeight - scaledHeight) / 2;
  } else {
    scaledHeight = cardHeight;
    scaledWidth = cardHeight * imageAspectRatio;
    offsetX = (cardWidth - scaledWidth) / 2;
    offsetY = 0;
  }

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const stepLabels = [
    key("color"),
    key("shape"),
    key("storesPageTitle"),
    key("message"),
  ];
  const handleSelect = (selectedIndex) => {
    setCurrentStep(selectedIndex);
  };
  const createCard = async () => {
    if (!isLogin) {
      setModalShow(true);
      return;
    }
    if (cardText === "") {
      notifyError(key("cardMessageError"));
      return;
    }
    if (cardPrice === "") {
      notifyError(key("cardPriceError"));
      return;
    }
    if (selectedShopId === "") {
      notifyError(key("cardStoreError"));
      return;
    }
    let formData = {
      isSpecial: false,
      price: {
        value: cardPrice,
        fontFamily: "'Times New Roman', Times, serif",
        fontSize: 40,
        fontColor: textColor,
        fontWeight: 600,
      },
      color: cardColorId,
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

    try {
      const response = await axios.post(`${baseServerUrl}cards`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      // console.log(response.data);
      const res = response.data;
      if (res?.status === "success") {
        queryClient.invalidateQueries(["getCard", token]);
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
            <Col sm={12} className={styles.card_side_container}>
              <div className={styles.card_side_header}>
                <h3>
                  {key("CardDisplay")} ({showBack ? key("back") : key("front")})
                </h3>
              </div>

              <div>
                <Stage
                  className={styles.card}
                  width={cardWidth}
                  height={cardHeight}
                  cornerRadius={30}
                >
                  <Layer>
                    <Rect
                      width={cardWidth}
                      height={cardHeight}
                      fill={cardColor}
                      cornerRadius={30}
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
                        cornerRadius={30}
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
                          x={cardWidth / 2 - (cardWidth * 0.8) / 2}
                          y={cardHeight / 2 - textFont / 2}
                          align="center"
                          wrap="char"
                          draggable
                          onDragEnd={(e) => {
                            setTextPosition({
                              x: e.target.x(),
                              y: e.target.y(),
                            });
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
                        />

                        {cardPrice && (
                          <Text
                            text={`${cardPrice} ${key("sar")}`}
                            fontSize={20}
                            fontFamily={"'Times New Roman', Times, serif"}
                            fill={textColor}
                            x={cardWidth / 2 - 40} // Center horizontally
                            y={cardHeight / 2 + textFont / 2 + 10}
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
                      width={100}
                      height={35}
                      visible={true}
                    />
                  </Layer>
                </Stage>
              </div>
            </Col>

            <Col sm={12} className={styles.control_side_container}>
              <div className={styles.steps_indicator}>
                {stepLabels.map((label, index) => (
                  <div
                    key={index}
                    className={`${styles.step} ${
                      currentStep === index ? styles.active_step : ""
                    }`}
                  >
                    <div className={styles.step_num}>
                      <span>{index + 1}</span>
                    </div>{" "}
                    <span>{label}</span>
                  </div>
                ))}
              </div>

              <Carousel
                activeIndex={currentStep}
                data-bs-theme="dark"
                onSelect={handleSelect}
                controls={true}
                indicators={false}
                interval={null}
                wrap={false}
                className={styles.carousel_body}
              >
                <Carousel.Item className={styles.carousel_item}>
                  <div className={styles.choose_color}>
                    <h4 className={`${styles.title} text-center mb-4`}>
                      {key("choose")} {key("cardColor")}
                    </h4>
                    <Row className={styles.color_group}>
                      {colors ? (
                        colors.data.map((color) => (
                          <Col
                            key={color._id}
                            xs={4}
                            sm={2}
                            className="d-flex justify-content-center align-items-center"
                          >
                            <div
                              onClick={() => {
                                setCardColorId(`${color._id}`);
                                setCardColor(`${color.hex}`);
                              }}
                              style={{ backgroundColor: `${color.hex}` }}
                              className={styles.color_circle}
                            ></div>
                          </Col>
                        ))
                      ) : (
                        <LoadingOne />
                      )}
                    </Row>
                  </div>
                </Carousel.Item>
                <Carousel.Item className={`${styles.carousel_item}`}>
                  <div className={`${styles.choose_shape}  position-relative`}>
                    <h4 className={`${styles.title} text-center mb-4`}>
                      {key("cardBackground")}
                    </h4>
                    <Row className={styles.shapes_container}>
                      {shapes ? (
                        shapes?.data.map((shape) => (
                          <Col
                            xs={12}
                            sm={6}
                            md={4}
                            className="d-flex justify-content-center align-items-center"
                            onClick={() => {
                              setSelectedShape(
                                `${process.env.REACT_APP_Host}shapes/${shape.image} `
                              );
                              setShowBack(true);
                              setSelectedShapeId(shape._id);
                            }}
                            key={shape._id}
                          >
                            <div
                              style={{
                                backgroundColor: cardColor
                                  ? cardColor
                                  : "#FFFFFF",
                              }}
                              className={styles.shape_div}
                            >
                              <img
                                src={`${process.env.REACT_APP_Host}shapes/${shape.image}`}
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
                </Carousel.Item>
                <Carousel.Item className={`${styles.carousel_item}`}>
                  <div className={`${styles.choose_shape} d-flex mx-4`}>
                    <h4 className={`${styles.title} text-start mb-3`}>
                      {key("choose")} {key("store")}
                    </h4>
                    <Row className={styles.logo_container}>
                      {shops &&
                        shops.data.map((shop) => (
                          <Col
                            xs={12}
                            sm={6}
                            md={4}
                            lg={3}
                            className="d-flex justify-content-center"
                            onClick={() => {
                              setLogoImage(
                                `${process.env.REACT_APP_Host}shops/${shop.logo}`
                              );
                              setSelectedShopId(shop._id);
                            }}
                            key={shop._id}
                          >
                            <div className={styles.logo_div}>
                              <img
                                src={`${process.env.REACT_APP_Host}shops/${shop.logo}`}
                                alt={`${shop.name}`}
                              />
                            </div>
                          </Col>
                        ))}
                    </Row>
                  </div>
                </Carousel.Item>
                <Carousel.Item className={styles.carousel_item}>
                  <div className={styles.text_containers_parent}>
                    <div className={`${styles.text_container}`}>
                      <div
                        className={`${styles.message_container} position-relative`}
                      >
                        <h4 className="text-start text-secondary">
                          {key("cardMessage")}
                        </h4>
                        <textarea
                          id="floatingTextarea"
                          value={cardText}
                          onChange={(e) => setCardText(e.target.value)}
                          onClick={() => setShowBack(false)}
                          className={`${styles.text_input} form-control`}
                        ></textarea>
                        <div className={styles.circle_inputs_div}>
                          <input
                            type="number"
                            placeholder={key("size")}
                            onChange={(e) => setTextFont(e.target.value)}
                            className={styles.fontSize_input}
                          />
                          <input
                            type="color"
                            value={textColor}
                            onChange={(e) => setTextColor(e.target.value)}
                            className={styles.color_input}
                          />
                          <Select
                            className={styles.select_input}
                            classNamePrefix="FontFamily"
                            isClearable={false}
                            isSearchable={true}
                            name="fontFamily"
                            placeholder={"TT"}
                            options={FontsFamilies}
                            onChange={(value) => setTextFontFamily(value.value)}
                            styles={{
                              control: (provided) => ({
                                ...provided,
                                borderRadius: "50%",
                                width: "45px",
                                height: "45px",
                                padding: "10px",
                                textAlign: "center",
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                              }),
                              valueContainer: (provided) => ({
                                ...provided,
                                justifyContent: "center",
                                display: "flex",
                                alignItems: "center",
                                padding: "0",
                              }),
                              singleValue: (provided) => ({
                                ...provided,
                                justifyContent: "center",
                                display: "flex",
                                alignItems: "center",
                                padding: "0",
                              }),
                              placeholder: (provided) => ({
                                ...provided,
                                justifyContent: "center",
                                display: "flex",
                                alignItems: "center",
                                width: "100%",
                                textAlign: "center",
                                fontWeight: "bold",
                              }),
                              dropdownIndicator: (provided) => ({
                                ...provided,
                                display: "none",
                              }),
                              indicatorSeparator: () => ({
                                display: "none",
                              }),
                              menu: (provided) => ({
                                ...provided,
                                width: "auto",
                                minWidth: "150px",
                              }),
                            }}
                          />
                        </div>
                      </div>
                    </div>

                    <div className={`${styles.text_container} my-5`}>
                      <h4 className="text-start text-secondary">
                        {key("cardPrice")}
                      </h4>
                      <div
                        className={`${
                          isArLang ? "flex-row-reverse" : ""
                        } input-group mb-3`}
                      >
                        <input
                          type="number"
                          value={cardPrice}
                          onChange={(e) => setCardPrice(e.target.value)}
                          onClick={() => setShowBack(false)}
                          className={`${styles.price_input} text-dark form-control`}
                        />
                        <span
                          className={` ${styles.sar_span} input-group-text bg-white border-start-0`}
                        >
                          SAR
                        </span>
                      </div>
                    </div>
                    <div className="my-5 mx-3 text-center">
                      <MainButton
                        onClick={createCard}
                        text={key("saveChanges")}
                      />
                    </div>
                  </div>
                </Carousel.Item>
              </Carousel>
            </Col>
          </Row>
        </div>
      </div>
      <ConfirmationModal
        show={modalShow}
        onHide={() => setModalShow(false)}
        func={navigateToLogin}
        message={key("loginFirst")}
      />
    </>
  );
};

export default CustomCards;
