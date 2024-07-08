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

const LoginForm = () => {
  const [isEmailError, setIsEmailError] = useState(false);
  const [isPasswordError, setIsPasswordError] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

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
    email: string().email("Email not valid").required("Email is required"),
    password: string()
      .min(5, "Min 5 characters")
      .required("Password is required")
      .matches(/[A-Z]+/, "Must contain at least one uppercase character")
      .matches(/[a-z]+/, "Must contain at least one lowercase character")
      .matches(/[0-9]+/, "Must contain at least one number"),
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
            <label htmlFor="emailInput">Email</label>
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
            <label htmlFor="passwordInput">Password</label>
            <Field
              type={passwordType}
              id="passwordInput"
              name="password"
              placeholder="********"
            />
            <ErrorMessage name="password" component={InputErrorMessage} />
            {isPasswordError && (
              <InputErrorMessage text="Incorrect Password!" />
            )}
            <FontAwesomeIcon
              onClick={toggleShowPassword}
              className={styles.show_password_field}
              icon={eyeShape}
            />
          </div>

          {isPending ? (
            <button type="submit" className={styles.login_btn}>
              <FontAwesomeIcon className="fa-spin" icon={faYinYang} />
            </button>
          ) : (
            <button type="submit" className={styles.login_btn}>
              Login
            </button>
          )}

          <div className={styles.form_options}>
            <span>
              <Link to={"/forget-password"}>Forgot Password?</Link>
            </span>
            <span>
              create account? <Link to={"/register"} className="text-primary">signup</Link>
            </span>
          </div>
        </Form>
      </Formik>
    </>
  );
};

export default LoginForm;
