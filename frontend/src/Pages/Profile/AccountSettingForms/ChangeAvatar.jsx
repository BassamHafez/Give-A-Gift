import React, { useState } from "react";
import { updateMe } from "../../../util/Http";
import { useMutation } from "@tanstack/react-query";
import { ErrorMessage, Form, Formik } from "formik";
import { mixed, object } from "yup";
import InputErrorMessage from "../../../Components/Ui/InputErrorMessage";
import styles from "./Forms.module.css";
import {faYinYang } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useTranslation } from "react-i18next";
import fetchProfileData from "../../../Store/profileInfo-actions";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";

const ChangeAvatar = () => {
  const { t: key } = useTranslation();
  const token = JSON.parse(localStorage.getItem("token"));
  const [selectedFile, setSelectedFile] = useState(null);
  const [imgUrl, setImgUrl] = useState(null);
  const profileData = useSelector((state) => state.profileInfo.data);

  const notifySuccess = (message) => toast.success(message);
  const notifyError = (message) => toast.error(message);
  const dispatch = useDispatch();

  const { mutate, isPending } = useMutation({
    mutationFn: updateMe,
    onSuccess: (data) => {
      if (data?.status === "success") {
        notifySuccess(key("photoChanged"));
        dispatch(fetchProfileData(token));
      } else if (
        data.response.data.message ===
        "User recently changed password! Please log in again."
      ) {
        notifyError(key("recentlyChangedPhoto"));
      } else {
      }
    },
    onError: (error) => {
      notifyError(key("photoFaild"));
    },
  });

  const initialValues = {
    photo: "",
  };

  const onSubmit = () => {
    const formData = new FormData();

    if (selectedFile) {
      formData.append("photo", selectedFile);
    } else {
      notifyError(key("uploadPhoto"));
      return;
    }

    mutate({
      formData: formData,
      token: token,
    });
  };

  const validationSchema = object({
    photo: mixed()
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
      const avatarUrl = URL.createObjectURL(file);
      setImgUrl(avatarUrl);
      notifySuccess(key("photoDownloaded"));
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
          <h5 className="mb-4">
            {key("photo")}
          </h5>
          <div className={styles.photo_field}>
            <label className={styles.avatar_label} htmlFor="photo">
              {imgUrl?<img src={imgUrl} alt="selected_img"/>:<img src={`${process.env.REACT_APP_Host}users/${profileData?.photo}`} alt="current_img"/>}
            </label>
            <input
              type="file"
              id="photo"
              name="photo"
              accept="image/*"
              onChange={handleFileChange}
              className="d-none"
            />
            <ErrorMessage name="photo" component={InputErrorMessage} />
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
    </>
  );
};

export default ChangeAvatar;
