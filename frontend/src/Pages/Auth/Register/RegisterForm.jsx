import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ErrorMessage, Field, Form, Formik } from "formik";
import { object, ref, string } from "yup";
import styles from "./RegisterForm.module.css";
import { useMutation } from "@tanstack/react-query";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faYinYang } from "@fortawesome/free-solid-svg-icons";
import { signFormsHandler } from "../../../util/Http";
import InputErrorMessage from "../../../Components/Ui/InputErrorMessage";
import { useTranslation } from "react-i18next";

const RegisterForm = ({notifySuccess,notifyError}) => {
  const [isEmailError, setIsEmailError] = useState(false);
  const navigate = useNavigate();
  const [key, control] = useTranslation();
  let isArLang = control.language === "ar";

  const { mutate, isPending } = useMutation({
    mutationFn: signFormsHandler,

    onSuccess: (response) => {
      if (response.data.status === "success") {
        setIsEmailError(false);
        notifySuccess();
        navigate("/login");
      } else {
        notifyError();
        console.log(response);
      }
    },
    onError(error) {
      console.log(error);
      if (error.status === 500) {
        if (
          error.data.message ===
          "connection <monitor> to 15.185.166.107:27017 timed out"
        ) {
          setIsEmailError(false);
          notifyError(
            "sorry! time out please check your network or try again later"
          );
        } else {
          setIsEmailError(true);
        }
      } else {
        notifyError("sorry something went wrong please try again later!");
      }
    },
  });

  const initialValues = {
    name: "",
    email: "",
    password: "",
    passwordConfirm: "",
  };

  const onSubmit = (values) => {
    mutate({ type: "signup", formData: values });
  };

  const passwordRegex = string()
    .min(5, `${key("passwordValidation1")}`)
    .required(`${key("passwordValidation2")}`)
    .matches(/[A-Z]+/, `${key("passwordValidation3")}`)
    .matches(/[a-z]+/, `${key("passwordValidation4")}`)
    .matches(/[0-9]+/, `${key("passwordValidation5")}`);

  const validationSchema = object({
    name: string()
      .min(3, `${key("nameValidation1")}`)
      .max(20, `${key("nameValidation2")}`)
      .required(`${key("nameValidation3")}`),
    email: string()
      .email(`${key("emailValidation1")}`)
      .required(`${key("emailValidation2")}`),
    password: passwordRegex,
    passwordConfirm: string()
    .oneOf([ref('password'), null], `${key("passwordMismatch")}`)
    .required(`${key("passwordValidation2")}`),
  });

  return (
    <>
      
      <Formik
        initialValues={initialValues}
        onSubmit={onSubmit}
        validationSchema={validationSchema}
      >
        <Form className={styles.register_form}>
          <div className="d-flex flex-column mb-5  position-relative">
            <Field
              type="text"
              id="name"
              name="name"
              placeholder={key("name")}
            />
            <ErrorMessage name="name" component={InputErrorMessage} />
          </div>

          <div className="d-flex flex-column mb-5 position-relative">
            <Field
              type="email"
              id="email_Input"
              name="email"
              placeholder={`${key("email")}`}
            />
            <ErrorMessage name="email" component={InputErrorMessage} />
            {isEmailError && <InputErrorMessage text="email already exist!" />}
          </div>
          <div
            className={`${styles.pass_group} d-flex justify-content-between align-items-center mb-5`}
          >
            <div
              className={`${styles.password_field} ${
                isArLang ? "ms-2" : "me-2"
              } d-flex flex-column position-relative`}
            >
              <Field
                type="password"
                id="Password_Input"
                name="password"
                placeholder={`${key("password")}`}
              />
              <ErrorMessage name="password" component={InputErrorMessage} />
            </div>
            <div
              className={`${styles.confirm_password} d-flex flex-column ms-2 position-relative`}
            >
              <Field
                type="password"
                id="passwordConfirm"
                name="passwordConfirm"
                placeholder={`${key("confirmPass")}`}
              />
              <ErrorMessage
                name="passwordConfirm"
                component={InputErrorMessage}
              />
            </div>
          </div>
          {isPending ? (
            <button type="submit" className={styles.register_btn}>
              <FontAwesomeIcon className="fa-spin" icon={faYinYang} />
            </button>
          ) : (
            <button type="submit" className={styles.register_btn}>
              {key("register")}
            </button>
          )}
          <div>
            <span className="or_span">or</span>
            <p className={`${styles.have_acc_p} mini_word`}>
              {key("haveAcc")} <Link className="text-primary fw-bold" to={"/login"}>{key("login")}</Link>
            </p>
          </div>
        </Form>
      </Formik>
    </>
  );
};

export default RegisterForm;
