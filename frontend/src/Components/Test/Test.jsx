// -----------------------------------new payment----------------------------------------

// import React, { useCallback, useEffect } from "react";
// import { Col, Row } from "react-bootstrap";
// import { useParams } from "react-router-dom";
// import axios from "axios";
// import { useQuery } from "@tanstack/react-query";
// import LoadingOne from "../../Components/Ui/LoadingOne";
// import styles from "./MyPay.module.css";
// import paymentImg from "../../Images/payment.svg";
// import { useDispatch } from "react-redux";

// const Payment = () => {
//   const token = JSON.parse(localStorage.getItem("token"));
//   const baseServerUrl = process.env.REACT_APP_Base_API_URl;
//   const dispatch = useDispatch();
//   let isArLang = localStorage.getItem("i18nextLng") === "ar";
//   const { price, cardId } = useParams();

//   const getInitialSession = async () => {
//     try {
//       const response = await axios.get(
//         `${baseServerUrl}payments/initiate-session`,
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );
//       console.log("Session initialized:", response.data);
//       return response.data;
//     } catch (error) {
//       console.error("Failed to fetch session data:", error);
//       throw new Error("Failed to fetch session data");
//     }
//   };

//   const {
//     data: sessionData,
//     isError,
//     isLoading,
//   } = useQuery({
//     queryKey: ["initialSession", cardId, price],
//     queryFn: getInitialSession,
//     enabled: !!cardId && !!price && !!token,
//     staleTime: Infinity,
//   });

//   const loadMyFatoorahScript = useCallback(() => {
//     if (!window.myFatoorahScriptLoaded) {
//       const script = document.createElement("script");
//       script.src = "https://sa.myfatoorah.com/payment/v1/session.js";
//       script.async = true;
//       script.onload = () => {
//         console.log("MyFatoorah script loaded");
//         window.myFatoorahScriptLoaded = true;
//       };
//       document.body.appendChild(script);
//     } else {
//       console.log("MyFatoorah script already loaded");
//     }
//   }, []);

//   useEffect(() => {
//     loadMyFatoorahScript();
//     return () => {
//       const container = document.getElementById("unified-session");
//       if (container) container.innerHTML = ""; // Cleanup session
//     };
//   }, [loadMyFatoorahScript]);

//   const applyPayment = (response) => {
//     if (response.isSuccess) {
//       switch (response.paymentType) {
//         case "ApplePay":
//         case "Card":
//           console.log("response >> ", response);
//           break;
//         default:
//           console.log("Unknown payment type");
//           break;
//       }
//     }
//   };

  // const sessionCanceled = () => {
  //   console.log("Failed");
  // };

  // const sessionStarted = () => {
  //   console.log("Start");
  // };

  // const handleCardBinChanged = (response) => {
  //   console.log(response);
  // };

//   useEffect(() => {
//     if (isLoading || isError || !sessionData) {
//       return;
//     }

//     if (window.myfatoorah) {
//       const config = {
//         sessionId: sessionData?.data?.Data?.SessionId,
//         countryCode: sessionData?.data?.Data?.CountryCode,
//         currencyCode: "SAR",
//         amount: `${price}`,
//         callback: applyPayment,
//         containerId: "unified-session",
//         paymentOptions: ["ApplePay", "Card"],
//         supportedNetworks: ["visa", "masterCard", "mada", "amex"],
//         language: "en",
//         settings: {
//           applePay: {
//             style: {
//               frameHeight: "50px",
//               frameWidth: "100%",
//               button: {
//                 height: "40px",
//                 type: "pay",
//                 borderRadius: "10px",
//               },
//             },
//             useCustomButton: false,
//             // sessionStarted,
//             // sessionCanceled,
//             requiredShippingContactFields: [
//               "postalAddress",
//               "name",
//               "phone",
//               "email",
//             ],
//             requiredBillingContactFields: ["postalAddress", "name", "phone"],
//           },
//           card: {
//             // onCardBinChanged: handleCardBinChanged,
//             style: {
//               hideNetworkIcons: false,
//               cardHeight: "180px",
//               tokenHeight: "180px",
//               input: {
//                 color: "black",
//                 fontSize: "15px",
//                 fontFamily: "Times",
//                 inputHeight: "32px",
//                 borderColor: "rgba(0,0,0,.6)",
//                 borderWidth: "1px",
//                 borderRadius: "10px",
//                 inputMargin: "10px",
//                 placeHolder: {
//                   holderName: "Name On Card",
//                   cardNumber: "Number",
//                   expiryDate: "MM/YY",
//                   securityCode: "CVV",
//                 },
//               },
//               button: {
//                 useCustomButton: false,
//                 textContent: "Pay",
//                 fontSize: "16px",
//                 fontFamily: "Times",
//                 color: "white",
//                 height: "30px",
//                 borderRadius: "8px",
//                 width: "70%",
//                 margin: "0 auto",
//                 cursor: "pointer",
//                 backgroundColor: "#b62026",
//               },
//             },
//           },
//         },
//       };
//       if (window.myfatoorah) {
//         window.myfatoorah.init(config);
//       }
//     } else {
//       console.error("MyFatoorah script not loaded");
//     }
//   }, [sessionData, price, isError, isLoading, dispatch]);

//   const centerClass = "d-flex justify-content-center align-items-center";

//   return (
//     <>
//       {(isLoading || !sessionData) && <LoadingOne />}

//       <section className={`${centerClass} ${styles.container}`}>
//         <Row className={styles.row_container}>
//           <Col
//             md={6}
//             className={`${centerClass} ${styles.payment_side} ${
//               isArLang ? styles.pc_ar : styles.pc_en
//             }`}
//           >
//             <div className={styles.payment_container}>
//               <div id="unified-session"></div>
//             </div>
//           </Col>
//           <Col md={6} className={centerClass}>
//             <div className={styles.payment_img}>
//               <img src={paymentImg} alt="payment" />
//             </div>
//           </Col>
//         </Row>
//       </section>
//     </>
//   );
// };

// export default Payment;




// .container {
//     min-height: 88vh;
//     padding-inline: 3.125rem;
//   }
//   .row_container {
//     width: 100%;
//     border-radius: 1.875rem;
//     box-shadow: 0 0 0.25rem rgba(0, 0, 0, 0.299);
//   }
//   .payment_side {
//     background-color: #ff979d;
//     padding: 0.625rem;
//     border-radius: 1.875rem;
//   }
//   .pc_en {
//     border-radius: 1.875rem 0 0 1.875rem;
//   }
//   .pc_ar {
//     border-radius: 0 1.875rem 1.875rem 0;
//   }
//   .payment_container {
//     box-shadow: 0 0.0625rem 0.1875rem rgba(0, 0, 0, 0.245);
//     padding: 3.125rem;
//     width: 31.25rem;
//     border-radius: 0.9375rem;
//     background-color: white;
//   }
  
//   .payment_img {
//     width: 31.25rem;
//   }
  
//   @media screen and (max-width: 768px) {
//     .payment_img {
//       display: none;
//     }
//     .container{
//       padding: 0;
//     }
//     .row_container {
//       box-shadow: none;
//     }
//     .payment_side {
//       background-color: transparent;
//       padding:0;
//       border-radius: none;
//     }
//   }
//   @media screen and (max-width: 500px) {
//     .payment_img {
//       display: none;
//     }
//     .payment_container {
//       width: 100%;
//     }
//   }
  


  // const notifyConfirm = (message) =>
  //   toast(message, {
  //     autoClose: false,
  //     position: "top-right",
  //     style: {
  //       backgroundColor: "rgb(240, 243, 247)",
  //       color: "black",
  //       boxShadow: "0px 0px 8px rgba(0, 0, 0, 0.5)",
  //     },
  //   });

 // const Msg = ({ closeToast, toastProps }) => (
        //   <div>
        //     <span>{key("openPageNewTab")}</span>
        //     <div
        //       style={{
        //         marginTop: "20px",
        //       }}
        //     >
        //       <div style={{ textAlign: "center" }}>
        //         <a
        //           href={`${paymentUrl}`}
        //           target="_blank"
        //           rel="noreferrer"
        //           onClick={() => {
        //             closeToast();
        //           }}
        //           style={{
        //             borderRadius: "0.9375rem",
        //             padding: "0.625rem 0.9375rem",
        //             backgroundColor: "#b62026",
        //             color: "#FFF",
        //             textAlign: "center",
        //           }}
        //           className="text-white"
        //         >
        //           {key("confirm")}
        //         </a>
        //       </div>
        //     </div>
        //   </div>
        // );
        // notifyConfirm(<Msg />);