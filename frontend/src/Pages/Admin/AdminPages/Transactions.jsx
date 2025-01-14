import React, { useEffect, useState } from "react";
import styles from "./AdminPages.module.css";
import {
  faChartSimple,
  faCoins,
  faCreditCard,
  faHashtag,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Row from "react-bootstrap/esm/Row";
import Col from "react-bootstrap/esm/Col";
import LoadingOne from "../../../Components/Ui/LoadingOne";
import SearchField from "../../../Components/Ui/SearchField";
import { useTranslation } from "react-i18next";
import { controlTransactions } from "../../../util/Http";
import { useQuery } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import NoDataPage from "../../../Components/Ui/NoDataPage";
import ScrollTopButton from "../../../Components/Ui/ScrollTopButton";

const Transactions = () => {
  const { t: key } = useTranslation();
  const token = JSON.parse(localStorage.getItem("token"));
  const [searchInput, setSearchInput] = useState("");
  const role = useSelector((state) => state.userInfo.role);
  const profileData = useSelector((state) => state.profileInfo.data);
  const navigate = useNavigate();

  useEffect(() => {
    if (role === "user") {
      navigate(`/`);
    } else if (role === "merchant") {
      navigate(`/merchant/${profileData?._id}`);
    }
  }, [role, navigate, profileData]);

  const { data: allTransactions } = useQuery({
    queryKey: ["allTransactions", token],
    queryFn: () => controlTransactions({ type: "all", token }),
    enabled: !!token,
    staleTime: Infinity,
  });

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const { data: totalSuccessTransactions } = useQuery({
    queryKey: ["successTransactions", token],
    queryFn: () => controlTransactions({ type: "successTransactions", token }),
    enabled: !!token,
    staleTime: Infinity,
  });

  const handleSearch = (e, searchTerm) => {
    e.preventDefault();
    if (searchTerm !== "" && searchTerm !== searchInput) {
      setSearchInput(searchTerm);
    }
  };
  let filterTransactions;

  filterTransactions = allTransactions
    ? allTransactions.data?.filter(
        (op) =>
          op.CustomerName.toLowerCase().includes(searchInput.toLowerCase()) ||
          op.CustomerEmail.toLowerCase().includes(searchInput.toLowerCase()) ||
          op.PaymentId.trim() === searchInput.trim() ||
          op.PaymentMethod.toLowerCase() === searchInput.toLowerCase() ||
          op.UserDefinedField.toLowerCase() === searchInput.toLowerCase()
      )
    : [];

  return (
    <div className={styles.main_body}>
      <div>
        <h4>
          <span className="text-secondary">
            {key("totalSuccessfulInvoiceValue")}:
          </span>{" "}
          {totalSuccessTransactions
            ? totalSuccessTransactions.data?.totalValue
            : 0}{" "}
          {key("sar")}
        </h4>
      </div>
      <hr />
      <div>
        <h5 className="text-secondary">{key("allTransactions")}</h5>

        <div
          className={`${styles.controllers} d-flex justify-content-between align-items-center my-5`}
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
            filterTransactions?.map((trans) => (
              <Col
                key={trans._id}
                sm={6}
                lg={4}
                className="d-flex justify-content-center align-items-center"
              >
                <div className={`${styles.user_div}`}>
                  <div className={styles.user_header_info}>
                    <h5>{trans.CustomerName}</h5>
                    <span className="mini_word">{trans.CustomerEmail}</span>
                  </div>

                  <ul className="p-0 mt-4">
                    <li className={styles.details_list}>
                      <FontAwesomeIcon
                        className={styles.details_list_icon}
                        icon={faChartSimple}
                      />{" "}
                      {key("state")}: {trans.TransactionStatus}
                    </li>
                    <li className={styles.details_list}>
                      <FontAwesomeIcon
                        className={styles.details_list_icon}
                        icon={faCoins}
                      />{" "}
                      {key("transValue")}: {trans.InvoiceValue}
                    </li>
                    <li className={styles.details_list}>
                      <FontAwesomeIcon
                        className={styles.details_list_icon}
                        icon={faCreditCard}
                      />{" "}
                      {key("PaymentMethod")}: {trans.PaymentMethod}
                    </li>
                    <li className={styles.details_list}>
                      <FontAwesomeIcon
                        className={styles.details_list_icon}
                        icon={faCreditCard}
                      />{" "}
                      {key("UserDefinedField")}: {trans.UserDefinedField}
                    </li>
                    <li className={styles.details_list}>
                      <FontAwesomeIcon
                        className={styles.details_list_icon}
                        icon={faHashtag}
                      />{" "}
                      {key("paymentId")}: {trans.PaymentId}
                    </li>
                  </ul>
                </div>
              </Col>
            ))
          ) : (
            <NoDataPage />
          )
        ) : (
          <LoadingOne />
        )}
      </Row>
      <ScrollTopButton />
    </div>
  );
};

export default Transactions;
