import React, { useEffect, useState } from "react";
import { getCard, getMyWallet, updateCard } from "../../util/Http";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ErrorMessage, Form, Formik, Field } from "formik";
import { object, string } from "yup";
import InputErrorMessage from "../../Components/Ui/InputErrorMessage";
import styles from "./RecipientInformation.module.css";
import {
  faCircleInfo,
  faCrown,
  faYinYang,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import toast from "react-hot-toast";
import Col from "react-bootstrap/esm/Col";
import Row from "react-bootstrap/esm/Row";
import DatePicker from "react-multi-date-picker";
import TimePicker from "react-multi-date-picker/plugins/time_picker";
import Select from "react-select";
import {
  celebrateIcon,
  CountriesPhoneNumbers,
} from "../../Components/Logic/Logic";
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
      .nullable()
      .test("is-future-time", key("deliveryTimeFuture"), function (value) {
        if (!value) return true;
        const selectedDateTime = new Date(value);
        return selectedDateTime > new Date();
      }),
    celebrationLink: string().url("Please enter a valid URL").nullable(),
  });
};

const RecipientInformation = () => {
  let isArLang = localStorage.getItem("i18nextLng") === "ar";
  const [disableBtn, setDisableBtn] = useState(false);
  const [dateTime, setDateTime] = useState(null);
  const [selectedCountry, setSelectedCountry] = useState("SA");
  const [modalShow, setModalShow] = useState(false);
  const [detailsShow, setDetailsShow] = useState(false);
  const [confirmMsg, setConfirmMsg] = useState("");
  const [balanceCase, setBalanceCase] = useState(false);
  const [cardDetails, setCardDetails] = useState({});
  const [walletDetails, setWalletDetails] = useState({});
  const [totalPrice, setTotalPrice] = useState(0);
  const [btnMsg, setBtnMsg] = useState("");
  const [isCelebrateIcon, setIsCelebrationIcon] = useState(false);
  const [isCelebrateQR, setIsCelebrateQR] = useState(false);
  const [totalShapesPrice, setTotalShapesPrice] = useState(0);
  const notifySuccess = (message) => {
    toast.success((t) => (
      <div
        onClick={() => toast.dismiss(t.id)}
      >
        {message}
      </div>
    ));
  };

  const notifyError = (message) => {
    toast.error((t) => (
      <div
        onClick={() => toast.dismiss(t.id)}
      >
        {message}
      </div>
    ));
  };
  const token = JSON.parse(localStorage.getItem("token"));
  const { cardId } = useParams();
  const navigate = useNavigate();
  const profileData = useSelector((state) => state.userInfo.data);
  const celebrateIconPrice = useSelector(
    (state) => state.configs.celebrateIconPrice
  );
  const celebrateLinkPrice = useSelector(
    (state) => state.configs.celebrateLinkPrice
  );
  const { t: key } = useTranslation();
  const queryClient = useQueryClient();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const PriceAlert = (message) =>
    toast(
      (t) => (
        <div>
          <span>{message}</span>

          <div style={{ textAlign: "end" }}>
            <button
              onClick={() => toast.dismiss(t.id)}
              style={{
                borderRadius: "1.5625rem",
                minWidth: "6.25rem",
                fontSize: "1.125rem",
                fontWeight: "700",
                boxShadow: "0 0 0.1875rem rgba(0, 0, 0, 0.5)",
                padding: "0.625rem 0.9375rem",
                marginTop: "10px",
                backgroundColor: "#FFF",
                color: "#000",
              }}
            >
              {key("confirm")}
            </button>
          </div>
        </div>
      ),
      {
        icon: "🔔",
        style: {
          padding: "16px",
          color: "#FFF",
          fontWeight: "600",
          backgroundColor: "#b62026",
        },
        position: "bottom-right",
      }
    );

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
      if (data?.status === "success") {
        console.log(data);
        queryClient.invalidateQueries(["getCard", token]);
        if (data?.data?.celebrateIcon) {
          setIsCelebrationIcon(true);
        } else {
          setIsCelebrationIcon(false);
        }
        if (data?.data?.celebrateQR) {
          setIsCelebrateQR(true);
        } else {
          setIsCelebrateQR(false);
        }
        if (data?.data?.shapes?.length > 0) {
          const totalPrice = data.data.shapes.reduce((sum, shape) => {
            const price = shape.shape?.price || 0;
            return sum + price;
          }, 0);

          setTotalShapesPrice(totalPrice);
        }
        notifySuccess(key("saveRec"));
        setDisableBtn(true);
        confirmMethod("pay");
      } else if (
        data.response.data.message === "This card already has a recipient"
      ) {
        notifyError(key("cardHaveRec"));
      } else {
        notifyError(key("failRec"));
      }
    },
    onError: (error) => {
      notifyError(key("failRec"));
    },
  });

  const validationSchema = getPhoneValidationSchema(selectedCountry, key);

  const initialValues = {
    RecipientName: "",
    RecNumber: "",
    DelTime: "",
    celebrateLink: "",
    celebrateIcon: "",
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

    let updatedValues = {
      recipient: {
        name: values.RecipientName,
        whatsappNumber: `${phoneBeginning}${values.RecNumber}`,
      },
    };
    if (values.DelTime) {
      updatedValues.receiveAt = values.DelTime;
    }

    if (values.celebrateIcon !== "") {
      updatedValues.celebrateIcon = values.celebrateIcon;
    }

    if (values.celebrateLink !== "") {
      updatedValues.celebrateLink = values.celebrateLink;
    }

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

  const payCard = async () => {
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
        setModalShow(false);
        setDetailsShow(true);
      } else {
        notifyError(key("wrong"));
      }
    } catch (error) {
      if (error?.response?.data?.message === "Card already paid") {
        notifyError(key("cardPaid"));
      } else {
        notifyError(key("wrong"));
      }
    }
  };

  const goToChargeMethods = (price, cardId) => {
    navigate(`/payment/payment/${cardId}/${price}`);
  };

  const choosePaymentWay = (way, isBalanced, price, totalPrice) => {
    setTotalPrice(totalPrice);
    if (isBalanced === "balanced") {
      if (way === "wallet") {
        payCard();
      } else if (way === "payment") {
        goToChargeMethods(price, cardId);
      }
    } else {
      setBtnMsg(key("charge"));
      setBalanceCase(true);
    }
  };

  return (
    <>
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
                      value={dateTime || null}
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

                  <div className={styles.field}>
                    <label htmlFor="celebrateIcon" className="text-secondary">
                      {key("celebrateIcon")}{" "}
                      <FontAwesomeIcon
                        className={styles.crown_icon}
                        icon={faCrown}
                      />
                      <FontAwesomeIcon
                        className={styles.info}
                        onClick={() =>
                          PriceAlert(
                            `${key(
                              "proCelebrateIconMsg"
                            )} ${celebrateIconPrice} ${key("sar")}`
                          )
                        }
                        icon={faCircleInfo}
                      />
                    </label>

                    <Select
                      classNamePrefix="celebrateIcon"
                      isClearable={false}
                      isSearchable={true}
                      name="celebrateIcon"
                      options={celebrateIcon}
                      onChange={(value) => {
                        setFieldValue("celebrateIcon", value.value);
                      }}
                    />

                    <ErrorMessage
                      name="celebrateIcon"
                      component={InputErrorMessage}
                    />
                  </div>

                  <div className={styles.field}>
                    <label htmlFor="celebrateLink" className="text-secondary">
                      {key("celebrateLink")}{" "}
                      <FontAwesomeIcon
                        className={styles.crown_icon}
                        icon={faCrown}
                      />
                      <FontAwesomeIcon
                        className={styles.info}
                        onClick={() =>
                          PriceAlert(
                            `${key(
                              "proCelebrateLinkMsg"
                            )} ${celebrateLinkPrice} ${key("sar")}`
                          )
                        }
                        icon={faCircleInfo}
                      />
                    </label>
                    <Field
                      className={styles.name_input}
                      type="text"
                      id="celebrateLink"
                      name="celebrateLink"
                    />
                    <ErrorMessage
                      name="celebrateLink"
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
                      <button
                        disabled={disableBtn}
                        className={styles.save_btn}
                        type="submit"
                      >
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
          ProPrice={
            card?.data?.proColor ? card?.data?.proColor?.price : undefined
          }
          isCelebrateIcon={isCelebrateIcon}
          isCelebrateQR={isCelebrateQR}
          cardId={cardId}
          balanceCase={balanceCase}
          shapePrice={totalShapesPrice}
          chargeCase={goToChargeMethods}
          isRecPage={true}
        />
      )}
      {detailsShow && (
        <DetailsAfterBuying
          show={detailsShow}
          onHide={() => setDetailsShow(false)}
          cardDetails={cardDetails}
          walletDetails={walletDetails}
          totalPrice={totalPrice}
        />
      )}
    </>
  );
};

export default RecipientInformation;
