import { useMutation } from "@tanstack/react-query";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { addProColor } from "../../../../util/Http";
import { useTranslation } from "react-i18next";
import { mixed, number, object } from "yup";
import { ErrorMessage, Field, Form, Formik } from "formik";
import styles from "../AdminPages.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faImage, faYinYang } from "@fortawesome/free-solid-svg-icons";
import InputErrorMessage from "../../../../Components/Ui/InputErrorMessage";

const AddProColor = ({ refetch }) => {
  const { t: key } = useTranslation();
  const token = JSON.parse(localStorage.getItem("token"));
  const [selectedFile, setSelectedFile] = useState(null);


  const notifySuccess = (message) => toast.success(message);
  const notifyError = (message) => toast.error(message);

  const { mutate, isPending } = useMutation({
    mutationFn: addProColor,
    onSuccess: (data) => {
      if (data?.status === "success") {
        notifySuccess(key("opSuccess"));
        refetch();
      } else {
        notifyError(key("wrong"));
      }
    },
    onError: (error) => {
      notifyError(key("wrong"));
    },
  });

  const initialValues = {
    img: "",
    price: "",
  };

  const onSubmit = (values) => {

    const formData = new FormData();

    if (selectedFile) {
      formData.append("image", selectedFile);
    } else {
      notifyError(key("uploadPhoto"));
      return;
    }
    formData.append("price", values.price);
    mutate({
      formData: formData,
      token: token,
    });
  };

  const validationSchema = object({
    img: mixed()
      .test("fileSize", `${key("photoValidationSize")}`, (value) => {
        return value ? value.size <= 3000000 : true;
      })
      .test("fileType", `${key("photoValidationType")}`, (value) => {
        return value
          ? ["image/jpeg", "image/png", "image/jpg"].includes(value.type)
          : true;
      }),
    price: number().required(key("priceRec")).min(1, key("priceVali")),
  });

  const handleFileChange = (e) => {
    const file = e.currentTarget.files[0];
    setSelectedFile(file);
    notifySuccess(key("photoDownloaded"));
  };

  return (
    <>
      <Formik
        initialValues={initialValues}
        onSubmit={onSubmit}
        validationSchema={validationSchema}
      >
        <Form className={styles.general_info_form}>
          <h5 className="fw-bold text-secondary">{key("addProColor")}</h5>
          <div className={styles.photo_field}>
            <label className={styles.photo_label} htmlFor="img">
              <FontAwesomeIcon className={styles.img_icon} icon={faImage} />
            </label>
            <input
              type="file"
              id="img"
              name="img"
              accept="image/*"
              onChange={handleFileChange}
              className="d-none"
            />
            <ErrorMessage name="img" component={InputErrorMessage} />
          </div>
          <div className={`${styles.field} mt-4`}>
            <label className="fw-bold text-secondary" htmlFor="price">
              {key("price")}
            </label>
            <Field type="number" id="price" name="price" />
            <ErrorMessage name="price" component={InputErrorMessage} />
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

    </>
  );
};

export default AddProColor;
