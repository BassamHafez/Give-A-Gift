import React from "react";
import styles from "./LogoutModal.module.css";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { useTranslation } from "react-i18next";

const ConfirmationModal = ({
  show,
  onHide,
  func,
  message,
  btnMsg,
  smallSize,
}) => {
  const { t: key } = useTranslation();

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
        {smallSize ? <h6>{message}</h6> : <h4>{message}</h4>}
      </Modal.Body>
      <Modal.Footer className={styles.modal_footer}>
        <Button variant="primary" className={styles.close_btn} onClick={onHide}>
          {key("cancel")}
        </Button>
        <Button variant="danger" className={styles.logout_btn} onClick={func}>
          {btnMsg ? btnMsg : key("continue")}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ConfirmationModal;
