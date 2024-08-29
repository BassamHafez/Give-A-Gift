import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { ErrorMessage, Field, Form, Formik } from "formik";
import { object, string } from "yup";
import InputErrorMessage from "../../../Components/Ui/InputErrorMessage";
import styles from "./LoginForm.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faYinYang,
} from "@fortawesome/free-solid-svg-icons";
import { useDispatch } from "react-redux";
import { userActions } from "../../../Store/userInfo-slice";
import saveUserInfoIntoLocalStorag, {
  saveIsLoginState,
  saveRoleState,
  saveTokenState,
} from "../../../Store/userInfo-actions";
import { faEye, faEyeSlash } from "@fortawesome/free-regular-svg-icons";
import { signFormsHandler } from "../../../util/Http";
import { useTranslation } from "react-i18next";

const LoginForm = () => {
  
  const [isEmailError, setIsEmailError] = useState(false);
  const [isPasswordError, setIsPasswordError] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [ key,control ] = useTranslation();
  let isArLang = control.language === "ar";

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { mutate, isPending } = useMutation({
    mutationFn: signFormsHandler,
    onSuccess: (response) => {
      let res = response.data;
      if (res.status === "success") {
        console.log("res", res);
          if (res.data.user.role === "user") {
            setIsEmailError(false);
            setIsPasswordError(false);
            dispatch(userActions.setUserInfo(res.data.user));
            dispatch(userActions.setIsLogin(true));
            dispatch(userActions.setRole("user"));
            dispatch(userActions.setToken(res.token));
            dispatch(saveUserInfoIntoLocalStorag(res.data.user));
            dispatch(saveIsLoginState(true));
            dispatch(saveRoleState("user"));
            dispatch(saveTokenState(res.token));
            navigate("/");
          } else {
            console.log(res);
            alert("sorry something went wrong please try again later!");
          }
        }
    },
    onError: (error) => {
      console.log(error);
      if (error.status === 404) {
        setIsEmailError(true);
        setIsPasswordError(false);
      } else if (error.status === 401) {
        setIsEmailError(false);
        setIsPasswordError(true);
      } else {
        console.log(error);
        alert("sorry something went wrong please try again later!");
      }
    },
  });

  const initialValues = {
    email: "",
    password: "",
  };

  const onSubmit = (values) => {
    mutate({ type: "login", formData: values });
  };

  const validationSchema = object({
    email:string().email(`${key("emailValidation1")}`).required(`${key("emailValidation2")}`),
    password: string()
    .min(5, `${key("passwordValidation1")}`)
    .required(`${key("passwordValidation2")}`)
    .matches(/[A-Z]+/, `${key("passwordValidation3")}`)
    .matches(/[a-z]+/, `${key("passwordValidation4")}`)
    .matches(/[0-9]+/, `${key("passwordValidation5")}`)
  });

  const toggleShowPassword = () => {
    setShowPassword((showPassword) => !showPassword);
  };

  const eyeShape = showPassword ? faEye : faEyeSlash;
  const passwordType = showPassword ? "text" : "password";

  return (
    <>
      <Formik
        initialValues={initialValues}
        onSubmit={onSubmit}
        validationSchema={validationSchema}
      >
        <Form className={styles.login_form}>
          <div className={styles.user_input_faild}>
            <label htmlFor="emailInput">{key("email")}</label>
            <Field
              type="email"
              id="emailInput"
              name="email"
              placeholder="example@gmail.com"
            />
            <ErrorMessage name="email" component={InputErrorMessage} />
            {isEmailError && <InputErrorMessage text="email not found!" />}
          </div>
          <div className={styles.user_input_faild}>
            <label htmlFor="passwordInput">{key("password")}</label>
            <Field
              type={passwordType}
              id="passwordInput"
              name="password"
            />
            <ErrorMessage name="password" component={InputErrorMessage} />
            {isPasswordError && (
              <InputErrorMessage text="Incorrect Password!" />
            )}
            <FontAwesomeIcon
              onClick={toggleShowPassword}
              className={`${isArLang?styles.show_password_field_ar:styles.show_password_field}`}
              icon={eyeShape}
            />
          </div>

          {isPending ? (
            <button type="submit" className={styles.login_btn}>
              <FontAwesomeIcon className="fa-spin" icon={faYinYang} />
            </button>
          ) : (
            <button type="submit" className={styles.login_btn}>
              {key("login")}
            </button>
          )}

          <div className={styles.form_options}>
            <span>
              <Link to={"/forget-password"}>{key("forgotPassword")}</Link>
            </span>
            <span>
            {key("createAccount")} <Link to={"/register"} className="text-primary">{key("register")}</Link>
            </span>
          </div>
        </Form>
      </Formik>
    </>
  );
};

export default LoginForm;
