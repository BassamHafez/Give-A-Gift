import React, { useEffect } from "react";
import styles from "./Register.module.css";
import RegisterForm from "./RegisterForm";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";

const Register = () => {
  const { t: key } = useTranslation();

  const notifySuccess = (message) => {
    toast.success((t) => (
      <div
        onClick={() => toast.dismiss(t.id)}
      >
        {key("newAcc")}
      </div>
    ));
  };

  const notifyError = (message) => {
    toast.error((t) => (
      <div
        onClick={() => toast.dismiss(t.id)}
      >
        {message?message:key("newAccFaild")}
      </div>
    ));
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <div className={styles.register_container}>
        <div className={styles.register_content}>
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
