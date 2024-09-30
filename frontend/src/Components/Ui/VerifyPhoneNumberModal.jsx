import React from "react";
import styles from "./LogoutModal.module.css";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import { useMutation } from "@tanstack/react-query";
import { ErrorMessage, Form, Formik, Field } from "formik";
import { number, object } from "yup";
import {sendVerificationCode } from "../../util/Http";
import InputErrorMessage from "./InputErrorMessage";
import fetchProfileData from "../../Store/profileInfo-actions";
import { useDispatch } from "react-redux";

const VerifyPhoneNumberModal = ({ onHide, show }) => {
  const { t: key } = useTranslation();
  let isArLang = localStorage.getItem("i18nextLng") === "ar";
  const token = JSON.parse(localStorage.getItem("token"));
  const notifySuccess = (message) => toast.success(message);
  const notifyError = (message) => toast.error(message);
  const dispatch = useDispatch();

  const { mutate } = useMutation({
    mutationFn: sendVerificationCode,
    onSuccess: (data) => {
      if (data?.status === "success") {
        notifySuccess(key("phoneVerifiedSuccess"));
        dispatch(fetchProfileData(token));
      }else if(data?.response?.data?.message==="Verification code is wrong"){
         notifyError(key("verificationCodeWrong"));
        }
       else {
        notifyError(key("verifyCodeFailResend"));
      }
    },
    onError: (error) => {
      notifyError(key("verifyCodeFailResend"));
    },
  });

  const initialValues = {
    verificationCode: "",
  };

  const onSubmit = (values) => {

    mutate({
      formData: values,
      token: token,
    });
  };

  const validationSchema = object({
    verificationCode: number().required(key("verificationCodeRequired")),
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
      <Modal.Body className={`${styles.modal_body} text-center`}>
        <>
          <Formik
            initialValues={initialValues}
            onSubmit={onSubmit}
            validationSchema={validationSchema}
          >
            <Form className={styles.general_info_form}>
              <div className={styles.field}>
                <label htmlFor="verifyCode">{key("sendMsgVerify1")}</label>
                <Field type="text" id="verifyCode" name="verificationCode" />
                <ErrorMessage
                  name="verificationCode"
                  component={InputErrorMessage}
                />
              </div>
              <div className="d-flex justify-content-evenly my-3">
                <Button
                  variant="primary"
                  className={isArLang ? styles.close_btn_ar : styles.close_btn}
                  onClick={onHide}
                >
                  {key("cancel")}
                </Button>
                <Button
                  variant="danger"
                  type="submit"
                  className={
                    isArLang ? styles.logout_btn_ar : styles.logout_btn
                  }
                >
                  {key("verify")}
                </Button>
              </div>
            </Form>
          </Formik>
        </>
      </Modal.Body>
    </Modal>
  );
};

export default VerifyPhoneNumberModal;
