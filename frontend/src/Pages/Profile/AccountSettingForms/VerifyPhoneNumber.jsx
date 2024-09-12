import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import Button from "react-bootstrap/Button";
import VerifyPhoneNumberModal from "../../../Components/Ui/VerifyPhoneNumberModal";
import axios from "axios";
import toast from "react-hot-toast";

const VerifyPhoneNumber = () => {
  const { t: key } = useTranslation();
  const [modalShow, setModalShow] = useState();
  let isArLang = localStorage.getItem("i18nextLng") === "ar";
  const token = JSON.parse(localStorage.getItem("token"));
  const notifyError = (message) => toast.error(message);
  const notifySuccess = (message) => toast.success(message);

  const sendVerificationCode = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_Base_API_URl}users/phone-wa-code`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      console.log(response.data);
      if (response?.data?.status === "success") {
        notifySuccess("check your whatsapp");
        setModalShow(true);
      } else {
        notifyError("couldn't send code try again later");
      }
    } catch (error) {
      console.error(error);
      return error;
    }
  };

  return (
    <>
      <div>
        <h4>{key("verifyMsg")}</h4>
        <div className={`${isArLang ? "text-start" : "text-end"}`}>
          <Button
            onClick={sendVerificationCode}
            className="fw-bold"
            variant="warning"
          >
            {key("sendCode")}
          </Button>
        </div>
      </div>
      {modalShow && (
        <VerifyPhoneNumberModal
          show={modalShow}
          onHide={() => setModalShow(false)}
        />
      )}
    </>
  );
};

export default VerifyPhoneNumber;
