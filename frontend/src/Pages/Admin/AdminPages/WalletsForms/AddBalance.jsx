import React from "react";
import styles from "../AdminPages.module.css";
import { controlWallets } from "../../../../util/Http";
import { useMutation } from "@tanstack/react-query";
import { ErrorMessage, Form, Formik, Field } from "formik";
import { number, object } from "yup";
import { faYinYang } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useTranslation } from "react-i18next";
import toast from "react-hot-toast";
import InputErrorMessage from "../../../../Components/Ui/InputErrorMessage";
import Modal from "react-bootstrap/Modal";

const AddBalance = ({ refetch, walletId, show, onHide }) => {
  const { t: key } = useTranslation();
  const token = JSON.parse(localStorage.getItem("token"));

  const notifySuccess = (message) => toast.success(message);
  const notifyError = (message) => toast.error(message);

  const { mutate, isPending } = useMutation({
    mutationFn: controlWallets,
    onSuccess: (data) => {
      console.log(data);
      if (data?.data?.status === "success") {
        notifySuccess(key("opSuccess"));
        refetch();
        onHide()
      } else {
        console.log(data);
        notifyError(key("wrong"));
      }
    },
    onError: (error) => {
      console.log(error);
      notifyError(key("wrong"));
    },
  });

  const initialValues = {
    amountToIncrease: "",
  };

  const onSubmit = (values) => {
    const updatedFormData={
        amountToIncrease:Number(values.amountToIncrease)
    }

    mutate({
      formData: updatedFormData,
      token: token,
      type: "addOne",
      walletId: walletId,
    });
  };

  const validationSchema = object({
    amountToIncrease: number().min(0, key("amountValidate4")),
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
        <Formik
          initialValues={initialValues}
          onSubmit={onSubmit}
          validationSchema={validationSchema}
        >
          <Form className={styles.general_info_form}>
            <div className={styles.field}>
              <label htmlFor="amountToIncrease">
                {key("add")} {key("amount")}
              </label>
              <Field type="text" id="amountToIncrease" name="amountToIncrease" />
              <ErrorMessage
                name="amountToIncrease"
                component={InputErrorMessage}
              />
            </div>

            <div className="d-flex justify-content-end align-items-center mt-3 px-2">
              {isPending ? (
                <button type="submit" className={styles.save_btn}>
                  <FontAwesomeIcon className="fa-spin" icon={faYinYang} />
                </button>
              ) : (
                <button className={styles.save_btn} type="submit">
                  {key("add")}
                </button>
              )}
            </div>
          </Form>
        </Formik>
      </Modal.Body>
    </Modal>
  );
};

export default AddBalance;
