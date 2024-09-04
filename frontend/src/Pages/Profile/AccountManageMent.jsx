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

const AccountManageMent = () => {
  const { t: key } = useTranslation();

  const { mutate, isPending } = useMutation({
    mutationFn: UpdatePassword,
    onSuccess: (data) => {
      if (data.data.status === "success") {
        //success message
      }
    },
    onError: (error) => {
      console.log(error);
      //error message
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
            <Field type="text" id="currentPass" name="currentPass" />
            <ErrorMessage name="currentPass" component={InputErrorMessage} />
          </div>

          <div className={styles.field}>
            <label htmlFor="newPass">New Password</label>
            <Field
              type="text"
              id="newPass"
              name="newPass"
            />
            <ErrorMessage name="newPass" component={InputErrorMessage} />
          </div>
          <div className={styles.field}>
            <label htmlFor="confirmPass">Confirm Password</label>
            <Field
              type="text"
              id="confirmPass"
              name="confirmPass"
            />
            <ErrorMessage name="confirmPass" component={InputErrorMessage} />
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
