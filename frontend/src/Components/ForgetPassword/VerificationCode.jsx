import React, { useState } from "react";
import styles from "./ForgetPassword.module.css";
import Modal from "react-bootstrap/Modal";
import { useMutation } from "@tanstack/react-query";
import { ErrorMessage, Form, Formik, Field } from "formik";
import { object, string } from "yup";
import InputErrorMessage from "../../Components/Ui/InputErrorMessage";
import { signFormsHandler } from "../../util/Http";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faYinYang } from "@fortawesome/free-solid-svg-icons";
import ResetPassword from "./ResetPassword";
import { useTranslation } from "react-i18next";

const VerificationCode = ({ onHide, show, notifySuccess, notifyError }) => {
  const [isCodeWrong, setIsCodeWrong] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const {t:key}=useTranslation();

  const { mutate, isPending } = useMutation({
    mutationFn: signFormsHandler,
    onSuccess: (data) => {
      if (data.data.status === "success") {
        setIsCodeWrong(false);
        console.log(data);
        setShowModal(true);
        onHide();
      } else {
        notifyError(key("faildResetPass"));
      }
    },
    onError: (error) => {
      console.log(error);
      if (error.data.message === "Reset code invalid or expired") {
        setIsCodeWrong(true);
      } else {
        setIsCodeWrong(false);
        notifyError(key("faildResetPass"));
      }
    },
  });

  const initialValues = {
    resetCode: "",
  };

  const onSubmit = (values) => {
    console.log(values);
    mutate({
      formData: values,
      type: "verifyPassResetCode",
    });
  };

  const validationSchema = object({
    resetCode: string().required(key("codeRec")),
  });

  return (
    <>
      <Modal
        show={show}
        onHide={onHide}
        size="md"
        aria-labelledby="contained-modal-title-vcenter"
        centered
        className={styles.modal_container}
      >
        <Modal.Body className={styles.modal_body}>
          <h4>{key("enterCode")}</h4>
          <Formik
            initialValues={initialValues}
            onSubmit={onSubmit}
            validationSchema={validationSchema}
          >
            <Form>
              <div className={styles.verify_form}>
                <Field
                  type="text"
                  id="forgetPasswordEmail"
                  name="resetCode"
                  placeholder="######"
                />
                {isCodeWrong && (
                  <InputErrorMessage text={key("resetInvalid")} />
                )}
                <ErrorMessage name="resetCode" component={InputErrorMessage} />
              </div>

              <div className="d-flex justify-content-center align-items-center mt-3 px-2">
                {isPending ? (
                  <button type="submit" className={styles.save_btn}>
                    <FontAwesomeIcon className="fa-spin" icon={faYinYang} />
                  </button>
                ) : (
                  <button className={styles.save_btn} type="submit">
                    {key("verify")}
                  </button>
                )}
              </div>
            </Form>
          </Formik>
        </Modal.Body>
      </Modal>

      <ResetPassword
        show={showModal}
        onHide={() => setShowModal(true)}
        notifySuccess={notifySuccess}
        notifyError={notifyError}
      />
    </>
  );
};

export default VerificationCode;
