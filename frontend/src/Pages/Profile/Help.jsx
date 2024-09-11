import React from "react";
import support from "../../Images/support.jpg";
import styles from "./Help.module.css";
import { Link } from "react-router-dom";

const Help = () => {
  return (
    <div className={styles.help_body}>
      <div className={styles.support_img}>
        <img className="w-100" src={support} alt="support" />
      </div>
      <div className=" mt-4">
        <span className="mini_word">
          If you need assistance, feel free to contact our support team{" "}
          <Link
            target="_blank"
            to={`https://wa.me/966557299119`}
            rel="noopener noreferrer"
            className="text-primary"
          >
            here
          </Link>,
          <br/>you can visit our Instagram page{" "}
          <Link
            target="_blank"
            to={"https://www.instagram.com/giveagiftsa?igsh=ZzY3bXhneDZ5MDNt"}
            className="text-primary"
          >
            here
          </Link>{" "}
          for more information. We're happy to help
        </span>
      </div>
      
    </div>
  );
};

export default Help;
