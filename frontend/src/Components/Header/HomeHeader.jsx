import React from "react";
import styles from "./HomeHeader.module.css";
import cardHand from "../../Images/cardHand.png";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import MainButtonTwo from "../Ui/MainButtonTwo";
import { useTranslation } from "react-i18next";

const HomeHeader = () => {

  const {t:key}=useTranslation();

  return (
    <div className={styles.header_container}>
      <div className={styles.header_layer}></div>
      <Row className="h-100">
        <Col md={7} className={styles.caption_side}>
          <div>
            <h1>
              {key("title")}
            </h1>
            <MainButtonTwo text="Get Card"/>
            <a href="#firstSec">
              <div className={styles.scroll_down}>
                <div className={styles.small_circle}></div>
              </div>
            </a>
          </div>
        </Col>
        <Col md={5} className={styles.img_side}>
          <div>
            <img className="w-100" src={cardHand} alt="card Hand" />
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default HomeHeader;
