import React, {useState } from "react";
import styles from "../AdminPages.module.css";
import { controlShapes } from "../../../../util/Http";
import { useMutation } from "@tanstack/react-query";
import { ErrorMessage, Field, Form, Formik } from "formik";
import { mixed, number, object } from "yup";
import { faImage, faYinYang } from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import InputErrorMessage from "../../../../Components/Ui/InputErrorMessage";

const AddShape = ({ refetch }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState(null);
  const notifyError = (message) => toast.error(message);
  const token = JSON.parse(localStorage.getItem("token"));
  const { t: key } = useTranslation();

  const { mutate, isPending } = useMutation({
    mutationFn: controlShapes,
  });

  const initialValues = {
    shapeImage: "",
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
    if (values.price) {
      formData.append("price", values.price);
    } else {
      formData.append("price", 0);
    }
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
            setSelectedFile(null);
            setImagePreviewUrl(null);
            resetForm();
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
    shapeImage: mixed()
      .test("fileSize", `${key("photoValidationSize")}`, (value) => {
        return value ? value.size <= 3000000 : true;
      })
      .test("fileType", `${key("photoValidationType")}`, (value) => {
        return value
          ? ["image/jpeg", "image/png", "image/jpg"].includes(value.type)
          : true;
      }),
    price: number().min(0, key("priceVali")),
    priority: number()
      .typeError(key("priorityValidation"))
      .required(key("priReq")),
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
          <h4>{key("shape")}</h4>
          <label
            className={
              imagePreviewUrl ? styles.photo_label_img : styles.photo_label
            }
            htmlFor="shape"
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
            id="shape"
            name="shapeImage"
            accept="image/*"
            onChange={handleFileChange}
            className="d-none"
          />
          <ErrorMessage name="shapeImage" component={InputErrorMessage} />
        </div>

        <div className={`${styles.field} my-4`}>
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
  );
};

export default AddShape;
