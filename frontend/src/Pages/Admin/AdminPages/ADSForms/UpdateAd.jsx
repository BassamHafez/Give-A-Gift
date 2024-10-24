import React, { useState } from "react";
import {faYinYang } from "@fortawesome/free-solid-svg-icons";
import { ErrorMessage, Field, Form, Formik } from "formik";
import InputErrorMessage from "../../../../Components/Ui/InputErrorMessage";
import { useMutation } from "@tanstack/react-query";
import { mixed, number, object, string } from "yup";
import { adsController } from "../../../../util/Http";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import styles from "../AdminPages.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Modal from "react-bootstrap/Modal";

const UpdateAd = ({ refetch, show, onHide, adData }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState(null);
  const notifySuccess = (message) => toast.success(message);
  const notifyError = (message) => toast.error(message);
  const { t: key } = useTranslation();
  const token = JSON.parse(localStorage.getItem("token"));

  const { mutate, isPending } = useMutation({
    mutationFn: adsController,
  });

  const initialValues = {
    image: "",
    link: adData.link || "",
    order: adData.order || "",
  };

  const onSubmit = (values, { resetForm }) => {
    const formData = new FormData();
    if (selectedFile) {
      formData.append("image", selectedFile);
    }
    formData.append("link", values.link);
    formData.append("order", values.order);
    mutate(
      {
        formData: formData,
        token: token,
        type: "update",
        adId:adData._id
      },
      {
        onSuccess: (data) => {
          if (data?.status === "success") {
            notifySuccess(key("opSuccess"));
            refetch();
            resetForm();
            setSelectedFile(null);
            setImagePreviewUrl(null);
            onHide()
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
    link: string().when("isOnline", {
      is: (isOnline) => isOnline === "true",
      then: (schema) =>
        schema.url(key("invalidLink")).required(key("linkRequired")),
      otherwise: (schema) => schema.nullable(),
    }),
  });

  const handleUpdateFileChange = (e) => {
    const file = e.currentTarget.files[0];
    setSelectedFile(file);
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      setImagePreviewUrl(previewUrl);
      notifySuccess(key("photoDownloaded"));
    }
    e.target.value = null;
  };

  return (
    <Modal
      show={show}
      onHide={onHide}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
      className={styles.modal_container}
    >
      <Modal.Body className={`${styles.modal_body} text-center`}>
        <Formik
          initialValues={initialValues}
          onSubmit={onSubmit}
          validationSchema={validationSchema}
          enableReinitialize
        >
          {({ values }) => (
            <Form className={styles.general_info_form}>
              <div className={styles.photo_field}>
                <h4 className="fw-bold">{key("adsImage")}</h4>
                <label className={styles.photo_label_img} htmlFor="updateadsImage">
                  {imagePreviewUrl ? (
                    <img
                      src={imagePreviewUrl}
                      alt="Uploaded Preview"
                      className={styles.image_preview}
                    />
                  ) : (
                    <img
                      src={`${process.env.REACT_APP_Host}ads/${adData.image}`}
                      alt="old_image_Preview"
                      className={styles.image_preview}
                    />
                  )}
                </label>
                <input
                  type="file"
                  id="updateadsImage"
                  name="image"
                  accept="image/*"
                  onChange={handleUpdateFileChange}
                  className="d-none"
                />
                <ErrorMessage name="image" component={InputErrorMessage} />
              </div>

              <div className={`${styles.field} my-4`}>
                <label className="fw-bold text-secondary" htmlFor="updatelink">
                  {key("adLink")}
                </label>
                <Field type="text" id="updatelink" name="link" />
                <ErrorMessage name="link" component={InputErrorMessage} />
              </div>

              <div className={`${styles.field}`}>
                <label className="fw-bold text-secondary" htmlFor="updateorder">
                  {key("priority")}
                </label>
                <Field type="number" id="updateorder" name="order" />
                <ErrorMessage name="order" component={InputErrorMessage} />
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
          )}
        </Formik>{" "}
      </Modal.Body>
    </Modal>
  );
};

export default UpdateAd;
