import React from "react";
import styles from "./HomeSections.module.css";
import Row from "react-bootstrap/esm/Row";
import Col from "react-bootstrap/esm/Col";
import cardWithDetails from "../../Images/cardWithDetails.jpg";
import MainButtonTwo from "./MainButtonTwo";

const HomeSections = () => {
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
          <Col
            md={6}
            className="d-flex justify-content-center align-items-center"
            data-aos="zoom-in-up"
            data-aos-duration="900"
          >
            <div className={`${styles.sec3_caption} px-4`}>
              <h2 className="text-center">
                Our Commitment to Quality and Customer Satisfaction
              </h2>
              <p>
                We provide top-quality gift cards and a seamless experience,
                from design selection to timely delivery. Customer satisfaction
                is our priority, and we're here to assist with any inquiries.
                Enjoy personalized service that makes every occasion special.
              </p>
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
            <h2 className="text-center">Our Policy</h2>
            <p>
              We offer a wide range of gift cards that suit all tastes and
              occasions. We also offer the possibility of creating a custom gift
              card with your own design and text.
            </p>
          </div>
          <div
            className="text-center"
            data-aos="zoom-in-up"
            data-aos-duration="900"
          >
            <MainButtonTwo text="Show Cards" />
          </div>
        </div>
      </section>
    </>
  );
};

export default HomeSections;
