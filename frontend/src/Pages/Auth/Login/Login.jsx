import React, { useEffect, useState } from "react";
import styles from "./Login.module.css";
import LoginForm from "./LoginForm";
import { useTranslation } from "react-i18next";
import VerifyPhoneNumberModal from "../../../Components/Ui/VerifyPhoneNumberModal";
import { toast } from "react-toastify";

const Login = () => {
  const { t: key } = useTranslation();
  const [modalShow, setModalShow] = useState();

  const notifySuccess = () => toast.success(key("logged"));
  const notifyError = (message) => toast.error(message ? message : key("loggedFaild"));

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <div className={styles.user_login_container}>
        <div className={styles.user_login_content}>
          <div className={styles.user_login_form}>
            <h3>{key("login")}</h3>
            <LoginForm
              notifySuccess={notifySuccess}
              notifyError={notifyError}
            />
          </div>
        </div>
      </div>
      {modalShow && (
        <VerifyPhoneNumberModal
          show={modalShow}
          onHide={() => setModalShow(false)}
        />
      )}
    </>
  );
};

export default Login;
