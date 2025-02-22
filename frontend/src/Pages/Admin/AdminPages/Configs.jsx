import React, { useEffect } from "react";
import styles from "./AdminPages.module.css";
import { getConfig } from "../../../util/Http";
import { useMutation } from "@tanstack/react-query";
import { ErrorMessage, Field, Form, Formik } from "formik";
import { number, object, string } from "yup";
import { faYinYang } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import InputErrorMessage from "../../../Components/Ui/InputErrorMessage";
import { useDispatch, useSelector } from "react-redux";
import fetchConfigs from "../../../Store/configs-actions";
import { useNavigate } from "react-router-dom";

const Configs = () => {
  const { t: key } = useTranslation();
  const token = JSON.parse(localStorage.getItem("token"));
  const dispatch = useDispatch();
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
  const notifyError = (message) => toast.error(message);

  const mainColor = useSelector((state) => state.configs.mainColor);
  const subColor = useSelector((state) => state.configs.subColor);
  const VAT = useSelector((state) => state.configs.VAT)?.trim();
  const celebrateIconPrice = useSelector(
    (state) => state.configs.celebrateIconPrice
  )?.trim();
  const celebrateLinkPrice = useSelector(
    (state) => state.configs.celebrateLinkPrice
  )?.trim();

  const messageReminder = useSelector((state) => state.configs.messageReminder);

  const messageCodeReminder = useSelector(
    (state) => state.configs.messageCodeReminder
  );
  const whatsappMessage = useSelector((state) => state.configs.whatsappMessage);
  const walletStarting = useSelector((state) => state.configs.walletStarting);
  const cashBack = useSelector((state) => state.configs.cashBack)?.trim();

  const { mutate, isPending } = useMutation({
    mutationFn: getConfig,
    onSuccess: (data) => {
      console.log(data);
      if (data?.status === "success") {
        dispatch(fetchConfigs(token));
      } else {
        notifyError(key("wrong"));
      }
    },
    onError: (error) => {
      console.log(error)
      notifyError(key("wrong"));
    },
  });

  const initialValues = {
    WALLET_STARTING_BALANCE: walletStarting || "",
    MAIN_COLOR: mainColor || "",
    SECONDRY_COLOR: subColor || "",
    VAT_VALUE: VAT ? Number(VAT) : "",
    CELEBRATE_ICON_PRICE: celebrateIconPrice ? Number(celebrateIconPrice) : "",
    CELEBRATE_LINK_PRICE: celebrateLinkPrice ? Number(celebrateLinkPrice) : "",
    CASH_BACK_PERCENTAGE: cashBack!==undefined ? Number(cashBack) : "",
    CART_REMINDER_MESSAGE: `${messageReminder}` || "",
    UNUSED_CODE_REMINDER_MESSAGE: `${messageCodeReminder}` || "",
    WHATSAPP_CARD_MESSAGE: `${whatsappMessage}` || "",
  };

  const onSubmit = (values) => {
    const updatedValues = {
      WALLET_STARTING_BALANCE: values.WALLET_STARTING_BALANCE,
      MAIN_COLOR: values.MAIN_COLOR,
      SECONDRY_COLOR: values.SECONDRY_COLOR,
      VAT_VALUE: `${values.VAT_VALUE}`,
      CELEBRATE_ICON_PRICE: `${values.CELEBRATE_ICON_PRICE}`,
      CELEBRATE_LINK_PRICE: `${values.CELEBRATE_LINK_PRICE}`,
      CASH_BACK_PERCENTAGE: `${values.CASH_BACK_PERCENTAGE}`,
      CART_REMINDER_MESSAGE: `${values.CART_REMINDER_MESSAGE}`,
      UNUSED_CODE_REMINDER_MESSAGE: `${values.UNUSED_CODE_REMINDER_MESSAGE}`,
      WHATSAPP_CARD_MESSAGE: `${values.WHATSAPP_CARD_MESSAGE}`,
    };
    console.log(updatedValues);
    mutate({
      type: "update",
      formData: updatedValues,
      token: token,
    });
  };

  const validationSchema = object({
    WALLET_STARTING_BALANCE: number()
      .min(0, key("walletStartingBalance"))
      .required(key("faildRec")),
    VAT_VALUE: number().min(0, key("vatValue")).required(key("faildRec")),
    MAIN_COLOR: string().required(key("faildRec")),
    SECONDRY_COLOR: string().required(key("faildRec")),
    CART_REMINDER_MESSAGE: string().required(key("faildRec")),
    UNUSED_CODE_REMINDER_MESSAGE: string().required(key("faildRec")),
    WHATSAPP_CARD_MESSAGE: string().required(key("faildRec")),
    CASH_BACK_PERCENTAGE: number()
      .min(0, key("cashBackValidation"))
      .required(key("faildRec")),
    CELEBRATE_ICON_PRICE: number()
      .min(0, key("lessThanZero"))
      .required(key("faildRec")),
    CELEBRATE_LINK_PRICE: number()
      .min(0, key("lessThanZero"))
      .required(key("faildRec")),
  });
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <div className={`${styles.main_body} ${styles.configs_body}`}>
        <Formik
          initialValues={initialValues}
          onSubmit={onSubmit}
          validationSchema={validationSchema}
          enableReinitialize
        >
          <Form className={styles.general_info_form}>
            <div className={styles.field}>
              <label htmlFor="VAT_VALUE" className="mt-3">
                {key("Vatvalue")}
              </label>
              <Field type="number" id="VAT_VALUE" name="VAT_VALUE" />
              <ErrorMessage name="VAT_VALUE" component={InputErrorMessage} />
            </div>
            <div className={styles.field}>
              <label htmlFor="CASH_BACK_PERCENTAGE" className="mt-3">
                {key("cashBack")}
              </label>
              <Field
                type="number"
                id="CASH_BACK_PERCENTAGE"
                name="CASH_BACK_PERCENTAGE"
              />
              <ErrorMessage
                name="CASH_BACK_PERCENTAGE"
                component={InputErrorMessage}
              />
            </div>
            <div className={styles.field}>
              <label htmlFor="WALLET_STARTING_BALANCE" className="mt-3">
                {key("walletStarting")}
              </label>
              <Field
                type="text"
                id="WALLET_STARTING_BALANCE"
                name="WALLET_STARTING_BALANCE"
              />
              <ErrorMessage
                name="WALLET_STARTING_BALANCE"
                component={InputErrorMessage}
              />
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
              <Field
                type="number"
                id="CELEBRATE_ICON_PRICE"
                name="CELEBRATE_ICON_PRICE"
              />
              <ErrorMessage
                name="CELEBRATE_ICON_PRICE"
                component={InputErrorMessage}
              />
            </div>
            <div className={styles.field}>
              <label htmlFor="CELEBRATE_LINK_PRICE" className="mt-3">
                {key("celebrateLink")}
              </label>
              <Field
                type="number"
                id="CELEBRATE_LINK_PRICE"
                name="CELEBRATE_LINK_PRICE"
              />
              <ErrorMessage
                name="CELEBRATE_LINK_PRICE"
                component={InputErrorMessage}
              />
            </div>
            <div className={styles.field}>
              <label htmlFor="CART_REMINDER_MESSAGE" className="mt-3">
                {key("reminderMsg")}
              </label>
              <Field
                type="text"
                id="CART_REMINDER_MESSAGE"
                name="CART_REMINDER_MESSAGE"
              />
              <ErrorMessage
                name="CART_REMINDER_MESSAGE"
                component={InputErrorMessage}
              />
            </div>
            <div className={styles.field}>
              <label htmlFor="UNUSED_CODE_REMINDER_MESSAGE" className="mt-3">
                {key("reminderCodeMsg")}
              </label>
              <Field
                type="text"
                id="UNUSED_CODE_REMINDER_MESSAGE"
                name="UNUSED_CODE_REMINDER_MESSAGE"
              />
              <ErrorMessage
                name="UNUSED_CODE_REMINDER_MESSAGE"
                component={InputErrorMessage}
              />
            </div>
            <div className={styles.field}>
              <label htmlFor="WHATSAPP_CARD_MESSAGE" className="mt-3">
                {key("whatsappMsg")}
              </label>
              <Field
                type="text"
                id="WHATSAPP_CARD_MESSAGE"
                name="WHATSAPP_CARD_MESSAGE"
              />
              <ErrorMessage
                name="WHATSAPP_CARD_MESSAGE"
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
