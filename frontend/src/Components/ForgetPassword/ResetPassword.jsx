import React, { useState } from "react";
import styles from "./ForgetPassword.module.css";
import Modal from "react-bootstrap/Modal";
import { useMutation } from "@tanstack/react-query";
import { ErrorMessage, Form, Formik, Field } from "formik";
import { object, string } from "yup";
import InputErrorMessage from "../../Components/Ui/InputErrorMessage";
import {signFormsHandler} from "../../util/Http";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faYinYang } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";

const ResetPassword = ({ onHide, show, notifySuccess, notifyError }) => {
  const [isRightEmail, setIsRightEmail] = useState(false);
  const navigate = useNavigate();

  const { mutate, isPending } = useMutation({
    mutationFn: signFormsHandler,
    onSuccess: (data) => {
      if (data.data.status === "success") {
        setIsRightEmail(false);
        console.log(data);
        notifySuccess("Your new Password saved successfully");
        navigate("/login");
        onHide();
      } else {
        notifyError("Your new Password faild to be reset please try again");
      }
    },
    onError: (error) => {
      console.log(error);
      if (error.data.message === "account with this email not found") {
        setIsRightEmail(true);
      } else {
        setIsRightEmail(false);
        notifyError("Your new Password faild to be reset please try again");
      }
    },
  });

  const initialValues = {
    email: "",
    newPassword: "",
  };

  const onSubmit = (values) => {
    console.log(values);
    mutate({
      formData: values,
      method: "put",
    });
  };

  const validationSchema = object({
    email: string().email("Email not valid").required("Email is required"),
    newPassword: string()
      .min(5, "Min 5 characters")
      .required("Password is required")
      .matches(/[A-Z]+/, "Must contain at least one uppercase character")
      .matches(/[a-z]+/, "Must contain at least one lowercase character")
      .matches(/[0-9]+/, "Must contain at least one number"),
  });

  return (
    <Modal
      show={show}
      onHide={onHide}
      size="md"
      aria-labelledby="contained-modal-title-vcenter"
      centered
      className={styles.modal_container}
    >
      <Modal.Body className={styles.modal_body}>
        <h4>Enter Your New Password</h4>
        <Formik
          initialValues={initialValues}
          onSubmit={onSubmit}
          validationSchema={validationSchema}
        >
          <Form>
            <div className={styles.field}>
              <label htmlFor="resetPasswordEmail">Email</label>
              <Field
                type="email"
                id="resetPasswordEmail"
                name="email"
                placeholder="example@gmail.com"
              />
              {isRightEmail && (
                <InputErrorMessage text="there is no Account with this email !" />
              )}
              <ErrorMessage name="email" component={InputErrorMessage} />
            </div>

            <div className={styles.field}>
              <label htmlFor="newPass">New Password</label>

              <Field type="password" id="newPass" name="newPassword" />
              <ErrorMessage name="newPassword" component={InputErrorMessage} />
            </div>

            <div className="d-flex justify-content-center align-items-center mt-3 px-2">
              {isPending ? (
                <button type="submit" className={styles.save_btn}>
                  <FontAwesomeIcon className="fa-spin" icon={faYinYang} />
                </button>
              ) : (
                <button className={styles.save_btn} type="submit">
                  Submit
                </button>
              )}
            </div>
          </Form>
        </Formik>
      </Modal.Body>
    </Modal>
  );
};

export default ResetPassword;
