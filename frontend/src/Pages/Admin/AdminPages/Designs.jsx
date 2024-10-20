import React, { useEffect } from "react";
import styles from "./AdminPages.module.css";
import UpdateMainBanner from "./DesignForms/UpdateMainBanner";
import UpdateSecondaryBanner from "./DesignForms/UpdateSecondaryBanner";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const Designs = () => {
  const role = useSelector((state) => state.userInfo.role);
  const profileData = useSelector((state) => state.profileInfo.data);
  const navigate = useNavigate();

  useEffect(() => {
    if (role === "user") {
      navigate(`/`);
    } else if (role === "merchant") {
      navigate(`/merchant/${profileData?._id}`);
    }
  }, [role, navigate, profileData]);

  return (
    <div className={`${styles.main_body} ${styles.configs_body}`}>
      <div className="mb-5">
        <UpdateMainBanner />
      </div>
      <div className="mb-5">
        <UpdateSecondaryBanner />
      </div>
    </div>
  );
};

export default Designs;
