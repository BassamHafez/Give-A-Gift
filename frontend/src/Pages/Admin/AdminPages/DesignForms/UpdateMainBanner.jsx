import { useMutation } from "@tanstack/react-query";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import { mixed, object } from "yup";
import { faCheck, faYinYang } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ErrorMessage, Form, Formik } from "formik";
import InputErrorMessage from "../../../../Components/Ui/InputErrorMessage";
import { updateBanner } from "../../../../util/Http";
import styles from "../AdminPages.module.css";

const UpdateMainBanner = () => {
  const { t: key } = useTranslation();
  const token = JSON.parse(localStorage.getItem("token"));
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedImgUrl, setSelectedImgUrl] = useState(null);

  const notifySuccess = (message) => toast.success(message);
  const notifyError = (message) => toast.error(message);

  const { mutate, isPending } = useMutation({
    mutationFn: updateBanner,
    onSuccess: (data) => {
      if (data?.status === "success") {
        notifySuccess(key("photoChanged"));
      } else {
        notifyError(key("photoFaild"));
      }
    },
    onError: (error) => {
      notifyError(key("photoFaild"));
    },
  });

  const initialValues = {
    banner: "",
  };

  const onSubmit = () => {
    const formData = new FormData();

    if (selectedFile) {
      formData.append("image", selectedFile);
    } else {
      notifyError(key("uploadPhoto"));
      return;
    }

    mutate({
      formData: formData,
      token: token,
      type: "banner",
    });
  };

  const validationSchema = object({
    banner: mixed()
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
    setSelectedFile(file);
    if (file) {
      const imgUrl = URL.createObjectURL(file);
      setSelectedImgUrl(imgUrl);
      notifySuccess(key("photoDownloaded"));
    }
  };

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={onSubmit}
      validationSchema={validationSchema}
    >
      <Form className={styles.general_info_form}>
        <div className={styles.photo_field}>
          <h5 className="text-center fw-bold">
            {key("banner")}{" "}
            {selectedFile && (
              <FontAwesomeIcon className="text-success" icon={faCheck} />
            )}
          </h5>
          <label className={styles.banner_img_label} htmlFor="banner">
            {selectedImgUrl ? (
              <img src={selectedImgUrl} alt="prev_banner" />
            ) : (
              <img
                src={`${process.env.REACT_APP_Host}designs/banner.png`}
                alt="current_banner"
              />
            )}
          </label>
          <input
            type="file"
            id="banner"
            name="banner"
            accept="image/*"
            onChange={handleFileChange}
            className="d-none"
          />
          <ErrorMessage name="banner" component={InputErrorMessage} />
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
  );
};

export default UpdateMainBanner;
