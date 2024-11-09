import React, { useState } from "react";
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
  faDoorOpen,
  faXmark,
  faUser,
  faWallet,
} from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import logo from "../../Images/logo.png";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import LogoutModal from "../Ui/LogoutModal";
import { useMediaQuery } from "react-responsive";

const ResponsiveSideBar = ({ onClose, show }) => {
  let isArLang = localStorage.getItem("i18nextLng") === "ar";
  const [key, control] = useTranslation();
  const isLogin = useSelector((state) => state.userInfo.isLogin);
  const [logoutModalShow, setLogoutModalShow] = useState(false);
  const profileData = useSelector((state) => state.profileInfo.data);

  const isSmallScreen = useMediaQuery({ query: "(max-width: 770px)" });

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
            <Link
              onClick={onClose}
              className={styles.hidden_small}
              to={`profile/${profileData?._id}`}
              end="true"
            >
              {isLogin && (
                <li className={styles.contact_list_item}>
                  {key("profile")}{" "}
                  <FontAwesomeIcon
                    icon={faUser}
                    className={styles.list_icons}
                  />
                </li>
              )}
            </Link>
            {isLogin && (
              <Link
                onClick={onClose}
                className={styles.wallet_icon_hidden}
                to={`wallet/${profileData?._id}`}
                end="true"
              >
                {isLogin && (
                  <li className={styles.contact_list_item}>
                    {key("wallet")}{" "}
                    <FontAwesomeIcon
                      className={styles.list_icons}
                      icon={faWallet}
                    />
                  </li>
                )}
              </Link>
            )}
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
            <Link onClick={onClose} to={"/special-cards"} end="true">
              <li className={styles.contact_list_item}>
                {key("buyCardNavTitle")}
                <FontAwesomeIcon
                  icon={faLayerGroup}
                  className={styles.list_icons}
                />
              </li>
            </Link>
            <Link onClick={onClose} to={"/custom-cards"} end="true">
              <li className={styles.contact_list_item}>
                {key("createCardPageTitle")}
                <FontAwesomeIcon
                  icon={faPenToSquare}
                  className={styles.list_icons}
                />
              </li>
            </Link>
            {isArLang ? (
              <li
                onClick={() => control.changeLanguage("en")}
                className={`${styles.contact_list_item} ${styles.lang}`}
              >
                English
              </li>
            ) : (
              <li
                onClick={() => control.changeLanguage("ar")}
                className={`${styles.contact_list_item} ${styles.lang}`}
              >
                العربية
              </li>
            )}

            {isSmallScreen && isLogin && (
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

          {!isLogin && isSmallScreen && (
            <div
              className={`${styles.side_bar_signing_btns} my-5 d-flex align-items-center justify-content-evenly flex-wrap`}
            >
              <Link to={"login"} onClick={onClose} className="m-2">
                <MainButton text={key("login")} />
              </Link>
              <Link to={"register"} onClick={onClose} className="m-2">
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
          onClose={onClose}
        />
      )}
    </>
  );
};

export default ResponsiveSideBar;
