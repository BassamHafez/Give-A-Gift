import React from "react";
import support from "../../Images/support.jpg";
import styles from "./Help.module.css";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

const Help = () => {

const {t:key}=useTranslation();

  return (
    <div className={styles.help_body}>
      <div className={styles.support_img}>
        <img className="w-100" src={support} alt="support" />
      </div>
      <div className=" mt-4">
        <span className={styles.message}>
          {key("supportMsg1")}{" "}
          <Link
            target="_blank"
            to={`https://wa.me/966557299119`}
            rel="noopener noreferrer"
            className="text-primary"
          >
            {key("here")}
          </Link>,
          <br/>{key("supportMsg2")}{" "}
          <Link
            target="_blank"
            to={"https://www.instagram.com/giveagiftsa?igsh=ZzY3bXhneDZ5MDNt"}
            className="text-primary"
          >
            {key("here")}
          </Link>{" "}
          {key("supportMsg3")}
        </span>
      </div>
      
    </div>
  );
};

export default Help;
