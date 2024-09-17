import React from "react";
import MainButton from "../../Components/Ui/MainButton";
import mainError from "../../Images/mainError.png";
import { useNavigate } from "react-router-dom";
import styles from "../Error404/Error404.module.css";
import { useTranslation } from "react-i18next";

const MainError = () => {
  const navigate = useNavigate();
  const { t: key } = useTranslation();

  return (
    <div className={styles.main_error}>
      <img src={mainError} alt="404 not found img" />
      <span className="mini_word text-center">{key("mainError")}</span>
      <div className=" mb-5 mt-3 text-center">
        <MainButton
          onClick={() => navigate(-1)}
          className="special_main_color"
          text={key("reloadPage")}
        />
      </div>
    </div>
  );
};

export default MainError;
