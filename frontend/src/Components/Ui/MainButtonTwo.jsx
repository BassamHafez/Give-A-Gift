import React from "react";
import styles from './MainButton.module.css';

const MainButtonTwo = ({text,onClick}) => {
  return (
    <>
      <button onClick={onClick} className={styles.btn_two}>{text}</button>
    </>
  );
};

export default MainButtonTwo;
