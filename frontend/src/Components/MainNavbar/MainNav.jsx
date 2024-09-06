import React, { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import MainButton from "../Ui/MainButton";
import styles from "./MainNav.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGlobe } from "@fortawesome/free-solid-svg-icons";
import { faOpencart } from "@fortawesome/free-brands-svg-icons";
import ResponsiveMenuSlideBar from "../ResponsiveSideBar/ResponsiveSideBar";
import nav_logo from "../../Images/LogoNav.jpg";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import Badge from "react-bootstrap/Badge";

const MainNav = () => {
  const [openResMenu, setOpenResMenu] = useState(false);
  const [key, control] = useTranslation();

  let isArLang = localStorage.getItem("i18nextLng") === "ar";
  const profileData = useSelector((state) => state.userInfo.data);
  const isLogin = useSelector((state) => state.userInfo.isLogin);
  const navigate = useNavigate();

  return (
    <>
      <nav
        className={`${styles.main_nav} static-top d-flex align-items-center px-3`}
      >
        <ul className={`${styles.nav_list} d-flex align-items-center mt-3`}>
          <div
            onClick={() => navigate("/")}
            className={`${styles.brand} ${isArLang ? "ms-5" : "me-5"}`}
          >
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
          <div className={styles.nav_controllers}>
            <div className="position-relative">
              <FontAwesomeIcon className={styles.cart_icon} icon={faOpencart} />{" "}
              <Badge className={styles.cart_badge} bg="danger">
                0
              </Badge>
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
            <Link to={`profile/${profileData._id}`}>
              <div className={styles.profile_img}>
                <img
                  src={`http://127.0.0.1:3001/users/${profileData?.photo}`}
                  alt={`${profileData.name}_ptofile_photo`}
                />
              </div>
            </Link>
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

    </>
  );
};

export default MainNav;
