import React from "react";
import noDataImg from "../../Images/noData.jpg";
import styles from "./NoData.module.css";

const NoDataPage = ({text}) => {
  return (
    <div className={styles.noData}>
      <img className={styles.noData_img} src={noDataImg} alt="noData_img" />
      {text&&<span>{text}</span>}
    </div>
  );
};

export default NoDataPage;
