import React from "react";
import VerifyPhoneNumber from "../Profile/AccountSettingForms/VerifyPhoneNumber";
import ChangeName from "../Profile/AccountSettingForms/ChangeName";
import ChangePhone from "../Profile/AccountSettingForms/ChangePhone";
import ChangeEmail from "../Profile/AccountSettingForms/ChangeEmail";
import ChangePassword from "../Profile/AccountSettingForms/ChangePassword";
import ChangeAvatar from "../Profile/AccountSettingForms/ChangeAvatar";
import styles from "./MerchantProfile.module.css";
import { useSelector } from "react-redux";
import Alert from "react-bootstrap/Alert";

const MerchantAccountSetting = () => {
  const profileData = useSelector((state) => state.profileInfo.data);
  return (
    <>
      <div className={styles.acc_setting_body}>
        <div className={styles.verify_container}></div>
        {!profileData?.phoneVerified && (
          <Alert variant={"warning"}>
            <VerifyPhoneNumber />
          </Alert>
        )}
        <div className={styles.form_container}>
          <ChangeAvatar />
        </div>
        <div className={styles.form_container}>
          <ChangeName />
        </div>
        <div className={styles.form_container}>
          <ChangePhone />
        </div>
        <div className={styles.form_container}>
          <ChangeEmail />
        </div>
        <div className={styles.form_container}>
          <ChangePassword />
        </div>
      </div>
    </>
  );
};

export default MerchantAccountSetting;
