import React, { useEffect } from "react";
import HomeHeader from "../../Components/Header/HomeHeader";
import Row from "react-bootstrap/Row";
import Container from "react-bootstrap/Container";
import Col from "react-bootstrap/Col";
import styles from "./Home.module.css";
import AOS from "aos";
import giftCard from "../../Images/home1.webp";
import giftCardBack from "../../Images/back.png";
import customGiftCard from "../../Images/home2.webp";
import customGiftBack from "../../Images/home2-back.png";
import TopStores from "../../Components/TopStores/TopStores";
import HomeSections from "../../Components/Ui/HomeSections";
import { useTranslation } from "react-i18next";

const Home = () => {
  const { t: key } = useTranslation();

  useEffect(() => {
    AOS.init();
  }, []);

  return (
    <>
      <HomeHeader />

      <section className={styles.top_stores}>
        <TopStores />
      </section>

      <section id="firstSec" className="my-5 py-5">
        <h2
          data-aos="zoom-in-up"
          data-aos-duration="900"
          className="text-center mt-4"
        >
          {key("sec1Title")}
        </h2>
        <Container fluid>
          <Row>
            <Col
              md={6}
              className="d-flex justify-content-center align-items-center my-5"
              data-aos="zoom-in-up"
              data-aos-duration="900"
            >
              <div>
                <div className={styles.sec1_gift_card}>
                  <img className={`${styles.front_img}`} src={giftCard} alt="giftCard" />
                  <div className={styles.sec1_layer}>
                    <img className={`${styles.back_img}`} src={giftCardBack} alt="giftCardBack" />
                  </div>
                </div>
                <div className="text-center mt-4">
                  <h3>{key("giftCards")}</h3>
                  <span className="mini_word">{key("giftCardsCaption")}</span>
                </div>
              </div>
            </Col>
            <Col
              md={6}
              className="d-flex justify-content-center align-items-center my-5"
              data-aos="zoom-in-up"
              data-aos-duration="900"
            >
              <div>
                <div className={styles.sec1_custom_gift_card}>
                  <img
                    className="w-100"
                    src={customGiftCard}
                    alt="customGiftCard"
                  />
                  <div className={styles.sec1_layer}>
                   <img className={`${styles.back_img}`} src={customGiftBack} alt="customGiftBack" />
                  </div>
                </div>
                <div className="text-center mt-4">
                  <h3>{key("customCards")}</h3>
                  <span className="mini_word">{key("customCardsCaption")}</span>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      <HomeSections />
    </>
  );
};

export default Home;
