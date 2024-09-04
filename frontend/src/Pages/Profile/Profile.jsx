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
} from "@fortawesome/free-solid-svg-icons";
import { useSelector } from "react-redux";
import LogoutModal from "../../Components/Ui/LogoutModal";
import AccountManageMent from "./AccountManageMent";

const Profile = ({ show, setShow }) => {
  const profileData = useSelector((state) => state.userInfo.data);
  const [logoutModalShow, setLogoutModalShow] = useState(false);

  return (
    <>
      <div className={styles.tab_container}>
        <Tab.Container defaultActiveKey="accManage">
          <Row className="justify-content-between">
            <Col sm={3}>
              <Nav className={`${styles.side_bar_tab} flex-column`}>
                <div className={styles.side_bar_header}>
                  <div className="text-start d-flex flex-column justify-content-center">
                    <h4 className="m-0 fw-bolder">{profileData.name}</h4>
                    <span className="mini_word">{profileData.email}</span>
                  </div>

                  <div className={styles.profile_img}>
                    <img
                      src={`http://127.0.0.1:3001${profileData.photo}`}
                      alt={`${profileData.name}_ptofile_photo`}
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
                    icon={faCircleInfo}
                  />
                  <Nav.Link eventKey="four">Your Cards</Nav.Link>
                </Nav.Item>
                <Nav.Item className={styles.nav_item} onClick={() => setLogoutModalShow(true)}>
                  <FontAwesomeIcon
                    className={styles.list_icon}
                    icon={faDoorOpen}
                  />
                  <Nav.Link eventKey="five">Logout</Nav.Link>
                </Nav.Item>
              </Nav>
            </Col>
            <Col sm={9}>
              <Tab.Content>
                <Tab.Pane className="px-5" eventKey="accManage"><AccountManageMent/></Tab.Pane>
                <Tab.Pane eventKey="second">Second tab content</Tab.Pane>
                <Tab.Pane eventKey="three">three tab content</Tab.Pane>
                <Tab.Pane eventKey="four">four tab content</Tab.Pane>
              </Tab.Content>
            </Col>
          </Row>
        </Tab.Container>
      </div>

      {logoutModalShow && (
        <LogoutModal
          show={logoutModalShow}
          onHide={() => setLogoutModalShow(false)}
          onClose={() => setShow(false)}
        />
      )}
    </>
  );
};

export default Profile;
