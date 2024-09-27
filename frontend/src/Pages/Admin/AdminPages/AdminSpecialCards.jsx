import React from "react";
import styles from "./AdminPages.module.css";
import { Toaster } from "react-hot-toast";
import AllCards from "./SpecialCards/AllCards";

const AdminSpecialCards = () => {
  return (
    <div className={styles.main_body}>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
        }}
      />
      <AllCards />
    </div>
  );
};

export default AdminSpecialCards;
