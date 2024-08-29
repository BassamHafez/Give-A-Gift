import React from "react";
import styles from './InputErrorMessage.module.css';
import { useTranslation } from "react-i18next";

const InputErrorMessage = (props) => {
  
  const [t,i118n] = useTranslation();
  let isArLang = i118n.language === "ar";

  return (
    <p
      className={`${styles.error_message} ${isArLang?styles.error_message_ar:styles.error_message_en}`}
    >
      {props.text ? props.text : props.children}
    </p>
  );
};

export default InputErrorMessage;
