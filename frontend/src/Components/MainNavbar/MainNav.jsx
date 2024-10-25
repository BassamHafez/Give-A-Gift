import React, { useEffect, useState } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import MainButton from "../Ui/MainButton";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faOpencart } from "@fortawesome/free-brands-svg-icons";
import ResponsiveMenuSlideBar from "../ResponsiveSideBar/ResponsiveSideBar";
import nav_logo from "../../Images/logo.png";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import Cart from "../Cart/Cart";
import styles from "./MainNav.module.css";
import noAvatar from "../../Images/default.png";
import LogoutModal from "../Ui/LogoutModal";
import CartIcon from "../Ui/CartIcon";
import { faWallet } from "@fortawesome/free-solid-svg-icons";

const MainNav = () => {
  const [openResMenu, setOpenResMenu] = useState(false);
  const [addNavClass, setAddNavClass] = useState(false);
  const [logoutModalShow, setLogoutModalShow] = useState(false);
  const [showCart, setShowCart] = useState(false);

  const [key, control] = useTranslation();
  let isArLang = localStorage.getItem("i18nextLng") === "ar";
  const profileData = useSelector((state) => state.profileInfo.data);
  const isLogin = useSelector((state) => state.userInfo.isLogin);
  const role = useSelector((state) => state.userInfo.role);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setAddNavClass(true);
      } else {
        setAddNavClass(false);
      }
    };
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <>
      <nav
        className={`${
          styles.main_nav
        } d-flex align-items-center justify-content-center ${
          isArLang ? "pe-5 ps-3" : "ps-5 pe-3"
        } ${location.pathname === "/" ? "fixed-top" : "sticky-top"}  ${
          (addNavClass || location.pathname !== "/") && styles.new_nav
        } ${location.pathname !== "/" && styles.new_pages_nav}`}
      >
        <div
          onClick={() => navigate("/")}
          className={`${role === "user" ? styles.brand : styles.admin_brand}`}
        >
          <img src={nav_logo} alt="logo" className="w-100" />
        </div>
        {role !== "admin" && role !== "merchant" && (
          <ul
            className={`${styles.nav_list} d-flex align-items-center mt-3 ${
              isArLang ? "me-3" : "ms-3"
            } w-75 justify-content-center`}
          >
            <>
              <li className={`${styles.special_hidden} mx-3`}>
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
              <li className={`${styles.special_hidden} mx-3`}>
                <NavLink
                  className={({ isActive }) =>
                    isActive ? styles.active : undefined
                  }
                  to={"about"}
                >
                  {key("aboutPageTitle")}
                </NavLink>
              </li>
              <li className={`${styles.special_hidden} mx-3`}>
                <NavLink
                  className={({ isActive }) =>
                    isLogin ? (isActive ? styles.active : undefined) : undefined
                  }
                  to={"special-cards"}
                >
                  {key("buyCardNavTitle")}
                </NavLink>
              </li>
              <li className={`${styles.special_hidden} mx-3`}>
                <NavLink
                  className={({ isActive }) =>
                    isLogin ? (isActive ? styles.active : undefined) : undefined
                  }
                  to={"custom-cards"}
                >
                  {key("createCardPageTitle")}
                </NavLink>
              </li>
              <li className={`${styles.special_hidden} mx-3`}>
                <NavLink
                  className={({ isActive }) =>
                    isActive ? styles.active : undefined
                  }
                  to={"stores"}
                >
                  {key("storesPageTitle")}
                </NavLink>
              </li>
              {isArLang ? (
                <li
                  onClick={() => control.changeLanguage("en")}
                  className={`${styles.special_hidden} ${styles.lang_item} mx-3`}
                >
                  English
                </li>
              ) : (
                <li
                  onClick={() => control.changeLanguage("ar")}
                  className={`${styles.special_hidden} ${styles.lang_item} mx-3`}
                >
                  العربية
                </li>
              )}
            </>
          </ul>
        )}
        <div
          className={`d-flex align-items-center ${
            isArLang ? "me-auto ms-2" : "ms-auto me-2"
          } ${styles.controller_div}`}
        >
          <div
            className={`${styles.nav_controllers} ${
              isArLang
                ? styles.nav_controller_small_ar
                : styles.nav_controller_small_en
            } ${role !== "user" && "d-none"}`}
          >
            {role !== "admin" && role !== "merchant" && (
              <>
                <div
                  onClick={() => navigate("/")}
                  className={`${
                    role !== "admin" && role !== "merchant"
                      ? styles.smallBrand
                      : styles.admin_brand
                  }`}
                >
                  <img src={nav_logo} alt="logo" className="w-100" />
                </div>
                <div
                  className="position-relative mx-3"
                  onClick={() => setShowCart(true)}
                >
                  <FontAwesomeIcon
                    className={styles.cart_icon}
                    icon={faOpencart}
                  />{" "}
                  <CartIcon />
                </div>
                {isLogin && (
                  <div
                    className={`${styles.wallet_icon} position-relative mx-2`}
                    onClick={() => navigate(`/wallet/${profileData._id}`)}
                  >
                    <FontAwesomeIcon
                      className={styles.cart_icon}
                      icon={faWallet}
                    />
                  </div>
                )}
                <div
                  onClick={() => setOpenResMenu(true)}
                  className={`${styles.burger_list} ${styles.list} justify-content-between flex-column mx-3`}
                >
                  <span className={styles.half_line}></span>
                  <span className={styles.full_line}></span>
                  <span className={`${styles.half_line} ms-auto`}></span>
                </div>
              </>
            )}
          </div>
          <>
            {role !== "admin" && role !== "merchant" ? (
              isLogin ? (
                <Link
                  to={`profile/${profileData?._id}`}
                  className={`${styles.profile_img_link} mx-4`}
                >
                  <div className={styles.profile_img}>
                    <img
                      src={
                        profileData
                          ? profileData.photo
                            ? `${process.env.REACT_APP_Host}users/${profileData?.photo}`
                            : noAvatar
                          : noAvatar
                      }
                      alt={`${profileData?.name}_ptofile_photo`}
                    />
                  </div>
                </Link>
              ) : (
                <>
                  <Link
                    to={"login"}
                    className={`${styles.sign_btn} ${isArLang?"ms-5":"me-5"}`}
                  >
                    <MainButton text={`${key("login")}`} />
                  </Link>
                </>
              )
            ) : (
              <>
                <ul className="pt-3 px-0">
                  {isArLang ? (
                    <li
                      onClick={() => control.changeLanguage("en")}
                      className={` ${styles.lang_item} mx-3`}
                    >
                      English
                    </li>
                  ) : (
                    <li
                      onClick={() => control.changeLanguage("ar")}
                      className={` ${styles.lang_item} mx-3`}
                    >
                      العربية
                    </li>
                  )}
                </ul>

                <Link
                  to={
                    role === "merchant"
                      ? `merchant/${profileData?._id}`
                      : `admin/${profileData?._id}`
                  }
                  className="mx-4"
                >
                  <div className={styles.profile_img}>
                    <img
                      src={
                        profileData
                          ? profileData.photo
                            ? `${process.env.REACT_APP_Host}users/${profileData?.photo}`
                            : noAvatar
                          : noAvatar
                      }
                      alt={`${profileData?.name}_ptofile_photo`}
                    />
                  </div>
                </Link>
              </>
            )}
          </>
          {!role && (
            <div
              onClick={() => setOpenResMenu(true)}
              className={`${styles.burger_list} ${styles.list} justify-content-between flex-column ${isArLang?"ms-5":"me-5"}`}
            >
              <span className={styles.half_line}></span>
              <span className={styles.full_line}></span>
              <span className={`${styles.half_line} ms-auto`}></span>
            </div>
          )}
        </div>
      </nav>
      {openResMenu && (!role || role === "user") && (
        <ResponsiveMenuSlideBar
          onClose={() => setOpenResMenu(false)}
          show={openResMenu}
        />
      )}
      {showCart && <Cart onClose={() => setShowCart(false)} show={showCart} />}
      {logoutModalShow && (
        <LogoutModal
          show={logoutModalShow}
          onHide={() => setLogoutModalShow(false)}
        />
      )}
    </>
  );
};

export default MainNav;
