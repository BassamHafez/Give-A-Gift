import React, { useEffect, useState } from "react";
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
  faDoorOpen,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import logo from "../../Images/logo.png";
import { useTranslation } from "react-i18next";
import { faOpencart } from "@fortawesome/free-brands-svg-icons";
import { useSelector } from "react-redux";
import LogoutModal from "../Ui/LogoutModal";

const ResponsiveSideBar = ({ onClose, show }) => {
  let isArLang = localStorage.getItem("i18nextLng") === "ar";
  const [key, control] = useTranslation();
  const isLogin = useSelector((state) => state.userInfo.isLogin);
  const [logoutModalShow, setLogoutModalShow] = useState(false);

  const [isSmallScreen, setIsSmallScreen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsSmallScreen(window.innerWidth < 575);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <>
      <Offcanvas
        show={show}
        onHide={onClose}
        placement="end"
        className={styles.side_bar}
      >
        <Offcanvas.Header className={styles.header}>
          <div className="d-flex justify-content-between align-items-center w-100">
            <img src={logo} className={styles.logo} alt="mykid logo" />

            <FontAwesomeIcon
              className={styles.close_icon}
              onClick={onClose}
              icon={faXmark}
            />
          </div>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <ul className={styles.contact_list}>
            <Link onClick={onClose} to={"/"} end="true">
              <li className={styles.contact_list_item}>
                {key("homePageTitle")}{" "}
                <FontAwesomeIcon icon={faHome} className={styles.list_icons} />
              </li>
            </Link>
            <Link onClick={onClose} to={"about"} end="true">
              <li className={styles.contact_list_item}>
                {key("aboutPageTitle")}{" "}
                <FontAwesomeIcon
                  icon={faCircleInfo}
                  className={styles.list_icons}
                />
              </li>
            </Link>
            <Link onClick={onClose} to={"stores"} end="true">
              <li className={styles.contact_list_item}>
                {key("storesPageTitle")}
                <FontAwesomeIcon icon={faStore} className={styles.list_icons} />
              </li>
            </Link>
            <Link onClick={onClose} to={"special-cards"} end="true">
              <li className={styles.contact_list_item}>
                {key("buyCardPageTitle")}
                <FontAwesomeIcon
                  icon={faLayerGroup}
                  className={styles.list_icons}
                />
              </li>
            </Link>
            <Link onClick={onClose} to={"custom-cards"} end="true">
              <li className={styles.contact_list_item}>
                {key("createCardPageTitle")}
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
                >
                  <span>{key("language")}</span>
                </div>

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
              <FontAwesomeIcon className={styles.list_icons} icon={faGlobe} />
            </li>
            <li className={`${styles.contact_list_item} ${styles.lang}`}>
              {key("cart")}
              <FontAwesomeIcon
                className={styles.list_icons}
                icon={faOpencart}
              />
            </li>
            {isSmallScreen && (
              <li
                className={`${styles.contact_list_item} ${styles.lang}`}
                onClick={() => setLogoutModalShow(true)}
              >
                {key("logout")}
                <FontAwesomeIcon
                  className={styles.list_icons}
                  icon={faDoorOpen}
                />
              </li>
            )}
          </ul>

          {!isLogin && (
            <div
              className={`${styles.side_bar_signing_btns} my-5 d-flex align-items-center justify-content-evenly`}
            >
              <Link to={"login"} onClick={onClose} className="mx-2">
                <MainButton text={key("login")} />
              </Link>
              <Link to={"register"} onClick={onClose} className="mx-2">
                <MainButton type="white" text={key("register")} />
              </Link>
            </div>
          )}
        </Offcanvas.Body>
      </Offcanvas>

      {logoutModalShow && isSmallScreen && (
        <LogoutModal
          show={logoutModalShow}
          onHide={() => setLogoutModalShow(false)}
        />
      )}
    </>
  );
};

export default ResponsiveSideBar;
