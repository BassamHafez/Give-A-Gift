import React, { useEffect, useState } from "react";
import styles from "./AdminPages.module.css";
import { controlShapes, getShapes } from "../../../util/Http";
import { useMutation, useQuery } from "@tanstack/react-query";
import { ErrorMessage, Field, Form, Formik } from "formik";
import { mixed, number, object } from "yup";
import {
  faCrown,
  faImage,
  faTrash,
  faYinYang,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useTranslation } from "react-i18next";
import InputErrorMessage from "../../../Components/Ui/InputErrorMessage";
import Row from "react-bootstrap/esm/Row";
import Col from "react-bootstrap/esm/Col";
import LoadingOne from "../../../Components/Ui/LoadingOne";
import axios from "axios";
import AddSpecialCardsShape from "./AddSpecialCardsShape";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const Shapes = () => {
  const { t: key } = useTranslation();
  const token = JSON.parse(localStorage.getItem("token"));
  const [selectedFile, setSelectedFile] = useState(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState(null);

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

  const { data: shapes, refetch } = useQuery({
    queryKey: ["shapes", token],
    queryFn: getShapes,
    staleTime: Infinity,
  });

  const { mutate, isPending } = useMutation({
    mutationFn: controlShapes,
  });

  const initialValues = {
    shapeImage: "",
    price: "",
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

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
    mutate(
      {
        formData: formData,
        token: token,
      },
      {
        onSuccess: (data) => {
          if (data?.status === "success") {
            notifySuccess(key("opSuccess"));
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
  });

  const deleteShape = async (shapeID) => {
    try {
      const response = await axios.delete(
        `${process.env.REACT_APP_Base_API_URl}shapes/${shapeID}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (response.status === 204) {
        notifySuccess(key("opSuccess"));
        refetch();
      } else {
        notifyError(key("wrong"));
      }
    } catch (error) {
      console.error(error);
      notifyError(key("wrong"));
    }
  };

  const handleFileChange = (e) => {
    const file = e.currentTarget.files[0];
    setSelectedFile(file);
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      setImagePreviewUrl(previewUrl);
      notifySuccess(key("photoDownloaded"));
    }
  };

  return (
    <>
      <div className={styles.main_body}>
        <div className={styles.configs_body}>
          <div className="my-5">
            <h4 className="fw-bold text-secondary">
              {key("changeReadyCards")}
            </h4>
            <AddSpecialCardsShape />
          </div>
          <div>
            <h4 className="fw-bold text-secondary">
              {key("add")} {key("customCards")}
            </h4>
            <Formik
              initialValues={initialValues}
              onSubmit={onSubmit}
              validationSchema={validationSchema}
            >
              <Form className={styles.general_info_form}>
                <div className={styles.photo_field}>
                  <h4 className="fw-bold">
                    {key("add")} {key("shape")}
                  </h4>
                  <label
                    className={
                      imagePreviewUrl
                        ? styles.photo_label_img
                        : styles.photo_label
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
                      <FontAwesomeIcon
                        className={styles.img_icon}
                        icon={faImage}
                      />
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
                  <ErrorMessage
                    name="shapeImage"
                    component={InputErrorMessage}
                  />
                </div>
                <div className={`${styles.field} my-4`}>
                  <label className="fw-bold text-secondary" htmlFor="price">
                    {key("add")} {key("price")}
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
          </div>
        </div>

        <hr />
        <h4 className="fw-bold">{key("allShapes")}</h4>
        <Row className="justify-content-center">
          {shapes ? (
            shapes.data?.map((shape) => (
              <Col
                key={shape._id}
                sm={4}
                className="d-flex justify-content-center align-items-center"
              >
                <div className={styles.shape_div}>
                  <FontAwesomeIcon
                    className={styles.delete_icon}
                    icon={faTrash}
                    onClick={() => deleteShape(shape._id)}
                  />
                  {shape.price > 0 && (
                    <FontAwesomeIcon
                      className={styles.shape_crown}
                      icon={faCrown}
                    />
                  )}
                  <img
                    src={`${process.env.REACT_APP_Host}shapes/${shape.image}`}
                    alt="shape"
                  />
                </div>
              </Col>
            ))
          ) : (
            <LoadingOne />
          )}
        </Row>
      </div>
    </>
  );
};

export default Shapes;
