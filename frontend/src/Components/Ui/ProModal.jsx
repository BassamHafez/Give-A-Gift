import React from "react";
import Modal from "react-bootstrap/Modal";
import styles from "./ProModal.module.css";

const ProModal = ({ show, onHide, title, msg }) => {
  return (
    <Modal
      size="md"
      show={show}
      onHide={onHide}
      aria-labelledby="proModal"
      className={styles.modal_body}
    >
      <Modal.Header closeButton>
        <Modal.Title className={styles.modal_title} id="proModal">{title}</Modal.Title>
      </Modal.Header>
      <Modal.Body className={styles.modal_content}>{msg}</Modal.Body>
    </Modal>
  );
};

export default ProModal;
