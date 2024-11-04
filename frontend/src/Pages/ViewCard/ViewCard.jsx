import { useQuery } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import { viewCard } from "../../util/Http";
import Placeholder from "react-bootstrap/Placeholder";
import Card from "react-bootstrap/Card";
import styles from "./ViewCard.module.css";
import { useTranslation } from "react-i18next";
import { Link, useParams } from "react-router-dom";
import confetti from "canvas-confetti";
import KonvaCard from "./KonvaCard";
import scan from "../../Images/scan.jpg";
import logo from "../../Images/logo.png";

const shapes = {
  all: ["circle", "triangle", "square"],
  paper: [confetti.shapeFromText({ text: "🎉", scalar: 2 })],
  star: [confetti.shapeFromText({ text: "⭐", scalar: 2 })],
  ribbon: [confetti.shapeFromText({ text: "🎊", scalar: 2 })],
  heart: [confetti.shapeFromText({ text: "❤️", scalar: 2 })],
  triangle: [confetti.shapeFromPath({ path: "M0 10 L5 0 L10 10z" })],
  circle: ["circle"],
  square: ["square"],
};

const triggerConfetti = (shape) => {
  const origins = [{ y: 0.6 }, { x: 1, y: 1 }, { x: 0, y: 1 }];

  origins.forEach((origin) => {
    confetti({
      particleCount: 400,
      spread: 200,
      origin,
      shapes: shapes[shape] || [],
    });
  });
};

const ViewCard = () => {
  const { cardId } = useParams();
  const [isFirstVisit, setIsFirstVisit] = useState(true);
  const [isFrontShape, setIsFrontShape] = useState("front");
  const { t: key } = useTranslation();
  let isArLang = localStorage.getItem("i18nextLng") === "ar";

  const { data: myCard, isFetching } = useQuery({
    queryKey: ["viewCard", cardId],
    queryFn: () => viewCard(cardId),
    staleTime: Infinity,
  });

  useEffect(() => {
    if (isFirstVisit) {
      const timer = setTimeout(() => {
        setIsFirstVisit(false);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [isFirstVisit]);

  useEffect(() => {
    if (myCard?.data?.celebrateIcon && isFirstVisit) {
      triggerConfetti(myCard.data?.celebrateIcon);
    }
  }, [myCard, isFirstVisit]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const loadingCard = (
    <Card style={{ width: "18rem" }}>
      <Card.Body>
        <Placeholder as={Card.Title} animation="glow">
          <Placeholder xs={6} />
        </Placeholder>
        <Placeholder as={Card.Text} animation="glow">
          <Placeholder xs={7} /> <Placeholder xs={4} /> <Placeholder xs={4} />
          <Placeholder xs={6} /> <Placeholder xs={8} />
        </Placeholder>
        <Placeholder.Button variant="danger" xs={6} />
      </Card.Body>
    </Card>
  );

  return (
    <>
      <div className={`${styles.card_container}`}>
        {!isFetching ? (
          myCard ? (
            <div
              className={`d-flex flex-column align-items-center ${styles.card_content}`}
              xlg={6}
              key={myCard.data._id}
            >
              <h3 className="text-center my-4">{key("viewMyCard")}</h3>
              <div
                className={styles.header}
                dir={`${isArLang ? "ltr" : "ltr"}`}
              >
                <ul className={styles.header_list}>
                  <li
                    className={`${styles.header_list_item} ${
                      isFrontShape === "usage" && styles.active
                    }`}
                    onClick={() => {
                      setIsFirstVisit(false);
                      setIsFrontShape("usage");
                    }}
                  >
                    {key("howToUse")}
                  </li>
                  <li
                    className={`${styles.header_list_item} ${
                      isFrontShape === "back" && styles.active
                    }`}
                    onClick={() => {
                      setIsFirstVisit(false);
                      setIsFrontShape("back");
                    }}
                  >
                    {key("previewBack")}
                  </li>
                  <li
                    className={`${styles.header_list_item} ${
                      isFrontShape === "front" && styles.active
                    }`}
                    onClick={() => {
                      setIsFirstVisit(false);
                      setIsFrontShape("front");
                    }}
                  >
                    {key("previewFront")}
                  </li>
                </ul>
              </div>
              {isFrontShape === "usage" ? (
                <div className={styles.steps_div}>
                  
                  <div className="d-flex justify-content-center  align-items-center mb-3">
                    <div className={styles.main_title_div}>
                      <img className={styles.logo} src={logo} alt="logo" />
                      <h2>{key("followSteps")}</h2>
                      <img className={styles.logo} src={logo} alt="logo" />
                    </div>
                  </div>

                  {myCard.data?.discountCode?.qrCode ? (
                    <>
                      <ul>
                        <li>
                          {key("qrUsageStep1")} "{myCard.data?.shop?.name}"
                        </li>
                        <li>{key("qrUsageStep2")}</li>
                        <li>{key("qrUsageStep3")}</li>
                        <li>{key("qrUsageStep4")}</li>
                      </ul>
                      <div className={styles.scan_img}>
                        <img className="w-100" src={scan} alt="scan the code" />
                      </div>
                    </>
                  ) : (
                    <ul>
                      <li>
                        {key("promoCodeUsageStep1")}{" "}
                        <Link
                          className="text-primary fw-bold"
                          target="_blank"
                          to={myCard.data?.shop?.link}
                        >
                          {key("here")}
                        </Link>
                      </li>
                      <li>{key("promoCodeUsageStep2")}</li>
                      <li>{key("promoCodeUsageStep3")}</li>
                      <li>{key("promoCodeUsageStep4")}</li>
                    </ul>
                  )}
                </div>
              ) : (
                <div className={styles.card_body}>
                  <KonvaCard
                    isPaid={myCard?.data?.isPaid}
                    isFrontShape={isFrontShape}
                    card={myCard?.data}
                  />
                </div>
              )}
            </div>
          ) : (
            loadingCard
          )
        ) : (
          loadingCard
        )}
      </div>
    </>
  );
};

export default ViewCard;
