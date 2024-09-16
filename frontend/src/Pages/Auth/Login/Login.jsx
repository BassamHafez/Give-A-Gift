import React, { useEffect } from "react";
import styles from "./Login.module.css";
import LoginForm from "./LoginForm";
import AOS from "aos";
import { useTranslation } from "react-i18next";
import toast, { Toaster } from "react-hot-toast";

const Login = () => {
  const { t: key } = useTranslation();
  const notifySuccess = () => toast.success(key("logged"));
  const notifyError = (message) =>
    message ? toast.error(message) : toast.error(key("loggedFaild"));
  useEffect(() => {
    AOS.init();
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <Toaster position="top-right" />
      <div className={styles.user_login_container}>
        <div
          className={styles.user_login_content}
          data-aos="zoom-in-up"
          data-aos-duration="800"
        >
          <div className={styles.user_login_form}>
            <h3>{key("login")}</h3>
            <LoginForm
              notifySuccess={notifySuccess}
              notifyError={notifyError}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
