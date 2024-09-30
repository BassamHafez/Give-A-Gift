import React, { useEffect, useState } from "react";
import MainNav from "../Components/MainNavbar/MainNav";
import Footer from "../Components/Footer/Footer";
import { Outlet } from "react-router-dom";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import VerifyPhoneNumberModal from "../Components/Ui/VerifyPhoneNumberModal";
import { useTranslation } from "react-i18next";

const Root = () => {
  const profileData = useSelector((state) => state.profileInfo.data);
  const [modalShow, setModalShow] = useState();
  const [storeLink, setStoreLink] = useState("");
  const { t: key } = useTranslation();
  const isLogin = useSelector((state) => state.userInfo.isLogin);

  const mainColor = useSelector((state) => state.configs.mainColor);
  const subColor = useSelector((state) => state.configs.subColor);

  useEffect(() => {
    const userAgent = navigator.userAgent || navigator.vendor || window.opera;

    if (/android/i.test(userAgent)) {
      setStoreLink(
        "https://play.google.com/store/apps/details?id=your.android.app"
      );
    } else if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) {
      setStoreLink("https://apps.apple.com/app/your-ios-app-id");
    }
  }, []);

  const Msg2 = ({ closeToast, toastProps }) => (
    <span>
      {key("downloadapp")}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          marginTop: "10px",
        }}
      >
        <div style={{ display: "flex", gap: "10px" }}>
          <button
            onClick={closeToast}
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
              window.open(`${storeLink}`);
            }}
            style={{
              borderRadius: "1.5625rem",
              minWidth: "6.25rem",
              fontSize: "1.125rem",
              fontWeight: "700",
              boxShadow: "0 0 0.1875rem rgba(0, 0, 0, 0.5)",
              padding: "10px",
              marginLeft: "auto",
              backgroundColor: "red",
              color: "#FFF",
            }}
          >
            {key("download")}
          </button>
        </div>
      </div>
    </span>
  );

  useEffect(() => {
    if (storeLink && !sessionStorage.getItem("appDownloadToastShown")) {
      toast.info(<Msg2 />, { autoClose: false });
      sessionStorage.setItem("appDownloadToastShown", "true");
    }
  }, [storeLink]);

  useEffect(() => {
    const Msg = ({ closeToast, toastProps }) => (
      <span>
        {key("verifyMsg")}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            marginTop: "10px",
          }}
        >
          <div style={{ display: "flex", gap: "10px" }}>
            <button
              onClick={closeToast}
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
              }}
              style={{
                borderRadius: "1.5625rem",
                minWidth: "6.25rem",
                fontSize: "1.125rem",
                fontWeight: "700",
                boxShadow: "0 0 0.1875rem rgba(0, 0, 0, 0.5)",
                padding: "10px",
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
    );

    const notifyError = () => toast(<Msg />, { autoClose: false });

    if (!isLogin || !profileData) {
      return;
    }

    if (profileData.phoneVerified === false) {
      notifyError();
    } else {
      return;
    }

    const intervalId = setInterval(() => {
      if (profileData?.phoneVerified === false) {
        notifyError();
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
