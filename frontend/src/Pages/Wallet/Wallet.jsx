import React, { useEffect, useState } from "react";
import {
  faClockRotateLeft,
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
  const [showHistoy, setShowHistoy] = useState(false);
  const token = JSON.parse(localStorage.getItem("token"));
  const { t: key } = useTranslation();
  let isArLang = localStorage.getItem("i18nextLng") === "ar";

  const { data, refetch } = useQuery({
    queryKey: ["walletBalance", token],
    queryFn: () => getMyWallet(token),
    enabled: !!token,
    staleTime: Infinity,
  });

  useEffect(() => {
    window.scrollTo(0, 0);
  });

  const notifySuccess = (message) => toast.success(message);
  const notifyError = (message) => toast.error(message);

  const formattedBalance = data?.data?.balance
    ? parseFloat(data.data.balance).toFixed(2)
    : "0.00";
  const [integerPart, decimalPart] = formattedBalance.split(".");

  const formatDateTime = (isoString) => {
    const date = new Date(isoString);
    const formattedDate = date.toLocaleDateString();
    const formattedTime = date.toLocaleTimeString();
    return { formattedDate, formattedTime };
  };

  return (
    <>
      <div className={styles.container_body}>
        <div>
          <div className={styles.title}>{key("currentBalance")}</div>
          <h1 className={styles.balance}>
            <span className={styles.sar}>{key("sar")}</span>{" "}
            <span className={styles.integer}>{integerPart}</span>
            <span className={styles.decimal}>.{decimalPart}</span>
          </h1>
        </div>

        <div>
          <Row className={`${styles.main_row} justify-content-center`}>
            <Col
              sm={6}
              className="d-flex justify-content-center align-items-center"
            >
              <div
                className={styles.list_item_prevOP}
                onClick={() => setShowHistoy(!showHistoy)}
              >
                <FontAwesomeIcon
                  className={styles.list_item_icon}
                  icon={faClockRotateLeft}
                />
                <span>{key("prevOP")}</span>
              </div>
            </Col>
            <Col
              sm={6}
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

        <ul
          className={`${styles.main_ul} ${
            showHistoy ? styles.show_ul : styles.hide_ul
          }`}
        >
          {data?.data?.transfers.map((process, index) => (
            <li className={styles.prev_process}>
              <h4 className={styles.counter_title}>{key("process")} ({index+1})</h4>
              <ul
                className={`${styles.sub_ul} ${!isArLang && styles.sub_ul_en}`}
              >
                <li>
                  <span>{key("amount")}</span>{" "}
                  <span>
                    {process.amount} {key("sar")}
                  </span>
                </li>
                <li>
                  <span>{key("name")}</span>
                  <span> {process.receiverName}</span>
                </li>
                <li>
                  <span>{key("phone")}</span>{" "}
                  <span>{process.receiverPhone}</span>
                </li>
                <li>
                  <span>{key("date")}</span>{" "}
                  <span>{formatDateTime(process.createdAt).formattedDate}</span>
                </li>
                <li>
                  <span>{key("time")}</span>{" "}
                  <span>{formatDateTime(process.createdAt).formattedTime}</span>
                </li>
              </ul>
            </li>
          ))}
        </ul>
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
