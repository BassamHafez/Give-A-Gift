import { useMutation } from "@tanstack/react-query";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import { joinPartner } from "../../util/Http";
import { object, string } from "yup";
import { Formik, Field, Form, ErrorMessage } from "formik";
import styles from "./JoinUs.module.css";
import InputErrorMessage from "../../Components/Ui/InputErrorMessage";
import Select from "react-select";
import { CountriesPhoneNumbers } from "../../Components/Logic/Logic";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faYinYang } from "@fortawesome/free-solid-svg-icons";

const getPhoneValidationSchema = (country, key) => {
  const phoneRegex = {
    EG: /^(\+20)?1[0125][0-9]{8}$/,
    SA: /^(\+966)?5[0-9]{8}$/,
    UAE: /^(\+971)?5[0-9]{8}$/,
    KW: /^(\+965)?[0-9]{8}$/,
    US: /^(\+1)?[0-9]{10}$/,
  };

  return object({
    name: string()
      .min(3, `${key("nameValidation1")}`)
      .max(20, `${key("nameValidation2")}`)
      .required(`${key("nameValidation3")}`),
    phone: string()
      .matches(phoneRegex[country], key("invalidPhoneNumber"))
      .required(key("phoneNumberRequired")),
    link: string().url(key("invalidLink")).nullable(),
    description: string().required(key("descReq")),
    email: string()
      .email(`${key("emailValidation1")}`)
      .required(`${key("emailValidation2")}`),
  });
};

const JoinUs = () => {
  const [selectedCountry, setSelectedCountry] = useState("SA");

  const { t: key } = useTranslation();
  const token = JSON.parse(localStorage.getItem("token"));
  let isArLang = localStorage.getItem("i18nextLng") === "ar";

  const notifySuccess = (message) => toast.success(message);
  const notifyError = (message) => toast.error(message);

  const { mutate, isPending } = useMutation({
    mutationFn: joinPartner,
  });

  const initialValues = {
    name: "",
    description: "",
    link: "",
    phone: "",
    email: "",
  };

  const onSubmit = (values,{resetForm}) => {
    console.log(values)
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
    let updatedValues = {
      name: values.name,
      description: values.description,
      link: values.link,
      email: values.email,
      phone: `${phoneBeginning}${values.phone}`,
    };

    mutate(
      {
        formData: updatedValues,
        token: token,
      },
      {
        onSuccess: (data) => {
            console.log(data)
          if (data?.status === "success") {
            notifySuccess(key("sentSucc"));
            resetForm()
          } else {
            notifyError(key("sendFaild"));
          }
        },
        onError: (error) => {
          console.log(error);
          notifyError(key("sendFaild"));
        },
      }
    );
  };
  const validationSchema = getPhoneValidationSchema(selectedCountry, key);

  return (
    <div className={styles.main_body}>
      <h2 className="text-center">{key("becomePartner")}</h2>

      <Formik
        initialValues={initialValues}
        onSubmit={onSubmit}
        validationSchema={validationSchema}
      >
        <Form className={styles.general_info_form}>
          <div className={styles.field}>
            <label htmlFor="name">{key("name")}</label>
            <Field type="text" id="name" name="name" />
            <ErrorMessage name="name" component={InputErrorMessage} />
          </div>
          <div className={styles.field}>
            <label htmlFor="email">{key("email")}</label>
            <Field type="text" id="email" name="email" />
            <ErrorMessage name="email" component={InputErrorMessage} />
          </div>

          <div className={styles.field}>
            <label htmlFor="phone" className="text-secondary">
              {key("phone")}
            </label>

            <div
              className={`${styles.phone_num} ${
                isArLang && styles.ar_phoneNum
              }`}
            >
              <Select
                className={styles.select_input}
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
                }}
              />
              <Field
                type="text"
                id="phone"
                name="phone"
                className={styles.phone_input}
              />
            </div>
            <ErrorMessage name="phone" component={InputErrorMessage} />
          </div>

          <div className={styles.field}>
            <label htmlFor="description">{key("description")}</label>
            <Field
              className={`${styles.desc_field} form-control`}
              as="textarea"
              id="description"
              name="description"
            />
            <ErrorMessage name="description" component={InputErrorMessage} />
          </div>

          <div className={styles.field}>
            <label htmlFor="link">{key("link")}</label>
            <Field type="text" id="link" name="link" />
            <ErrorMessage name="link" component={InputErrorMessage} />
          </div>

          <div className="d-flex justify-content-end align-items-center mt-3 px-2">
            {isPending ? (
              <button type="submit" className={styles.save_btn}>
                <FontAwesomeIcon className="fa-spin" icon={faYinYang} />
              </button>
            ) : (
              <button className={styles.save_btn} type="submit">
                {key("send")}
              </button>
            )}
          </div>
        </Form>
      </Formik>
    </div>
  );
};

export default JoinUs;
