import React from "react";
import styles from "./HomeHeader.module.css";
import { useTranslation } from "react-i18next";

const HomeHeader = () => {
  const {t:key} = useTranslation();
  let isArLang = localStorage.getItem("i18nextLng") === "ar";

  return (
    <div className={styles.header_container}>
      <div className={styles.header_layer}></div>
      <div className={`${styles.header_text} ${!isArLang&&styles.letter_spacing}`}>
        <h1>{key("sec3Title")}</h1>
        <p >{key("sec3Caption")}</p>
      </div>
      <a href="#firstSec">
          <div className={styles.scroll_down}>
            <div className={styles.small_circle}></div>
          </div>
        </a>
    </div>
  );
};

export default HomeHeader;
