import React, { useEffect, useState } from "react";
import useImage from "use-image";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import styles from "./CustomCards.module.css";
import { useQueryClient } from "@tanstack/react-query";
import mainLogo from "../../Images/logo.png";
import Select from "react-select";
import { FontsFamilies, fontSizes } from "../../Components/Logic/Logic";
import MainButton from "../../Components/Ui/MainButton";
import axios from "axios";

import { useNavigate } from "react-router-dom";
import Carousel from "react-bootstrap/Carousel";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { cartActions } from "../../Store/cartCounter-slice";
import CustomCardColors from "./CustomCardColors";
import CustomCardShapes from "./CustomCardShapes";
import CustomCardShops from "./CustomCardShops";
import CustomeCardStage from "./CustomeCardStage";
import { toast } from "react-toastify";
import { customCardActions } from "../../Store/customCardStore-slice";

const baseServerUrl = process.env.REACT_APP_Base_API_URl;

const CustomCards = () => {
  const notifySuccess = (message) => toast.success(message);
  const notifyError = (message) => toast.error(message);
  const [shapesArray, setShapesArray] = useState([]);
  const [cardWidth, setCardWidth] = useState(480);
  const [cardHeight, setCardHeight] = useState(270);
  const [cardColor, setCardColor] = useState("#FFFFFF");
  const [cardProColor, setCardProColor] = useState("");
  const [cardColorId, setCardColorId] = useState("");
  const [textColor, setTextColor] = useState("#000");
  const [selectedShopId, setSelectedShopId] = useState("");
  const [logoImage, setLogoImage] = useState(null);
  const [cardText, setCardText] = useState("");
  const [cardPrice, setCardPrice] = useState("");
  const [showBack, setShowBack] = useState(true);
  const [textPosition, setTextPosition] = useState({
    x: cardWidth / 2 - (cardWidth / 2) * 0.8,
    y: cardHeight / 2,
  });
  const [textFontFamily, setTextFontFamily] = useState("Roboto");
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
  const { isStoreSelected, storeId, storeLogo } = useSelector(
    (state) => state.customCard
  );
  const [colorShape] = useImage(cardProColor);
  const [logo] = useImage(logoImage);
  const [mainLogoImage] = useImage(mainLogo);
  const priceSafeY = cardHeight * 0.55;

  const Msg = ({ closeToast, toastProps }) => (
    <span>
      {key("loginFirst")}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          marginTop: "10px",
        }}
      >
        <div style={{ display: "flex", gap: "10px" }}>
          <button
            onClick={closeToast}
            style={{
              borderRadius: "1.5625rem",
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
            }}
            style={{
              borderRadius: "1.5625rem",
              minWidth: "5rem",
              fontWeight: "700",
              boxShadow: "0 0 3px rgba(0, 0, 0, 0.5)",
              padding: "0.625rem",
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
  );

  const notifyLoginError = () => toast.info(<Msg />);

  useEffect(() => {
    if (isStoreSelected) {
      setLogoImage(`${process.env.REACT_APP_Host}shops/${storeLogo}`);
    }
  }, [isStoreSelected, storeLogo]);

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

  useEffect(() => {
    return () => {
      dispatch(customCardActions.setIsStoreSelected(false));
      dispatch(customCardActions.setStoreId(""));
    };
  }, [dispatch]);

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
    key("design"),
    key("storesPageTitle"),
    key("message"),
  ];

  const handleSelect = (selectedIndex) => {
    if (currentStep !== selectedIndex) {
      setCurrentStep(selectedIndex);
    }
  };

  const createCard = async () => {
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
    if (storeId === "") {
      if (selectedShopId === "") {
        notifyError(key("cardStoreError"));
        return;
      }
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

    const shapes = shapesArray?.map((shape) => ({
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
      shop: isStoreSelected ? storeId : selectedShopId,
      shapes: shapes,
      text: textValues,
    };

    if (isProColor) {
      formData.proColor = cardColorId;
    } else {
      formData.color = cardColorId;
    }
    if (!isLogin) {
      notifyLoginError();
      localStorage.setItem("notReadyCard", JSON.stringify(formData));
      localStorage.setItem("isNotReadyCard", "true");
      return;
    }

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
                  {key("CardDisplay")} ({showBack ? key("front") : key("back")})
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
                {stepLabels?.map((label, index) => (
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
                <Carousel.Item>
                  <CustomCardColors saveColorValues={saveColorValues} />
                </Carousel.Item>
                <Carousel.Item>
                  <CustomCardShapes
                    addShape={addShape}
                    settingShowBack={settingShowBack}
                  />
                </Carousel.Item>
                {!isStoreSelected && (
                  <Carousel.Item>
                    <CustomCardShops saveShop={saveShop} />
                  </Carousel.Item>
                )}
                <Carousel.Item>
                  <div className={styles.text_containers_parent}>
                    <div className={`${styles.text_container}`}>
                      <div
                        className={`${styles.message_container} position-relative`}
                      >
                        <h4>{key("cardMessage")}</h4>
                        <textarea
                          value={cardText}
                          onChange={handleTextChange}
                          onClick={() => setShowBack(false)}
                          className={`${styles.text_input} form-control`}
                        />
                      </div>
                    </div>

                    <div className={styles.control_inputs_div}>
                      <Select
                        classNamePrefix="fontSizes"
                        placeholder={key("fontSize")}
                        isClearable={false}
                        isSearchable={true}
                        name="fontSizes"
                        options={fontSizes}
                        onChange={(value) => setTextFont(value.value)}
                        className={`${styles.fontSize_input} ${styles.fontSize_width}`}
                      />
                      <Select
                        classNamePrefix="FontFamily"
                        placeholder={key("fontType")}
                        isClearable={false}
                        isSearchable={true}
                        name="fontFamily"
                        options={FontsFamilies}
                        onChange={(value) => setTextFontFamily(value.value)}
                        className={styles.fontSize_input}
                      />
                      <div className={styles.color_input_div}>
                        <label
                          className={`${textColor === "#000" ? "" : "d-none"}`}
                          htmlFor="colorInput"
                        >
                          {key("color")}
                        </label>
                        <input
                          type="color"
                          value={textColor}
                          onChange={(e) => setTextColor(e.target.value)}
                          className={
                            textColor === "#000"
                              ? styles.color_input
                              : styles.input_color_show
                          }
                          id="colorInput"
                        />
                      </div>
                    </div>
                    <div className={`${styles.text_container} my-5`}>
                      <h4>{key("cardPrice")}</h4>
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
