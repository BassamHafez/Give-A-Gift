import React from "react";
import styles from "./HomeSections.module.css";
import Container from "react-bootstrap/esm/Container";
import Row from "react-bootstrap/esm/Row";
import Col from "react-bootstrap/esm/Col";
import cardsImage from "../../Images/policy.webp";
import { useTranslation } from "react-i18next";

const HomeSections = () => {
  const { t: key } = useTranslation();
  let isArLang = localStorage.getItem("i18nextLng") === "ar";

  return (
    <>
      <section className="my-5 py-5">
        <Container>
          <Row className={`${isArLang&&"flex-row-reverse"} mt-5`}>
            <Col
              lg={6}
              className="d-flex p-0 justify-content-center align-items-center"
            >
                <div
                  className={`${styles.sec1_custom_gift_card} ${styles.sec2_quality_img}`}
                >
                  <img src={cardsImage} alt="cardsImage" />
                </div>
            </Col>
            <Col
             lg={{ span: 5, offset: 1 }}
              className="d-flex justify-content-center align-items-center"
            >
              <div className={`${styles.sec3_caption}`}>
                <h2>{key("sec2Title")}</h2>
                <p>{key("sec2Caption")}</p>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      <section className="py-5 my-5">
        <div className={styles.caption}>
          <div
            className={`${styles.caption_text} text-center px-5`}
          >
            <h2 className="text-center">{`${key("sec3Title")}`}</h2>
            <p>{`${key("sec3Caption")}`}</p>
          </div>
        </div>
      </section>
    </>
  );
};

export default HomeSections;
