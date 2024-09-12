import React from "react";
import { updateMe } from "../../../util/Http";
import { useMutation } from "@tanstack/react-query";
import { ErrorMessage, Form, Formik, Field } from "formik";
import { object, string } from "yup";
import InputErrorMessage from "../../../Components/Ui/InputErrorMessage";
import styles from "./Forms.module.css";
import { faYinYang } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useTranslation } from "react-i18next";
import toast from "react-hot-toast";
import fetchProfileData from "../../../Store/profileInfo-actions";
import { useDispatch } from "react-redux";

const ChangeEmail = () => {
  const { t: key } = useTranslation();
  const token = JSON.parse(localStorage.getItem("token"));

  const notifySuccess = (message) => toast.success(message);
  const notifyError = (message) => toast.error(message);
  const dispatch=useDispatch();

  const { mutate, isPending } = useMutation({
    mutationFn: updateMe,
    onSuccess: (data) => {
      console.log(data);
      if (data?.status === "success") {
        notifySuccess(key("emailChanged"));
        dispatch(fetchProfileData(token));
      } else if (
        data.response.data.message ===
        "User recently changed password! Please log in again."
      ) {
        notifyError(key("recentlyChangedEmail"));
      } else {
      }
    },
    onError: (error) => {
      console.log(error);
      notifyError(key("emailFailed"));
    },
  });

  const initialValues = {
    email: "",
  };

  const onSubmit = (values) => {
    console.log(values);

    const formData = new FormData();
    formData.append("email", values.email);

    mutate({
      formData: formData,
      token: token,
    });
  };

  const validationSchema = object({
    email: string()
      .email(`${key("emailValidation1")}`)
      .required(`${key("emailValidation2")}`),
  });

  return (
    <>
      <Formik
        initialValues={initialValues}
        onSubmit={onSubmit}
        validationSchema={validationSchema}
      >
        <Form className={styles.general_info_form}>
          <div className={styles.field}>
            <label htmlFor="email">{key("email")}</label>
            <Field type="email" id="email" name="email" />
            <ErrorMessage name="email" component={InputErrorMessage} />
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
    </>
  );
};

export default ChangeEmail;
