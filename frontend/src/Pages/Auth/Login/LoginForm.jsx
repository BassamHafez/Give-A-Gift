import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ErrorMessage, Field, Form, Formik } from "formik";
import { object, string } from "yup";
import InputErrorMessage from "../../../Components/Ui/InputErrorMessage";
import styles from "./LoginForm.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faYinYang } from "@fortawesome/free-solid-svg-icons";
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
import axios from "axios";
import { cartActions } from "../../../Store/cartCounter-slice";

const LoginForm = ({ notifySuccess, notifyError }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [key, control] = useTranslation();
  let isArLang = control.language === "ar";

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const queryClient = useQueryClient();

  const saveNotReadyCard = async (token) => {
    let formData = JSON.parse(localStorage.getItem("notReadyCard"));
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_Base_API_URl}cards`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const res = response.data;
      if (res?.status === "success") {
        queryClient.invalidateQueries(["getMyCards", token]);
        dispatch(cartActions.addItem());
        notifySuccess(key("cardSaved"));
        localStorage.removeItem("notReadyCard");
        localStorage.setItem("isNotReadyCard", "false");
        navigate(`/recipient-information/${res.data?._id}`);
      } else {
        navigate("/");
      }
    } catch (error) {
      notifyError(key("wrong"));
      navigate("/");
    }
  };

  const { mutate, isPending } = useMutation({
    mutationFn: signFormsHandler,
    onSuccess: (response) => {
      let res = response.data;
      if (res.status === "success") {
        dispatch(userActions.setUserInfo(res.data?.user));
        dispatch(userActions.setIsLogin(true));

        dispatch(userActions.setToken(res.token));
        dispatch(saveUserInfoIntoLocalStorag(res.data?.user));
        dispatch(saveIsLoginState(true));

        dispatch(saveTokenState(res.token));
        if (res.data?.user?.role === "user") {
          dispatch(userActions.setRole("user"));
          dispatch(saveRoleState("user"));
          if (localStorage.getItem("isNotReadyCard") === "true") {
            saveNotReadyCard(res.token);
          } else {
            navigate("/");
          }
        } else if (res.data?.user?.role === "admin") {
          dispatch(saveRoleState("admin"));
          dispatch(userActions.setRole("admin"));
          navigate(`/admin/${res.data?.user?._id}`);
        } else if (res.data?.user?.role === "merchant") {
          dispatch(saveRoleState("merchant"));
          dispatch(userActions.setRole("merchant"));
          navigate(`/merchant/${res.data?.user?._id}`);
        }
      }
    },
    onError: (error) => {
      if (error.status === 401) {
        notifyError(key("emailOrPass"));
      } else {
        notifyError();
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
    email: string()
      .email(`${key("emailValidation1")}`)
      .required(`${key("emailValidation2")}`),
    password: string()
      .min(5, `${key("passwordValidation1")}`)
      .required(`${key("passwordValidation2")}`)
      .matches(/[A-Z]+/, `${key("passwordValidation3")}`)
      .matches(/[a-z]+/, `${key("passwordValidation4")}`)
      .matches(/[0-9]+/, `${key("passwordValidation5")}`),
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
            <Field type="email" id="emailInput" name="email" />
            <ErrorMessage name="email" component={InputErrorMessage} />
          </div>
          <div className={styles.user_input_faild}>
            <label htmlFor="passwordInput">{key("password")}</label>
            <Field type={passwordType} id="passwordInput" name="password" />
            <ErrorMessage name="password" component={InputErrorMessage} />
            <FontAwesomeIcon
              onClick={toggleShowPassword}
              className={`${
                isArLang
                  ? styles.show_password_field_ar
                  : styles.show_password_field
              }`}
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
              {key("createAccount")}{" "}
              <Link to={"/register"}>{key("register")}</Link>
            </span>
          </div>
        </Form>
      </Formik>
    </>
  );
};

export default LoginForm;
