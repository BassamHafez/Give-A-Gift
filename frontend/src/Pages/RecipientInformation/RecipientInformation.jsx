import React, { useState } from "react";
import { updateCard } from "../../util/Http";
import { useMutation } from "@tanstack/react-query";
import { ErrorMessage, Form, Formik, Field } from "formik";
import { object, string } from "yup";
import InputErrorMessage from "../../Components/Ui/InputErrorMessage";
import styles from "./RecipientInformation.module.css";
import { faYinYang } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import toast, { Toaster } from "react-hot-toast";
import Col from "react-bootstrap/esm/Col";
import Row from "react-bootstrap/esm/Row";
import recGift from "../../Images/recipientGift.jpg";
import DatePicker from "react-multi-date-picker";
import TimePicker from "react-multi-date-picker/plugins/time_picker";
import Ar from "react-date-object/locales/persian_ar";
import Select from "react-select";
import { CountriesPhoneNumbers } from "../../Components/Logic/Logic";
import Button from "react-bootstrap/Button";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";

const getPhoneValidationSchema = (country) => {
  const phoneRegex = {
    EG: /^(\+20)?1[0125][0-9]{8}$/,
    SA: /^(\+966)?5[0-9]{8}$/,
    UAE: /^(\+971)?5[0-9]{8}$/,
    KW: /^(\+965)?[0-9]{8}$/,
    US: /^(\+1)?[0-9]{10}$/,
  };

  return object({
    RecipientName: string().required("Recipient Name is required"),
    RecNumber: string()
      .matches(phoneRegex[country], "Invalid phone number")
      .required("Phone Number is required"),
    DelTime: string()
      .required("Delivery Time is required")
      .test(
        "is-future-time",
        "Delivery time must be in the future",
        function (value) {
          if (!value) return false;
          const selectedDateTime = new Date(value);
          return selectedDateTime > new Date();
        }
      ),
  });
};

const RecipientInformation = () => {
  let isArLang = localStorage.getItem("i18nextLng") === "ar";
  const [dateTime, setDateTime] = useState(null);
  const [selectedCountry, setSelectedCountry] = useState("SA");

  const notifySuccess = (message) => toast.success(message);
  const notifyError = (message) => toast.error(message);
  const token = JSON.parse(localStorage.getItem("token"));
  const { cardId } = useParams();
  const navigate=useNavigate();
  const profileData = useSelector((state) => state.userInfo.data);

  const { mutate, isPending } = useMutation({
    mutationFn: updateCard,
    onSuccess: (data) => {
      console.log("data", data);
      if (data?.status === "success") {
        notifySuccess("Recipient Info has been Saved successfully");
        // navigate to payment
      } else {
        notifyError("Recipient Info failed to be changed. Please try again.");
      }
    },
    onError: (error) => {
      console.error(error);
      notifyError("Recipient Info failed to be changed. Please try again.");
    },
  });

  const initialValues = {
    RecipientName: "",
    RecNumber: "",
    DelTime: "",
  };
  const onSubmit = (values) => {
    console.log(values);
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
      recipient: {
        name: values.RecipientName,
        whatsappNumber: `${phoneBeginning}${values.RecNumber}`,
      },
      receiveAt: values.DelTime,
    };
    console.log(updatedValues);
    mutate({
      formData: updatedValues,
      token: token,
      cardId: cardId,
    });
  };

  return (
    <>
      <Toaster position="top-right" />
      <div className="my-5 px-3 px-lg-5">
        <h2 className="text-center mb-4">Recipient Information</h2>
        <Row>
          <Col md={6}>
            <Formik
              initialValues={initialValues}
              onSubmit={onSubmit}
              validationSchema={getPhoneValidationSchema(selectedCountry)}
            >
              {({ setFieldValue }) => (
                <Form className={styles.general_info_form}>
                  <div className={styles.field}>
                    <label htmlFor="recName">Recipient Name</label>
                    <Field type="text" id="recName" name="RecipientName" />
                    <ErrorMessage
                      name="RecipientName"
                      component={InputErrorMessage}
                    />
                  </div>

                  <div className={styles.field}>
                    <label htmlFor="phoneNum">Phone Number</label>

                    <div className={styles.phone_num}>
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
                        name="RecNumber"
                        className={styles.phone_input}
                      />
                    </div>
                    <ErrorMessage
                      name="RecNumber"
                      component={InputErrorMessage}
                    />
                  </div>

                  <div className={styles.field}>
                    <label htmlFor="delTime">Delivery Date and Time</label>
                    <DatePicker
                      value={dateTime}
                      onChange={(value) => {
                        setDateTime(value);
                        const formattedDateTime = new Date(value).toISOString();
                        setFieldValue("DelTime", formattedDateTime);
                      }}
                      format="YYYY/MM/DD HH:mm"
                      plugins={[<TimePicker position="bottom" />]}
                      locale={isArLang ? Ar : ""}
                      placeholder="YYYY/MM/DD HH:mm"
                      className={styles.date_picker}
                    />
                    <ErrorMessage
                      name="DelTime"
                      component={InputErrorMessage}
                    />
                  </div>

                  <div className={`${styles.btn_group} d-flex justify-content-between align-items-center mt-3 px-2`}>
                    <Button onClick={()=>navigate(`/profile/${profileData._id}`)} variant="secondary" className={styles.later_btn}>
                      Later
                    </Button>
                    {isPending ? (
                      <button type="submit" className={styles.save_btn}>
                        <FontAwesomeIcon className="fa-spin" icon={faYinYang} />
                      </button>
                    ) : (
                      <button className={styles.save_btn} type="submit">
                        Save
                      </button>
                    )}
                  </div>
                </Form>
              )}
            </Formik>
          </Col>
          <Col
            className="d-flex justify-content-center align-items-center"
            md={6}
          >
            <div className={styles.rec_img}>
              <img src={recGift} alt="recipient Gift" />
            </div>
          </Col>
        </Row>
      </div>
    </>
  );
};

export default RecipientInformation;
