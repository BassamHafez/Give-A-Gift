import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ErrorMessage, Field, Form, Formik } from "formik";
import { object, string } from "yup";
import styles from "./RegisterForm.module.css";
import { useMutation } from "@tanstack/react-query";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faYinYang } from "@fortawesome/free-solid-svg-icons";
import { signFormsHandler } from "../../../util/Http";
import InputErrorMessage from "../../../Components/Ui/InputErrorMessage";

const RegisterForm = () => {
  const [isEmailError, setIsEmailError] = useState(false);
  const navigate = useNavigate();

  const { mutate, isPending } = useMutation({
    mutationFn: signFormsHandler,

    onSuccess: (response) => {
      if (response.data.status === "success") {
        setIsEmailError(false);
        navigate("/login");
      } else {
        alert("sorry something went wrong please try again later!");
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
          alert("sorry! time out please check your network or try again later");
        } else {
          setIsEmailError(true);
        }
      } else {
        alert("sorry something went wrong please try again later!");
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
    .min(5, "Min 5 characters")
    .required("Password is required")
    .matches(/[A-Z]+/, "Must contain at least one uppercase character")
    .matches(/[a-z]+/, "Must contain at least one lowercase character")
    .matches(/[0-9]+/, "Must contain at least one number");

  const validationSchema = object({
    name: string()
      .min(3, "name should be at min 3 char")
      .max(20, "name should be at max 20 char")
      .required("first name is required"),
    email: string().email("email not valid").required("email is required"),
    password: passwordRegex,
    passwordConfirm: passwordRegex,
  });

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={onSubmit}
      validationSchema={validationSchema}
    >
      <Form className={styles.register_form}>
        <div className="d-flex flex-column mb-5  position-relative">
          <Field type="text" id="name" name="name" placeholder="Name" />
          <ErrorMessage name="name" component={InputErrorMessage} />
        </div>

        <div className="d-flex flex-column mb-5 position-relative">
          <Field
            type="email"
            id="email_Input"
            name="email"
            placeholder="Email"
          />
          <ErrorMessage name="email" component={InputErrorMessage} />
          {isEmailError && <InputErrorMessage text="email already exist!" />}
        </div>
        <div
          className={`${styles.pass_group} d-flex justify-content-between align-items-center mb-5`}
        >
          <div
            className={`${styles.password_field} d-flex flex-column me-2 position-relative`}
          >
            <Field
              type="password"
              id="Password_Input"
              name="password"
              placeholder="Password"
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
              placeholder="Confirm Password"
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
            Register
          </button>
        )}
        <div>
          <span className="or_span">or</span>
          <p className={`${styles.have_acc_p} mini_word`}>
            Already have an Account{" "}
            <Link to={"/login"}>Login</Link>
          </p>
        </div>
      </Form>
    </Formik>
  );
};

export default RegisterForm;
