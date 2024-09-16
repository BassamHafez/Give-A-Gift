import React, { useState } from "react";
import {
  faBrush,
  faChartPie,
  faDoorOpen,
  faGifts,
  faMoneyBillTransfer,
  faPallet,
  faStar,
  faStore,
  faTicket,
  faUsers,
  faWallet,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import styles from "./Admin.module.css";
import Row from "react-bootstrap/esm/Row";
import Col from "react-bootstrap/esm/Col";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import LogoutModal from "../../Components/Ui/LogoutModal";

const Admin = () => {
  const [logoutModalShow, setLogoutModalShow] = useState(false);
  const navigate = useNavigate();
  const { t: key } = useTranslation();

  return (
    <>
      <div className={styles.container_body}>
        <div className={styles.content}>
          <h1 className={styles.balance}>{key("dashboard")}</h1>
          <div>
            <Row className={`${styles.main_row} justify-content-center`}>
              <Col
                xs={6}
                className="d-flex justify-content-center align-items-center"
              >
                <div className={styles.list_item}>
                  <FontAwesomeIcon
                    className={styles.list_item_icon}
                    icon={faChartPie}
                  />
                  <span>{key("analysis")}</span>
                </div>
              </Col>
              <Col
                xs={6}
                className="d-flex justify-content-center align-items-center"
                onClick={() => navigate("/admin-specialCards")}
              >
                <div className={styles.list_item}>
                  <FontAwesomeIcon
                    className={styles.list_item_icon}
                    icon={faGifts}
                  />
                  <span>{key("readyCards")}</span>
                </div>
              </Col>
              <Col
                xs={6}
                className="d-flex justify-content-center align-items-center"
                onClick={() => navigate("/admin-users")}
              >
                <div className={styles.list_item}>
                  <FontAwesomeIcon
                    className={styles.list_item_icon}
                    icon={faUsers}
                  />
                  <span>{key("users")}</span>
                </div>
              </Col>
              <Col
                xs={6}
                className="d-flex justify-content-center align-items-center"
                onClick={() => navigate("/admin-wallets")}
              >
                <div className={styles.list_item}>
                  <FontAwesomeIcon
                    className={styles.list_item_icon}
                    icon={faWallet}
                  />
                  <span>{key("wallet")}</span>
                </div>
              </Col>
              <Col
                xs={6}
                className="d-flex justify-content-center align-items-center"
                onClick={() => navigate("/admin-transactions")}
              >
                <div className={styles.list_item}>
                  <FontAwesomeIcon
                    className={styles.list_item_icon}
                    icon={faMoneyBillTransfer}
                  />
                  <span>{key("trasActions")}</span>
                </div>
              </Col>
              <Col
                xs={6}
                className="d-flex justify-content-center align-items-center"
                onClick={() => navigate("/admin-configs")}
              >
                <div className={styles.list_item}>
                  <FontAwesomeIcon
                    className={styles.list_item_icon}
                    icon={faBrush}
                  />
                  <span>{key("configs")}</span>
                </div>
              </Col>
              <Col
                xs={6}
                className="d-flex justify-content-center align-items-center"
                onClick={() => navigate("/admin-shapes")}
              >
                <div className={styles.list_item}>
                  <FontAwesomeIcon
                    className={styles.list_item_icon}
                    icon={faStar}
                  />
                  <span>{key("shapes")}</span>
                </div>
              </Col>
              <Col
                xs={6}
                className="d-flex justify-content-center align-items-center"
                onClick={() => navigate("/admin-shops")}
              >
                <div className={styles.list_item}>
                  <FontAwesomeIcon
                    className={styles.list_item_icon}
                    icon={faStore}
                  />
                  <span>{key("stores")}</span>
                </div>
              </Col>
              <Col
                xs={6}
                className="d-flex justify-content-center align-items-center"
              >
                <div
                  className={styles.list_item}
                  onClick={() => navigate("/admin-colors")}
                >
                  <FontAwesomeIcon
                    className={styles.list_item_icon}
                    icon={faPallet}
                  />
                  <span>{key("colors")}</span>
                </div>
              </Col>
              <Col
                xs={6}
                className="d-flex justify-content-center align-items-center"
              >
                <div
                  className={styles.list_item}
                  onClick={() => navigate("/admin-coupons")}
                >
                  <FontAwesomeIcon
                    className={styles.list_item_icon}
                    icon={faTicket}
                  />
                  <span>{key("coupons")}</span>
                </div>
              </Col>
              <Col
                xs={6}
                className="d-flex justify-content-center align-items-center"
              >
                <div
                  className={styles.list_item}
                  onClick={() => setLogoutModalShow(true)}
                >
                  <FontAwesomeIcon
                    className={styles.list_item_icon}
                    icon={faDoorOpen}
                  />
                  <span>{key("logout")}</span>
                </div>
              </Col>
            </Row>
          </div>
        </div>
      </div>
      {logoutModalShow && (
        <LogoutModal
          show={logoutModalShow}
          onHide={() => setLogoutModalShow(false)}
        />
      )}
    </>
  );
};

export default Admin;
