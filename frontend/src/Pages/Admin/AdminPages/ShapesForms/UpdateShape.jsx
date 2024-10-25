import React from "react";
import styles from "../AdminPages.module.css";
import { controlUpdateShapes } from "../../../../util/Http";
import { useMutation } from "@tanstack/react-query";
import { ErrorMessage, Field, Form, Formik } from "formik";
import { number, object } from "yup";
import { faYinYang } from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import InputErrorMessage from "../../../../Components/Ui/InputErrorMessage";
import Modal from "react-bootstrap/Modal";

const UpdateShape = ({ refetch, show, onHide, shapeData }) => {
  const notifyError = (message) => toast.error(message);
  const token = JSON.parse(localStorage.getItem("token"));
  const { t: key } = useTranslation();

  const { mutate, isPending } = useMutation({
    mutationFn: controlUpdateShapes,
  });

  const initialValues = {
    price: shapeData.price || "",
    priority: shapeData.priority || "",
  };

  const onSubmit = (values, { resetForm }) => {
    let shapePrice = 0;
    if (values.price) {
      shapePrice = values.price;
    } else {
      shapePrice = 0;
    }

    const updatedFormData = {
      price: shapePrice,
      priority: values.priority,
    };
    mutate(
      {
        formData: updatedFormData,
        token: token,
        shapeId: shapeData._id,
      },
      {
        onSuccess: (data) => {
          if (data?.status === "success") {
            refetch();
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
    price: number().min(0, key("priceVali")),
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
            <div className={`${styles.field} my-4`}>
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

export default UpdateShape;
