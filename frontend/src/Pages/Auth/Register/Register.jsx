import React, { useEffect } from "react";
import styles from "./Register.module.css";
import RegisterForm from "./RegisterForm";
import toast, { Toaster } from "react-hot-toast";
import AOS from "aos";
import { useTranslation } from "react-i18next";

const Register = () => {
  const { t: key } = useTranslation();

  const notifySuccess = () => toast.success(key("newAcc"));
  const notifyError = (message) =>
    message ? toast.error(message) : toast.error(key("newAccFaild"));
  useEffect(() => {
    AOS.init();
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <Toaster position="top-right" />
      <div className={styles.register_container}>
        <div
          className={styles.register_content}
          data-aos="fade-in"
          data-aos-duration="800"
        >
          <div className={styles.register_form}>
            <h3>{key("register")}</h3>
            <RegisterForm
              notifySuccess={notifySuccess}
              notifyError={notifyError}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default Register;
