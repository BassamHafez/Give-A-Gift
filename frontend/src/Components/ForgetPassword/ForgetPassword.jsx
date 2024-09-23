import React, { useState } from "react";
import styles from "./ForgetPassword.module.css";
import { useMutation } from "@tanstack/react-query";
import { ErrorMessage, Form, Formik, Field } from "formik";
import { object, string } from "yup";
import InputErrorMessage from "../../Components/Ui/InputErrorMessage";
import {signFormsHandler} from "../../util/Http";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faYinYang } from "@fortawesome/free-solid-svg-icons";
import lock from "../../Images/lock.webp";
import { Link } from "react-router-dom";
import VerificationCode from "./VerificationCode";
import toast, { Toaster } from "react-hot-toast";
import { useTranslation } from "react-i18next";

const notifySuccess = (message) => toast.success(message);
const notifyError = (message) => toast.error(message);

const ForgetPassword = () => {
  const [isRightEmail, setIsRightEmail] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const {t:key}=useTranslation();

  const { mutate, isPending } = useMutation({
    mutationFn: signFormsHandler,
    onSuccess: (data) => {
      if (data.data.status === "Success") {
        setIsRightEmail(false);
        notifySuccess(key("checkResetPass"));
        setShowModal(true);
      } else {
        notifyError(key("faildResetPass"));
      }
    },
    onError: (error) => {
      if (error.data.message === "account with this email not found") {
        setIsRightEmail(true);
      } else {
        setIsRightEmail(false);
        notifyError(key("faildResetPass"));
      }
    },
  });

  const initialValues = {
    email: "",
  };

  const onSubmit = (values) => {
    mutate({
      formData: values,
      type: "forgotPassword",
    });
  };

  const validationSchema = object({
    email: string().email(key("emailValidation1")).required(key("emailValidation2")),
  });

  return (
    <>
      <Toaster position="top-right" />
      <div className={styles.general_info_form}>
        <Formik
          initialValues={initialValues}
          onSubmit={onSubmit}
          validationSchema={validationSchema}
        >
          <Form className={styles.form}>
            <div className={styles.form_header}>
              <div className={styles.lock_img}>
                <img src={lock} alt="lock" />
              </div>
              <h3>{key("forgetTitle")}</h3>
              <span className="mini_word">
                {key("enterEmailToSendCode")}
              </span>
            </div>

            <div className={styles.field}>
              <label htmlFor="getPassEmail">{key("email")}</label>
              <Field
                type="email"
                id="getPassEmail"
                name="email"
              />
              {isRightEmail && (
                <InputErrorMessage text={key("noAcc")} />
              )}
              <ErrorMessage name="email" component={InputErrorMessage} />
            </div>
            <div className="d-flex justify-content-center align-items-center mt-3 px-2">
              {isPending ? (
                <button type="submit" className={styles.save_btn}>
                  <FontAwesomeIcon className="fa-spin" icon={faYinYang} />
                </button>
              ) : (
                <button className={styles.save_btn} type="submit">
                  {key("sendEmail")}
                </button>
              )}
            </div>
            <div className={styles.options}>
              <span className="or_span">{key("or")}</span>

              <span className="mini_word">
                {key("youCanCreateAcc")}{" "}
                <Link to={"/register"} className="text-primary">{key("register")}</Link>
              </span>
            </div>
          </Form>
        </Formik>
        {showModal && (
          <VerificationCode
            show={showModal}
            onHide={() => setShowModal(true)}
            notifySuccess={notifySuccess}
            notifyError={notifyError}
          />
        )}
      </div>
    </>
  );
};

export default ForgetPassword;
