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

const UpdateSecondaryBanner = () => {
  const { t: key } = useTranslation();
  const token = JSON.parse(localStorage.getItem("token"));
  const [webBannerFile, setWebBannerFile] = useState(null);
  const [selectedWebImgUrl, setSelectedWebImgUrl] = useState(null);

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
    webSecondaryBanner: "",
  };

  const onSubmit = () => {
    const formData = new FormData();

    if (webBannerFile) {
      formData.append("webSecondaryBanner", webBannerFile);
    }else{
      notifyError(key("uploadPhoto"));
      return;
    }

    mutate({
      formData: formData,
      token: token,
      type: "secondary-banners",
    });
  };

  const validationSchema = object({
    webSecondaryBanner: mixed()
      .test("fileSize", `${key("photoValidationSize")}`, (value) => {
        return value ? value.size <= 3000000 : true;
      })
      .test("fileType", `${key("photoValidationType")}`, (value) => {
        return value
          ? ["image/jpeg", "image/png", "image/jpg"].includes(value.type)
          : true;
      }),
  });

  const handleWebFileChange = (e) => {
    const file = e.currentTarget.files[0];
    if (file?.size > 20 * 1024 * 1024) {
      notifyError(key("imgSizeError"));
      return;
    }
    setWebBannerFile(file);
    if (file) {
      const imgUrl = URL.createObjectURL(file);
      setSelectedWebImgUrl(imgUrl);
      notifySuccess(key("photoDownloaded"));
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
          <div className="mb-5">
            <h5 className="text-center fw-bold">
              {key("webSecBanner")}{" "}
              {webBannerFile && (
                <FontAwesomeIcon className="text-success" icon={faCheck} />
              )}
            </h5>
            <label
              className={styles.web_sub_banner_label}
              htmlFor="webSecondaryBanner"
            >
              {selectedWebImgUrl ? (
                <img src={selectedWebImgUrl} alt="prev_banner" />
              ) : (
                <img
                  src={`${process.env.REACT_APP_Host}designs/web-secondary-banner.png`}
                  alt="current_web_banner"
                />
              )}
            </label>
            <input
              type="file"
              id="webSecondaryBanner"
              name="webSecondaryBanner"
              accept="image/*"
              onChange={handleWebFileChange}
              className="d-none"
            />
            <ErrorMessage
              name="webSecondaryBanner"
              component={InputErrorMessage}
            />
          </div>
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

export default UpdateSecondaryBanner;
