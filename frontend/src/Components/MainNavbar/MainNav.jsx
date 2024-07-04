import React, { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import MainButton from "../Ui/MainButton";
import styles from "./MainNav.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {faGlobe } from "@fortawesome/free-solid-svg-icons";
import { faOpencart } from "@fortawesome/free-brands-svg-icons";
import ResponsiveMenuSlideBar from "../ResponsiveSideBar/ResponsiveSideBar";
import nav_logo from "../../Images/LogoNav.jpg";

const MainNav = () => {
  const [openResMenu, setOpenResMenu] = useState(false);

  return (
    <>
      <nav
        className={`${styles.main_nav} static-top d-flex align-items-center px-3`}
      >
        <ul className={`${styles.nav_list} d-flex align-items-center mt-3`}>
          <div className={`${styles.brand} me-5`}>
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
                Home
              </NavLink>
            </li>
            <li className={`${styles.special_hidden} mx-4`}>
              <NavLink
                className={({ isActive }) =>
                  isActive ? styles.active : undefined
                }
                to={"about"}
              >
                About
              </NavLink>
            </li>
            <li className={`${styles.special_hidden} mx-4`}>
              <NavLink
                className={({ isActive }) =>
                  isActive ? styles.active : undefined
                }
                to={"contact"}
              >
                Stores
              </NavLink>
            </li>
            <li className={`${styles.special_hidden} mx-4`}>
              <NavLink
                className={({ isActive }) =>
                  isActive ? styles.active : undefined
                }
                to={"contact"}
              >
                Buy A Card
              </NavLink>
            </li>
            <li className={`${styles.special_hidden} mx-4`}>
              <NavLink
                className={({ isActive }) =>
                  isActive ? styles.active : undefined
                }
                to={"contact"}
              >
                Create A Card
              </NavLink>
            </li>
          </>
        </ul>

        <div className="d-flex align-items-center ms-auto me-2">
          <div className="d-flex justify-content-center align-items-center">
            <FontAwesomeIcon className={styles.cart_icon} icon={faOpencart} />
            <FontAwesomeIcon className={styles.cart_icon} icon={faGlobe}/>
          </div>

          <Link to={"login"} className={styles.sign_btn}>
            <MainButton text="Login" />
          </Link>

          <Link to={"company-home"} className={styles.sign_btn}>
            <MainButton type="white" text="Register" />
          </Link>

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
