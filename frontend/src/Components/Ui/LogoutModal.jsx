import React from 'react'
import { useDispatch } from "react-redux";
import styles from "./LogoutModal.module.css";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { useNavigate } from "react-router-dom";
import { userActions } from "../../Store/userInfo-slice";
import { saveIsLoginState } from "../../Store/userInfo-actions";
import { useTranslation } from 'react-i18next';

const LogoutModal = (props) => {
  const { t: key } = useTranslation();

    const dispatch = useDispatch();
    const navigate = useNavigate();
  
    const signOutHandler = () => {
      localStorage.removeItem("userData");
      dispatch(userActions.setRole(""))
      localStorage.removeItem("role");
      localStorage.removeItem("token");
      dispatch(userActions.setIsLogin(false));
      dispatch(saveIsLoginState(false));
      props.onHide();
      navigate("/");
    };
  

  return (
    <Modal
    {...props}
    size="md"
    aria-labelledby="contained-modal-title-vcenter"
    centered
    className={styles.modal_container}
  >
    <Modal.Body className={`${styles.modal_body} text-center`}>
      <h4>
        {key("logoutMsg")}
      </h4>
    </Modal.Body>
    <Modal.Footer className={styles.modal_footer}>
      <Button
        variant="primary"
        className={styles.close_btn}
        onClick={props.onHide}
      >
        {key("cancel")}
      </Button>
      <Button
        variant="danger"
        className={styles.logout_btn}
        onClick={signOutHandler}
      >
        {key("logout")}
      </Button>
    </Modal.Footer>
  </Modal>
  )
}

export default LogoutModal
