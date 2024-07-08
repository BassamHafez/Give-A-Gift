import React from "react";
import styles from './InputErrorMessage.module.css';

const InputErrorMessage = (props) => {
  return (
    <p
      className={styles.error_message}
    >
      {props.text ? props.text : props.children}
    </p>
  );
};

export default InputErrorMessage;
