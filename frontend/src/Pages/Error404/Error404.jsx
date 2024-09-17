import React from "react";
import styles from "./Error404.module.css";
import notFound from "../../Images/404.jpg";

const Error404 = () => {

  return (
    <div className={styles.not_found_page}>
      <div  className={styles.notFound_img}>
        <img src={notFound} alt="error 404" />
      </div>
    </div>
  );
};

export default Error404;
