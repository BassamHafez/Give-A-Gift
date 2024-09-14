import React from "react";
import styles from "./AdminPages.module.css";
import { controlColors, getColors } from "../../../util/Http";
import { useMutation, useQuery } from "@tanstack/react-query";
import { ErrorMessage, Form, Formik, Field } from "formik";
import { object, string } from "yup";
import { faTrash, faYinYang } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useTranslation } from "react-i18next";
import toast, { Toaster } from "react-hot-toast";
import InputErrorMessage from "../../../Components/Ui/InputErrorMessage";
import Row from "react-bootstrap/esm/Row";
import Col from "react-bootstrap/esm/Col";
import LoadingOne from "../../../Components/Ui/LoadingOne";
import axios from "axios";

const Colors = () => {
  const { t: key } = useTranslation();
  const token = JSON.parse(localStorage.getItem("token"));

  const notifySuccess = (message) => toast.success(message);
  const notifyError = (message) => toast.error(message);

  const { data: Colors,refetch } = useQuery({
    queryKey: ["colors"],
    queryFn: getColors,
    staleTime: 300000,
  });

  const { mutate, isPending } = useMutation({
    mutationFn: controlColors,
    onSuccess: (data) => {
      console.log(data);
      if (data?.status === "success") {
        notifySuccess(key("opSuccess"));
        refetch()
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
    hex: "",
  };

  const onSubmit = (values) => {
    console.log(values);

    mutate({
      formData: values,
      token: token,
      method: "add",
    });
  };

  const validationSchema = object({
    hex: string().required(`${key("colorreq")}`),
  });

  const deleteColor = async (colorId) => {
    try {
      const response = await axios.delete(
        `${process.env.REACT_APP_Base_API_URl}colors/${colorId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (response.status===204) {
        notifySuccess(key("opSuccess"));
        refetch()
      } else {
        notifyError(key("wrong"));
      }
    } catch (error) {
      console.error(error);
      notifyError(key("wrong"));
    }
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
            <div className={styles.field}>
              <label htmlFor="color">
                {key("add")} {key("color")}
              </label>
              <Field type="text" id="color" name="hex" />
              <ErrorMessage name="hex" component={InputErrorMessage} />
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
        <h4>All Colors</h4>
        <Row className="justify-content-center">
          {Colors ? (
            Colors.data.map((color) => (
              <Col
                key={color._id}
                xs={6}
                sm={3}
                className="d-flex justify-content-center align-items-center"
              >
                <div
                  className={styles.color_square}
                  style={{ backgroundColor: `${color?.hex}` }}
                >
                  <FontAwesomeIcon
                    className={styles.delete_icon}
                    icon={faTrash}
                    onClick={()=>deleteColor(color._id)}
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

export default Colors;
