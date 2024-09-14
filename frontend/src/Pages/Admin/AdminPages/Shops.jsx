import React, { useState } from "react";
import styles from "./AdminPages.module.css";
import { controlShops, getShops } from "../../../util/Http";
import { useMutation, useQuery } from "@tanstack/react-query";
import { ErrorMessage, Field, Form, Formik } from "formik";
import { mixed, object, string } from "yup";
import { faImage, faTrash, faYinYang } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useTranslation } from "react-i18next";
import toast, { Toaster } from "react-hot-toast";
import InputErrorMessage from "../../../Components/Ui/InputErrorMessage";
import Row from "react-bootstrap/esm/Row";
import Col from "react-bootstrap/esm/Col";
import LoadingOne from "../../../Components/Ui/LoadingOne";
import axios from "axios";

const Shops = () => {
  const { t: key } = useTranslation();
  const token = JSON.parse(localStorage.getItem("token"));
  const [selectedFile, setSelectedFile] = useState(null);

  const notifySuccess = (message) => toast.success(message);
  const notifyError = (message) => toast.error(message);

  const { data: shops, refetch } = useQuery({
    queryKey: ["shops", token],
    queryFn: getShops,
    staleTime: 300000,
  });

  const { mutate, isPending } = useMutation({
    mutationFn: controlShops,
    onSuccess: (data) => {
      console.log(data);
      if (data?.status === "success") {
        notifySuccess(key("opSuccess"));
        refetch();
      } else {
        notifyError(key("wrong"));
      }
    },
    onError: (error) => {
      console.log(error);
      notifyError(key("wrong"));
    },
  });

  const initialValues = {
    shapeImage: "",
    description: "",
    name: "",
  };

  const onSubmit = (values) => {
    console.log(values);
    const formData = new FormData();

    if (selectedFile) {
      formData.append("logo", selectedFile);
    } else {
      notifyError(key("uploadPhoto"));
      return;
    }
    formData.append("name", values.name);
    formData.append("description", values.description);

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
    description: string().required(key("descReq")),
    name: string().required(key("nameValidation3")),
  });

  const deleteShop = async (shopID) => {
    try {
      const response = await axios.delete(
        `${process.env.REACT_APP_Base_API_URl}shops/${shopID}`,
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
    notifySuccess(key("photoDownloaded"));
  };

  return (
    <>
      <Toaster position="top-right" />
      <div className={styles.main_body}>
        <Formik
          initialValues={initialValues}
          onSubmit={onSubmit}
          validationSchema={validationSchema}
        >
          <Form className={styles.general_info_form}>
            <div className={styles.photo_field}>
              <h4 className="fw-bold">Add New Store</h4>
              <h5>Store Logo</h5>
              <label className={styles.photo_label} htmlFor="shape">
                <FontAwesomeIcon className={styles.img_icon} icon={faImage} />
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

            <div className={styles.field}>
              <label htmlFor="name" className="mt-3">
                {key("add")} {key("name")}
              </label>
              <Field type="text" id="name" name="name" />
              <ErrorMessage name="name" component={InputErrorMessage} />
            </div>

            <div className={styles.field}>
              <label htmlFor="description">
                {key("add")} {key("description")}
              </label>
              <Field type="text" id="description" name="description" />
              <ErrorMessage name="description" component={InputErrorMessage} />
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
        <hr />
        <h4 className="fw-bold">All Stores</h4>
        <Row className="justify-content-center">
          {shops ? (
            shops.data?.map((shop) => (
              <Col
                key={shop._id}
                sm={4}
                className="d-flex justify-content-center align-items-center"
              >
                <div className={styles.shop_div}>
                  <FontAwesomeIcon
                    className={styles.delete_icon}
                    icon={faTrash}
                    onClick={() => deleteShop(shop._id)}
                  />
                  <img
                    src={`${process.env.REACT_APP_Host}shops/${shop.logo}`}
                    alt="shop"
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

export default Shops;
