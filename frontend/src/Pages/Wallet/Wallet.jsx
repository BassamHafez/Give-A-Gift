import React, { useEffect, useState } from "react";
import {
  faMoneyBillTransfer,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import styles from "../Profile/ProfileContent.module.css";
import Row from "react-bootstrap/esm/Row";
import Col from "react-bootstrap/esm/Col";
import { useTranslation } from "react-i18next";
import Transfer from "../../Components/Transfer/Transfer";
import { useQuery } from "@tanstack/react-query";
import { getMyWallet } from "../../util/Http";
import { toast } from "react-toastify";

const Wallet = () => {

    const [modalShow, setModalShow] = useState(false);
    const token = JSON.parse(localStorage.getItem("token"));
    const { t: key } = useTranslation();
  
    const { data,refetch } = useQuery({
      queryKey: ["walletBalance", token],
      queryFn: () => getMyWallet(token),
      enabled: !!token,
      staleTime:Infinity
    });

    useEffect(()=>{
      window.scrollTo(0, 0)
    })
  
    const notifySuccess = (message) => toast.success(message);
    const notifyError = (message) => toast.error(message);
  
    const formattedBalance = data?.data?.balance
      ? parseFloat(data.data.balance).toFixed(2)
      : "0.00";
    const [integerPart, decimalPart] = formattedBalance.split(".");

  return (
    <>
      <div className={styles.container_body}>
        <div>
          <div className={styles.title}>
            {key("currentBalance")}
          </div>
          <h1 className={styles.balance}>
            <span className={styles.sar}>{key("sar")}</span>{" "}
            <span className={styles.integer}>{integerPart}</span>
            <span className={styles.decimal}>.{decimalPart}</span>
          </h1>
        </div>

        <div>
          <Row className={`${styles.main_row} justify-content-center`}>
            <Col
              xs={6}
              className="d-flex justify-content-center align-items-center"
            >
              <div
                className={styles.list_item}
                onClick={() => setModalShow(true)}
              >
                <FontAwesomeIcon
                  className={styles.list_item_icon}
                  icon={faMoneyBillTransfer}
                />
                <span>{key("transfer")}</span>
              </div>
            </Col>
          </Row>
        </div>
      </div>

      {modalShow && (
        <Transfer
          notifySuccess={notifySuccess}
          notifyError={notifyError}
          show={modalShow}
          onHide={() => setModalShow(false)}
          balance={formattedBalance}
          refetch={refetch}
        />
      )}

    </>
  );
};

export default Wallet;
