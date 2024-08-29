import React, { useEffect } from "react";
import styles from "./Register.module.css";
import RegisterForm from "./RegisterForm";
import register_img from "../../../Images/gift.jpg";

import AOS from "aos";
import { useTranslation } from "react-i18next";
const Register = () => {

  const {t:key } = useTranslation();

    useEffect(() => {
        AOS.init();
      }, []);
      
      useEffect(()=>{
        window.scrollTo(0,0)
      },[])

  return (
    <div className={styles.register_container}>
      <div
        className={styles.register_content}
        data-aos="fade-in"
        data-aos-duration="800"
      >
        <div className={styles.register_form}>
          <h3>{key("register")}</h3>
          <RegisterForm />
        </div>
        <div className={styles.register_caption}>
          <img src={register_img} alt="register vector" />
        </div>
      </div>
    </div>
  )
}

export default Register
