import React, { useState } from "react";
import styles from "../AdminPages.module.css";
import { controlCoupons } from "../../../../util/Http";
import { useMutation } from "@tanstack/react-query";
import { ErrorMessage, Form, Formik, Field } from "formik";
import { number, object, string } from "yup";
import { faYinYang } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useTranslation } from "react-i18next";
import toast from "react-hot-toast";
import InputErrorMessage from "../../../../Components/Ui/InputErrorMessage";
import DatePicker from "react-multi-date-picker";
import TimePicker from "react-multi-date-picker/plugins/time_picker";

const AddCoupon = ({refetch}) => {
  const { t: key } = useTranslation();
  const token = JSON.parse(localStorage.getItem("token"));
  const [dateTime, setDateTime] = useState(null);

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
    mutationFn: controlCoupons,
    onSuccess: (data) => {
      if (data?.status === "success") {
        notifySuccess(key("opSuccess"));
        refetch()
      }else if (data?.response?.data?.error?.code===11000){
        notifyError(key("dupName"))
      }
       else {
        notifyError(key("wrong"));
      }
    },
    onError: (error) => {
      notifyError(key("wrong"));
    },
  });

  const initialValues = {
    name: "",
    expire: "",
    discount: "",
  };

  const onSubmit = (values) => {

    mutate({
      formData: values,
      token: token,
      method: "add",
    });
  };

  const validationSchema = object({
    name: string()
      .required(`${key("nameValidation3")}`)
      .min(3, key("nameValidation1")),
    expire: string()
      .required(key("expRec"))
      .test("is-future-time", key("futureTime"), function (value) {
        if (!value) return false;
        const selectedDateTime = new Date(value);
        return selectedDateTime > new Date();
      }),
    discount: number()
      .required(`${key("discountRec")}`)
      .min(1, key("minZero")).max(100, key("maxZero")),
  });

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={onSubmit}
      validationSchema={validationSchema}
    >
      {({ setFieldValue }) => (
        <Form>
          <div className={styles.field}>
            <label htmlFor="name">{key("name")}</label>
            <Field type="text" id="name" name="name" />
            <ErrorMessage name="name" component={InputErrorMessage} />
          </div>
          <div className={styles.field}>
            <label htmlFor="discount">{key("discount")}</label>
            <Field type="text" id="discount" name="discount" />
            <ErrorMessage name="discount" component={InputErrorMessage} />
          </div>
          <div className={styles.field}>
            <label htmlFor="expire">{key("dicexpire")}</label>
            <DatePicker
              value={dateTime}
              onChange={(value) => {
                setDateTime(value);
                const formattedDateTime = new Date(value).toISOString();
                setFieldValue("expire", formattedDateTime);
              }}
              format="YYYY/MM/DD HH:mm"
              plugins={[<TimePicker position="top" />]}
              placeholder="YYYY/MM/DD HH:mm"
              className={styles.date_picker}
            />
            <ErrorMessage name="expire" component={InputErrorMessage} />
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
      )}
    </Formik>
  );
};

export default AddCoupon;
