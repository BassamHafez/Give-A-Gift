import { useMutation } from "@tanstack/react-query";
import React from "react";
import { updateProColor } from "../../../../util/Http";
import { useTranslation } from "react-i18next";
import { number, object } from "yup";
import { ErrorMessage, Field, Form, Formik } from "formik";
import styles from "../AdminPages.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faYinYang } from "@fortawesome/free-solid-svg-icons";
import InputErrorMessage from "../../../../Components/Ui/InputErrorMessage";
import { toast } from "react-toastify";
import Modal from "react-bootstrap/Modal";

const UpdateProColor = ({ refetch, show, onHide, proColorData }) => {
  const { t: key } = useTranslation();
  const token = JSON.parse(localStorage.getItem("token"));
console.log(proColorData)
  const notifySuccess = (message) => toast.success(message);
  const notifyError = (message) => toast.error(message);

  const { mutate, isPending } = useMutation({
    mutationFn: updateProColor,
  });

  const initialValues = {
    price: proColorData.price || "",
    priority: proColorData.priority || "",
  };

  const onSubmit = (values, { resetForm }) => {
    console.log(values)
    mutate(
      {
        formData: values,
        token: token,
        proColorId: proColorData._id,
      },
      {
        onSuccess: (data) => {
          console.log(data);
          if (data?.status === "success") {
            notifySuccess(key("opSuccess"));
            refetch();
            resetForm();
            onHide();
          } else {
            notifyError(key("wrong"));
          }
        },
        onError: (error) => {
          console.log(error);
          notifyError(key("wrong"));
        },
      }
    );
  };

  const validationSchema = object({
    price: number().required(key("priceRec")).min(1, key("priceVali")),
    priority: number()
      .typeError(key("priorityValidation"))
      .required(key("priReq")),
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
          enableReinitialize
        >
          <Form className={styles.general_info_form}>
            <div className={`${styles.field} mt-4`}>
              <label className="text-secondary" htmlFor="price">
                {key("price")}
              </label>
              <Field type="number" id="price" name="price" />
              <ErrorMessage name="price" component={InputErrorMessage} />
            </div>

            <div className={`${styles.field} my-4`}>
              <label className="text-secondary" htmlFor="priority">
                {key("priority")}
              </label>
              <Field type="number" id="priority" name="priority" />
              <ErrorMessage name="priority" component={InputErrorMessage} />
            </div>

            <div className="d-flex justify-content-end align-items-center mt-3 px-2">
              {isPending ? (
                <button type="submit" className={styles.save_btn}>
                  <FontAwesomeIcon className="fa-spin" icon={faYinYang} />
                </button>
              ) : (
                <button className={styles.save_btn} type="submit">
                  {key("update")}
                </button>
              )}
            </div>
          </Form>
        </Formik>
      </Modal.Body>
    </Modal>
  );
};

export default UpdateProColor;
