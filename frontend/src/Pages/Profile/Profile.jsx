import React from "react";
import { Toaster } from "react-hot-toast";
import ProfileContent from "./ProfileContent";

const Profile = () => {

  return (
    <>
      <Toaster position="top-right" />
      <ProfileContent/>
    </>
  );
};

export default Profile;
