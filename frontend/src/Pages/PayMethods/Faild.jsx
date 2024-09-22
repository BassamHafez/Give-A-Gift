import React from 'react'
import supportImg from "../../Images/support.jpg";
import { useTranslation } from 'react-i18next';
import styles from "./Payment.module.css";

const Faild = () => {

    const {t:key}=useTranslation();


  return (
    <div className={styles.success_body}>
      <div className={styles.success_img}>
        <img src={supportImg} alt="payment faild"/>
      </div>
      <span className='fs-5 text-center'>{key("faildMsg")}</span>
    </div>
  )
}

export default Faild
