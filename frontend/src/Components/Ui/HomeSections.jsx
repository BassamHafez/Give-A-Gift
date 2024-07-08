import React from "react";
import styles from "./HomeSections.module.css";
import Row from "react-bootstrap/esm/Row";
import Col from "react-bootstrap/esm/Col";
import cardWithDetails from "../../Images/cardWithDetails.jpg";
import MainButtonTwo from "./MainButtonTwo";
import { useTranslation } from "react-i18next";

const HomeSections = () => {
  const {t:key} = useTranslation();

  return (
    <>
      <section className="my-5 py-5">
        <Row className="mt-5">
          <Col
            md={6}
            className="d-flex justify-content-center align-items-center"
            data-aos="zoom-in-up"
            data-aos-duration="900"
          >
            <div className={`${styles.sec3_caption} px-4`}>
              <h2 className="text-center">{key("sec2Title")}</h2>
              <p>{key("sec2Caption")}</p>
            </div>
          </Col>

          <Col
            md={6}
            className="d-flex justify-content-center align-items-center"
            data-aos="zoom-in-up"
            data-aos-duration="900"
          >
            <div>
              <div
                className={`${styles.sec1_custom_gift_card} ${styles.sec2_quality_img}`}
              >
                <img
                  className="w-100"
                  src={cardWithDetails}
                  alt="cardWithDetails"
                />
              </div>
            </div>
          </Col>
        </Row>
      </section>

      <section className="py-5 my-5">
        <div className={styles.caption}>
          <div
            className="text-center px-5"
            data-aos="zoom-in-up"
            data-aos-duration="900"
          >
            <h2 className="text-center">{`${key("sec3Title")}`}</h2>
            <p>{`${key("sec3Caption")}`}</p>
          </div>
          <div
            className="text-center"
            data-aos="zoom-in-up"
            data-aos-duration="900"
          >
            <MainButtonTwo text={`${key("getCardBtn")}`} />
          </div>
        </div>
      </section>
    </>
  );
};

export default HomeSections;
