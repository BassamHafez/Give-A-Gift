import React from "react";
import styles from "./Policy.module.css";
import { useTranslation } from "react-i18next";

const Policy = () => {
  const { t: key } = useTranslation();

  return (
    <div className={styles.policy_body}>
      <div className={styles.policy_content}>
        <h2>{key("returnPolicy")}</h2>
        <p>{key("retunPolicyContent")}</p>
      </div>
    </div>
  );
};

export default Policy;
