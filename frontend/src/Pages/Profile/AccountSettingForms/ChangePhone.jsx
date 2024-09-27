import React, { useState } from "react";
import { updateMe } from "../../../util/Http";
import { useMutation } from "@tanstack/react-query";
import { ErrorMessage, Form, Formik, Field } from "formik";
import { object, string } from "yup";
import InputErrorMessage from "../../../Components/Ui/InputErrorMessage";
import styles from "./Forms.module.css";
import { faYinYang } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useTranslation } from "react-i18next";
import toast from "react-hot-toast";
import { CountriesPhoneNumbers } from "../../../Components/Logic/Logic";
import Select from "react-select";
import fetchProfileData from "../../../Store/profileInfo-actions";
import { useDispatch } from "react-redux";

const getPhoneValidationSchema = (country, key) => {
  const phoneRegex = {
    EG: /^(\+20)?1[0125][0-9]{8}$/,
    SA: /^(\+966)?5[0-9]{8}$/,
    UAE: /^(\+971)?5[0-9]{8}$/,
    KW: /^(\+965)?[0-9]{8}$/,
    US: /^(\+1)?[0-9]{10}$/,
  };

  return object({
    phone: string()
      .matches(phoneRegex[country], key("invalidPhoneNumber"))
      .required(key("phoneNumberRequired")),
  });
};

const ChangePhone = () => {
  const { t: key } = useTranslation();
  const token = JSON.parse(localStorage.getItem("token"));
  const [selectedCountry, setSelectedCountry] = useState("SA");
  let isArLang = localStorage.getItem("i18nextLng") === "ar";

  const notifySuccess = (message) => {
    toast.success((t) => (
      <div
        onClick={() => toast.dismiss(t.id)}
        onTap={() => toast.dismiss(t.id)}
      >
        {message}
      </div>
    ));
  };

  const notifyError = (message) => {
    toast.error((t) => (
      <div
        onClick={() => toast.dismiss(t.id)}
        onTap={() => toast.dismiss(t.id)}
      >
        {message}
      </div>
    ));
  };
  const dispatch=useDispatch();
  
  const { mutate, isPending } = useMutation({
    mutationFn: updateMe,
    onSuccess: (data) => {
      if (data?.status === "success") {
        notifySuccess(key("phoneChanged"));
        dispatch(fetchProfileData(token));
      } else if (
        data.response.data.message ===
        "User recently changed password! Please log in again."
      ) {
        notifyError(key("recentlyChangedPhone"));
      } else {
      }
    },
    onError: (error) => {
      notifyError(key("phoneFailed"));
    },
  });

  const initialValues = {
    phone: "",
  };

  const onSubmit = (values) => {
    let phoneBeginning = "966";
    switch (selectedCountry) {
      case "SA":
        phoneBeginning = "966";
        break;
      case "EG":
        phoneBeginning = "20";
        break;
      case "UAE":
        phoneBeginning = "971";
        break;
      case "KW":
        phoneBeginning = "965";
        break;
      case "US":
        phoneBeginning = "1";
        break;

      default:
        break;
    }
    const updatedValues = {
      phone: `${phoneBeginning}${values.phone}`,
    };

    const formData = new FormData();
    formData.append("phone", updatedValues.phone);

    mutate({
      formData: formData,
      token: token,
    });
  };

  const validationSchema = getPhoneValidationSchema(selectedCountry, key);

  return (
    <>
      <Formik
        initialValues={initialValues}
        onSubmit={onSubmit}
        validationSchema={validationSchema}
      >
        {({ setFieldValue }) => (
          <Form className={styles.general_info_form}>
            <div className={styles.field}>
              <label htmlFor="phoneNum">{key("phone")}</label>

              <div
                className={`${styles.phone_num} ${
                  isArLang && styles.ar_phoneNum
                }`}
              >
                <Select
                  className={styles.select_input}
                  classNamePrefix="Country"
                  isClearable={false}
                  isSearchable={true}
                  name="Country"
                  options={CountriesPhoneNumbers}
                  defaultValue={CountriesPhoneNumbers[1]}
                  components={{
                    DropdownIndicator: () => null,
                    IndicatorSeparator: () => null,
                  }}
                  onChange={(value) => {
                    setSelectedCountry(value.value);
                    setFieldValue("Country", value.value);
                  }}
                />
                <Field
                  type="text"
                  id="phoneNum"
                  name="phone"
                  className={styles.phone_input}
                />
              </div>
              <ErrorMessage name="phone" component={InputErrorMessage} />
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
    </>
  );
};

export default ChangePhone;
