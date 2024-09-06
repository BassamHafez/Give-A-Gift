import React from "react";
import { UpdatePassword } from "../../util/Http";
import { useMutation } from "@tanstack/react-query";
import { ErrorMessage, Form, Formik, Field } from "formik";
import { object, ref, string } from "yup";
import InputErrorMessage from "../../Components/Ui/InputErrorMessage";
import styles from "./AccountManageMent.module.css";
import { faYinYang } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useTranslation } from "react-i18next";

const AccountManageMent = ({ notifySuccess, notifyError }) => {
  const { t: key } = useTranslation();

  const { mutate, isPending } = useMutation({
    mutationFn: UpdatePassword,
    onSuccess: (data) => {
      console.log(data);
      if (data.data.status === "success") {
        notifySuccess("Password has been changed successfully");
      }
    },
    onError: (error) => {
      console.log(error);
      notifyError("Password faild to be change please try again");
    },
  });

  const initialValues = {
    currentPassword: "",
    newPassword: "",
    passwordConfirm: "",
  };

  const onSubmit = (values) => {
    console.log(values);
    mutate({
      formData: values,
    });
  };

  const passwordRegex = string()
    .min(5, `${key("passwordValidation1")}`)
    .required(`${key("passwordValidation2")}`)
    .matches(/[A-Z]+/, `${key("passwordValidation3")}`)
    .matches(/[a-z]+/, `${key("passwordValidation4")}`)
    .matches(/[0-9]+/, `${key("passwordValidation5")}`);

  const validationSchema = object({
    currentPassword: passwordRegex,
    newPassword: passwordRegex,
    passwordConfirm: string()
      .oneOf([ref("newPassword"), null], `${key("passwordMismatch")}`)
      .required(`${key("passwordValidation2")}`),
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
            <label htmlFor="currentPass">Current Password</label>
            <Field type="password" id="currentPass" name="currentPassword" />
            <ErrorMessage name="currentPassword" component={InputErrorMessage} />
          </div>

          <div className={styles.field}>
            <label htmlFor="newPass">New Password</label>
            <Field type="password" id="newPass" name="newPassword" />
            <ErrorMessage name="newPassword" component={InputErrorMessage} />
          </div>
          <div className={styles.field}>
            <label htmlFor="confirmPass">Confirm Password</label>
            <Field type="password" id="confirmPass" name="passwordConfirm" />
            <ErrorMessage name="passwordConfirm" component={InputErrorMessage} />
          </div>

          <div className="d-flex justify-content-end align-items-center mt-3 px-2">
            {isPending ? (
              <button type="submit" className={styles.save_btn}>
                <FontAwesomeIcon className="fa-spin" icon={faYinYang} />
              </button>
            ) : (
              <button className={styles.save_btn} type="submit">
                Save
              </button>
            )}
          </div>
        </Form>
      </Formik>
    </>
  );
};

export default AccountManageMent;
