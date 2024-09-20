import React, { useEffect } from "react";
import HomeHeader from "../../Components/Header/HomeHeader";
import Row from "react-bootstrap/Row";
import Container from "react-bootstrap/Container";
import Col from "react-bootstrap/Col";
import styles from "./Home.module.css";
import giftCard from "../../Images/home1.webp";
import giftCardBack from "../../Images/back-shape.webp";
import customGiftCard from "../../Images/home2.webp";
import customGiftBack from "../../Images/home2-back.png";
import TopStores from "../../Components/TopStores/TopStores";
import HomeSections from "../../Components/Ui/HomeSections";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

const Home = () => {
  const { t: key } = useTranslation();
  const navigate = useNavigate();
  const role = useSelector((state) => state.userInfo.role);
  const profileData = useSelector((state) => state.profileInfo.data);

  useEffect(() => {
    if (role === "admin") {
      navigate(`/admin/${profileData?._id}`);
    }
  }, [role, navigate, profileData]);

  return (
    <>
      <HomeHeader />

      <section className={styles.top_stores}>
        <TopStores />
      </section>

      <section id="firstSec" className="my-5 py-5">
        <div className="d-flex justify-content-center align-items-center">
          <h2 className={`${styles.sec1_title} mt-4 ms-2`}>
            {key("sec1Title")}
          </h2>
        </div>

        <Container>
          <Row>
            <Col
              xl={6}
              className="d-flex justify-content-center align-items-center my-4"
            >
              <div>
                <div
                  className={styles.sec1_gift_card}
                  onClick={() => navigate("/custom-cards")}
                >
                  <img
                    className={`${styles.front_img}`}
                    src={giftCard}
                    alt="giftCard"
                  />
                  <div className={styles.sec1_layer}>
                    <img
                      className={`${styles.back_img}`}
                      src={giftCardBack}
                      alt="giftCardBack"
                    />
                  </div>
                </div>
                <div className="text-center mt-4">
                  <h3>{key("giftCards")}</h3>
                  <p>{key("giftCardsCaption")}</p>
                </div>
              </div>
            </Col>
            <Col
              xl={6}
              className="d-flex justify-content-center align-items-center my-4"
            >
              <div>
                <div
                  className={styles.sec1_custom_gift_card}
                  onClick={() => navigate("/special-cards")}
                >
                  <img
                    className={`${styles.front_img}`}
                    src={customGiftCard}
                    alt="customGiftCard"
                  />
                  <div className={styles.sec1_layer}>
                    <img
                      className={`${styles.back_img}`}
                      src={customGiftBack}
                      alt="customGiftBack"
                    />
                  </div>
                </div>
                <div className="text-center mt-4">
                  <h3>{key("customCards")}</h3>
                  <p>{key("customCardsCaption")}</p>
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
