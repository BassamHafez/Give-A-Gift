import React from "react";
import styles from "./MainButton.module.css";

const MainButton = ({ text, onClick, type ,children}) => {
  const classes =
    type === "white" ? styles.MainButton_white : styles.MainButton;

  return (
    <button onClick={onClick} className={classes}>
      <div className={styles.MainButton_layer}></div>
      {text?text:children}
    </button>
  );
};

export default MainButton;
