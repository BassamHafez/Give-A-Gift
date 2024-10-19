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
import { useNavigate, useParams } from "react-router-dom";
import InputErrorMessage from "../../Components/Ui/InputErrorMessage";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import styles from "./MyPay.module.css";

const Payment = () => {
  const token = JSON.parse(localStorage.getItem("token"));
  const { type, cardId, price } = useParams();
  const [activeMethod, setActiveMethod] = useState(0);
  const { t: key } = useTranslation();
  const navigate = useNavigate();

  const notifyError = (message) => toast.error(message);
  const notifyConfirm = (message) =>
    toast(message, {
      autoClose: false,
      position: "top-right",
      style: {
        backgroundColor: "rgb(240, 243, 247)",
        color: "black",
        boxShadow: "0px 0px 8px rgba(0, 0, 0, 0.5)",
      },
    });

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
      if (response.status === "success") {
        const paymentUrl = response.data?.Data?.PaymentURL;
        const Msg = ({ closeToast, toastProps }) => (
          <div>
            <span>{key("openPageNewTab")}</span>
            <div
              style={{
                marginTop: "20px",
              }}
            >
              <div style={{ textAlign: "center" }}>
                <a
                  href={`${paymentUrl}`}
                  target="_blank"
                  rel="noreferrer"
                  onClick={() => {
                    closeToast();
                    navigate(`/user-orders`);
                  }}
                  style={{
                    borderRadius: "1.5625rem",
                    padding: "0.625rem 0.9375rem",
                    backgroundColor: "#b62026",
                    color: "#FFF",
                    textAlign: "center",
                  }}
                  className="text-white"
                >
                  {key("confirm")}
                </a>
              </div>
            </div>
          </div>
        );
        notifyConfirm(<Msg />);
      } else {
        notifyError(key("wrong"));
      }
    },
    onError: (error) => {
      notifyError(key("wrong"));
    },
  });

  const initialValues = {
    PaymentMethodId: "",
    InvoiceValue: type === "payment" ? Number(price) : "",
  };

  const onSubmit = (values) => {
    const updatedFormData = {
      PaymentMethodId: values.PaymentMethodId,
      InvoiceValue: values.InvoiceValue,
      cardId: cardId,
    };
    mutate({ token: token, formData: updatedFormData });
  };

  const validationSchema = object({
    PaymentMethodId: number()
      .typeError(key("paymentIdValidate1"))
      .required(key("paymentIdValidate2")),
    InvoiceValue: number()
      .typeError(key("amountValidate1"))
      .required(key("amountValidate2"))
      .min(10, key("min10")),
  });

  return (
    <>
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
              <div className="text-center mt-4">
                {isPending ? (
                  <button type="submit" className={styles.save_btn}>
                    <FontAwesomeIcon className="fa-spin" icon={faYinYang} />
                  </button>
                ) : (
                  <button type="submit" className={styles.save_btn}>
                    {key("pay")}
                  </button>
                )}
              </div>

              <ErrorMessage
                name="PaymentMethodId"
                component={InputErrorMessage}
              />
              <ErrorMessage name="InvoiceValue" component={InputErrorMessage} />
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
            </div>
          </Form>
        </Formik>
      </div>
    </>
  );
};

export default Payment;

// const { mutate, isPending } = useMutation({
//   mutationFn: executePayment,
//   onSuccess: (response) => {
//     if (response.status === "success") {
//       const paymentUrl = response.data?.Data?.PaymentURL;
//       const Msg = ({ closeToast, toastProps }) => (
//         <div>
//           <span>{key("openPageNewTab")}</span>
//           <div
//             style={{
//               display: "flex",
//               flexDirection: "column",
//               marginTop: "10px",
//             }}
//           >
//             <div style={{ display: "flex", gap: "10px" }}>
//               <a
//                 href={`${paymentUrl}`}
//                 onClick={() => {
//                   closeToast();
//                 }}
//                 style={{
//                   borderRadius: "1.5625rem",
//                   fontWeight: "700",
//                   boxShadow: "0 0 0.1875rem rgba(0, 0, 0, 0.5)",
//                   padding: "0.625rem 0.9375rem",
//                   marginRight: "auto",
//                   textAlign: "center",
//                 }}
//                 className="text-dark"
//               >
//                 {key("sameTab")}
//               </a>

//               <a
//                 href={`${paymentUrl}`}
//                 target="_blank"
//                 rel="noreferrer"
//                 onClick={() => {
//                   closeToast();
//                   navigate(`/user-orders`);
//                 }}
//                 style={{
//                   borderRadius: "1.5625rem",
//                   minWidth: "6.25rem",
//                   fontWeight: "700",
//                   boxShadow: "0 0 0.1875rem rgba(0, 0, 0, 0.5)",
//                   padding: "0.625rem",
//                   marginLeft: "auto",
//                   backgroundColor: "red",
//                   color: "#FFF",
//                   textAlign: "center",
//                 }}
//                 className="text-white"
//               >
//                 {key("newTab")}
//               </a>
//             </div>
//           </div>
//         </div>
//       );
//       notifyConfirm(<Msg />);
//     } else {
//       notifyError(key("wrong"));
//     }
//   },
//   onError: (error) => {
//     notifyError(key("wrong"));
//   },
// });
