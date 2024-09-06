import React, { useState } from "react";
import styles from "./Profile.module.css";
import Col from "react-bootstrap/Col";
import Nav from "react-bootstrap/Nav";
import Row from "react-bootstrap/Row";
import Tab from "react-bootstrap/Tab";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCircleInfo,
  faCoins,
  faDoorOpen,
  faGears,
  faLayerGroup,
} from "@fortawesome/free-solid-svg-icons";
import { useSelector } from "react-redux";
import LogoutModal from "../../Components/Ui/LogoutModal";
import AccountManageMent from "./AccountManageMent";
import ribbon from "../../Images/ribbon.png";
import LoadingOne from "../../Components/Ui/LoadingOne";

const ProfileVertical = ({ notifySuccess, notifyError }) => {
  const profileData = useSelector((state) => state.userInfo.data);
  const [logoutModalShow, setLogoutModalShow] = useState(false);

  return (
    <>
      <Tab.Container defaultActiveKey="accManage">
        <Row>
          <Col sm={6} md={4} xl={3} className="position-relative">
            {profileData ? (
              <Nav className={`${styles.side_bar_tab} flex-column`}>
                <div className={styles.side_bar_header}>
                  <div className="text-start d-flex flex-column justify-content-center">
                    <h4 className="m-0 fw-bolder">{profileData.name}</h4>
                    <span className="mini_word">{profileData.email}</span>
                  </div>

                  <div className={styles.profile_img}>
                    <img
                      src={`http://127.0.0.1:3001/users/${profileData.photo}`}
                      alt={`${profileData?.name}_ptofile_photo`}
                    />
                  </div>
                </div>

                <Nav.Item className={styles.nav_item}>
                  <FontAwesomeIcon
                    className={styles.list_icon}
                    icon={faGears}
                  />
                  <Nav.Link eventKey="accManage">Account Setting</Nav.Link>
                </Nav.Item>
                <Nav.Item className={styles.nav_item}>
                  <FontAwesomeIcon
                    className={styles.list_icon}
                    icon={faCoins}
                  />

                  <Nav.Link eventKey="second">Wallet Management</Nav.Link>
                </Nav.Item>
                <Nav.Item className={styles.nav_item}>
                  <FontAwesomeIcon
                    className={styles.list_icon}
                    icon={faCircleInfo}
                  />
                  <Nav.Link eventKey="three">Help</Nav.Link>
                </Nav.Item>
                <Nav.Item className={styles.nav_item}>
                  <FontAwesomeIcon
                    className={styles.list_icon}
                    icon={faLayerGroup}
                  />
                  <Nav.Link eventKey="four">Your Cards</Nav.Link>
                </Nav.Item>
                <Nav.Item
                  className={styles.nav_item}
                  onClick={() => setLogoutModalShow(true)}
                >
                  <FontAwesomeIcon
                    className={styles.list_icon}
                    icon={faDoorOpen}
                  />
                  <Nav.Link>Logout</Nav.Link>
                </Nav.Item>
              </Nav>
            ) : (
              <LoadingOne />
            )}
          </Col>
          <Col
            sm={6}
            md={8}
            xl={7}
            className="d-flex flex-column justify-content-center"
          >
            <Tab.Content>
              <Tab.Pane className="px-5" eventKey="accManage">
                <AccountManageMent
                  notifySuccess={notifySuccess}
                  notifyError={notifyError}
                />
              </Tab.Pane>
              <Tab.Pane eventKey="second">Second tab content</Tab.Pane>
              <Tab.Pane eventKey="three">three tab content</Tab.Pane>
              <Tab.Pane eventKey="four">four tab content</Tab.Pane>
            </Tab.Content>
          </Col>
        </Row>
        <div className={styles.ribbon}>
          <img src={ribbon} alt="ribbon" className="w-100" />
        </div>
      </Tab.Container>
      {logoutModalShow && (
        <LogoutModal
          show={logoutModalShow}
          onHide={() => setLogoutModalShow(false)}
        />
      )}
    </>
  );
};

export default ProfileVertical;
