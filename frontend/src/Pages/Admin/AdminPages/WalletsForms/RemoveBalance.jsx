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

const RemoveBalance = ({refetch,onHide,walletId}) => {
  const { t: key } = useTranslation();
  const token = JSON.parse(localStorage.getItem("token"));

  const notifySuccess = (message) => {
    toast.success((t) => (
      <div
        onClick={() => toast.dismiss(t.id)}
        onTap={() => toast.dismiss(t.id)}
      >
        {message}
      </div>
    ));
  };

  const notifyError = (message) => {
    toast.error((t) => (
      <div
        onClick={() => toast.dismiss(t.id)}
        onTap={() => toast.dismiss(t.id)}
      >
        {message}
      </div>
    ));
  };

  const { mutate, isPending } = useMutation({
    mutationFn: controlWallets,
    onSuccess: (data) => {
      if (data?.data?.status === "success") {
        notifySuccess(key("opSuccess"));
        refetch();
        onHide();
      } else {
        notifyError(key("wrong"));
      }
    },
    onError: (error) => {
      notifyError(key("wrong"));
    },
  });

  const initialValues = {
    amountToIncrease: "",
  };

  const onSubmit = (values) => {
    const updatedFormData = {
      amountToIncrease: -Number(values.amountToIncrease),
    };

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
    <Formik
      initialValues={initialValues}
      onSubmit={onSubmit}
      validationSchema={validationSchema}
    >
      <Form className={styles.general_info_form}>
        <div className={`${styles.field} mb-2`}>
          <label htmlFor="amountToIncrease">
            {key("remove")} {key("amountWithout")}
          </label>
          <Field type="number" id="amountToIncrease" name="amountToIncrease" />
          <ErrorMessage name="amountToIncrease" component={InputErrorMessage} />
        </div>

        <div className="d-flex justify-content-end align-items-center px-2">
          {isPending ? (
            <button type="submit" className={styles.save_btn}>
              <FontAwesomeIcon className="fa-spin" icon={faYinYang} />
            </button>
          ) : (
            <button className={styles.save_btn} type="submit">
              {key("remove")}
            </button>
          )}
        </div>
      </Form>
    </Formik>
  );
};

export default RemoveBalance;
