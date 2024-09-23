import React, { useEffect, useState } from "react";
import styles from "./AdminPages.module.css";
import { controlUsers } from "../../../util/Http";
import { useMutation, useQuery } from "@tanstack/react-query";
import { ErrorMessage, Field, Form, Formik } from "formik";
import { object, ref, string } from "yup";
import {
  faIdCard,
  faPhone,
  faTrash,
  faYinYang,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useTranslation } from "react-i18next";
import toast, { Toaster } from "react-hot-toast";
import InputErrorMessage from "../../../Components/Ui/InputErrorMessage";
import Row from "react-bootstrap/esm/Row";
import Col from "react-bootstrap/esm/Col";
import LoadingOne from "../../../Components/Ui/LoadingOne";
import axios from "axios";
import Select from "react-select";
import { CountriesPhoneNumbers } from "../../../Components/Logic/Logic";
import defaultImg from "../../../Images/default.png";
import SearchField from "../../../Components/Ui/SearchField";

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
  });
};

const Users = () => {
  const { t: key } = useTranslation();
  const token = JSON.parse(localStorage.getItem("token"));
  const [isEmailError, setIsEmailError] = useState(false);
  let isArLang = localStorage.getItem("i18nextLng") === "ar";
  const [selectedCountry, setSelectedCountry] = useState("SA");
  const [searchInput, setSearchInput] = useState("");

  const notifySuccess = (message) => toast.success(message);
  const notifyError = (message) => toast.error(message);

  const { data: users, refetch } = useQuery({
    queryKey: ["controlUsers", token],
    queryFn: () => controlUsers({ token }),
    enabled: !!token,
    staleTime: Infinity,
  });

  const { mutate, isPending } = useMutation({
    mutationFn: controlUsers,
    onSuccess: (data) => {
      console.log(data);
      if (data?.status === "success") {
        setIsEmailError(false);
        notifySuccess(key("opSuccess"));
        refetch();
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
    };
    console.log(updatedValues);
    mutate({
      formData: values,
      token: token,
      type: "add",
    });
  };

  const validationSchema = getPhoneValidationSchema(selectedCountry, key);

  const deleteUser = async (userId) => {
    try {
      const response = await axios.delete(
        `${process.env.REACT_APP_Base_API_URl}users/${userId}`,
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

  const handleSearch = (e, searchTerm) => {
    e.preventDefault();
    if (searchTerm !== "" && searchTerm !== searchInput) {
      setSearchInput(searchTerm);
      notifySuccess(key("searchFilterApplied"));
    }
  };

  const filteredUsers = users
    ? users.data.filter(
        (user) =>
          user.name.toLowerCase().includes(searchInput.toLowerCase()) ||
          user._id.includes(searchInput)
      )
    : [];
    useEffect(()=>{
      window.scrollTo(0, 0)
    },[])
  return (
    <>
      <Toaster position="top-right" />
      <div className={styles.main_body}>
        <div className={styles.configs_body}>
          <h4 className="fw-bold text-secondary">{key("addAdmin")}</h4>
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
                    id="name"
                    name="name"
                    placeholder={key("name")}
                  />
                  <ErrorMessage name="name" component={InputErrorMessage} />
                </div>

                <div className="d-flex flex-column mb-5 position-relative">
                  <Field
                    type="email"
                    id="email_Input"
                    name="email"
                    placeholder={`${key("email")}`}
                  />
                  <ErrorMessage name="email" component={InputErrorMessage} />
                  {isEmailError && (
                    <InputErrorMessage text="email already exist!" />
                  )}
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
                      isSearchable={true}
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
                      id="phoneNum"
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
                      id="Password_Input"
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
                      id="passwordConfirm"
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
        <hr />
        <div>
          <div>
            <h4 className="fw-bold text-secondary">{key("allUsers")}</h4>

            <div
              className={`${styles.controllers} d-flex justify-content-between my-5`}
            >
              <div
                onClick={() => setSearchInput("")}
                className={styles.filter_box}
              >
                <span className={styles.filter}>{key("default")}</span>
              </div>
              <div>
                <SearchField onSearch={handleSearch} text={key("search")} />
              </div>
            </div>
          </div>
          <Row className="justify-content-center position-relative">
            {users ? (
              filteredUsers?.length > 0 ? (
                filteredUsers.map((user) => (
                  <Col
                    key={user._id}
                    sm={6}
                    lg={4}
                    className="d-flex justify-content-center align-items-center"
                  >
                    <div className={styles.user_div}>
                      <FontAwesomeIcon
                        className={styles.delete_icon}
                        icon={faTrash}
                        onClick={() => deleteUser(user._id)}
                      />
                      <div className={styles.user_header}>
                        <div className={styles.user_img}>
                          <img
                            src={
                              user.photo
                                ? `${process.env.REACT_APP_Host}users/${user.photo}`
                                : defaultImg
                            }
                            alt="user"
                          />
                        </div>
                        <div className={styles.user_header_info}>
                          <h5>{user.name}</h5>
                          <span className="mini_word">{user.email}</span>
                        </div>
                      </div>
                      <ul className="p-0 mt-4">
                        <li className={styles.details_list}>
                          <FontAwesomeIcon
                            className={styles.details_list_icon}
                            icon={faPhone}
                          />{" "}
                          {user.phone}
                        </li>
                        <li className={styles.details_list}>
                          <FontAwesomeIcon
                            className={styles.details_list_icon}
                            icon={faIdCard}
                          />
                          {user._id}
                        </li>
                      </ul>
                    </div>
                  </Col>
                ))
              ) : (
                users.data?.map((user) => (
                  <Col
                    key={user._id}
                    sm={6}
                    lg={4}
                    className="d-flex justify-content-center align-items-center"
                  >
                    <div className={styles.user_div}>
                      <FontAwesomeIcon
                        className={styles.delete_icon}
                        icon={faTrash}
                        onClick={() => deleteUser(user._id)}
                      />
                      <div className={styles.user_header}>
                        <div className={styles.user_img}>
                          <img
                            src={
                              user.photo
                                ? `${process.env.REACT_APP_Host}users/${user.photo}`
                                : defaultImg
                            }
                            alt="user"
                          />
                        </div>
                        <div className={styles.user_header_info}>
                          <h5>{user.name}</h5>
                          <span className="mini_word">{user.email}</span>
                        </div>
                      </div>
                      <ul className="p-0 mt-4">
                        <li className={styles.details_list}>
                          <FontAwesomeIcon
                            className={styles.details_list_icon}
                            icon={faPhone}
                          />{" "}
                          {user.phone}
                        </li>
                        <li className={styles.details_list}>
                          <FontAwesomeIcon
                            className={styles.details_list_icon}
                            icon={faIdCard}
                          />
                          {user._id}
                        </li>
                      </ul>
                    </div>
                  </Col>
                ))
              )
            ) : (
              <LoadingOne />
            )}
          </Row>
        </div>
      </div>
    </>
  );
};

export default Users;
