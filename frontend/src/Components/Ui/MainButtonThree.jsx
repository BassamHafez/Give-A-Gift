import React from "react";
import styles from "./MainButton.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowAltCircleRight } from "@fortawesome/free-solid-svg-icons";

const MainButtonThree = ({ text, onClick }) => {
  return (
    <>
      <button onClick={onClick} className={styles.btn_three}>
        {text} <FontAwesomeIcon icon={faArrowAltCircleRight} />
      </button>
    </>
  );
};

export default MainButtonThree;
