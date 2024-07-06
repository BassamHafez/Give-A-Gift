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
} from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import logo from "../../Images/LogoNav.jpg";

const ResponsiveSideBar = ({ onClose, show }) => {

  return (
    <Offcanvas
      show={show}
      onHide={onClose}
      placement="end"
      className={styles.side_bar}
    >
      <Offcanvas.Header className={styles.header} closeButton>
        <Offcanvas.Title>
          <img src={logo} className={styles.logo} alt="mykid logo" />
        </Offcanvas.Title>
      </Offcanvas.Header>

      <Offcanvas.Body>
        <ul className={styles.contact_list}>
          <Link onClick={onClose} to={"/"} end="true">
            <li className={styles.contact_list_item}>
              Home{" "}
              <FontAwesomeIcon icon={faHome} className={styles.list_icons} />
            </li>
          </Link>
          <Link onClick={onClose} to={"companies"} end="true">
            <li className={styles.contact_list_item}>
              About{" "}
              <FontAwesomeIcon
                icon={faCircleInfo}
                className={styles.list_icons}
              />
            </li>
          </Link>
          <Link onClick={onClose} to={"contact"} end="true">
            <li className={styles.contact_list_item}>
              Stores
              <FontAwesomeIcon
                icon={faStore}
                className={styles.list_icons}
              />
            </li>
          </Link>
          <Link onClick={onClose} to={"contact"} end="true">
            <li className={styles.contact_list_item}>
              Buy A Card
              <FontAwesomeIcon
                icon={faLayerGroup}
                className={styles.list_icons}
              />
            </li>
          </Link>
          <Link onClick={onClose} to={"contact"} end="true">
            <li className={styles.contact_list_item}>
              Create A Card
              <FontAwesomeIcon
                icon={faPenToSquare}
                className={styles.list_icons}
              />
            </li>
          </Link>
        </ul>

        <div
          className={`${styles.side_bar_signing_btns} my-5 d-flex align-items-center justify-content-evenly`}
        >
          <Link to={"login"} onClick={onClose} className="mx-2">
            <MainButton text="Login" />
          </Link>
          <Link to={"/"} onClick={onClose} className="mx-2">
            <MainButton type="white" text="Register" />
          </Link>
        </div>
      </Offcanvas.Body>
    </Offcanvas>
  );
};

export default ResponsiveSideBar;
