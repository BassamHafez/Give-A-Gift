import React from "react";
import styles from "./Footer.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faInstagram,
  faWhatsapp,
} from "@fortawesome/free-brands-svg-icons";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.footer_links}>
        <Link
          target="_blank"
          to={`https://wa.me/966557299119`}
          rel="noopener noreferrer"
        >
          <FontAwesomeIcon icon={faWhatsapp} />
        </Link>
        <Link
          target="_blank"
          to={"https://www.instagram.com/giveagiftsa?igsh=ZzY3bXhneDZ5MDNt"}
        >
          <FontAwesomeIcon icon={faInstagram} />
        </Link>
      </div>
    </footer>
  );
};

export default Footer;
