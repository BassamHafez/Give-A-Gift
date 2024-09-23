import React, { useEffect } from "react";
import styles from "./AdminPages.module.css";
import { getConfig } from "../../../util/Http";
import { useMutation } from "@tanstack/react-query";
import { ErrorMessage, Field, Form, Formik } from "formik";
import { object, string } from "yup";
import { faYinYang } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useTranslation } from "react-i18next";
import toast, { Toaster } from "react-hot-toast";
import InputErrorMessage from "../../../Components/Ui/InputErrorMessage";
import { useDispatch, useSelector } from "react-redux";
import fetchConfigs from "../../../Store/configs-actions";

const Configs = () => {
  const { t: key } = useTranslation();
  const token = JSON.parse(localStorage.getItem("token"));
  const dispatch = useDispatch();

  const notifySuccess = (message) => toast.success(message);
  const notifyError = (message) => toast.error(message);

  const mainColor = useSelector((state) => state.configs.mainColor);
  const subColor = useSelector((state) => state.configs.subColor);
  const VAT = useSelector((state) => state.configs.VAT);
  const celebrateIconPrice = useSelector(
    (state) => state.configs.celebrateIconPrice
  );
  const celebrateLinkPrice = useSelector(
    (state) => state.configs.celebrateLinkPrice
  );
  const walletStarting = useSelector((state) => state.configs.walletStarting);

  const { mutate, isPending } = useMutation({
    mutationFn: getConfig,
    onSuccess: (data) => {
      if (data?.status === "success") {
        notifySuccess(key("opSuccess"));
        dispatch(fetchConfigs(token));
      } else {
        notifyError(key("wrong"));
      }
    },
    onError: (error) => {
      notifyError(key("wrong"));
    },
  });

  const initialValues = {
    WALLET_STARTING_BALANCE: walletStarting || "",
    MAIN_COLOR: mainColor || "",
    SECONDRY_COLOR: subColor || "",
    VAT_VALUE: VAT || "",
    CELEBRATE_ICON_PRICE: celebrateIconPrice || "",
    CELEBRATE_LINK_PRICE: celebrateLinkPrice || "",
  };

  const onSubmit = (values) => {
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
  useEffect(()=>{
    window.scrollTo(0, 0)
  },[])
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
            <Form className={styles.general_info_form}>
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
              <div className={styles.field}>
                <label htmlFor="CELEBRATE_ICON_PRICE" className="mt-3">
                  {key("celebrateIcon")}
                </label>
                <Field type="text" id="CELEBRATE_ICON_PRICE" name="CELEBRATE_ICON_PRICE" />
                <ErrorMessage
                  name="CELEBRATE_ICON_PRICE"
                  component={InputErrorMessage}
                />
              </div>
              <div className={styles.field}>
                <label htmlFor="CELEBRATE_LINK_PRICE" className="mt-3">
                  {key("celebrateLink")}
                </label>
                <Field type="text" id="CELEBRATE_LINK_PRICE" name="CELEBRATE_LINK_PRICE" />
                <ErrorMessage
                  name="CELEBRATE_LINK_PRICE"
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
        </Formik>
      </div>
    </>
  );
};

export default Configs;
