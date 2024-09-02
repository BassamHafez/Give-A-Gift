import React, { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import MainButton from "../Ui/MainButton";
import styles from "./MainNav.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGlobe, faUserLarge } from "@fortawesome/free-solid-svg-icons";
import { faOpencart } from "@fortawesome/free-brands-svg-icons";
import ResponsiveMenuSlideBar from "../ResponsiveSideBar/ResponsiveSideBar";
import nav_logo from "../../Images/LogoNav.jpg";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import ProfileSideBar from "../Ui/ProfileSideBar";
import Badge from 'react-bootstrap/Badge';

const MainNav = () => {
  const [openResMenu, setOpenResMenu] = useState(false);
  const [key, control] = useTranslation();
  const [show, setShow] = useState(false);

  let isArLang = localStorage.getItem("i18nextLng")==="ar";

  const isLogin = useSelector((state) => state.userInfo.isLogin);

  return (
    <>
      <nav
        className={`${styles.main_nav} static-top d-flex align-items-center px-3`}
      >
        <ul className={`${styles.nav_list} d-flex align-items-center mt-3`}>
          <div className={`${styles.brand} ${isArLang ? "ms-5" : "me-5"}`}>
            <img src={nav_logo} alt="logo" className="w-100" />
          </div>

          <>
            <li className={`${styles.special_hidden} mx-4`}>
              <NavLink
                className={({ isActive }) =>
                  isActive ? styles.active : undefined
                }
                to={"/"}
                end
              >
                {key("homePageTitle")}
              </NavLink>
            </li>
            <li className={`${styles.special_hidden} mx-4`}>
              <NavLink
                className={({ isActive }) =>
                  isActive ? styles.active : undefined
                }
                to={"about"}
              >
                {key("aboutPageTitle")}
              </NavLink>
            </li>
            <li className={`${styles.special_hidden} mx-4`}>
              <NavLink
                className={({ isActive }) =>
                  isActive ? styles.active : undefined
                }
                to={"stores"}
              >
                {key("storesPageTitle")}
              </NavLink>
            </li>
            <li className={`${styles.special_hidden} mx-4`}>
              <NavLink
                className={({ isActive }) =>
                  isActive ? styles.active : undefined
                }
                to={"special-cards"}
              >
                {key("buyCardPageTitle")}
              </NavLink>
            </li>
            <li className={`${styles.special_hidden} mx-4`}>
              <NavLink
                className={({ isActive }) =>
                  isActive ? styles.active : undefined
                }
                to={"custom-cards"}
              >
                {key("createCardPageTitle")}
              </NavLink>
            </li>
          </>
        </ul>

        <div
          className={`d-flex align-items-center ${
            isArLang ? "me-auto ms-2" : "ms-auto me-2"
          }`}
        >
          <div className="d-flex justify-content-center align-items-center">
            <div className="position-relative">
              <FontAwesomeIcon className={styles.cart_icon} icon={faOpencart} />{" "}
              <Badge className={styles.cart_badge} bg="danger">0</Badge>
            </div>
            <div className="dropdown">
              <FontAwesomeIcon
                className={`${styles.lang_icon} dropdown-toggle`}
                data-bs-toggle="dropdown"
                aria-expanded="false"
                icon={faGlobe}
              />

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
          </div>
          {isLogin ? (
            <div className={styles.profile_icon} onClick={() => setShow(true)}>
              <FontAwesomeIcon
                className={styles.user_icon}
                icon={faUserLarge}
              />
            </div>
          ) : (
            <>
              <Link to={"login"} className={styles.sign_btn}>
                <MainButton text={`${key("login")}`} />
              </Link>

              <Link to={"register"} className={styles.sign_btn}>
                <MainButton type="white" text={`${key("register")}`} />
              </Link>
            </>
          )}

          <div
            onClick={() => setOpenResMenu(true)}
            className={`${styles.burger_list} ${styles.list} justify-content-between flex-column mx-3`}
          >
            <span className={styles.half_line}></span>
            <span className={styles.full_line}></span>
            <span className={`${styles.half_line} ms-auto`}></span>
          </div>
        </div>
      </nav>
      <ResponsiveMenuSlideBar
        onClose={() => setOpenResMenu(false)}
        show={openResMenu}
      />

      <ProfileSideBar show={show} setShow={setShow} />
    </>
  );
};

export default MainNav;
