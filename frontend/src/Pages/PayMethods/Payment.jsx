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
import styles from "./PayMent.module.css";
import pay from "../../Images/pay.jpg";
import toast, { Toaster } from "react-hot-toast";

const notifySuccess = (message) => toast.success(message);
const notifyError = (message) => toast.error(message);

const Payment = () => {
  const token = JSON.parse(localStorage.getItem("token"));
  const { type, userId } = useParams();
  const [activeMethod, setActiveMethod] = useState(0);

  const { data } = useQuery({
    queryKey: ["paymentMethods", token],
    queryFn: () => getPaymentMethods(token),
    staleTime: 300000,
    enabled: !!token,
  });

  let isArLang = localStorage.getItem("i18nextLng") === "ar";
  // const navigate = useNavigate();

  const { mutate, isPending } = useMutation({
    mutationFn: executePayment,
    onSuccess: (response) => {
      console.log(response);
      if (response.status === "success") {
        notifySuccess("Please wait a moment while we process your request");
        window.open(`${response.data?.Data?.PaymentURL}`, "_blank");
      } else {
        notifyError("something went wrong please try again later");
      }
    },
    onError: (error) => {
      console.log(error);
      notifyError("something went wrong please try again later");
    },
  });

  const initialValues = {
    PaymentMethodId: "",
    InvoiceValue: "",
  };

  const onSubmit = (values) => {
    const updatedFormData = {
      PaymentMethodId: values.PaymentMethodId,
      InvoiceValue: values.InvoiceValue,
      type: type === "payment" ? "PAYMENT" : "DEPOSIT",
      successURL: `http://127.0.0.1:3001/profile/${userId}`,
      errorURL: `http://127.0.0.1:3001/profile/${userId}`,
      // errorURL: `http://127.0.0.1:3001/payment-faild`,
    };
    console.log(updatedFormData);
    mutate({ token: token, formData: updatedFormData });
  };

  const validationSchema = object({
    PaymentMethodId: number()
      .typeError("Payment Id should be a number")
      .required("Payment Method is required"),
    InvoiceValue: number()
      .typeError("Amount should be a number")
      .required("Amount is required")
      .min(5, "Amount must be greater than 5 SAR"),
  });

  return (
    <>
      <Toaster position="top-right" />
      <Row className={styles.container}>
        <Col
          md={7}
          className="d-flex justify-content-center align-items-center"
        >
          <Formik
            initialValues={initialValues}
            onSubmit={onSubmit}
            validationSchema={validationSchema}
          >
            <Form className={styles.form_container}>
              <div className={`${styles.field} ${styles.checks_group}`}>
                <h4 className="mb-4">Choose Payment Method</h4>
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
                        <img
                          src={method.ImageUrl}
                          alt={method.PaymentMethodEn}
                        />
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

              <div className={`${styles.field} ${styles.amount_field} `}>
                <label htmlFor="Amount">Amount (SAR)</label>
                <Field type="text" id="Amount" name="InvoiceValue" />
                <ErrorMessage
                  name="InvoiceValue"
                  component={InputErrorMessage}
                />
              </div>

              {isPending ? (
                <button type="submit" className={styles.save_btn}>
                  <FontAwesomeIcon className="fa-spin" icon={faYinYang} />
                </button>
              ) : (
                <button type="submit" className={styles.save_btn}>
                  Charge
                </button>
              )}
            </Form>
          </Formik>
        </Col>
        <Col
          md={5}
          className="d-flex justify-content-center align-items-center"
        >
          <div className={styles.main_img}>
            <img className="w-100" src={pay} alt="payment" />
          </div>
        </Col>
      </Row>
    </>
  );
};

export default Payment;
