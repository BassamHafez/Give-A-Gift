import Modal from "react-bootstrap/Modal";
import React from "react";
import styles from "../AdminPages.module.css";
import { ErrorMessage, Field, Form, Formik } from "formik";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faYinYang } from "@fortawesome/free-solid-svg-icons";
import InputErrorMessage from "../../../../Components/Ui/InputErrorMessage";
import { useMutation } from "@tanstack/react-query";
import { getShops } from "../../../../util/Http";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import { object, string } from "yup";


const StoresMessage = ({ show, onHide, storeIds }) => {
    const { t: key } = useTranslation();
    const notifySuccess = (message) => toast.success(message);
    const notifyError = (message) => toast.error(message);
    const token = JSON.parse(localStorage.getItem("token"));
  
    const { mutate, isPending } = useMutation({
      mutationFn: getShops,
    });
  
    const initialValues = {
      message: "",
      type: "email",
      shopsIds: storeIds || [],
    };
  
    const onSubmit = (values, { resetForm }) => {
      mutate(
        {
          formData: values,
          token: token,
          type: "message",
        },
        {
          onSuccess: (data) => {
            if (data?.status === "success") {
              notifySuccess(key("opSuccess"));
              resetForm();
              onHide();
            } else {
              notifyError(key("wrong"));
            }
          },
          onError: (error) => {
            notifyError(key("wrong"));
          },
        }
      );
    };
  
    const validationSchema = object({
      message: string().required(key("messageRec")),
      type: string().required(key("typeRec")),
    });

  return (
    <Modal
      show={show}
      onHide={onHide}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
      className={styles.modal_container}
    >
      <Modal.Body className={`${styles.modal_body} text-center`}>
        <Formik
          initialValues={initialValues}
          onSubmit={onSubmit}
          validationSchema={validationSchema}
        >
          {({ values }) => (
            <Form className={styles.general_info_form}>
              <div className={styles.field}>
                <label htmlFor="message" className="mt-3">
                  {key("add")} {key("message")}
                </label>
                <Field as="textarea" id="message" name="message" className={`form-control ${styles.textArea}`} />
                <ErrorMessage name="message" component={InputErrorMessage} />
              </div>

              <div className={styles.field}>
                <div className="form-check">
                  <Field
                    type="radio"
                    className="form-check-input"
                    name="type"
                    id="typeEmail"
                    value="email"
                    checked={values.type === "email"}
                  />
                  <label className="form-check-label mx-2" htmlFor="typeEmail">
                    {key("email")}
                  </label>
                </div>

                <div className="form-check">
                  <Field
                    type="radio"
                    className="form-check-input"
                    name="type"
                    id="typeWhatsapp"
                    value="whatsapp"
                    checked={values.type === "whatsapp"}
                  />
                  <label
                    className="form-check-label mx-2"
                    htmlFor="typeWhatsapp"
                  >
                    {key("whatsapp")}
                  </label>
                </div>
              </div>

              <div className="d-flex justify-content-end align-items-center mt-3 px-2">
                {isPending ? (
                  <button type="submit" className={styles.save_btn}>
                    <FontAwesomeIcon className="fa-spin" icon={faYinYang} />
                  </button>
                ) : (
                  <button className={styles.save_btn} type="submit">
                    {key("sendMessage")}
                  </button>
                )}
              </div>
            </Form>
          )}
        </Formik>
      </Modal.Body>
    </Modal>
  )
}

export default StoresMessage
