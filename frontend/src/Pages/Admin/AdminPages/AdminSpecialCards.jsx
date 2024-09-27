import React from "react";
import styles from "./AdminPages.module.css";
import AllCards from "./SpecialCards/AllCards";

const AdminSpecialCards = () => {
  return (
    <div className={styles.main_body}>
      <AllCards />
    </div>
  );
};

export default AdminSpecialCards;
