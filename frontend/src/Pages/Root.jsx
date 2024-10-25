import React, { useEffect, useState } from "react";
import MainNav from "../Components/MainNavbar/MainNav";
import Footer from "../Components/Footer/Footer";
import { Outlet } from "react-router-dom";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import VerifyPhoneNumberModal from "../Components/Ui/VerifyPhoneNumberModal";
import { useTranslation } from "react-i18next";
import { alertActions } from "../Store/cardsPhoneAlert-slice";

const Root = () => {
  const profileData = useSelector((state) => state.profileInfo.data);
  const [modalShow, setModalShow] = useState();
  const [storeLink, setStoreLink] = useState("");
  const isLogin = useSelector((state) => state.userInfo.isLogin);
  const dispatch = useDispatch();

  const mainColor = useSelector((state) => state.configs.mainColor);
  const showAlert = useSelector((state) => state.alert.showAlert);
  const lastAlertTime = useSelector((state) => state.alert.lastAlertTime);
  const subColor = useSelector((state) => state.configs.subColor);
  const [t, i18next] = useTranslation();

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

  const Msg2 = ({ closeToast }) => (
    <span>
      {t("downloadapp")}
      <div
        style={{ display: "flex", flexDirection: "column", marginTop: "10px" }}
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
            {t("later")}
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
              padding: "0.625rem",
              marginLeft: "auto",
              backgroundColor: "red",
              color: "#FFF",
            }}
          >
            {t("download")}
          </button>
        </div>
      </div>
    </span>
  );

  useEffect(() => {
    const showDownloadToast = () => {
      toast.info(<Msg2 />, { autoClose: false });
      sessionStorage.setItem("appDownloadToastShown", "true");
    };
    if (storeLink && !sessionStorage.getItem("appDownloadToastShown")) {
      showDownloadToast();
    }

    const handleLanguageChange = (lng) => {
      const previousLang = sessionStorage.getItem("prevLang");

      if (
        lng === "ar" &&
        previousLang !== "ar" &&
        !sessionStorage.getItem("languageToastShown")
      ) {
        showDownloadToast();
        sessionStorage.setItem("languageToastShown", "true");
      }

      sessionStorage.setItem("prevLang", lng);
    };
    handleLanguageChange(i18next.language);
    i18next.on("languageChanged", handleLanguageChange);
    return () => {
      i18next.off("languageChanged", handleLanguageChange);
    };
  }, [storeLink, t, i18next]);

  useEffect(() => {
    const Msg = ({ closeToast }) => (
      <span>
        {t("verifyMsg")}
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
                fontWeight: "700",
                boxShadow: "0 0 0.1875rem rgba(0, 0, 0, 0.5)",
                padding: "0.625rem 0.9375rem",
                marginRight: "auto",
              }}
            >
              {t("later")}
            </button>

            <button
              onClick={() => {
                setModalShow(true);
              }}
              style={{
                borderRadius: "1.5625rem",
                minWidth: "5rem",
                fontWeight: "700",
                boxShadow: "0 0 0.1875rem rgba(0, 0, 0, 0.5)",
                padding: "10px",
                marginLeft: "auto",
                backgroundColor: "red",
                color: "#FFF",
              }}
            >
              {t("verify")}
            </button>
          </div>
        </div>
      </span>
    );

    const notifyError = () => toast(<Msg />, { autoClose: false });

    if (!isLogin || !profileData) {
      return;
    }

    if (profileData.phoneVerified === false && showAlert) {
      const now = Date.now();

      if (!lastAlertTime || now - lastAlertTime >= 30 * 60 * 1000) {
        notifyError();
        dispatch(alertActions.setLastAlertTime(now));
      }
    }
    const intervalId = setInterval(() => {
      const now = Date.now();

      if (
        profileData?.phoneVerified === false &&
        (!lastAlertTime || now - lastAlertTime >= 30 * 60 * 1000)
      ) {
        notifyError();
        dispatch(alertActions.setLastAlertTime(now));
      }
    }, 30 * 60 * 1000);

    return () => clearInterval(intervalId);
  }, [profileData, isLogin, t, showAlert, lastAlertTime, dispatch]);

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
