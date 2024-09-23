import React, { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { ErrorMessage, Field, Form, Formik } from "formik";
import { number, object } from "yup";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faYinYang } from "@fortawesome/free-solid-svg-icons";
import { executePayment } from "../../util/Http";
import Col from "react-bootstrap/esm/Col";
import Row from "react-bootstrap/esm/Row";
import { getPaymentMethods } from "../../util/Http";
import { useParams } from "react-router-dom";
import InputErrorMessage from "../../Components/Ui/InputErrorMessage";
import styles from "./Payment.module.css";
import toast, { Toaster } from "react-hot-toast";
import { useTranslation } from "react-i18next";

const notifySuccess = (message) => toast.success(message);
const notifyError = (message) => toast.error(message);

const Payment = () => {
  const token = JSON.parse(localStorage.getItem("token"));
  const { type, cardId, price } = useParams();
  const [activeMethod, setActiveMethod] = useState(0);
  const { t: key } = useTranslation();

  const { data } = useQuery({
    queryKey: ["paymentMethods", token],
    queryFn: () => getPaymentMethods(token),
    staleTime: Infinity,
    enabled: !!token,
  });

  let isArLang = localStorage.getItem("i18nextLng") === "ar";

  const { mutate, isPending } = useMutation({
    mutationFn: executePayment,
    onSuccess: (response) => {
      console.log(response);
      if (response.status === "success") {
        notifySuccess(key("redirect"));
        window.open(`${response.data?.Data?.PaymentURL}`, "_blank");
      } else {
        notifyError(key("wrong"));
      }
    },
    onError: (error) => {
      console.log(error);
      notifyError(key("wrong"));
    },
  });

  const initialValues = {
    PaymentMethodId: "",
    InvoiceValue: type === "payment" ? Number(price) : "",
  };

  const onSubmit = (values) => {
    const successURL =
      type === "payment"
        ? `${process.env.REACT_APP_Host}payment-success/${cardId}`
        : `${process.env.REACT_APP_Host}payment-success/charge`;

    const updatedFormData = {
      PaymentMethodId: values.PaymentMethodId,
      InvoiceValue: values.InvoiceValue,
      type: type === "payment" ? "PAYMENT" : "DEPOSIT",
      successURL: successURL,
      errorURL: successURL,
      // errorURL: `${process.env.REACT_APP_Host}payment-faild`,
    };
    mutate({ token: token, formData: updatedFormData });
  };

  const validationSchema = object({
    PaymentMethodId: number()
      .typeError(key("paymentIdValidate1"))
      .required(key("paymentIdValidate2")),
    InvoiceValue: number()
      .typeError(key("amountValidate1"))
      .required(key("amountValidate2")),
    // .min(5, key("amountValidate3")),
  });

  return (
    <>
      <Toaster position="top-right" />
      <div
        className={`${styles.container} d-flex justify-content-center align-items-center my-5`}
      >
        <Formik
          initialValues={initialValues}
          onSubmit={onSubmit}
          validationSchema={validationSchema}
          enableReinitialize
        >
          <Form className={styles.form_container}>
            <div className={`${styles.field} ${styles.checks_group}`}>
              <h4 className="mb-4">{key("chooseMethod")}</h4>
              <Row
                className={`${styles.select_group} gy-2`}
                role="group"
                aria-label="Basic radio toggle button group"
              >
                {data?.data?.map((method, index) => (
                  <Col
                    key={method.PaymentMethodId}
                    className="d-flex flex-column align-items-center justify-content-center my-4"
                    sm={4}
                    md={6}
                    lg={4}
                  >
                    <div className={styles.method_img}>
                      <img src={method.ImageUrl} alt={method.PaymentMethodEn} />
                    </div>
                    <div>
                      <Field
                        type="radio"
                        className="btn-check"
                        name="PaymentMethodId"
                        id={method.PaymentMethodId}
                        value={method.PaymentMethodId}
                        autoComplete="off"
                      />
                      <label
                        onClick={() => setActiveMethod(index)}
                        className={`${styles.method_label} ${
                          activeMethod === index && styles.active_method
                        } btn btn-outline-secondary`}
                        htmlFor={method.PaymentMethodId}
                      >
                        {isArLang
                          ? method.PaymentMethodAr
                          : method.PaymentMethodEn}
                      </label>
                    </div>
                  </Col>
                ))}
              </Row>
              <ErrorMessage
                name="PaymentMethodId"
                component={InputErrorMessage}
              />
            </div>

            <div
              className={`${styles.field} ${styles.amount_field} ${
                type === "payment" ? "d-none" : ""
              }`}
            >
              <label htmlFor="Amount">
                {key("amount")} ({key("sar")})
              </label>
              <Field type="text" id="Amount" name="InvoiceValue" />
              <ErrorMessage name="InvoiceValue" component={InputErrorMessage} />
            </div>

            {isPending ? (
              <button type="submit" className={styles.save_btn}>
                <FontAwesomeIcon className="fa-spin" icon={faYinYang} />
              </button>
            ) : (
              <button type="submit" className={styles.save_btn}>
                {key("charge")}
              </button>
            )}
          </Form>
        </Formik>
      </div>
    </>
  );
};

export default Payment;
