import React from "react";
import { useDispatch } from "react-redux";
import styles from "./LogoutModal.module.css";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { useNavigate } from "react-router-dom";
import { userActions } from "../../Store/userInfo-slice";
import { saveIsLoginState } from "../../Store/userInfo-actions";
import { useTranslation } from "react-i18next";
import { profileActions } from "../../Store/profileInfo-slice";

const LogoutModal = ({ onHide, show, onClose }) => {
  const { t: key } = useTranslation();
  let isArLang = localStorage.getItem("i18nextLng") === "ar";

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const signOutHandler = () => {
    localStorage.removeItem("userData");
    dispatch(userActions.setRole(""));
    localStorage.removeItem("role");
    localStorage.removeItem("token");
    dispatch(userActions.setIsLogin(false));
    dispatch(saveIsLoginState(false));
    dispatch(profileActions.setProfileInfo(null));
    onHide();
    if (onClose) {
      onClose();
    }
    navigate("/");
  };

  return (
    <Modal
      show={show}
      onHide={onHide}
      size="md"
      aria-labelledby="contained-modal-title-vcenter"
      centered
      className={styles.modal_container}
    >
      <Modal.Body className={`${styles.modal_body} text-center`}>
        <h4>{key("logoutMsg")}</h4>
      </Modal.Body>
      <Modal.Footer className={styles.modal_footer}>
        <Button
          variant="primary"
          className={isArLang ? styles.close_btn_ar : styles.close_btn}
          onClick={onHide}
        >
          {key("cancel")}
        </Button>
        <Button
          variant="danger"
          className={isArLang ? styles.logout_btn_ar : styles.logout_btn}
          onClick={signOutHandler}
        >
          {key("logout")}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default LogoutModal;
