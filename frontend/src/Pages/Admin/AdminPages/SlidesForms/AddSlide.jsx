import React, { useState } from "react";
import { faImage, faYinYang } from "@fortawesome/free-solid-svg-icons";
import { ErrorMessage, Field, Form, Formik } from "formik";
import InputErrorMessage from "../../../../Components/Ui/InputErrorMessage";
import { useMutation } from "@tanstack/react-query";
import { mixed, number, object } from "yup";
import { slidesController } from "../../../../util/Http";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import styles from "../AdminPages.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const AddSlide = ({ refetch }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState(null);
  const notifyError = (message) => toast.error(message);
  const { t: key } = useTranslation();
  const token = JSON.parse(localStorage.getItem("token"));

  const { mutate, isPending } = useMutation({
    mutationFn: slidesController,
  });

  const initialValues = {
    image: "",
    order: "",
  };

  const onSubmit = (values, { resetForm }) => {
    const formData = new FormData();
    if (selectedFile) {
      formData.append("image", selectedFile);
    } else {
      notifyError(key("uploadPhoto"));
      return;
    }
    formData.append("order", values.order);
    mutate(
      {
        formData: formData,
        token: token,
        type: "add",
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
    image: mixed()
      .test("fileSize", `${key("photoValidationSize")}`, (value) => {
        return value ? value.size <= 3000000 : true;
      })
      .test("fileType", `${key("photoValidationType")}`, (value) => {
        return value
          ? ["image/jpeg", "image/png", "image/jpg"].includes(value.type)
          : true;
      }),
    order: number().required(key("orderRec")),
  });

  const handleFileChange = (e) => {
    const file = e.currentTarget.files[0];
    if (file?.size > 20 * 1024 * 1024) {
      notifyError(key("imgSizeError"));
      return;
    }
    setSelectedFile(file);
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      setImagePreviewUrl(previewUrl);
    }
    e.target.value = null;
  };

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={onSubmit}
      validationSchema={validationSchema}
    >
      <Form className={styles.general_info_form}>
        <div className={styles.photo_field}>
          <h4>{key("slideImage")}</h4>
          <label
            className={
              imagePreviewUrl ? styles.photo_label_img : styles.photo_label
            }
            htmlFor="slideImage"
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
            id="slideImage"
            name="image"
            accept="image/*"
            onChange={handleFileChange}
            className="d-none"
          />
          <ErrorMessage name="image" component={InputErrorMessage} />
        </div>

        <div className={`${styles.field} mt-5`}>
          <label className="text-secondary" htmlFor="order">
            {key("priority")}
          </label>
          <Field type="number" id="order" name="order" />
          <ErrorMessage name="order" component={InputErrorMessage} />
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
  );
};

export default AddSlide;
