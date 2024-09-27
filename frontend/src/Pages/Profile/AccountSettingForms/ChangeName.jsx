import React from "react";
import { updateMe } from "../../../util/Http";
import { useMutation } from "@tanstack/react-query";
import { ErrorMessage, Form, Formik, Field } from "formik";
import { object,string } from "yup";
import InputErrorMessage from "../../../Components/Ui/InputErrorMessage";
import styles from "./Forms.module.css";
import { faYinYang } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useTranslation } from "react-i18next";
import toast from "react-hot-toast";
import fetchProfileData from "../../../Store/profileInfo-actions";
import { useDispatch } from "react-redux";

const ChangeName = () => {
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
  const dispatch=useDispatch();

  const { mutate, isPending } = useMutation({
    mutationFn: updateMe,
    onSuccess: (data) => {
      if (data?.status === "success") {
        notifySuccess(key("nameChanged"));
        // notifySuccess(key("afterChange"))
        dispatch(fetchProfileData(token));
      }else if (
        data.response.data.message ===
        "User recently changed password! Please log in again."
      ) {
        notifyError(key("recentlyChangedName"));
      } else {
      }
    },
    onError: (error) => {
      notifyError(key("nameFaild"));
    },
  });

  const initialValues = {
    name: "",
  };

  const onSubmit = (values) => {
  
    const formData = new FormData();
    formData.append('name', values.name);
  
    mutate({
      formData: formData,
      token: token,
    });
  };
  

  const validationSchema = object({
    name: string()
      .min(3, `${key("nameValidation1")}`)
      .max(20, `${key("nameValidation2")}`)
      .required(`${key("nameValidation3")}`),
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
            <label htmlFor="name">{key("name")}</label>
            <Field type="text" id="name" name="name" />
            <ErrorMessage name="name" component={InputErrorMessage} />
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

export default ChangeName;
