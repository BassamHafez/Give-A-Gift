import React from "react";
import styles from "./AboutFooter.module.css";
import Col from "react-bootstrap/esm/Col";
import Row from "react-bootstrap/esm/Row";
import { Link } from "react-router-dom";
import footerLogo from "../../Images/logo.png";
import mada from "../../Images/mada.png";
import masterCard from "../../Images/masterCard.png";
import visa from "../../Images/visa.png";
import applePay from "../../Images/applePay.png";
import { useTranslation } from "react-i18next";

const AboutFooter = () => {
  const { t: key } = useTranslation();
  let isArLang = localStorage.getItem("i18nextLng") === "ar";

  return (
    <div className={styles.footer}>
      <div className="container">
        <Row>
          <Col md={4}>
            <div className={styles.footer_logo}>
              <img src={footerLogo} alt="footerLogo" width="100%" />
            </div>
            <div>
              <p>
                {key("giftCardsCaption")}{" "}
                <Link to={"/special-cards"} className={`${styles.footer_link} text-primary`}>
                  {key("here")}
                </Link>
              </p>
            </div>
            <div>
              <p>
                {key("takeLook")}{" "}
                <span>
                  <Link to={"/our-policy"} className={`${styles.footer_link} text-primary`}>
                    {key("sec2Title")}
                  </Link>
                </span>
              </p>
            </div>
          </Col>
          <Col md={4}>
          <div className={styles.footer_head}>
              <h4>Links</h4>
            </div>
            <div className={styles.links_Box}>
              <div>
                <Link to={"/"} className={styles.footer_link}>
                  {key("homePageTitle")}
                </Link>
                <Link to={"/stores"} className={styles.footer_link}>
                  {key("storesPageTitle")}
                </Link>
                <Link to={"/custom-cards"} className={styles.footer_link}>
                  {key("createCardPageTitle")}
                </Link>
                <Link to={"/special-cards"} className={styles.footer_link}>
                  {key("buyCardNavTitle")}
                </Link>
              </div>
              <div className={isArLang?"me-5":"ms-5"}>
                <Link to={"/our-policy"} className={styles.footer_link}>
                  {key("returnPolicy")}
                </Link>
                <Link to={"/joinUs"} className={styles.footer_link}>
                  {key("joinUs")}
                </Link>
                <Link to={"/help"} className={styles.footer_link}>
                  {key("help")}
                </Link>
              </div>
            </div>
          </Col>
          <Col
            md={4}
            className="d-flex justify-content-center align-items-center flex-column"
          >
            <div className={styles.footer_payment}>
              <div className={styles.icon_div}>
                <img src={mada} alt="mada" />
                <img src={masterCard} alt="masterCard" />
                <img src={visa} alt="visa" />
                <img src={applePay} alt="applePay" />
              </div>
            </div>
            <div>
              <p> © 2024 {key("copyRights")} </p>
            </div>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default AboutFooter;
