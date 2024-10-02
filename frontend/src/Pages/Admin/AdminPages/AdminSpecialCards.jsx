import React, { useEffect } from "react";
import styles from "./AdminPages.module.css";
import AllCards from "./SpecialCards/AllCards";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const AdminSpecialCards = () => {
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
    <div className={styles.main_body}>
      <AllCards />
    </div>
  );
};

export default AdminSpecialCards;
