import { useQuery } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import { getCard } from "../../util/Http";
import Placeholder from "react-bootstrap/Placeholder";
import Card from "react-bootstrap/Card";
import styles from "./ViewCard.module.css";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import confetti from "canvas-confetti";
import KonvaCard from "./KonvaCard";

const ViewCard = () => {
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
      setTimeout(() => {
        setIsFirstVisit(false);
      }, 5000);
    }
  }, [isFirstVisit]);

  // var scalar = 2;
  // var paper = confetti.shapeFromText({ text: "🎉", scalar });
  // var ribbon  = confetti.shapeFromText({ text: "🎊", scalar });
  // var heart = confetti.shapeFromText({ text: "❤️", scalar });
  const triangle = confetti.shapeFromPath({ path: "M0 10 L5 0 L10 10z" });
  // var star = confetti.shapeFromText({ text: "⭐", scalar });

  useEffect(() => {
    if (isFirstVisit) {
      confetti({
        particleCount: 400,
        spread: 200,
        origin: { y: 0.6 },
        shapes: ["circle", triangle, "square"],
      });

      confetti({
        particleCount: 400,
        spread: 200,
        origin: { x: 1, y: 1 },
        shapes: ["circle", triangle, "square"],
      });

      confetti({
        particleCount: 400,
        spread: 200,
        origin: { x: 0, y: 1 },
        shapes: ["circle", triangle, "square"],
      });
    }
  }, [isFirstVisit, triangle]);

  const loadingCard = (
    <Card style={{ width: "18rem" }}>
      <Card.Body>
        <Placeholder as={Card.Title} animation="glow">
          <Placeholder xs={6} />
        </Placeholder>
        <Placeholder as={Card.Text} animation="glow">
          <Placeholder xs={7} /> <Placeholder xs={4} /> <Placeholder xs={4} />{" "}
          <Placeholder xs={6} /> <Placeholder xs={8} />
        </Placeholder>
        <Placeholder.Button variant="danger" xs={6} />
      </Card.Body>
    </Card>
  );

  return (
    <div className="d-flex justify-content-center align-items-center vh-100">
      {!isFetching ? (
        myCard ? (
          <div
            className="d-flex flex-column justify-content-center align-items-center"
            xlg={6}
            key={myCard.data._id}
          >
            <div className={styles.header}>
              <ul className={styles.header_list}>
                <li
                  className={`${styles.header_list_item} ${
                    isFrontShape && styles.active
                  }`}
                  onClick={() => {
                    setIsFirstVisit(false);
                    setIsFrontShape(true);
                  }}
                >
                  {key("previewFront")}
                </li>
                <li
                  className={`${styles.header_list_item} ${
                    !isFrontShape && styles.active
                  }`}
                  onClick={() => {
                    setIsFirstVisit(false);
                    setIsFrontShape(false);
                  }}
                >
                  {key("previewBack")}
                </li>
              </ul>
            </div>
            <div className={styles.card_body}>
              <KonvaCard
                isPaid={myCard.data.isPaid}
                isFrontShape={isFrontShape}
                card={myCard.data}
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
  );
};

export default ViewCard;
