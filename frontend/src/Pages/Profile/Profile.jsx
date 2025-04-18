import React, { useEffect } from "react";
import ProfileContent from "./ProfileContent";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const role = useSelector((state) => state.userInfo.role);
  const navigate = useNavigate();
  const profileData = useSelector((state) => state.profileInfo.data);

  useEffect(() => {
    if (role === "admin") {
      navigate(`/admin/${profileData?._id}`);
    } else if (role === "merchant") {
      navigate(`/merchant/${profileData?._id}`);
    }
  }, [role, navigate, profileData]);

  return (
    <>
      <ProfileContent />
    </>
  );
};

export default Profile;
