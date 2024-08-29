import React, { useEffect } from "react";
import styles from "./Login.module.css";
import loginImg from "../../../Images/loginImg.png";
import LoginForm from "./LoginForm";
import AOS from "aos";
import { useTranslation } from "react-i18next";

const Login = () => {

  const {t:key } = useTranslation();

    useEffect(() => {
        AOS.init();
      }, []);
      
      useEffect(()=>{
        window.scrollTo(0,0)
      },[])

  return (
    <div className={styles.user_login_container}>
    <div className={styles.layer}></div>
    <div
      className={styles.user_login_content}
      data-aos="zoom-in-up"
      data-aos-duration="800"
    >
      <div className={styles.user_login_caption}>
        <h3>{key("loginTitle")}</h3>
        <div className={styles.caption_vector}>
          <img src={loginImg} alt="login Img" />
        </div>
      </div>
      <div className={styles.user_login_form}>
        <h3>{key("login")}</h3>
        <LoginForm />
      </div>
    </div>
  </div>    
  )
}

export default Login
