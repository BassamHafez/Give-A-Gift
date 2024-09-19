import React, { useState } from "react";
import styles from "./AdminPages.module.css";
import {
  faIdCard,
  faPhone,
  faSackDollar,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Row from "react-bootstrap/esm/Row";
import Col from "react-bootstrap/esm/Col";
import LoadingOne from "../../../Components/Ui/LoadingOne";
import defaultImg from "../../../Images/default.png";
import SearchField from "../../../Components/Ui/SearchField";
import { useTranslation } from "react-i18next";
import toast from "react-hot-toast";
import { controlTransactions } from "../../../util/Http";
import { useQuery } from "@tanstack/react-query";

const Transactions = () => {
  const { t: key } = useTranslation();
  const token = JSON.parse(localStorage.getItem("token"));
  const [searchInput, setSearchInput] = useState("");

  const notifySuccess = (message) => toast.success(message);

  const { data: allTransactions } = useQuery({
    queryKey: ["allTransactions", token],
    queryFn: () => controlTransactions({ type: "all", token }),
    enabled: !!token,
    staleTime: Infinity,
  });

  const { data: totalSuccessTransactions } = useQuery({
    queryKey: ["successTransactions", token],
    queryFn: () => controlTransactions({ type: "successTransactions", token }),
    enabled: !!token,
    staleTime: Infinity,
  });

  const handleSearch = (e, searchTerm) => {
    e.preventDefault();
    if (searchTerm !== ""&&searchTerm!==searchInput) {
      setSearchInput(searchTerm);
      notifySuccess(key("searchFilterApplied"));
    }
  };

  let filterTransactions;

  filterTransactions = allTransactions
    ? allTransactions.data?.filter(
        (op) =>
          op.CustomerName.toLowerCase().includes(searchInput.toLowerCase()) ||
          op._id.includes(searchInput) ||
          op.PaymentMethod.toLowerCase() === searchInput.toLowerCase()
      )
    : [];

  return (
    <div className={styles.main_body}>
      <div>
        <h2><span className="text-secondary">{key("totalSuccessfulInvoiceValue")}:</span> {totalSuccessTransactions?totalSuccessTransactions.data?.totalValue:0}</h2>
      </div>
      <hr/>
      <div>
        <h4 className="fw-bold text-secondary">{key("allTransactions")}</h4>

        <div
          className={`${styles.controllers} d-flex justify-content-between my-5`}
        >
          <div onClick={() => setSearchInput("")} className={styles.filter_box}>
            <span className={styles.filter}>{key("default")}</span>
          </div>
          <div>
            <SearchField onSearch={handleSearch} text={key("search")} />
          </div>
        </div>
      </div>
      <Row className="justify-content-center position-relative">
        {allTransactions ? (
          filterTransactions?.length > 0 ? (
            filterTransactions.map((wallet) => (
              <Col
                key={wallet._id}
                sm={6}
                lg={4}
                className="d-flex justify-content-center align-items-center"
              >
                <div className={`${styles.user_div} ${styles.cur_pointer}`}>
                  <div className={styles.user_header}>
                    <div className={styles.user_img}>
                      <img
                        src={
                          wallet.user?.photo
                            ? `${process.env.REACT_APP_Host}users/${wallet.user.photo}`
                            : defaultImg
                        }
                        alt="wallet user"
                      />
                    </div>
                    <div className={styles.user_header_info}>
                      <h5>{wallet.user?.name}</h5>
                      <span className="mini_word">{wallet.user?.email}</span>
                    </div>
                  </div>
                  <ul className="p-0 mt-4">
                    <li className={styles.details_list}>
                      <FontAwesomeIcon
                        className={styles.details_list_icon}
                        icon={faPhone}
                      />{" "}
                      {wallet.user?.phone}
                    </li>
                    <li className={styles.details_list}>
                      <FontAwesomeIcon
                        className={styles.details_list_icon}
                        icon={faIdCard}
                      />
                      {wallet._id}
                    </li>
                    <li className={styles.details_list}>
                      <FontAwesomeIcon
                        className={styles.details_list_icon}
                        icon={faSackDollar}
                      />
                      {key("balance")}: {wallet.balance}
                    </li>
                  </ul>
                </div>
              </Col>
            ))
          ) : (
            allTransactions.data?.data?.map((wallet) => (
              <Col
                key={wallet._id}
                sm={6}
                lg={4}
                className="d-flex justify-content-center align-items-center"
              >
                <div className={styles.user_div}>
                  <div className={styles.user_header}>
                    <div className={styles.user_img}>
                      <img
                        src={
                          wallet.user?.photo
                            ? `${process.env.REACT_APP_Host}users/${wallet.user.photo}`
                            : defaultImg
                        }
                        alt="wallet user"
                      />
                    </div>
                    <div className={styles.user_header_info}>
                      <h5>{wallet.user?.name}</h5>
                      <span className="mini_word">{wallet.user?.email}</span>
                    </div>
                  </div>
                  <ul className="p-0 mt-4">
                    <li className={styles.details_list}>
                      <FontAwesomeIcon
                        className={styles.details_list_icon}
                        icon={faPhone}
                      />{" "}
                      {wallet.user?.phone}
                    </li>
                    <li className={styles.details_list}>
                      <FontAwesomeIcon
                        className={styles.details_list_icon}
                        icon={faIdCard}
                      />
                      {wallet._id}
                    </li>
                    <li className={styles.details_list}>
                      <FontAwesomeIcon
                        className={styles.details_list_icon}
                        icon={faSackDollar}
                      />
                      {key("balance")}: {wallet.balance}
                    </li>
                  </ul>
                </div>
              </Col>
            ))
          )
        ) : (
          <LoadingOne />
        )}
      </Row>
    </div>
  );
};

export default Transactions;
