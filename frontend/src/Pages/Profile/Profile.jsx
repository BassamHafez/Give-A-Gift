import React, { useEffect, useState } from "react";
import styles from "./Profile.module.css";
import ProfileHorizontal from "./ProfileHorizontal";
import ProfileVertical from "./ProfileVertical";
import { Toaster } from "react-hot-toast";

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
        {isSmallScreen ? <ProfileHorizontal /> : <ProfileVertical />}
      </div>
    </>
  );
};

export default Profile;
