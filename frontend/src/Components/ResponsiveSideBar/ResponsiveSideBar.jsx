import React from "react";
import styles from "./ResponsiveSideBar.module.css";
import Offcanvas from "react-bootstrap/Offcanvas";
import MainButton from "../Ui/MainButton";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHome,
  faCircleInfo,
  faStore,
  faLayerGroup,
  faPenToSquare,
  faGlobe,
} from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import logo from "../../Images/LogoNav.jpg";
import { useTranslation } from "react-i18next";
import { faOpencart } from "@fortawesome/free-brands-svg-icons";

const ResponsiveSideBar = ({ onClose, show }) => {
  let isArLang = localStorage.getItem("i18nextLng") === "ar";
  const [key, control] = useTranslation();
  return (
    <Offcanvas
      show={show}
      onHide={onClose}
      placement="end"
      className={styles.side_bar}
    >
      <Offcanvas.Header className={styles.header}>
        <Offcanvas.Title>
          <img src={logo} className={styles.logo} alt="mykid logo" />
        </Offcanvas.Title>
      </Offcanvas.Header>

      <Offcanvas.Body>
        <ul className={styles.contact_list}>
          <Link onClick={onClose} to={"/"} end="true">
            <li className={styles.contact_list_item}>
              {key('homePageTitle')}{" "}
              <FontAwesomeIcon icon={faHome} className={styles.list_icons} />
            </li>
          </Link>
          <Link onClick={onClose} to={"companies"} end="true">
            <li className={styles.contact_list_item}>
            {key('aboutPageTitle')}{" "}
              <FontAwesomeIcon
                icon={faCircleInfo}
                className={styles.list_icons}
              />
            </li>
          </Link>
          <Link onClick={onClose} to={"contact"} end="true">
            <li className={styles.contact_list_item}>
            {key('storesPageTitle')}
              <FontAwesomeIcon icon={faStore} className={styles.list_icons} />
            </li>
          </Link>
          <Link onClick={onClose} to={"contact"} end="true">
            <li className={styles.contact_list_item}>
            {key('buyCardPageTitle')}
              <FontAwesomeIcon
                icon={faLayerGroup}
                className={styles.list_icons}
              />
            </li>
          </Link>
          <Link onClick={onClose} to={"contact"} end="true">
            <li className={styles.contact_list_item}>
            {key('createCardPageTitle')}
              <FontAwesomeIcon
                icon={faPenToSquare}
                className={styles.list_icons}
              />
            </li>
          </Link>
          <li className={`${styles.contact_list_item} ${styles.lang}`}>
          <div className="dropdown">
              <div
                className={`${styles.lang}`}
                data-bs-toggle="dropdown"
                aria-expanded="false"
              ><span>{key('language')}</span></div>

              <ul className="dropdown-menu">
                <li
                  onClick={() => control.changeLanguage("ar")}
                  className={`${styles.lang_item} ${
                    isArLang ? styles.active_lang : ""
                  }`}
                >
                  <span className="dropdown-item">Arabic</span>
                </li>
                <li
                  onClick={() => control.changeLanguage("en")}
                  className={`${styles.lang_item} ${
                    !isArLang ? styles.active_lang : ""
                  }`}
                >
                  <span className="dropdown-item">English</span>
                </li>
              </ul>
            </div>  
            <FontAwesomeIcon
                className={styles.list_icons}
                icon={faGlobe}
              />
          </li>
          <li className={`${styles.contact_list_item} ${styles.lang}`}>
            {key("cart")}
            <FontAwesomeIcon className={styles.list_icons} icon={faOpencart} />
          </li>

        </ul>

        <div
          className={`${styles.side_bar_signing_btns} my-5 d-flex align-items-center justify-content-evenly`}
        >
          <Link to={"login"} onClick={onClose} className="mx-2">
            <MainButton text={key("login")} />
          </Link>
          <Link to={"/"} onClick={onClose} className="mx-2">
            <MainButton type="white" text={key("register")} />
          </Link>
        </div>
      </Offcanvas.Body>
    </Offcanvas>
  );
};

export default ResponsiveSideBar;
