import React, { useState } from "react";
import styles from "./MyWallet.module.css";
import { useQuery } from "@tanstack/react-query";
import { getMyWallet } from "../../util/Http";
import { useTranslation } from "react-i18next";
import MainButton from "../../Components/Ui/MainButton";
import wallet from "../../Images/wallet.png";
import Transfer from "../../Components/Transfer/Transfer";
import toast, { Toaster } from "react-hot-toast";

const MyWallet = () => {
  const [modalShow, setModalShow] = useState(false);
  const token = JSON.parse(localStorage.getItem("token"));
  const { t: key } = useTranslation();
  const notifySuccess = (message) => toast.success(message);
  const notifyError = (message) => toast.error(message);

  const { data } = useQuery({
    queryKey: ["walletBalance", token],
    queryFn: () => getMyWallet(token),
    enabled: !!token,
    staleTime: 300000,
  });

  return (
    <>
      <Toaster position="top-right" />
      <div className={styles.wallet_body}>
        <h1>My Wallet</h1>
        <div className={styles.wallet_balance}>
          <div className={styles.wallet_img}>
            <img src={wallet} className="w-100" alt="wallet" />
          </div>
          <h2>Current Balance</h2>
          <h3>
            {data?.data?.balance} {key("sar")}
          </h3>
          <div className={styles.btn_group}>
            <MainButton
              onClick={() => setModalShow(true)}
              type="white"
              text={"Transfer"}
            />
            <MainButton text={"Recharge"} />
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
    </>
  );
};

export default MyWallet;
