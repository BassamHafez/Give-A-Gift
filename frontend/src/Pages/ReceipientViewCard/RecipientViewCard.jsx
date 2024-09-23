import React, { useEffect, useState } from "react";
import styles from "./RecipientViewCard.module.css";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import confetti from "canvas-confetti";
import Placeholder from "react-bootstrap/Placeholder";
import Card from "react-bootstrap/Card";
import { useQuery } from "@tanstack/react-query";
import RecipientKonva from "./RecipientKonva";
import { getCard } from "../../util/Http";

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
    const origins = [
      { y: 0.6 },
      { x: 1, y: 1 },
      { x: 0, y: 1 },
    ];
    
    origins.forEach(origin => {
      confetti({
        particleCount: 400,
        spread: 200,
        origin,
        shapes: shapes[shape] || [],
      });
    });
  };

const RecipientViewCard = () => {

    const token = JSON.parse(localStorage.getItem("token"));
    const { cardId } = useParams();
    const [isFirstVisit, setIsFirstVisit] = useState(true);
    const [isFrontShape, setIsFrontShape] = useState(false);
    const { t: key } = useTranslation();
  
    const { data: myCard, isFetching } = useQuery({
      queryKey: ["viewCard", token, cardId],
      queryFn: () => getCard(token, cardId),
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
        console.log(myCard.data?.celebrateIcon)
        triggerConfetti(myCard.data?.celebrateIcon);
      }
    }, [myCard, isFirstVisit]);
  
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
    <div className={`${styles.card_container}`}>
    {!isFetching ? (
      myCard ? (
        <div className="d-flex flex-column justify-content-center align-items-center" xlg={6} key={myCard.data._id}>
          <div className={styles.header}>
            <ul className={styles.header_list}>
              <li
                className={`${styles.header_list_item} ${isFrontShape && styles.active}`}
                onClick={() => { setIsFirstVisit(false); setIsFrontShape(true); }}
              >
                {key("previewFront")}
              </li>
              <li
                className={`${styles.header_list_item} ${!isFrontShape && styles.active}`}
                onClick={() => { setIsFirstVisit(false); setIsFrontShape(false); }}
              >
                {key("previewBack")}
              </li>
            </ul>
          </div>
          <div className={styles.card_body}>
            <RecipientKonva
              isPaid={myCard?.data.isPaid}
              isFrontShape={isFrontShape}
              card={myCard?.data}
            />
          </div>
        </div>
      ) : (
        loadingCard
      )
    ) : (
      loadingCard
    )}
  </div>
  )
}

export default RecipientViewCard
