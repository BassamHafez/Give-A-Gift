import React, { useState } from "react";
import Offcanvas from "react-bootstrap/Offcanvas";
import styles from "./ProfileSideBar.module.css";
import { useSelector } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChartPie,
  faCircleInfo,
  faDoorOpen,
  faGears,
} from "@fortawesome/free-solid-svg-icons";
import LoadingOne from "./LoadingOne";
import { useTranslation } from "react-i18next";
import LogoutModal from "./LogoutModal";

const ProfileSideBar = ({ show, setShow }) => {
  const [logoutModalShow, setLogoutModalShow] = useState(false);
  const profileData = useSelector((state) => state.userInfo.data);
  const [key, control] = useTranslation();
  let isArLang = control.language === "ar";


  console.log(profileData)

  return (
    <>
      <Offcanvas
        className={`${styles.canvas_continer} ${
          isArLang && styles.canvas_container_ar
        }`}
        show={show}
        onHide={() => setShow(false)}
        placement={isArLang ? "end" : "start"}
      >
        {profileData ? (
          <>
            <Offcanvas.Header>
              <Offcanvas.Title className={styles.canvas_title}>
                <div className="text-start d-flex flex-column justify-content-center">
                  <h4 className="m-0 fw-bolder">{profileData.name}</h4>
                  <span className="mini_word">{profileData.email}</span>
                </div>
                <div className={styles.profile_img}>
                  <img src={`http://127.0.0.1:3001${profileData.photo}`} alt={`${profileData.name}_ptofile_photo`} />
                </div>
              </Offcanvas.Title>
            </Offcanvas.Header>
            <Offcanvas.Body>
              <ul className={styles.list}>
                <li className={styles.list_item}>
                  {key("dashboard")}{" "}
                  <FontAwesomeIcon
                    className={styles.list_icon}
                    icon={faChartPie}
                  />
                </li>
                <li className={styles.list_item}>
                  {key("setting")}{" "}
                  <FontAwesomeIcon
                    className={styles.list_icon}
                    icon={faGears}
                  />
                </li>
                <li className={styles.list_item}>
                  {key("help")}{" "}
                  <FontAwesomeIcon
                    className={styles.list_icon}
                    icon={faCircleInfo}
                  />
                </li>
                <li
                  onClick={() => setLogoutModalShow(true)}
                  className={styles.list_item}
                >
                  {key("logout")}{" "}
                  <FontAwesomeIcon
                    className={styles.list_icon}
                    icon={faDoorOpen}
                  />
                </li>
              </ul>
            </Offcanvas.Body>
          </>
        ) : (
          <LoadingOne />
        )}
      </Offcanvas>
      {logoutModalShow && (
        <LogoutModal
          show={logoutModalShow}
          onHide={() => setLogoutModalShow(false)}
          onClose={() => setShow(false)}
        />
      )}
    </>
  );
};

export default ProfileSideBar;
