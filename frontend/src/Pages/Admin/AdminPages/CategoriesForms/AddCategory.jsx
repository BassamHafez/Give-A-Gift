import React, {useState } from "react";
import styles from "../AdminPages.module.css";
import { ErrorMessage, Field, Form, Formik } from "formik";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faImage,
  faYinYang,
} from "@fortawesome/free-solid-svg-icons";
import InputErrorMessage from "../../../../Components/Ui/InputErrorMessage";
import { useMutation } from "@tanstack/react-query";
import {
  categoriesController,
} from "../../../../util/Http";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import { mixed,object, string } from "yup";

const AddCategory = ({refetch}) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState(null);

  const { t: key } = useTranslation();
  const notifyError = (message) => toast.error(message);
  const token = JSON.parse(localStorage.getItem("token"));

  const { mutate, isPending } = useMutation({
    mutationFn: categoriesController,
  });

  const initialValues = {
    icon: "",
    name: "",
    enName: "",
  };

  const onSubmit = (values, { resetForm }) => {
    const formData = new FormData();

    if (selectedFile) {
      formData.append("icon", selectedFile);
    } else {
      notifyError(key("uploadPhoto"));
      return;
    }

    formData.append("enName", values.enName);
    formData.append("name", values.name);

    mutate(
      {
        formData: formData,
        token: token,
        type:"add"
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

  const validationSchema =object({
    name: string().required(key("nameValidation3")),
    enName: string().required(key("nameValidation3")),
    icon: mixed()
    .test("fileSize", `${key("photoValidationSize")}`, (value) => {
      return value ? value.size <= 3000000 : true;
    })
    .test("fileType", `${key("photoValidationType")}`, (value) => {
      return value
        ? ["image/jpeg", "image/png", "image/jpg"].includes(value.type)
        : true;
    }),
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
            <h5>{key("icon")}</h5>
            <label
              className={
                imagePreviewUrl ? styles.photo_label_img : styles.photo_label
              }
              htmlFor="icon"
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
              id="icon"
              name="icon"
              accept="image/*"
              onChange={handleFileChange}
              className="d-none"
            />
            <ErrorMessage name="icon" component={InputErrorMessage} />
          </div>

          <div className={styles.field}>
            <label htmlFor="name" className="mt-3">
              {key("arName")}
            </label>
            <Field type="text" id="name" name="name" />
            <ErrorMessage name="name" component={InputErrorMessage} />
          </div>

          <div className={styles.field}>
            <label htmlFor="enName">
              {key("enName")}
            </label>
            <Field type="text" id="enName" name="enName" />
            <ErrorMessage name="enName" component={InputErrorMessage} />
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

export default AddCategory;
