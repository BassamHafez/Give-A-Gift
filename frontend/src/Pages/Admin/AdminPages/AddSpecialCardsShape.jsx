import React, { useEffect, useState } from "react";
import styles from "./AdminPages.module.css";
import { addSpecialColorsShape } from "../../../util/Http";
import { useMutation } from "@tanstack/react-query";
import { ErrorMessage, Form, Formik } from "formik";
import { mixed, object } from "yup";
import { faYinYang } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import InputErrorMessage from "../../../Components/Ui/InputErrorMessage";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const AddSpecialCardsShape = () => {
  const { t: key } = useTranslation();
  const token = JSON.parse(localStorage.getItem("token"));
  const [selectedFrontShape, setSelectedFrontShape] = useState(null);
  const [selectedBackShape, setSelectedBackShape] = useState(null);
  const [frontImagePreviewUrl, setFrontImagePreviewUrl] = useState(null);
  const [backImagePreviewUrl, setBackImagePreviewUrl] = useState(null);

  const role = useSelector((state) => state.userInfo.role);
  const profileData = useSelector((state) => state.profileInfo.data);
  const navigate = useNavigate();

  useEffect(() => {
    if (role === "user") {
      navigate(`/`);
    } else if (role === "merchant") {
      navigate(`/merchant/${profileData?._id}`);
    }
  }, [role, navigate, profileData]);

  const notifySuccess = (message) => toast.success(message);
  const notifyError = (message) => toast.error(message);

  const { mutate, isPending } = useMutation({
    mutationFn: addSpecialColorsShape,
    onSuccess: (data) => {
      if (data?.status === "success") {
        notifySuccess(key("opSuccess"));
      } else {
        notifyError(key("wrong"));
      }
    },
    onError: (error) => {
      notifyError(key("wrong"));
    },
  });

  const initialValues = {
    frontShapeImage: "",
    backShapeImage: "",
  };

  const onSubmit = (values) => {
    const formData = new FormData();

    if (selectedFrontShape) {
      formData.append("frontShapeImage", selectedFrontShape);
    }
    if (selectedBackShape) {
      formData.append("backShapeImage", selectedBackShape);
    }
    if (!selectedFrontShape && !selectedBackShape) {
      notifyError(key("uploadPhoto"));
      return;
    }
    mutate({
      formData: formData,
      token: token,
    });
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
  });

  const handleFrontChange = (e) => {
    const file = e.currentTarget.files[0];
    setSelectedFrontShape(file);
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      setFrontImagePreviewUrl(previewUrl);
      notifySuccess(key("photoDownloaded"));
    }
  };
  const handleBackChange = (e) => {
    const file = e.currentTarget.files[0];
    setSelectedBackShape(file);
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      setBackImagePreviewUrl(previewUrl);
      notifySuccess(key("photoDownloaded"));
    }
  };

  return (
    <>
      <Formik
        initialValues={initialValues}
        onSubmit={onSubmit}
        validationSchema={validationSchema}
      >
        <Form className={styles.general_info_form}>
          <div className={styles.photo_field}>
            <h4 className="fw-bold">{key("frontShape")}</h4>
            <label
              className={styles.banner_img_label}
              htmlFor="frontShapeImage"
            >
              {frontImagePreviewUrl ? (
                <img src={frontImagePreviewUrl} alt="prev_front_shape" />
              ) : (
                <img
                  src={`${process.env.REACT_APP_Host}specialCards/front-shape.webp`}
                  alt="current_front_shape"
                />
              )}
            </label>
            <input
              type="file"
              id="frontShapeImage"
              name="frontShapeImage"
              accept="image/*"
              onChange={handleFrontChange}
              className="d-none"
            />
            <ErrorMessage
              name="frontShapeImage"
              component={InputErrorMessage}
            />
          </div>
          <br />
          <div className={styles.photo_field}>
            <h4 className="fw-bold">{key("backShape")}</h4>
            <label className={styles.banner_img_label} htmlFor="backShapeImage">
              {backImagePreviewUrl ? (
                <img src={backImagePreviewUrl} alt="prev_back_shape" />
              ) : (
                <img
                  src={`${process.env.REACT_APP_Host}specialCards/back-shape.webp`}
                  alt="current_back_shape"
                />
              )}
            </label>
            <input
              type="file"
              id="backShapeImage"
              name="backShapeImage"
              accept="image/*"
              onChange={handleBackChange}
              className="d-none"
            />
            <ErrorMessage name="backShapeImage" component={InputErrorMessage} />
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

export default AddSpecialCardsShape;
