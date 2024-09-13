import React from "react";
import { Toaster } from "react-hot-toast";
import ProfileContent from "./ProfileContent";

const Profile = () => {

  return (
    <>
      <Toaster position="top-right" />
      <ProfileContent/>
      {/* <div className={styles.tab_container}>
        {isSmallScreen ? <ProfileHorizontal /> : <ProfileVertical />}
      </div> */}
    </>
  );
};

export default Profile;
