import React, { useState } from "react";
import { useSelector } from "react-redux";
import styles from "./MerchantProfile.module.css";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Row from "react-bootstrap/esm/Row";
import Col from "react-bootstrap/esm/Col";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCircleInfo,
  faDoorOpen,
  faGears,
  faTag,
} from "@fortawesome/free-solid-svg-icons";
import LogoutModal from "../../Components/Ui/LogoutModal";

const MerchantProfile = () => {
  const [logoutModalShow, setLogoutModalShow] = useState(false);
  const profileData = useSelector((state) => state.profileInfo.data);
  const navigate = useNavigate();
  const { t: key } = useTranslation();

  return (
    <>
      <div className={styles.container_body}>
        <div>
          <div className={styles.profile_img}>
            {profileData && (
              <img
                src={`${process.env.REACT_APP_Host}users/${profileData?.photo}`}
                alt={profileData?.name}
              />
            )}
          </div>
          <h1 className={styles.name}>{profileData?.name}</h1>
        </div>

        <div>
          <Row className={`${styles.main_row} justify-content-center`}>
            <Col
              xs={6}
              className="d-flex justify-content-center align-items-center"
            >
              <div
                className={styles.list_item}
                onClick={() => navigate("/merchant-discounts")}
              >
                <FontAwesomeIcon
                  className={styles.list_item_icon}
                  icon={faTag}
                />
                <span>{key("allDisount")}</span>
              </div>
            </Col>
            <Col
              xs={6}
              className="d-flex justify-content-center align-items-center"
            >
              <div
                className={styles.list_item}
                onClick={() => navigate("/merchant-setting")}
              >
                <FontAwesomeIcon
                  className={styles.list_item_icon}
                  icon={faGears}
                />
                <span>{key("accountSetting")}</span>
              </div>
            </Col>
            <Col
              xs={6}
              className="d-flex justify-content-center align-items-center"
            >
              <div
                className={styles.list_item}
                onClick={() => navigate("/help")}
              >
                <FontAwesomeIcon
                  className={styles.list_item_icon}
                  icon={faCircleInfo}
                />
                <span>{key("help")}</span>
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

      {logoutModalShow && (
        <LogoutModal
          show={logoutModalShow}
          onHide={() => setLogoutModalShow(false)}
        />
      )}
    </>
  );
};

export default MerchantProfile;
