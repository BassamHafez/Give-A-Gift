import React, { useEffect, useState } from "react";
import {
  faBook,
  faBrush,
  faCashRegister,
  faChartPie,
  faDoorOpen,
  faGifts,
  faImage,
  faMoneyBillTransfer,
  faPallet,
  faShop,
  faStar,
  faStore,
  faTag,
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
import { useSelector } from "react-redux";
import { faOpencart } from "@fortawesome/free-brands-svg-icons";

const Admin = () => {
  const [logoutModalShow, setLogoutModalShow] = useState(false);
  const { t: key } = useTranslation();

  const navigate = useNavigate();
  const role = useSelector((state) => state.userInfo.role);
  const profileData = useSelector((state) => state.profileInfo.data);

  useEffect(() => {
    if (role === "user") {
      navigate(`/`);
    } else if (role === "merchant") {
      navigate(`/merchant/${profileData?._id}`);
    }
  }, [role, navigate, profileData]);
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
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
                onClick={() => navigate("/admin-anaysis")}
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
                onClick={() => navigate("/admin-orders")}
              >
                <div className={styles.list_item}>
                  <FontAwesomeIcon
                    className={styles.list_item_icon}
                    icon={faCashRegister}
                  />
                  <span>{key("orders")}</span>
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
                  onClick={() => navigate("/admin-merchant")}
                >
                  <FontAwesomeIcon
                    className={styles.list_item_icon}
                    icon={faShop}
                  />
                  <span>{key("merchant")}</span>
                </div>
              </Col>
              <Col
                xs={6}
                className="d-flex justify-content-center align-items-center"
              >
                <div
                  className={styles.list_item}
                  onClick={() => navigate("/admin-carts")}
                >
                  <FontAwesomeIcon
                    className={styles.list_item_icon}
                    icon={faOpencart}
                  />
                  <span>{key("carts")}</span>
                </div>
              </Col>
              <Col
                xs={6}
                className="d-flex justify-content-center align-items-center"
              >
                <div
                  className={styles.list_item}
                  onClick={() => navigate("/admin-discounts")}
                >
                  <FontAwesomeIcon
                    className={styles.list_item_icon}
                    icon={faTag}
                  />
                  <span>{key("discount")}</span>
                </div>
              </Col>
              <Col
                xs={6}
                className="d-flex justify-content-center align-items-center"
              >
                <div
                  className={styles.list_item}
                  onClick={() => navigate("/admin-designs")}
                >
                  <FontAwesomeIcon
                    className={styles.list_item_icon}
                    icon={faImage}
                  />
                  <span>{key("designs")}</span>
                </div>
              </Col>
              <Col
                xs={6}
                className="d-flex justify-content-center align-items-center"
              >
                <div
                  className={styles.list_item}
                  onClick={() => navigate("/docs")}
                >
                  <FontAwesomeIcon
                    className={styles.list_item_icon}
                    icon={faBook}
                  />
                  <span>{key("docs")}</span>
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
