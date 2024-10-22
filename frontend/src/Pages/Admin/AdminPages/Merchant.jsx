import React, { useEffect, useState } from "react";
import styles from "./AdminPages.module.css";
import { controlUsers, getShops } from "../../../util/Http";
import { useMutation, useQuery } from "@tanstack/react-query";
import { ErrorMessage, Field, Form, Formik } from "formik";
import { object, ref, string } from "yup";
import { faYinYang } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useTranslation } from "react-i18next";
import InputErrorMessage from "../../../Components/Ui/InputErrorMessage";
import Select from "react-select";
import { CountriesPhoneNumbers } from "../../../Components/Logic/Logic";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const getPhoneValidationSchema = (country, key) => {
  const phoneRegex = {
    EG: /^(\+20)?1[0125][0-9]{8}$/,
    SA: /^(\+966)?5[0-9]{8}$/,
    UAE: /^(\+971)?5[0-9]{8}$/,
    KW: /^(\+965)?[0-9]{8}$/,
    US: /^(\+1)?[0-9]{10}$/,
  };
  const passwordRegex = string()
    .min(5, `${key("passwordValidation1")}`)
    .required(`${key("passwordValidation2")}`)
    .matches(/[A-Z]+/, `${key("passwordValidation3")}`)
    .matches(/[a-z]+/, `${key("passwordValidation4")}`)
    .matches(/[0-9]+/, `${key("passwordValidation5")}`);

  return object({
    name: string()
      .min(3, `${key("nameValidation1")}`)
      .max(20, `${key("nameValidation2")}`)
      .required(`${key("nameValidation3")}`),
    email: string()
      .email(`${key("emailValidation1")}`)
      .required(`${key("emailValidation2")}`),
    password: passwordRegex,
    passwordConfirm: string()
      .oneOf([ref("password"), null], `${key("passwordMismatch")}`)
      .required(`${key("passwordValidation2")}`),
    phone: string()
      .matches(phoneRegex[country], key("invalidPhoneNumber"))
      .required(key("phoneNumberRequired")),
    merchantShop: string().required(key("merchantRec")),
  });
};

const Merchant = () => {
  const { t: key } = useTranslation();
  const token = JSON.parse(localStorage.getItem("token"));
  const [isEmailError, setIsEmailError] = useState(false);
  let isArLang = localStorage.getItem("i18nextLng") === "ar";
  const [selectedCountry, setSelectedCountry] = useState("SA");
  const [physicalShops, setPhysicalShops] = useState([]);
  const [physicalShopsOptions, setPhysicalShopsOptions] = useState([]);
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

  const { data: shops, refetch } = useQuery({
    queryKey: ["shops", token],
    queryFn: getShops,
    staleTime: Infinity,
  });
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  useEffect(() => {
    if (shops) {
      const physicalShopsValues = shops.data?.filter(
        (shop) => shop?.isOnline === false
      );
      setPhysicalShops(physicalShopsValues);
    }
  }, [shops]);

  useEffect(() => {
    if (physicalShops.length > 0) {
      const options = physicalShops?.map((shop) => ({
        label: shop.name,
        value: shop._id,
      }));
      setPhysicalShopsOptions(options);
    }
  }, [physicalShops]);

  const { mutate, isPending } = useMutation({
    mutationFn: controlUsers,
    onSuccess: (data) => {
      if (data?.status === "success") {
        setIsEmailError(false);
        refetch();
        notifySuccess(key("opSuccess"));
      } else if (data.response?.data?.message === "Shop already in use") {
        notifyError(key("shopeUsed"));
      } else if (data.response.data.message.split(" ")[0] === "Duplicate") {
        notifyError(key("duplicate"));
      } else {
        notifyError(key("wrong"));
      }
    },
    onError: (error) => {
      if (error.status === 500) {
        if (
          error.data.message ===
          "connection <monitor> to 15.185.166.107:27017 timed out"
        ) {
          setIsEmailError(false);
          notifyError(key("timeout"));
        } else {
          setIsEmailError(true);
        }
      } else {
        notifyError(key("wrong"));
      }
    },
  });

  const initialValues = {
    name: "",
    email: "",
    phone: "",
    password: "",
    passwordConfirm: "",
    merchantShop: "",
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
      name: values.name,
      email: values.email,
      password: values.password,
      passwordConfirm: values.passwordConfirm,
      phone: `${phoneBeginning}${values.phone}`,
      merchantShop: values.merchantShop,
    };
    mutate({
      formData: updatedValues,
      token: token,
      type: "merchant",
    });
  };

  const validationSchema = getPhoneValidationSchema(selectedCountry, key);

  return (
    <>
      <div className={styles.main_body}>
        <h4 className="fw-bold text-secondary">
          {key("add")} {key("merchant")}
        </h4>
        <div className={styles.configs_body}>
          <Formik
            initialValues={initialValues}
            onSubmit={onSubmit}
            validationSchema={validationSchema}
          >
            {({ setFieldValue }) => (
              <Form className={styles.register_form}>
                <div className="d-flex flex-column mb-5  position-relative">
                  <Field
                    type="text"
                    id="name_Merchant"
                    name="name"
                    placeholder={key("name")}
                  />
                  <ErrorMessage name="name" component={InputErrorMessage} />
                </div>

                <div className="d-flex flex-column mb-5 position-relative">
                  <Field
                    type="email"
                    id="email_Input_Merchant"
                    name="email"
                    placeholder={`${key("email")}`}
                  />
                  <ErrorMessage name="email" component={InputErrorMessage} />
                  {isEmailError && (
                    <InputErrorMessage text="email already exist!" />
                  )}
                </div>

                <div className="d-flex flex-column mb-5 position-relative">
                  <label className="fw-bold" htmlFor="merchantShop">
                    {key("merchant")} {key("store")}
                  </label>
                  <Select
                    classNamePrefix="merchantShop"
                    id="merchantShop"
                    isClearable={false}
                    isSearchable={true}
                    name="merchantShop"
                    options={physicalShopsOptions}
                    onChange={(value) => {
                      setFieldValue("merchantShop", value.value);
                    }}
                  />
                  <ErrorMessage
                    name="merchantShop"
                    component={InputErrorMessage}
                  />
                </div>

                <div className={styles.field}>
                  <div
                    className={`${styles.phone_num} ${
                      isArLang && styles.ar_phoneNum
                    }`}
                  >
                    <Select
                      className={styles.select_input}
                      classNamePrefix="Country"
                      isClearable={false}
                      isSearchable={false}
                      placeholder={key("whatsAppNum2")}
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
                      id="phoneNum_Merchant"
                      name="phone"
                      className={styles.phone_input}
                    />
                  </div>
                  <ErrorMessage name="phone" component={InputErrorMessage} />
                </div>

                <div
                  className={`${styles.pass_group} d-flex justify-content-between align-items-center mb-5`}
                >
                  <div
                    className={`${styles.password_field} ${
                      isArLang ? "ms-2" : "me-2"
                    } d-flex flex-column position-relative`}
                  >
                    <Field
                      type="password"
                      id="Password_Input_Merchant"
                      name="password"
                      placeholder={`${key("password")}`}
                    />
                    <ErrorMessage
                      name="password"
                      component={InputErrorMessage}
                    />
                  </div>
                  <div
                    className={`${styles.confirm_password} d-flex flex-column ms-2 position-relative`}
                  >
                    <Field
                      type="password"
                      id="passwordConfirm_Merchant"
                      name="passwordConfirm"
                      placeholder={`${key("confirmPass")}`}
                    />
                    <ErrorMessage
                      name="passwordConfirm"
                      component={InputErrorMessage}
                    />
                  </div>
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
            )}
          </Formik>
        </div>
      </div>
    </>
  );
};

export default Merchant;
