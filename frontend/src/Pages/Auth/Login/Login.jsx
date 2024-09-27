import React, { useEffect, useState } from "react";
import styles from "./Login.module.css";
import LoginForm from "./LoginForm";
import { useTranslation } from "react-i18next";
import toast, { Toaster } from "react-hot-toast";
import VerifyPhoneNumberModal from "../../../Components/Ui/VerifyPhoneNumberModal";

const Login = () => {
  const { t: key } = useTranslation();
  const [modalShow, setModalShow] = useState();
  const notifySuccess = () => toast.success(key("logged"));
  const notifyError = (message) =>
    message ? toast.error(message) : toast.error(key("loggedFaild"));

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
        }}
      />
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
