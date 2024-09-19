import React, { useState } from "react";
import { getCard, getMyWallet, updateCard } from "../../util/Http";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ErrorMessage, Form, Formik, Field } from "formik";
import { object, string } from "yup";
import InputErrorMessage from "../../Components/Ui/InputErrorMessage";
import styles from "./RecipientInformation.module.css";
import { faYinYang } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import toast, { Toaster } from "react-hot-toast";
import Col from "react-bootstrap/esm/Col";
import Row from "react-bootstrap/esm/Row";
import DatePicker from "react-multi-date-picker";
import TimePicker from "react-multi-date-picker/plugins/time_picker";
import Select from "react-select";
import { CountriesPhoneNumbers } from "../../Components/Logic/Logic";
import Button from "react-bootstrap/Button";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import ConfirmationModal from "../../Components/Ui/ConfirmationModal";
import axios from "axios";
import { useTranslation } from "react-i18next";
import KonvaCard from "./KonvaCard";
import DetailsAfterBuying from "../DetailsAfterBuying/DetailsAfterBuying";

const getPhoneValidationSchema = (country, key) => {
  const phoneRegex = {
    EG: /^(\+20)?1[0125][0-9]{8}$/,
    SA: /^(\+966)?5[0-9]{8}$/,
    UAE: /^(\+971)?5[0-9]{8}$/,
    KW: /^(\+965)?[0-9]{8}$/,
    US: /^(\+1)?[0-9]{10}$/,
  };

  return object({
    RecipientName: string().required(key("recNameValidation")),
    RecNumber: string()
      .matches(phoneRegex[country], key("invalidPhoneNumber"))
      .required(key("phoneNumberRequired")),
    DelTime: string()
      .required(key("deliveryTimeRequired"))
      .test("is-future-time", key("deliveryTimeFuture"), function (value) {
        if (!value) return false;
        const selectedDateTime = new Date(value);
        return selectedDateTime > new Date();
      }),
  });
};

const RecipientInformation = () => {
  let isArLang = localStorage.getItem("i18nextLng") === "ar";
  const [dateTime, setDateTime] = useState(null);
  const [selectedCountry, setSelectedCountry] = useState("SA");
  const [modalShow, setModalShow] = useState(false);
  const [detailsShow, setDetailsShow] = useState(false);
  const [confirmMsg, setConfirmMsg] = useState("");
  const [balanceCase, setBalanceCase] = useState(false);
  const [cardDetails, setCardDetails] = useState({});
  const [walletDetails, setWalletDetails] = useState({});
  const [btnMsg, setBtnMsg] = useState("");
  const notifySuccess = (message) => toast.success(message);
  const notifyError = (message) => toast.error(message);
  const token = JSON.parse(localStorage.getItem("token"));
  const { cardId } = useParams();
  const navigate = useNavigate();
  const profileData = useSelector((state) => state.userInfo.data);
  const { t: key } = useTranslation();
  const queryClient = useQueryClient();

  const { data: walletBalance } = useQuery({
    queryKey: ["walletBalance", token],
    queryFn: () => getMyWallet(token),
    enabled: !!token,
    staleTime: 300000,
    select: (data) => data.data?.balance,
  });

  const { data: card } = useQuery({
    queryKey: ["card", token],
    queryFn: () => getCard(token, cardId),
    staleTime: Infinity,
  });

  const { mutate, isPending } = useMutation({
    mutationFn: updateCard,
    onSuccess: (data) => {
      console.log("data", data);
      if (data?.status === "success") {
        queryClient.invalidateQueries(["getCard", token]);
        notifySuccess(key("saveRec"));
        confirmMethod("pay");
      } else {
        notifyError(key("failRec"));
      }
    },
    onError: (error) => {
      console.error(error);
      notifyError(key("failRec"));
    },
  });

  const validationSchema = getPhoneValidationSchema(selectedCountry, key);

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

  const confirmMethod = (method) => {
    if (method === "pay") {
      setModalShow(true);
      setConfirmMsg(key("purchase"));
      setBtnMsg(key("confirm"));
    } else {
      setModalShow(true);
      setConfirmMsg(key("chargeWallet"));
      setBtnMsg(key("confirm"));
    }
  };

  const payCard = async (price) => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_Base_API_URl}wallets/buy-card`,
        { cardId: cardId },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.status === 200 || response.status === 201) {
        notifySuccess(key("cardPurchased"));
        setCardDetails(response.data?.data?.card);
        setWalletDetails(response.data?.data?.wallet);
        setModalShow(false)
        setDetailsShow(true);
      } else {
        notifyError(key("wrong"));
      }
    } catch (error) {
      console.error("Payment error:", error);

      if (error?.response?.data?.message === "Card already paid") {
        notifyError(key("cardPaid"));
      } else {
        notifyError(key("wrong"));
      }
    }
  };

  const goToChargeMethods = (price) => {
    navigate(`/payment/payment/${profileData?._id}/${price}`);
  };

  const choosePaymentWay = (way, isBalanced, price) => {
    if (isBalanced === "balanced") {
      if (way === "wallet") {
        payCard(price);
      } else if (way === "payment") {
        goToChargeMethods(price);
      }
    } else {
      setBtnMsg(key("charge"));
      setBalanceCase(true);
    }
  };

  return (
    <>
      <Toaster position="top-right" />
      <div className="my-5 px-3 px-lg-5">
        <h1 className="text-center mb-4">{key("recipientInformation")}</h1>
        <Row className={styles.rec_row}>
          <Col xl={6}>
            <Formik
              initialValues={initialValues}
              onSubmit={onSubmit}
              validationSchema={validationSchema}
            >
              {({ setFieldValue }) => (
                <Form className={styles.general_info_form}>
                  <div className={styles.field}>
                    <label htmlFor="recName" className="text-secondary">
                      {key("name")}
                    </label>
                    <Field
                      className={styles.name_input}
                      type="text"
                      id="recName"
                      name="RecipientName"
                    />
                    <ErrorMessage
                      name="RecipientName"
                      component={InputErrorMessage}
                    />
                  </div>

                  <div className={styles.field}>
                    <label htmlFor="phoneNum" className="text-secondary">
                      {key("whatsAppNum2")}
                    </label>

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
                    <label htmlFor="delTime" className="text-secondary">
                      {key("dateTime")}
                    </label>
                    <DatePicker
                      value={dateTime}
                      onChange={(value) => {
                        setDateTime(value);
                        const formattedDateTime = new Date(value).toISOString();
                        setFieldValue("DelTime", formattedDateTime);
                      }}
                      format="YYYY/MM/DD HH:mm"
                      plugins={[<TimePicker position="top" />]}
                      placeholder="YYYY/MM/DD HH:mm"
                      className={styles.date_picker}
                    />
                    <ErrorMessage
                      name="DelTime"
                      component={InputErrorMessage}
                    />
                  </div>

                  <div
                    className={`${styles.btn_group} d-flex justify-content-between align-items-center mt-3 px-2`}
                  >
                    <Button
                      onClick={() => navigate(`/profile/${profileData._id}`)}
                      variant="secondary"
                      className={styles.later_btn}
                    >
                      {key("later")}
                    </Button>
                    {isPending ? (
                      <button type="submit" className={styles.save_btn}>
                        <FontAwesomeIcon className="fa-spin" icon={faYinYang} />
                      </button>
                    ) : (
                      <button className={styles.save_btn} type="submit">
                        {key("save")}
                      </button>
                    )}
                  </div>
                </Form>
              )}
            </Formik>
          </Col>
          <Col
            className="d-flex justify-content-center align-items-center"
            xl={6}
          >
            <KonvaCard
              isSpecial={card?.data?.isSpecial}
              canvaCard={card?.data}
            />
          </Col>
        </Row>
      </div>
      {modalShow && (
        <ConfirmationModal
          show={modalShow}
          onHide={() => setModalShow(false)}
          choosePaymentWay={choosePaymentWay}
          message={confirmMsg ? confirmMsg : ""}
          btnMsg={btnMsg}
          balance={walletBalance && walletBalance}
          cardPrice={card?.data?.price?.value}
          cardId={cardId}
          balanceCase={balanceCase}
          chargeCase={goToChargeMethods}
        />
      )}
      {detailsShow && (
        <DetailsAfterBuying
          show={detailsShow}
          onHide={() => setDetailsShow(false)}
          cardDetails={cardDetails}
          walletDetails={walletDetails}
        />
      )}
    </>
  );
};

export default RecipientInformation;
