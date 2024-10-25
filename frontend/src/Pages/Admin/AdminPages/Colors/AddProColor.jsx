import { useMutation } from "@tanstack/react-query";
import React, { useState } from "react";
import { addProColor } from "../../../../util/Http";
import { useTranslation } from "react-i18next";
import { mixed, number, object } from "yup";
import { ErrorMessage, Field, Form, Formik } from "formik";
import styles from "../AdminPages.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faImage, faYinYang } from "@fortawesome/free-solid-svg-icons";
import InputErrorMessage from "../../../../Components/Ui/InputErrorMessage";
import { toast } from "react-toastify";

const AddProColor = ({ refetch }) => {
  const { t: key } = useTranslation();
  const token = JSON.parse(localStorage.getItem("token"));
  const [selectedFile, setSelectedFile] = useState(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState(null);

  const notifyError = (message) => toast.error(message);

  const { mutate, isPending } = useMutation({
    mutationFn: addProColor,
  });

  const initialValues = {
    img: "",
    price: "",
    priority: "",
  };

  const onSubmit = (values, { resetForm }) => {
    const formData = new FormData();

    if (selectedFile) {
      formData.append("image", selectedFile);
    } else {
      notifyError(key("uploadPhoto"));
      return;
    }
    formData.append("price", values.price);
    formData.append("priority", values.priority);
    mutate(
      {
        formData: formData,
        token: token,
      },
      {
        onSuccess: (data) => {
          if (data?.status === "success") {
            refetch();
            resetForm();
            setSelectedFile(null);
            setImagePreviewUrl(null);
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
    priority: number()
      .typeError(key("priorityValidation"))
      .required(key("priReq")),
  });

  const handleFileChange = (e) => {
    const file = e.currentTarget.files[0];
    setSelectedFile(file);
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      setImagePreviewUrl(previewUrl);
    }
    e.target.value = null;
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
            <label
              className={
                imagePreviewUrl ? styles.photo_label_img : styles.photo_label
              }
              htmlFor="img"
            >
              {imagePreviewUrl ? (
                <img
                  src={imagePreviewUrl}
                  alt="Uploaded Preview"
                  className={styles.image_preview}
                />
              ) : (
                <FontAwesomeIcon className={styles.img_icon} icon={faImage} />
              )}
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
