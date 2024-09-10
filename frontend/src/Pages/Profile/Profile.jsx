import React, { useEffect, useState } from "react";
import styles from "./Profile.module.css";
import ProfileHorizontal from "./ProfileHorizontal";
import ProfileVertical from "./ProfileVertical";
import toast, { Toaster } from "react-hot-toast";

const notifySuccess = (message) => toast.success(message);
const notifyError = (message) => toast.error(message);

const Profile = () => {
  const [isSmallScreen, setIsSmallScreen] = useState(false);
  
  useEffect(() => {
    const handleResize = () => {
      setIsSmallScreen(window.innerWidth < 768);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <>
      <Toaster position="top-right" />

      <div className={styles.tab_container}>
        {isSmallScreen ? (
          <ProfileHorizontal
            notifySuccess={notifySuccess}
            notifyError={notifyError}
          />
        ) : (
          <ProfileVertical
            notifySuccess={notifySuccess}
            notifyError={notifyError}
          />
        )}
      </div>
    </>
  );
};

export default Profile;
