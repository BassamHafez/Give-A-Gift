import React from "react";
import styles from "./Stores.module.css";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";
import shop1 from "../../Images/Stores/shop1.png";
import shop2 from "../../Images/Stores/shop2.png";
import shop3 from "../../Images/Stores/shop3.png";
import shop4 from "../../Images/Stores/shop4.png";
import shop5 from "../../Images/Stores/shop5.png";
import SearchField from "../../Components/Ui/SearchField";
import { useTranslation } from "react-i18next";

const Stores = () => {
  const { t: key } = useTranslation();
  // let isArLang = localStorage.getItem("i18nextLng") === "ar";
  return (
    <>
      <Container className="my-5">
        <h2 className="text-center my-3 mb-5">
          {key("storesTitle")}
        </h2>
        <div className="d-flex justify-content-between my-4">
          <div className={styles.filter_box}>
            <span className={styles.filter}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="25"
                height="25"
                fill="currentColor"
                className="bi bi-filter"
                viewBox="0 0 16 16"
              >
                <path d="M6 10.5a.5.5 0 0 1 .5-.5h3a.5.5 0 0 1 0 1h-3a.5.5 0 0 1-.5-.5m-2-3a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5m-2-3a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5" />
              </svg>{" "}
              Filter{" "}
            </span>
          </div>
          <div className="w-25">
            <SearchField text={key("search")} />
          </div>
        </div>
        <Row className="gy-5">
          <Col
            md={4}
            className="d-flex justify-content-center align-items-center"
          >
            <div className={styles.store_card}>
              <div className={styles.store_item}>
                <div className={styles.store_logo}>
                  <img alt="storeLogo" className="w-100" src={shop1} />
                </div>
                <div>
                  <h5 className="text-center">ELCT</h5>
                </div>
              </div>
            </div>
          </Col>
          <Col
            md={4}
            className="d-flex justify-content-center align-items-center"
          >
            <div className={styles.store_card}>
              <div className={styles.store_item}>
                <div className={styles.store_logo}>
                  <img alt="storeLogo" className="w-100" src={shop2} />
                </div>
                <div>
                  <h5 className="text-center">ELCT</h5>
                </div>
              </div>
            </div>
          </Col>
          <Col
            md={4}
            className="d-flex justify-content-center align-items-center"
          >
            <div className={styles.store_card}>
              <div className={styles.store_item}>
                <div className={styles.store_logo}>
                  <img alt="storeLogo" className="w-100" src={shop3} />
                </div>
                <div>
                  <h5 className="text-center">ELCT</h5>
                </div>
              </div>
            </div>
          </Col>
          <Col
            md={4}
            className="d-flex justify-content-center align-items-center"
          >
            <div className={styles.store_card}>
              <div className={styles.store_item}>
                <div className={styles.store_logo}>
                  <img alt="storeLogo" className="w-100" src={shop4} />
                </div>
                <div>
                  <h5 className="text-center">ELCT</h5>
                </div>
              </div>
            </div>
          </Col>
          <Col
            md={4}
            className="d-flex justify-content-center align-items-center"
          >
            <div className={styles.store_card}>
              <div className={styles.store_item}>
                <div className={styles.store_logo}>
                  <img alt="storeLogo" className="w-100" src={shop5} />
                </div>
                <div>
                  <h5 className="text-center">ELCT</h5>
                </div>
              </div>
            </div>
          </Col>
            <Col
              md={4}
              className="d-flex justify-content-center align-items-center"
            >
              <div className={styles.store_card}>
                <div className={styles.store_item}>
                  <div className={styles.store_logo}>
                    <img alt="storeLogo" className="w-100" src={shop1} />
                  </div>
                  <div>
                    <h5 className="text-center">ELCT</h5>
                  </div>
                </div>
              </div>
            </Col>
        </Row>
      </Container>
    </>
  );
};

export default Stores;
