import React, { useEffect, useState } from "react";
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
import { controlWallets } from "../../../util/Http";
import { useQuery } from "@tanstack/react-query";
import AddBalanceAll from "./WalletsForms/AddBalanceAll";
import AddBalance from "./WalletsForms/AddBalance";
import RemoveBalanceAll from "./WalletsForms/RemoveBalanceAll";

const Wallets = () => {
  const { t: key } = useTranslation();
  const token = JSON.parse(localStorage.getItem("token"));
  const [searchInput, setSearchInput] = useState("");
  const [showModal, setModalShow] = useState(false);
  const [walletId, setWalletId] = useState(false);

  const notifySuccess = (message) => {
    toast.success((t) => (
      <div
        onClick={() => toast.dismiss(t.id)}
      >
        {message}
      </div>
    ));
  };


  const { data: wallets, refetch } = useQuery({
    queryKey: ["controlWallets", token],
    queryFn: () => controlWallets({ token }),
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

  const filterWallets = wallets
    ? wallets.data?.data?.filter(
        (wallet) =>
          wallet.user?.name.toLowerCase().includes(searchInput.toLowerCase()) ||
          wallet._id.includes(searchInput)
      )
    : [];
    useEffect(()=>{
      window.scrollTo(0, 0)
    },[])
  return (
    <>
      <div className={styles.main_body}>
        <div className={styles.configs_body}>
          <AddBalanceAll refetch={refetch} />
          <RemoveBalanceAll refetch={refetch}/>
        </div>
        <hr />
        <div>
          <div>
            <h4 className="fw-bold text-secondary">{key("allWallets")}</h4>

            <div
              className={`${styles.controllers} d-flex justify-content-between my-5`}
            >
              <div
                onClick={() => setSearchInput("")}
                className={styles.filter_box}
              >
                <span className={styles.filter}>{key("default")}</span>
              </div>
              <div>
                <SearchField onSearch={handleSearch} text={key("search")} />
              </div>
            </div>
          </div>
          <Row className="justify-content-center position-relative">
            {wallets ? (
              filterWallets?.length > 0 ? (
                filterWallets.map((wallet) => (
                  <Col
                    key={wallet._id}
                    sm={6}
                    lg={4}
                    className="d-flex justify-content-center align-items-center"
                  >
                    <div
                      className={`${styles.user_div} ${styles.cur_pointer}`}
                      onClick={() => {
                        setWalletId(wallet._id);
                        setModalShow(true);
                      }}
                    >
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
                          <span className="mini_word">
                            {wallet.user?.email}
                          </span>
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
                          {key("balance")}: {wallet.balance.toFixed(2)}
                        </li>
                      </ul>
                    </div>
                  </Col>
                ))
              ) : (
                wallets.data?.data?.map((wallet) => (
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
                          <span className="mini_word">
                            {wallet.user?.email}
                          </span>
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
      </div>
      {showModal && (
        <AddBalance
          show={showModal}
          onHide={() => setModalShow(false)}
          walletId={walletId}
          refetch={refetch}
        />
      )}
    </>
  );
};

export default Wallets;
