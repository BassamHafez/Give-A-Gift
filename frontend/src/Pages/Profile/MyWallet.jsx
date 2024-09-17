import React, { useState } from "react";
import styles from "./MyWallet.module.css";
import { useQuery } from "@tanstack/react-query";
import { getMyWallet } from "../../util/Http";
import { useTranslation } from "react-i18next";
import MainButton from "../../Components/Ui/MainButton";
import wallet from "../../Images/wallet.png";
import Transfer from "../../Components/Transfer/Transfer";
import toast from "react-hot-toast";
import { useNavigate} from "react-router-dom";
import { useSelector } from "react-redux";
import ConfirmationModal from "../../Components/Ui/ConfirmationModal";

const MyWallet = () => {
  const [modalShow, setModalShow] = useState(false);
  const [chargeModalShow, setChargeModalShow] = useState(false);
  const profileData = useSelector((state) => state.userInfo.data);
  const token = JSON.parse(localStorage.getItem("token"));
  const { t: key } = useTranslation();
  const navigate=useNavigate
  ();

  const notifySuccess = (message) => toast.success(message);
  const notifyError = (message) => toast.error(message);

  const { data } = useQuery({
    queryKey: ["walletBalance", token],
    queryFn: () => getMyWallet(token),
    enabled: !!token,
    staleTime:Infinity
  });


  const goToChargeMethods = () => {
    navigate(`/payment/payment/${profileData?._id}`);
  };

  return (
    <>
      <div className={styles.wallet_body}>
        <h1>{key("wallet")}</h1>
        <div className={styles.wallet_balance}>
          <div className={styles.wallet_img}>
            <img src={wallet} className="w-100" alt="wallet" />
          </div>
          <h2>{key("currentBalance")}</h2>
          <h3>
            {data?.data?.balance} {key("sar")}
          </h3>
          <div className={styles.btn_group}>
            <MainButton
              onClick={() => setModalShow(true)}
              type="white"
              text={key("transfer")}
            />
            <MainButton onClick={()=>setChargeModalShow(true)} text={key("charge")} />
          </div>
        </div>
      </div>
      {modalShow && (
        <Transfer
          notifySuccess={notifySuccess}
          notifyError={notifyError}
          show={modalShow}
          onHide={() => setModalShow(false)}
          balance={data?.data?.balance}
        />
      )}

      <ConfirmationModal
        show={chargeModalShow}
        onHide={() => setChargeModalShow(false)}
        func={goToChargeMethods}
        message={key("wouldCharge")}
        btnMsg={key("continue")}
      />
    </>
  );
};

export default MyWallet;
