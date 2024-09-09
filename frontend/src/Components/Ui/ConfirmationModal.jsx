import React from "react";
import styles from "./LogoutModal.module.css";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";

const ConfirmationModal = ({ show, onHide, func, message }) => {
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
        <h4>{message}</h4>
      </Modal.Body>
      <Modal.Footer className={styles.modal_footer}>
        <Button
          variant="primary"
          className={styles.close_btn}
          onClick={onHide}
        >
          Cancel
        </Button>
        <Button
          variant="danger"
          className={styles.logout_btn}
          onClick={func}
        >
          Continue
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ConfirmationModal;
