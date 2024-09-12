import { useSelector } from "react-redux";
import styles from "./AccountManageMent.module.css";
import ChangeAvatar from "./AccountSettingForms/ChangeAvatar";
import ChangeEmail from "./AccountSettingForms/ChangeEmail";
import ChangeName from "./AccountSettingForms/ChangeName";
import ChangePassword from "./AccountSettingForms/ChangePassword";
import ChangePhone from "./AccountSettingForms/ChangePhone";
import VerifyPhoneNumber from "./AccountSettingForms/VerifyPhoneNumber";
import Alert from "react-bootstrap/Alert";

const AccountManageMent = () => {
  const profileData = useSelector((state) => state.profileInfo.data);

  return (
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
  );
};

export default AccountManageMent;
