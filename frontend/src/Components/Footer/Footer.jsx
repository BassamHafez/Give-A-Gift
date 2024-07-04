import React from "react";
import logo from "../../Images/mainLogo.jpg";
import styles from "./Footer.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFacebook,
  faInstagram,
  faWhatsapp,
  faXTwitter,
} from "@fortawesome/free-brands-svg-icons";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.footer_brand}>
        <img className="w-100" src={logo} alt="logo" />
      </div>
      <div className={styles.footer_links}>
        <Link>
          <FontAwesomeIcon icon={faWhatsapp} />
        </Link>
        <Link>
          <FontAwesomeIcon icon={faFacebook} />
        </Link>
        <Link>
          <FontAwesomeIcon icon={faXTwitter} />
        </Link>
        <Link>
          <FontAwesomeIcon icon={faInstagram} />
        </Link>
      </div>
    </footer>
  );
};

export default Footer;
