import React, { useState } from "react";
import styles from "./Transfer.module.css";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import ConfirmationModal from "../Ui/ConfirmationModal";
import { useMutation } from "@tanstack/react-query";
import { ErrorMessage, Field, Form, Formik } from "formik";
import { object, string, number } from "yup";
import InputErrorMessage from "../Ui/InputErrorMessage";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faYinYang } from "@fortawesome/free-solid-svg-icons";
import { CountriesPhoneNumbers } from "../Logic/Logic";
import { transferMoney } from "../../util/Http";
import Select from "react-select";

const Transfer = ({ show, onHide, notifySuccess, notifyError, balance }) => {
  const [modalShow, setModalShow] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState("SA");
  const [transferData, setTransferData] = useState({});
  const token = JSON.parse(localStorage.getItem("token"));

  const getPhoneValidationSchema = (country) => {
    const phoneRegex = {
      EG: /^(\+20)?1[0125][0-9]{8}$/,
      SA: /^(\+966)?5[0-9]{8}$/,
      UAE: /^(\+971)?5[0-9]{8}$/,
      KW: /^(\+965)?[0-9]{8}$/,
      US: /^(\+1)?[0-9]{10}$/,
    };

    return object({
      amount: number()
        .typeError("Amount should be a number")
        .required("Amount is required")
        .min(5, "Amount must be greater than 5")
        .max(balance, "Not enough balance. Please recharge."),

      phoneNum: string()
        .matches(phoneRegex[country], "Invalid phone number")
        .required("Phone Number is required"),
    });
  };

  const { mutate, isPending } = useMutation({
    mutationFn: transferMoney,
    onSuccess: (response) => {
      let res = response.data;
      if (res.status === "success") {
        console.log("res", res);
        if (res.status === "success") {
          notifySuccess("Data transfered successfully");
        } else {
          console.log("else res", res);
          notifyError("Couldn'y transfer please try again later!");
        }
      }
    },
    onError: (error) => {
      console.log(error);
      notifyError("Couldn'y transfer please try again later!");
    },
  });

  const initialValues = {
    amount: "",
    phoneNum: "",
  };

  const onSubmit = (values) => {
    // console.log(values);
    setTransferData(values);
    setModalShow(true);
  };

  const transfer = () => {
    setModalShow(false);
    if (transferData) {
      mutate({ token: token, formData: transferData });
      console.log("transfered", transferData);
    } else {
      notifyError("There are no data to transfer");
    }
  };

  return (
    <>
      <Modal
        show={show}
        onHide={onHide}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
        className={styles.modal_container}
      >
        <Modal.Header closeButton>
          <Modal.Title>Transfer Funds to Recipient</Modal.Title>
        </Modal.Header>
        <Modal.Body className={`${styles.modal_body} text-center`}>
          <Formik
            initialValues={initialValues}
            onSubmit={onSubmit}
            validationSchema={getPhoneValidationSchema(selectedCountry)}
          >
            {({ setFieldValue }) => (
              <Form>
                <div className={styles.field}>
                  <label htmlFor="amount">Amount</label>
                  <Field type="text" id="amount" name="amount" />
                  <ErrorMessage name="amount" component={InputErrorMessage} />
                </div>

                <div className={`${styles.field} ${styles.phone_num_field}`}>
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
                      name="phoneNum"
                      className={styles.phone_input}
                    />
                  </div>
                  <ErrorMessage name="phoneNum" component={InputErrorMessage} />
                </div>

                <div className={styles.modal_footer}>
                  <Button
                    variant="primary"
                    className={styles.close_btn}
                    onClick={onHide}
                  >
                    Cancel
                  </Button>
                  {isPending ? (
                    <button type="submit" className={styles.tranfer_btn}>
                      <FontAwesomeIcon className="fa-spin" icon={faYinYang} />
                    </button>
                  ) : (
                    <button type="submit" className={styles.tranfer_btn}>
                      Transfer
                    </button>
                  )}
                </div>
              </Form>
            )}
          </Formik>
        </Modal.Body>
      </Modal>
      <ConfirmationModal
        show={modalShow}
        onHide={() => setModalShow(false)}
        func={transfer}
        message="You are about to transfer funds. Do you wish to continue?"
        btnMsg="Transfer"
      />
    </>
  );
};

export default Transfer;
