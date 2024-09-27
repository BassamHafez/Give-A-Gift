import React, { useEffect, useState } from "react";
import MainNav from "../Components/MainNavbar/MainNav";
import Footer from "../Components/Footer/Footer";
import { Outlet } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import { useSelector } from "react-redux";
import VerifyPhoneNumberModal from "../Components/Ui/VerifyPhoneNumberModal";
import { useTranslation } from "react-i18next";

const Root = () => {
  const profileData = useSelector((state) => state.profileInfo.data);
  const [modalShow, setModalShow] = useState();
  const { t: key } = useTranslation();
  const isLogin = useSelector((state) => state.userInfo.isLogin);

  const mainColor = useSelector((state) => state.configs.mainColor);
  const subColor = useSelector((state) => state.configs.subColor);

  useEffect(() => {
    const notifyError = (message) =>
      toast(
        (t) => (
          <span>
            {message}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                marginTop: "10px",
              }}
            >
              <div style={{ display: "flex", gap: "10px" }}>
                <button
                  onClick={() => toast.dismiss(t.id)}
                  style={{
                    borderRadius: "1.5625rem",
                    fontSize: "1.125rem",
                    fontWeight: "700",
                    boxShadow: "0 0 0.1875rem rgba(0, 0, 0, 0.5)",
                    padding: "0.625rem 0.9375rem",
                    marginRight: "auto",
                  }}
                >
                  {key("later")}
                </button>

                <button
                  onClick={() => {
                    setModalShow(true);
                    toast.dismiss(t.id);
                  }}
                  style={{
                    borderRadius: "1.5625rem",
                    minWidth: "6.25rem",
                    fontSize: "1.125rem",
                    fontWeight: "700",
                    boxShadow: "0 0 0.1875rem rgba(0, 0, 0, 0.5)",
                    padding: "0.625rem 0.9375rem",
                    marginLeft: "auto",
                    backgroundColor: "red",
                    color: "#FFF",
                  }}
                >
                  {key("verify")}
                </button>
              </div>
            </div>
          </span>
        ),
        {
          icon: "⚠️",
          style: {
            padding: "16px",
            color: "#000",
            fontWeight: "600",
          },
        }
      );

    if (!isLogin || !profileData) {
      return;
    }

    if (profileData.phoneVerified === false) {
      notifyError(key("verifyMsg"));
    } else {
      return;
    }

    const intervalId = setInterval(() => {
      if (profileData?.phoneVerified === false) {
        notifyError(key("verifyMsg"));
      }
    }, 30 * 60 * 1000);

    return () => clearInterval(intervalId);
  }, [profileData, isLogin, key]);

  if (mainColor) {
    document.documentElement.style.setProperty("--main_color", mainColor);
  }
  if (subColor) {
    document.documentElement.style.setProperty("--sub_color", subColor);
  }

  return (
    <>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
        }}
      />
      <div>
        <MainNav />
        <Outlet />
        <Footer />
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

export default Root;
