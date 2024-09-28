import React, { useEffect, useState } from "react";
import useImage from "use-image";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import styles from "./CustomCards.module.css";
import { useQueryClient } from "@tanstack/react-query";
import mainLogo from "../../Images/logo.png";
import Select from "react-select";
import { FontsFamilies } from "../../Components/Logic/Logic";
import MainButton from "../../Components/Ui/MainButton";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import Carousel from "react-bootstrap/Carousel";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { cartActions } from "../../Store/cartCounter-slice";
import CustomCardColors from "./CustomCardColors";
import CustomCardShapes from "./CustomCardShapes";
import CustomCardShops from "./CustomCardShops";
import CustomeCardStage from "./CustomeCardStage";

const notifySuccess = (message) => {
  toast.success((t) => (
    <div
      onClick={() => toast.dismiss(t.id)}
    >
      {message}
    </div>
  ));
};

const notifyError = (message) => {
  toast.error((t) => (
    <div
      onClick={() => toast.dismiss(t.id)}
    >
      {message}
    </div>
  ));
};
const baseServerUrl = process.env.REACT_APP_Base_API_URl;

const CustomCards = () => {
  const [shapesArray, setShapesArray] = useState([]);
  const [cardWidth, setCardWidth] = useState(480);
  const [cardHeight, setCardHeight] = useState(270);
  const [cardColor, setCardColor] = useState("#FFFFFF");
  const [cardProColor, setCardProColor] = useState("");
  const [cardColorId, setCardColorId] = useState("");
  const [textColor, setTextColor] = useState("#000000");
  const [selectedShopId, setSelectedShopId] = useState("");
  const [logoImage, setLogoImage] = useState(null);
  const [cardText, setCardText] = useState("");
  const [cardPrice, setCardPrice] = useState("");
  const [showBack, setShowBack] = useState(true);
  const [textPosition, setTextPosition] = useState({
    x: cardWidth / 2 - (cardWidth / 2) * 0.8,
    y: cardHeight / 2,
  });
  const [textFontFamily, setTextFontFamily] = useState("ARAHAMAH1982");
  const [textFont, setTextFont] = useState(40);
  const [currentStep, setCurrentStep] = useState(0);
  const [isProColor, setIsProColor] = useState(false);

  const token = JSON.parse(localStorage.getItem("token"));
  const isLogin = useSelector((state) => state.userInfo.isLogin);
  const navigate = useNavigate();
  const { t: key } = useTranslation();
  let isArLang = localStorage.getItem("i18nextLng") === "ar";
  const queryClient = useQueryClient();
  const dispatch = useDispatch();

  const [colorShape] = useImage(cardProColor);
  const [logo] = useImage(logoImage);
  const [mainLogoImage] = useImage(mainLogo);
  const priceSafeY = cardHeight * 0.55;

  const notifyLoginError = (message) =>
    toast(
      (t) => (
        <span>
          {message}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              marginTop: "10px",
            }}
          >
            <div style={{ display: "flex", gap: "10px" }}>
              <button
                onClick={() => toast.dismiss(t.id)}
                style={{
                  borderRadius: "1.5625rem",
                  fontSize: "1.125rem",
                  fontWeight: "700",
                  boxShadow: "0 0 0.1875rem rgba(0, 0, 0, 0.5)",
                  padding: "0.625rem 0.9375rem",
                  marginRight: "auto",
                }}
              >
                {key("later")}
              </button>

              <button
                onClick={() => {
                  navigate(`/login`);
                  toast.dismiss(t.id);
                }}
                style={{
                  borderRadius: "1.5625rem",
                  minWidth: "6.25rem",
                  fontSize: "1.125rem",
                  fontWeight: "700",
                  boxShadow: "0 0 0.1875rem rgba(0, 0, 0, 0.5)",
                  padding: "0.625rem 0.9375rem",
                  marginLeft: "auto",
                  backgroundColor: "red",
                  color: "#FFF",
                }}
              >
                {key("login")}
              </button>
            </div>
          </div>
        </span>
      ),
      {
        icon: "⚠️",
        style: {
          padding: "16px",
          color: "#000",
          fontWeight: "600",
        },
        duration: 4000,
      }
    );

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth < 500 ? window.innerWidth * 0.9 : 480;
      if (width !== cardWidth) {
        setCardWidth(width);
        setCardHeight((width * 9) / 16);
      }
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    return () => window.removeEventListener("resize", handleResize);
  }, [cardWidth]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const saveColorValues = (type, value, colorId) => {
    if (type === "pro") {
      setCardColorId(`${colorId}`);
      setCardProColor(`${process.env.REACT_APP_Host}colors/${value}`);
      setIsProColor(true);
    } else {
      setCardColorId(`${colorId}`);
      setCardColor(`${value}`);
      setIsProColor(false);
    }
  };

  const addShape = (shapeData) => {
    setShapesArray((prev) => {
      if (!prev.some((shape) => shape.id === shapeData.id)) {
        return [
          ...prev,
          {
            ...shapeData,
            scale: 0.3,
            position: { x: cardWidth / 2, y: cardHeight / 2 },
            rotation: 0,
          },
        ];
      }
      return prev;
    });
  };

  const removeShape = (shapeId) => {
    setShapesArray((prev) => prev.filter((shape) => shape.id !== shapeId));
  };

  const updateShape = (index, updatedShape) => {
    setShapesArray((prev) =>
      prev.map((shape, i) => (i === index ? updatedShape : shape))
    );
  };

  const saveShop = (value, shopId) => {
    setLogoImage(`${process.env.REACT_APP_Host}shops/${value}`);
    setSelectedShopId(shopId);
  };

  const stepLabels = [
    key("color"),
    key("shape"),
    key("storesPageTitle"),
    key("message"),
  ];

  const handleSelect = (selectedIndex) => {
    if (currentStep !== selectedIndex) {
      setCurrentStep(selectedIndex);
    }
  };
  const createCard = async () => {
    if (!isLogin) {
      notifyLoginError(key("loginFirst"));
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

    if (isNaN(Number(cardPrice))) {
      notifyError(key("priceNum"));
      return;
    }
    if (Number(cardPrice) < 1) {
      notifyError(key("priceVali"));
      return;
    }
    if (selectedShopId === "") {
      notifyError(key("cardStoreError"));
      return;
    }
    if (!(shapesArray.length > 0)) {
      notifyError(key("shapereq"));
      return;
    }
    if (cardColorId === "") {
      notifyError(key("colorreq"));
      return;
    }

    const priceValues = {
      value: cardPrice,
      fontFamily: "'Times New Roman', Times, serif",
      fontSize: 40,
      fontColor: textColor,
      fontWeight: 600,
    };
    const textValues = {
      message: cardText,
      fontFamily: textFontFamily,
      fontSize: textFont,
      fontColor: textColor,
      fontWeight: 600,
      xPosition: textPosition.x,
      yPosition: textPosition.y,
    };

    const shapes = shapesArray.map((shape) => ({
      shape: shape.id,
      position: { x: shape.position.x, y: shape.position.y },
      scale: shape.scale,
      rotation: shape.rotation,
    }));

    let formData = {};

    formData = {
      isSpecial: false,
      price: priceValues,
      proColor: cardColorId,
      shop: selectedShopId,
      shapes: shapes,
      text: textValues,
    };

    if (isProColor) {
      formData.proColor = cardColorId;
    } else {
      formData.color = cardColorId;
    }

    console.log(formData);
    try {
      const response = await axios.post(`${baseServerUrl}cards`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const res = response.data;
      if (res?.status === "success") {
        queryClient.invalidateQueries(["getMyCards", token]);
        dispatch(cartActions.addItem());
        notifySuccess(key("cardSaved"));
        navigate(`/recipient-information/${res.data?._id}`);
      }
    } catch (error) {
      notifyError(key("wrong"));
    }
  };

  const handleTextChange = (e) => {
    setCardText(e.target.value);
  };
  const handlePriceChange = (e) => {
    setCardPrice(e.target.value);
  };

  const settingShowBack = (value) => {
    setShowBack(value);
  };

  return (
    <>
      <div className={`${styles.canva_body} page_height`}>
        <div className={styles.content}>
          <Row className="w-100 h-75 justify-content-between">
            <Col sm={12} className={styles.card_side_container}>
              <div className={styles.card_side_header}>
                <h3>
                  {key("CardDisplay")} ({showBack ? key("back") : key("front")})
                </h3>
              </div>

              <div>
                <CustomeCardStage
                  cardWidth={cardWidth}
                  cardHeight={cardHeight}
                  isProColor={isProColor}
                  colorShape={colorShape}
                  cardColor={cardColor}
                  showBack={showBack}
                  cardText={cardText}
                  textFont={textFont}
                  textFontFamily={textFontFamily}
                  textColor={textColor}
                  textPosition={textPosition}
                  setTextPosition={setTextPosition}
                  cardPrice={cardPrice}
                  logo={logo}
                  mainLogoImage={mainLogoImage}
                  shapesArray={shapesArray}
                  updateShape={updateShape}
                  priceSafeY={priceSafeY}
                  removeShape={removeShape}
                  currentStep={currentStep}
                />
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
                touch={false}
              >
                <Carousel.Item className={styles.carousel_item}>
                  <CustomCardColors saveColorValues={saveColorValues} />
                </Carousel.Item>
                <Carousel.Item className={`${styles.carousel_item}`}>
                  <CustomCardShapes
                    addShape={addShape}
                    settingShowBack={settingShowBack}
                  />
                </Carousel.Item>
                <Carousel.Item className={`${styles.carousel_item}`}>
                  <CustomCardShops saveShop={saveShop} />
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
                          value={cardText}
                          onChange={handleTextChange}
                          onClick={() => setShowBack(false)}
                          className={`${styles.text_input} form-control`}
                        />
                        <div className={styles.circle_inputs_div}>
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
                                minWidth: "150px",
                                maxWidth: "100%",
                                zIndex: 9999,
                              }),
                            }}
                          />
                          <input
                            type="number"
                            value={textFont}
                            onChange={(e) => setTextFont(e.target.value)}
                            className={styles.fontSize_input}
                          />
                          <input
                            type="color"
                            value={textColor}
                            onChange={(e) => setTextColor(e.target.value)}
                            className={styles.color_input}
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
                          type="text"
                          value={cardPrice}
                          onChange={handlePriceChange}
                          onClick={() => setShowBack(false)}
                          className={`${styles.price_input} text-dark form-control`}
                        />
                        <span
                          className={` ${styles.sar_span} input-group-text bg-white border-start-0`}
                        >
                          {key("sar")}
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
    </>
  );
};

export default CustomCards;
