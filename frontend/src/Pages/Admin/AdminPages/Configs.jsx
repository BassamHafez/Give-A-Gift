import React, { useEffect, useState } from "react";
import styles from "./AdminPages.module.css";
import { getConfig, getShapes } from "../../../util/Http";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ErrorMessage, Field, Form, Formik } from "formik";
import { object, string } from "yup";
import { faYinYang } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useTranslation } from "react-i18next";
import toast, { Toaster } from "react-hot-toast";
import InputErrorMessage from "../../../Components/Ui/InputErrorMessage";
import Select from "react-select";

const Configs = () => {
  const { t: key } = useTranslation();
  const token = JSON.parse(localStorage.getItem("token"));
  const [myShapes, setMyShapes] = useState([]);
  const queryClient = useQueryClient();

  const notifySuccess = (message) => toast.success(message);
  const notifyError = (message) => toast.error(message);

  const { data: configs, refetch } = useQuery({
    queryKey: ["configs"],
    queryFn: getConfig,
    staleTime: Infinity,
  });

  const { data: shapes } = useQuery({
    queryKey: ["shapes", token],
    queryFn: getShapes,
    staleTime: Infinity,
  });

  const findConfigByKey = (arr, targetKey) => {
    return Array.isArray(arr)
      ? arr.find((config) => config.key === targetKey)
      : undefined;
  };

  useEffect(() => {
    if (shapes) {
      const shapeArr = shapes.data?.map((shape) => ({
        label: (
          <div className={styles.select_shape}>
            <img
              src={`${process.env.REACT_APP_Host}shapes/${shape.image}`}
              alt="card Shape"
            />
          </div>
        ),
        value: shape._id,
      }));
      setMyShapes(shapeArr);
    }
  }, [shapes]);

  const { mutate, isPending } = useMutation({
    mutationFn: getConfig,
    onSuccess: (data) => {
      console.log(data);
      if (data?.status === "success") {
        notifySuccess(key("opSuccess"));
        queryClient.invalidateQueries(["configs"]);
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
    WALLET_STARTING_BALANCE:
      findConfigByKey(configs?.data, "WALLET_STARTING_BALANCE")?.value || "",
    MAIN_COLOR: findConfigByKey(configs?.data, "MAIN_COLOR")?.value || "",
    SECONDRY_COLOR:
      findConfigByKey(configs?.data, "SECONDRY_COLOR")?.value || "",
    SPECIAL_FRONT_SHAPE_ID:
      findConfigByKey(configs?.data, "SPECIAL_FRONT_SHAPE_ID")?.value || "",
    SPECIAL_BACK_SHAPE_ID:
      findConfigByKey(configs?.data, "SPECIAL_BACK_SHAPE_ID")?.value || "",
    VAT_VALUE: findConfigByKey(configs?.data, "VAT_VALUE")?.value || "",
  };

  const onSubmit = (values) => {
    console.log(values);
    mutate({
      type: "update",
      formData: values,
      token: token,
    });
  };

  const validationSchema = object({
    WALLET_STARTING_BALANCE: string().min(0, key("walletStartingBalance")),
    VAT_VALUE: string().min(0, key("vatValue")),
    MAIN_COLOR: string(),
    SECONDRY_COLOR: string(),
    SPECIAL_FRONT_SHAPE_ID: string(),
    SPECIAL_BACK_SHAPE_ID: string(),
  });

  return (
    <>
      <Toaster position="top-right" />
      <div className={`${styles.main_body} ${styles.configs_body}`}>
        <Formik
          initialValues={initialValues}
          onSubmit={onSubmit}
          validationSchema={validationSchema}
          enableReinitialize
        >
          {({ setFieldValue }) => (
            <Form className={styles.general_info_form}>
              <div className={styles.field}>
                <h4 className="fw-bold">{key("frontShape")}</h4>
                <Select
                  className={` mb-3`}
                  classNamePrefix="SPECIAL_FRONT_SHAPE_ID"
                  isClearable={false}
                  isSearchable={true}
                  name="SPECIAL_FRONT_SHAPE_ID"
                  placeholder={key("shapes")}
                  options={myShapes ? myShapes : []}
                  onChange={(value) => {
                    setFieldValue("SPECIAL_FRONT_SHAPE_ID", value.value);
                  }}
                />
                <ErrorMessage
                  name="SPECIAL_FRONT_SHAPE_ID"
                  component={InputErrorMessage}
                />
              </div>
              <div className={styles.field}>
                <h4 className="fw-bold">{key("backShape")}</h4>
                <Select
                  className={`mb-3`}
                  classNamePrefix="SPECIAL_BACK_SHAPE_ID"
                  isClearable={false}
                  isSearchable={true}
                  name="SPECIAL_BACK_SHAPE_ID"
                  placeholder={key("shapes")}
                  options={myShapes ? myShapes : []}
                  onChange={(value) => {
                    setFieldValue("SPECIAL_BACK_SHAPE_ID", value.value);
                  }}
                />
                <ErrorMessage
                  name="SPECIAL_BACK_SHAPE_ID"
                  component={InputErrorMessage}
                />
              </div>
              <div className={styles.field}>
                <label htmlFor="walletStarting" className="mt-3">
                  {key("walletStarting")}
                </label>
                <Field
                  type="text"
                  id="walletStarting"
                  name="WALLET_STARTING_BALANCE"
                />
                <ErrorMessage
                  name="WALLET_STARTING_BALANCE"
                  component={InputErrorMessage}
                />
              </div>
              <div className={styles.field}>
                <label htmlFor="VAT_VALUE" className="mt-3">
                  {key("Vatvalue")}
                </label>
                <Field type="text" id="VAT_VALUE" name="VAT_VALUE" />
                <ErrorMessage name="VAT_VALUE" component={InputErrorMessage} />
              </div>
              <div className={styles.field}>
                <label htmlFor="MAIN_COLOR" className="mt-3">
                  {key("mainColor")}
                </label>
                <Field type="text" id="MAIN_COLOR" name="MAIN_COLOR" />
                <ErrorMessage name="MAIN_COLOR" component={InputErrorMessage} />
              </div>
              <div className={styles.field}>
                <label htmlFor="SECONDRY_COLOR" className="mt-3">
                  {key("subColor")}
                </label>
                <Field type="text" id="SECONDRY_COLOR" name="SECONDRY_COLOR" />
                <ErrorMessage
                  name="SECONDRY_COLOR"
                  component={InputErrorMessage}
                />
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
        </Formik>
      </div>
    </>
  );
};

export default Configs;
