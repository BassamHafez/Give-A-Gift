import Modal from "react-bootstrap/Modal";
import React, { useEffect, useState } from "react";
import styles from "../AdminPages.module.css";
import { ErrorMessage, Field, Form, Formik } from "formik";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faImage, faYinYang } from "@fortawesome/free-solid-svg-icons";
import InputErrorMessage from "../../../../Components/Ui/InputErrorMessage";
import { useMutation, useQuery } from "@tanstack/react-query";
import { controlShops, getCategories } from "../../../../util/Http";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import { mixed, number, object, string } from "yup";
import Select from "react-select";
import { CountriesPhoneNumbers } from "../../../../Components/Logic/Logic";

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
    email: string()
      .email(`${key("emailValidation1")}`)
      .required(`${key("emailValidation2")}`),
    link: string().when("isOnline", {
      is: (isOnline) => isOnline === "true",
      then: (schema) =>
        schema.url(key("invalidLink")).required(key("invalidLink")),
      otherwise: (schema) => schema.nullable(),
    }),
    priority: number().typeError(key("priorityValidation")),
    category: string().required(key("categoryReq")),
  });
};

const UpdateShop = ({ show, onHide, shopData, refetch }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedCountry, setSelectedCountry] = useState("SA");
  const [purePhoneNum, setPurePhoneNum] = useState("");

  const { t: key } = useTranslation();
  let isArLang = localStorage.getItem("i18nextLng") === "ar";
  const notifySuccess = (message) => toast.success(message);
  const notifyError = (message) => toast.error(message);
  const token = JSON.parse(localStorage.getItem("token"));
  const [categoriesOptions, setCategoriesOptions] = useState([]);

  const { data: categories } = useQuery({
    queryKey: ["categories", token],
    queryFn: () => getCategories(token),
    enabled: !!token,
    staleTime: Infinity,
  });

  useEffect(() => {
    if (categories) {
      const myCategories = categories?.data.map((category) => {
        return {
          label: (
            <div className={styles.category_label}>
              <img
                src={`${process.env.REACT_APP_Host}categories/${category.icon}`}
                alt={`${category.name}`}
              />
              <h4>{category.name}</h4>
            </div>
          ),
          value: category._id,
        };
      });
      setCategoriesOptions(myCategories);
    }
  }, [categories]);

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

  useEffect(() => {
    const getCountryFromPhoneNumber = () => {
      const countryCodes = {
        "20": "EG",
        "966": "SA",
        "965": "KW",
        "971": "UAE",
        "1": "US",
      };
  
      for (let code in countryCodes) {
        if (shopData.phone.startsWith(code)) {
          setSelectedCountry(countryCodes[code]);
          
          const purePhoneNum = shopData.phone.slice(code.length);
          setPurePhoneNum(purePhoneNum);
          break;
        }
      }
    };
  
    getCountryFromPhoneNumber();
  }, [shopData]);
  

  const initialValues = {
    shapeImage: "",
    description: shopData.description || "",
    name: shopData.name || "",
    link: shopData.link || "",
    isOnline: "true",
    email: shopData.email || "",
    phone: purePhoneNum || "",
    priority: shopData.priority || "",
    category: shopData.category?._id || "",
    country: selectedCountry || "",
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

    if (values.isOnline === "true") {
      formData.append("link", values.link);
      formData.append("isOnline", true);
    } else {
      formData.append("isOnline", false);
    }
    if (values.priority !== "") {
      formData.append("priority", Number(values.priority));
    }
    formData.append("email", values.email);
    formData.append("phone", `${phoneBeginning}${values.phone}`);
    formData.append("category", values.category);
    mutate({
      formData: formData,
      token: token,
    });
  };

  const validationSchema = getPhoneValidationSchema(selectedCountry, key);

  const handleFileChange = (e) => {
    const file = e.currentTarget.files[0];
    setSelectedFile(file);
    notifySuccess(key("photoDownloaded"));
  };

  return (
    <Modal
      show={show}
      onHide={onHide}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
      className={styles.modal_container}
    >
      <Modal.Body className={`${styles.modal_body} text-center`}>
        <Formik
          initialValues={initialValues}
          onSubmit={onSubmit}
          validationSchema={validationSchema}
          enableReinitialize
        >
          {({ values, setFieldValue }) => (
            <Form className={styles.general_info_form}>
              <div className={styles.photo_field}>
                <h4 className="fw-bold">
                  {key("add")} {key("store")}
                </h4>
                <h5>{key("storeLogo")}</h5>
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
                <label htmlFor="storeEmail">
                  {key("add")} {key("email")}
                </label>
                <Field type="text" id="storeEmail" name="email" />
                <ErrorMessage name="email" component={InputErrorMessage} />
              </div>

              <div className={styles.field}>
                <label htmlFor="phoneNum">{key("whatsAppNum2")}</label>

                <div
                  className={`${styles.phone_num} ${
                    isArLang && styles.ar_phoneNum
                  }`}
                >
                  <Select
                    className={styles.select_input}
                    classNamePrefix="country"
                    isClearable={false}
                    isSearchable={true}
                    name="country"
                    options={CountriesPhoneNumbers}
                    value={CountriesPhoneNumbers.find((val) => val.value === selectedCountry)}
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
                    id="phoneNum"
                    name="phone"
                    className={styles.phone_input}
                  />
                </div>
                <ErrorMessage name="phone" component={InputErrorMessage} />
              </div>

              <div className={styles.field}>
                <label htmlFor="category">{key("category")}</label>

                <Select
                  classNamePrefix="category"
                  isClearable={false}
                  isSearchable={true}
                  name="category"
                  options={categoriesOptions}
                  onChange={(value) => {
                    setFieldValue("category", value.value);
                  }}
                  value={categoriesOptions.find((val) => val.value === shopData.category?._id )}
                />

                <ErrorMessage name="category" component={InputErrorMessage} />
              </div>

              <div className={styles.field}>
                <label htmlFor="priority" className="mt-3">
                  {key("add")} {key("priority")}
                </label>
                <Field type="text" id="priority" name="priority" />
                <ErrorMessage name="priority" component={InputErrorMessage} />
              </div>

              <div className={styles.field}>
                <label htmlFor="description">
                  {key("add")} {key("description")}
                </label>
                <Field type="text" id="description" name="description" />
                <ErrorMessage
                  name="description"
                  component={InputErrorMessage}
                />
              </div>

              <div className={styles.field}>
                <div className={styles.field}>
                  <div className="form-check">
                    <Field
                      type="radio"
                      className="form-check-input"
                      name="isOnline"
                      id="onlineStore"
                      value="true"
                      checked={values.isOnline === "true"}
                    />
                    <label
                      className="form-check-label mx-2"
                      htmlFor="onlineStore"
                    >
                      {key("onlineStore")}
                    </label>
                  </div>

                  <div className="form-check">
                    <Field
                      type="radio"
                      className="form-check-input"
                      name="isOnline"
                      id="offlineStore"
                      value="false"
                      checked={values.isOnline === "false"}
                    />
                    <label
                      className="form-check-label mx-2"
                      htmlFor="offlineStore"
                    >
                      {key("physicalStore")}
                    </label>
                  </div>
                </div>
              </div>

              <div
                className={`${styles.field} ${
                  values.isOnline === "false" && styles.disable
                }`}
              >
                <label htmlFor="link">{key("storeLink")}</label>
                <Field
                  type="text"
                  id="link"
                  name="link"
                  disabled={values.isOnline === "false"}
                />
                <ErrorMessage name="link" component={InputErrorMessage} />
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
      </Modal.Body>
    </Modal>
  );
};

export default UpdateShop;
