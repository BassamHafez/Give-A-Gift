import React from "react";
import { Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import styles from "./HomeHeader.module.css";

const HomeHeader = () => {
  const { t } = useTranslation();

  return (
    <header className={styles.header_container}>
      <div
        className={`${styles.layer} position-absolute w-100 h-100`}
        style={{ opacity: 0.5 }}
      ></div>

      <div
        className={`${styles.caption_div} bg-main d-flex flex-column  shadow-lg position-relative`}
      >
        <Typography
          variant="h2"
          component="h1"
          className={`${styles.title} text-center`}
        >
          {t("sec3Title")}
        </Typography>
        <br />
        <Typography
          variant="h5"
          component="p"
          className={`${styles.caption} text-center`}
        >
          {t("sec3Caption")}
        </Typography>
      </div>
    </header>
    
  );
};

export default HomeHeader;
