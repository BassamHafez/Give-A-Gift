// import React, { useEffect, useState } from "react";
// import useImage from "use-image";
// import Row from "react-bootstrap/Row";
// import Col from "react-bootstrap/Col";
// import styles from "./CustomCards.module.css";
// import { useQueryClient } from "@tanstack/react-query";
// import mainLogo from "../../Images/logo.png";
// import Select from "react-select";
// import { FontsFamilies } from "../../Components/Logic/Logic";
// import MainButton from "../../Components/Ui/MainButton";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";
// import Carousel from "react-bootstrap/Carousel";
// import { useTranslation } from "react-i18next";
// import { useDispatch } from "react-redux";
// import { cartActions } from "../../Store/cartCounter-slice";
// import CustomCardColors from "./CustomCardColors";
// import CustomCardShapes from "./CustomCardShapes";
// import CustomCardShops from "./CustomCardShops";
// import CustomeCardStage from "./CustomeCardStage";

// const notifySuccess = (message) => toast.success(message);
// const notifyError = (message) => toast.error(message);
// const baseServerUrl = process.env.REACT_APP_Base_API_URl;

// const CustomCards = () => {
//   const [cardWidth, setCardWidth] = useState(480);
//   const [cardHeight, setCardHeight] = useState(270);
//   const [cardColor, setCardColor] = useState("#FFFFFF");
//   const [cardProColor, setCardProColor] = useState("");
//   const [cardColorId, setCardColorId] = useState("");
//   const [textColor, setTextColor] = useState("#000000");
//   const [selectedShape, setSelectedShape] = useState(null);
//   const [selectedShapeId, setSelectedShapeId] = useState("");
//   const [selectedShape2, setSelectedShape2] = useState(null);
//   const [selectedShapeId2, setSelectedShapeId2] = useState("");
//   const [selectedShopId, setSelectedShopId] = useState("");
//   const [logoImage, setLogoImage] = useState(null);
//   const [cardText, setCardText] = useState("");
//   const [cardPrice, setCardPrice] = useState("");
//   const [showBack, setShowBack] = useState(true);
//   const [textPosition, setTextPosition] = useState({
//     x: cardWidth / 2 - (cardWidth / 2) * 0.8,
//     y: cardHeight / 2,
//   });
//   const [textFontFamily, setTextFontFamily] = useState(
//     "'ARAHAMAH1982', sans-serif"
//   );
//   const [textFont, setTextFont] = useState(40);
//   const [currentStep, setCurrentStep] = useState(0);
//   const [isProColor, setIsProColor] = useState(false);
//   const [scale, setScale] = useState(1);
//   const [shapePosition, setShapePosition] = useState({ x: 0, y: 0 });
//   const [scale2, setScale2] = useState(1);
//   const [shapePosition2, setShapePosition2] = useState({ x: 0, y: 0 });

//   const token = JSON.parse(localStorage.getItem("token"));
//   const navigate = useNavigate();
//   const { t: key } = useTranslation();
//   let isArLang = localStorage.getItem("i18nextLng") === "ar";
//   const queryClient = useQueryClient();
//   const dispatch = useDispatch();

//   const [shapeImage] = useImage(selectedShape);
//   const [shapeImage2] = useImage(selectedShape2);
//   const [colorShape] = useImage(cardProColor);
//   const [logo] = useImage(logoImage);
//   const [mainLogoImage] = useImage(mainLogo);

//   useEffect(() => {
//     const handleResize = () => {
//       const width = window.innerWidth < 500 ? window.innerWidth * 0.9 : 480;
//       setCardWidth(width);
//       setCardHeight((width * 9) / 16);
//     };

//     window.addEventListener("resize", handleResize);
//     handleResize();

//     return () => window.removeEventListener("resize", handleResize);
//   }, []);

//   useEffect(() => {
//     window.scrollTo(0, 0);
//   }, []);

//   const saveColorValues = (type, value, colorId) => {
//     if (type === "pro") {
//       setCardColorId(`${colorId}`);
//       setCardProColor(`${process.env.REACT_APP_Host}colors/${value}`);
//       setIsProColor(true);
//     } else {
//       setCardColorId(`${colorId}`);
//       setCardColor(`${value}`);
//       setIsProColor(false);
//     }
//   };

//   const saveShape = (value, shapeId, showBack) => {
//     setSelectedShape(`${process.env.REACT_APP_Host}shapes/${value} `);
//     setShowBack(showBack);
//     setSelectedShapeId(shapeId);
//   };
//   const saveShape2 = (value, shapeId, showBack) => {
//     setSelectedShape2(`${process.env.REACT_APP_Host}shapes/${value} `);
//     setShowBack(showBack);
//     setSelectedShapeId2(shapeId);
//   };

//   const saveShop = (value, shopId) => {
//     setLogoImage(`${process.env.REACT_APP_Host}shops/${value}`);
//     setSelectedShopId(shopId);
//   };

//   const imageAspectRatio = shapeImage?.width / shapeImage?.height;
//   const imageAspectRatio2 = shapeImage2?.width / shapeImage2?.height;
//   const cardAspectRatio = cardWidth / cardHeight;
//   const priceSafeY = cardHeight * 0.55;

//   let scaledWidth,
//     scaledHeight,
//     scaledWidth2,
//     scaledHeight2,
//     offsetX = 0,
//     offsetY = 0;

//   if (imageAspectRatio > cardAspectRatio) {
//     scaledWidth = cardWidth;
//     scaledHeight = cardWidth / imageAspectRatio;
//     offsetX = 0;
//     offsetY = (cardHeight - scaledHeight) / 2;
//   } else {
//     scaledHeight = cardHeight;
//     scaledWidth = cardHeight * imageAspectRatio;
//   }

//   if (imageAspectRatio2 > cardAspectRatio) {
//     scaledWidth2 = cardWidth;
//     scaledHeight2 = cardWidth / imageAspectRatio2;
//     offsetX = 0;
//     offsetY = (cardHeight - scaledHeight2) / 2;
//   } else {
//     scaledHeight2 = cardHeight;
//     scaledWidth2 = cardHeight * imageAspectRatio;
//   }

//   const stepLabels = [
//     key("color"),
//     key("shape"),
//     key("storesPageTitle"),
//     key("message"),
//   ];

//   const handleSelect = (selectedIndex) => {
//     setCurrentStep(selectedIndex);
//   };

//   const createCard = async () => {
//     if (cardText === "") {
//       notifyError(key("cardMessageError"));
//       return;
//     }
//     if (cardPrice === "") {
//       notifyError(key("cardPriceError"));
//       return;
//     }

//     if (isNaN(Number(cardPrice))) {
//       notifyError(key("priceNum"));
//       return;
//     }
//     if (Number(cardPrice) < 1) {
//       notifyError(key("priceVali"));
//       return;
//     }
//     if (selectedShopId === "") {
//       notifyError(key("cardStoreError"));
//       return;
//     }
//     if (selectedShapeId === "") {
//       notifyError(key("shapereq"));
//       return;
//     }
//     if (cardColorId === "") {
//       notifyError(key("colorreq"));
//       return;
//     }

//     const priceValues = {
//       value: cardPrice,
//       fontFamily: "'Times New Roman', Times, serif",
//       fontSize: 40,
//       fontColor: textColor,
//       fontWeight: 600,
//     };
//     const textValues = {
//       message: cardText,
//       fontFamily: textFontFamily,
//       fontSize: textFont,
//       fontColor: textColor,
//       fontWeight: 600,
//       xPosition: textPosition.x,
//       yPosition: textPosition.y,
//     };

//     let formData = {};

//     formData = {
//       isSpecial: false,
//       price: priceValues,
//       proColor: cardColorId,
//       shop: selectedShopId,
//       shape: selectedShapeId,
//       shapePosition: { x: shapePosition.x, y: shapePosition.y },
//       shapeScale: scale,
//       text: textValues,
//     };

//     if (isProColor) {
//       formData.proColor = cardColorId;
//     } else {
//       formData.color = cardColorId;
//     }

//     if (selectedShapeId2!=="") {
//       formData.shape2 = selectedShapeId2;
//       formData.shape2Position = { x: shapePosition2.x, y: shapePosition2.y };
//       formData.shape2Scale = scale2;
//     }

//     console.log(formData);
//     try {
//       const response = await axios.post(`${baseServerUrl}cards`, formData, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });
//       const res = response.data;
//       if (res?.status === "success") {
//         queryClient.invalidateQueries(["getMyCards", token]);
//         dispatch(cartActions.addItem());
//         notifySuccess(key("cardSaved"));
//         navigate(`/recipient-information/${res.data?._id}`);
//       }
//     } catch (error) {
//       notifyError(key("wrong"));
//     }
//   };

//   return (
//     <>
//       <div className={`${styles.canva_body} page_height`}>
//         <div className={styles.content}>
//           <Row className="w-100 h-75 justify-content-between">
//             <Col sm={12} className={styles.card_side_container}>
//               <div className={styles.card_side_header}>
//                 <h3>
//                   {key("CardDisplay")} ({showBack ? key("back") : key("front")})
//                 </h3>
//               </div>

//               <div>
//                 <CustomeCardStage
//                   cardWidth={cardWidth}
//                   cardHeight={cardHeight}
//                   isProColor={isProColor}
//                   colorShape={colorShape}
//                   cardColor={cardColor}
//                   shapeImage={shapeImage}
//                   shapeImage2={shapeImage2}
//                   showBack={showBack}
//                   scaledWidth={scaledWidth}
//                   scaledHeight={scaledHeight}
//                   scaledWidth2={scaledWidth2}
//                   scaledHeight2={scaledHeight2}
//                   offsetX={offsetX}
//                   offsetY={offsetY}
//                   cardText={cardText}
//                   textFont={textFont}
//                   textFontFamily={textFontFamily}
//                   textColor={textColor}
//                   textPosition={textPosition}
//                   setTextPosition={setTextPosition}
//                   priceSafeY={priceSafeY}
//                   cardPrice={`${cardPrice}`}
//                   logo={logo}
//                   mainLogoImage={mainLogoImage}
//                   scale={scale}
//                   shapePosition={shapePosition}
//                   setShapePosition={setShapePosition}
//                   scale2={scale2}
//                   shapePosition2={shapePosition2}
//                   setShapePosition2={setShapePosition2}
//                 />
//               </div>
//             </Col>
//             <Col sm={12} className={styles.control_side_container}>
//               <div className={styles.steps_indicator}>
//                 {stepLabels.map((label, index) => (
//                   <div
//                     key={index}
//                     className={`${styles.step} ${
//                       currentStep === index ? styles.active_step : ""
//                     }`}
//                   >
//                     <div className={styles.step_num}>
//                       <span>{index + 1}</span>
//                     </div>{" "}
//                     <span>{label}</span>
//                   </div>
//                 ))}
//               </div>

//               <Carousel
//                 activeIndex={currentStep}
//                 data-bs-theme="dark"
//                 onSelect={handleSelect}
//                 controls={true}
//                 indicators={false}
//                 interval={null}
//                 wrap={false}
//                 className={styles.carousel_body}
//                 touch={false}
//               >
//                 <Carousel.Item className={styles.carousel_item}>
//                   <CustomCardColors saveColorValues={saveColorValues} />
//                 </Carousel.Item>
//                 <Carousel.Item className={`${styles.carousel_item}`}>
//                   <CustomCardShapes
//                     saveShape={saveShape}
//                     saveShape2={saveShape2}
//                     scale={scale}
//                     setScale={setScale}
//                     scale2={scale2}
//                     setScale2={setScale2}
//                   />
//                 </Carousel.Item>
//                 <Carousel.Item className={`${styles.carousel_item}`}>
//                   <CustomCardShops saveShop={saveShop} />
//                 </Carousel.Item>
//                 <Carousel.Item className={styles.carousel_item}>
//                   <div className={styles.text_containers_parent}>
//                     <div className={`${styles.text_container}`}>
//                       <div
//                         className={`${styles.message_container} position-relative`}
//                       >
//                         <h4 className="text-start text-secondary">
//                           {key("cardMessage")}
//                         </h4>
//                         <textarea
//                           id="floatingTextarea"
//                           value={cardText}
//                           onChange={(e) => setCardText(e.target.value)}
//                           onClick={() => setShowBack(false)}
//                           className={`${styles.text_input} form-control`}
//                         ></textarea>
//                         <div className={styles.circle_inputs_div}>
//                           <Select
//                             className={styles.select_input}
//                             classNamePrefix="FontFamily"
//                             isClearable={false}
//                             isSearchable={true}
//                             name="fontFamily"
//                             placeholder={"TT"}
//                             options={FontsFamilies}
//                             onChange={(value) => setTextFontFamily(value.value)}
//                             styles={{
//                               control: (provided) => ({
//                                 ...provided,
//                                 borderRadius: "50%",
//                                 width: "45px",
//                                 height: "45px",
//                                 padding: "10px",
//                                 textAlign: "center",
//                                 display: "flex",
//                                 justifyContent: "center",
//                                 alignItems: "center",
//                               }),
//                               valueContainer: (provided) => ({
//                                 ...provided,
//                                 justifyContent: "center",
//                                 display: "flex",
//                                 alignItems: "center",
//                                 padding: "0",
//                               }),
//                               singleValue: (provided) => ({
//                                 ...provided,
//                                 justifyContent: "center",
//                                 display: "flex",
//                                 alignItems: "center",
//                                 padding: "0",
//                               }),
//                               placeholder: (provided) => ({
//                                 ...provided,
//                                 justifyContent: "center",
//                                 display: "flex",
//                                 alignItems: "center",
//                                 width: "100%",
//                                 textAlign: "center",
//                                 fontWeight: "bold",
//                               }),
//                               dropdownIndicator: (provided) => ({
//                                 ...provided,
//                                 display: "none",
//                               }),
//                               indicatorSeparator: () => ({
//                                 display: "none",
//                               }),
//                               menu: (provided) => ({
//                                 ...provided,
//                                 minWidth: "150px",
//                                 maxWidth: "100%",
//                                 zIndex: 9999,
//                               }),
//                             }}
//                           />
//                           <input
//                             type="number"
//                             value={textFont}
//                             placeholder={key("size")}
//                             onChange={(e) => setTextFont(e.target.value)}
//                             className={styles.fontSize_input}
//                           />
//                           <input
//                             type="color"
//                             value={textColor}
//                             onChange={(e) => setTextColor(e.target.value)}
//                             className={styles.color_input}
//                           />
//                         </div>
//                       </div>
//                     </div>

//                     <div className={`${styles.text_container} my-5`}>
//                       <h4 className="text-start text-secondary">
//                         {key("cardPrice")}
//                       </h4>
//                       <div
//                         className={`${
//                           isArLang ? "flex-row-reverse" : ""
//                         } input-group mb-3`}
//                       >
//                         <input
//                           type="text"
//                           value={cardPrice}
//                           onChange={(e) => setCardPrice(e.target.value)}
//                           onClick={() => setShowBack(false)}
//                           className={`${styles.price_input} text-dark form-control`}
//                         />
//                         <span
//                           className={` ${styles.sar_span} input-group-text bg-white border-start-0`}
//                         >
//                           {key("sar")}
//                         </span>
//                       </div>
//                     </div>
//                     <div className="my-5 mx-3 text-center">
//                       <MainButton
//                         onClick={createCard}
//                         text={key("saveChanges")}
//                       />
//                     </div>
//                   </div>
//                 </Carousel.Item>
//               </Carousel>
//             </Col>
//           </Row>
//         </div>
//       </div>
//     </>
//   );
// };

// export default CustomCards;









// import React, { useEffect, useState, useRef } from "react";
// import { useMediaQuery } from "react-responsive";
// import { Stage, Layer, Rect, Text, Image } from "react-konva";
// import styles from "./CustomCards.module.css";
// import { useTranslation } from "react-i18next";
// import useImage from "use-image";

// const CustomeCardStage = ({
//   cardWidth,
//   cardHeight,
//   isProColor,
//   colorShape,
//   cardColor,
//   shapeImage,
//   shapeImage2,
//   showBack,
//   scaledWidth,
//   scaledHeight,
//   scaledWidth2,
//   scaledHeight2,
//   cardText,
//   textFont,
//   textFontFamily,
//   textColor,
//   textPosition,
//   setTextPosition,
//   priceSafeY,
//   cardPrice,
//   logo,
//   mainLogoImage,
//   scale,
//   shapePosition,
//   setShapePosition,
//   scale2,
//   shapePosition2,
//   setShapePosition2,
//   shapesArray,
//   updateShape,
// }) => {
//   const isSmallScreen = useMediaQuery({ query: "(max-width: 400px)" });
//   const { t: key } = useTranslation();
//   const [hasDraggedText, setHasDraggedText] = useState(false);
//   const initialTextPosition = useRef(null);
//   const [initialCenteringDone, setInitialCenteringDone] = useState(false);
//   const [loadedImages, setLoadedImages] = useState([]);

//   useEffect(() => {
//     // Load all images at once
//     const loadImages = async () => {
//       const images = await Promise.all(
//         shapesArray.map((shape) => {
//           return new Promise((resolve) => {
//             const img = new window.Image();
//             img.src = `${process.env.REACT_APP_Host}shapes/${shape.image}`;
//             img.onload = () => resolve(img);
//             img.onerror = () => resolve(null); // Resolve with null on error
//           });
//         })
//       );
//       setLoadedImages(images);
//     };

//     loadImages();
//   }, [shapesArray]);

//   useEffect(() => {
//     if (!initialCenteringDone) {
//       const centeredX = (cardWidth - scaledWidth * scale) / 2;
//       const centeredY = (cardHeight - scaledHeight * scale) / 2;
//       setShapePosition({ x: centeredX, y: centeredY });
//       const centeredX2 = (cardWidth - scaledWidth2 * scale2) / 2;
//       const centeredY2 = (cardHeight - scaledHeight2 * scale2) / 2;
//       setShapePosition2({ x: centeredX2, y: centeredY2 });
//     }
//   }, [
//     initialCenteringDone,
//     scaledWidth,
//     scaledHeight,
//     scaledWidth2,
//     scaledHeight2,
//     scale,
//     cardWidth,
//     cardHeight,
//     setShapePosition,
//     setShapePosition2,
//     scale2,
//   ]);

//   const handleTextDragStart = () => {
//     setHasDraggedText(true);
//   };

//   const handleTextDragMove = (e) => {
//     setTextPosition({ x: e.target.x(), y: e.target.y() });
//   };

//   const handleShapeDragMove = (e, shapeIndex) => {
//     const setPosition = shapeIndex === 1 ? setShapePosition : setShapePosition2;
//     setPosition({ x: e.target.x(), y: e.target.y() });
//     setInitialCenteringDone(true);
//   };

//   const handleDragMove = (index, e) => {
//     const newPos = { x: e.target.x(), y: e.target.y() };
//     updateShape(index, { ...shapesArray[index], position: newPos });
//   };

//   const handleScaleChange = (index, e) => {
//     const newScale = parseFloat(e.target.value);
//     updateShape(index, { ...shapesArray[index], scale: newScale });
//   };

//   const handleTouchMove = (index) => (e) => {
//     e.evt.preventDefault(); // Prevent default touch behavior

//     const { touches } = e.evt; // Access touches from the event
//     if (touches && touches.length === 2) {
//       const dx = touches[0].clientX - touches[1].clientX;
//       const dy = touches[0].clientY - touches[1].clientY;
//       const distance = Math.sqrt(dx * dx + dy * dy);

//       // Update scale based on distance between two touch points
//       const newScale = distance / 100; // Adjust scaling factor as needed
//       updateShape(index, { ...shapesArray[index], scale: newScale });
//     }
//   };

//   const handleWheel = (index) => (e) => {
//     e.evt.preventDefault(); // Prevent the default scrolling behavior
//     const delta = e.evt.deltaY;
//     const scaleChange = delta > 0 ? 0.95 : 1.05; // Zoom in/out
//     updateShape(index, {
//       ...shapesArray[index],
//       scale: shapesArray[index].scale * scaleChange,
//     });
//   };

//   const handleRotationChange = (index, e) => {
//     const newRotation = parseFloat(e.target.value);
//     updateShape(index, { ...shapesArray[index], rotation: newRotation });
//   };

//   return (
//     <>
//       <Stage
//         className={styles.card}
//         width={cardWidth}
//         height={cardHeight}
//         cornerRadius={30}
//       >
//         <Layer>
//           {isProColor ? (
//             <Image
//               image={colorShape}
//               width={cardWidth}
//               height={cardHeight}
//               opacity={1}
//               visible={true}
//               cornerRadius={30}
//             />
//           ) : (
//             <Rect
//               width={cardWidth}
//               height={cardHeight}
//               fill={cardColor}
//               cornerRadius={30}
//             />
//           )}

//           {shapesArray.map((shape, index) => (
//             <Image
//              key={`${shape._id}_${index}`}
//               image={loadedImages[index]} // Use the preloaded image
//               x={shape.position.x}
//               y={shape.position.y}
//               width={100 * shape.scale}
//               height={100 * shape.scale}
//               rotation={shape.rotation} // Apply rotation
//               draggable
//               onDragMove={(e) => handleDragMove(index, e)}
//               onTouchMove={handleTouchMove(index)} // Attach touch move handler for each shape
//               onWheel={handleWheel(index)} // Attach the wheel handler for each shape
//             />
//           ))}

    //  {shapeImage && showBack && (
    //       <Image
    //         image={shapeImage}
    //         width={scaledWidth * scale || cardWidth * scale}
    //         height={scaledHeight * scale || cardHeight * scale}
    //         x={shapePosition.x || 0}
    //         y={shapePosition.y || 0}
    //         draggable
    //         onDragMove={(e) => handleShapeDragMove(e, 1)}
    //         opacity={1}
    //         visible={true}
    //         cornerRadius={30}
    //         onMouseEnter={(e) => {
    //           const container = e.target.getStage().container();
    //           container.style.cursor = "grab";
    //         }}
    //         onMouseLeave={(e) => {
    //           const container = e.target.getStage().container();
    //           container.style.cursor = "default";
    //         }}
    //         onMouseDown={(e) => {
    //           const container = e.target.getStage().container();
    //           container.style.cursor = "grabbing";
    //         }}
    //         onMouseUp={(e) => {
    //           const container = e.target.getStage().container();
    //           container.style.cursor = "grab";
    //         }}
    //       />
    //     )}
    //     {shapeImage2 && showBack && (
    //       <Image
    //         image={shapeImage2}
    //         width={scaledWidth2 * scale2 || cardWidth * scale2}
    //         height={scaledHeight2 * scale2 || cardHeight * scale2}
    //         x={shapePosition2.x || 0}
    //         y={shapePosition2.y || 0}
    //         draggable
    //         onDragMove={(e) => handleShapeDragMove(e, 2)}
    //         opacity={1}
    //         visible={true}
    //         cornerRadius={30}
    //         onMouseEnter={(e) => {
    //           const container = e.target.getStage().container();
    //           container.style.cursor = "grab";
    //         }}
    //         onMouseLeave={(e) => {
    //           const container = e.target.getStage().container();
    //           container.style.cursor = "default";
    //         }}
    //         onMouseDown={(e) => {
    //           const container = e.target.getStage().container();
    //           container.style.cursor = "grabbing";
    //         }}
    //         onMouseUp={(e) => {
    //           const container = e.target.getStage().container();
    //           container.style.cursor = "grab";
    //         }}
        //   />
        // )}

//           {/* {!showBack && (
//             <>
//               {cardText && (
//                 <Text
//                   text={cardText}
//                   fontSize={isSmallScreen ? textFont / 2 : Number(textFont)}
//                   fontFamily={textFontFamily}
//                   fill={textColor}
//                   width={cardWidth * 0.8}
//                   x={textPosition.x}
//                   y={textPosition.y}
//                   align="center"
//                   wrap="char"
//                   draggable
//                   onDragStart={handleTextDragStart}
//                   onDragMove={handleTextDragMove}
//                   onMouseEnter={(e) => {
//                     const container = e.target.getStage().container();
//                     container.style.cursor = "grab";
//                   }}
//                   onMouseLeave={(e) => {
//                     const container = e.target.getStage().container();
//                     container.style.cursor = "default";
//                   }}
//                   onMouseDown={(e) => {
//                     const container = e.target.getStage().container();
//                     container.style.cursor = "grabbing";
//                   }}
//                   onMouseUp={(e) => {
//                     const container = e.target.getStage().container();
//                     container.style.cursor = "grab";
//                   }}
//                   ref={(node) => {
//                     if (
//                       node &&
//                       !hasDraggedText &&
//                       initialTextPosition.current === null
//                     ) {
//                       const textWidth = node.getClientRect().width;
//                       const textHeight = node.getClientRect().height;
//                       const centeredX = cardWidth / 2 - textWidth / 2;
//                       let centeredY = cardHeight / 2 - textHeight / 2;

//                       if (centeredY + textHeight > priceSafeY) {
//                         centeredY = priceSafeY - textHeight;
//                       }

//                       if (
//                         textPosition.x !== centeredX ||
//                         textPosition.y !== centeredY
//                       ) {
//                         setTextPosition({
//                           x: centeredX,
//                           y: centeredY,
//                         });
//                       }
//                     }
//                   }}
//                 />
//               )}

//               {cardPrice && (
//                 <Text
//                   text={`${cardPrice} ${key("sar")}`}
//                   fontSize={20}
//                   fontFamily={"'Times New Roman', Times, serif"}
//                   fill={textColor}
//                   x={cardWidth / 2 - 30}
//                   y={cardHeight / 2 + textFont / 2}
//                 />
//               )}
//             </>
//           )}

//           {logo && (
//             <Image
//               image={logo}
//               x={isSmallScreen ? cardWidth - 60 : cardWidth - 70}
//               y={10}
//               width={isSmallScreen ? 40 : 60}
//               height={isSmallScreen ? 40 : 60}
//               visible={true}
//               cornerRadius={30}
//             />
//           )}

//           <Image
//             image={mainLogoImage}
//             x={20}
//             y={isSmallScreen ? cardHeight - 30 : cardHeight - 50}
//             width={isSmallScreen ? 50 : 100}
//             height={isSmallScreen ? 17.5 : 35}
//             visible={true}
//           />
//         </Layer>
//       </Stage>
//       <div>
//         {shapesArray.map((shape, index) => (
//           <div key={`${shape._id}_${index}`}>
//             <label>{`Scale Shape ${index + 1}`}</label>
//             <input
//               type="range"
//               min="0.1"
//               max="2"
//               step="0.01"
//               value={shape.scale}
//               onChange={(e) => handleScaleChange(index, e)}
//             />
//             <label>{`Rotate Shape ${index + 1}`}</label>
//             <input
//               type="range"
//               min="0"
//               max="360"
//               step="1"
//               value={shape.rotation} // Add rotation slider
//               onChange={(e) => handleRotationChange(index, e)}
//             />
//           </div>
//         ))}
//       </div>
//     </>
//   );
// };

// export default CustomeCardStage; */}

