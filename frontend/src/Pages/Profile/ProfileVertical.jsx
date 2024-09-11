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
import LoadingOne from "../../Components/Ui/LoadingOne";
import MyCards from "./MyCards";
import { useTranslation } from "react-i18next";
import Help from "./Help";
import MyWallet from "./MyWallet";
import { useQuery } from "@tanstack/react-query";
import { getMyWallet } from "../../util/Http";

const ProfileVertical = ({ notifySuccess, notifyError }) => {

  const profileData = useSelector((state) => state.userInfo.data);
  const [logoutModalShow, setLogoutModalShow] = useState(false);
  const { t: key } = useTranslation();
  const token = JSON.parse(localStorage.getItem("token"));


  const {data:walletBalance}=useQuery({
    queryKey:["walletBalance",token],
    queryFn: () => getMyWallet(token),
    enabled: !!token,
    staleTime: 300000,
    select: (data) => data.data?.balance,
  })

  return (
    <>
      <Tab.Container defaultActiveKey="myCards">
        <Row>
          <Col sm={6} md={4} xl={3} className="position-relative">
            {profileData ? (
              <Nav className={`${styles.side_bar_tab} flex-column`}>
                <div className={styles.side_bar_header}>
                  <div className="text-start d-flex flex-column justify-content-center">
                    <h4 className="m-0 fw-bolder">{profileData.name}</h4>
                    <span className="mini_word">{profileData.email}</span>
                  </div>

                  <div className={styles.wallet_balance}>
                   {walletBalance?walletBalance:0} {key("sar")}
                  </div>
                </div>
                <Nav.Item className={styles.nav_item}>
                  <FontAwesomeIcon
                    className={styles.list_icon}
                    icon={faLayerGroup}
                  />
                  <Nav.Link eventKey="myCards">{key("yourCards")}</Nav.Link>
                </Nav.Item>
                <Nav.Item className={styles.nav_item}>
                  <FontAwesomeIcon
                    className={styles.list_icon}
                    icon={faCoins}
                  />

                  <Nav.Link eventKey="wallet">
                    {key("walletManagement")}
                  </Nav.Link>
                </Nav.Item>
                <Nav.Item className={styles.nav_item}>
                  <FontAwesomeIcon
                    className={styles.list_icon}
                    icon={faGears}
                  />
                  <Nav.Link eventKey="accSetting">
                    {key("accountSetting")}
                  </Nav.Link>
                </Nav.Item>
                <Nav.Item className={styles.nav_item}>
                  <FontAwesomeIcon
                    className={styles.list_icon}
                    icon={faCircleInfo}
                  />
                  <Nav.Link eventKey="help">{key("help")}</Nav.Link>
                </Nav.Item>
                <Nav.Item
                  className={styles.nav_item}
                  onClick={() => setLogoutModalShow(true)}
                >
                  <FontAwesomeIcon
                    className={styles.list_icon}
                    icon={faDoorOpen}
                  />
                  <Nav.Link>{key("logout")}</Nav.Link>
                </Nav.Item>
              </Nav>
            ) : (
              <LoadingOne />
            )}
          </Col>
          <Col
            sm={6}
            md={8}
            xl={9}
            className={`${styles.content_side} d-flex flex-column justify-content-center`}
          >
            <Tab.Content className="h-100 w-100">
              <Tab.Pane eventKey="myCards">
                <MyCards />
              </Tab.Pane>

              <Tab.Pane eventKey="wallet"><MyWallet/></Tab.Pane>
              <Tab.Pane className="px-5" eventKey="accSetting">
                <AccountManageMent
                  notifySuccess={notifySuccess}
                  notifyError={notifyError}
                />
              </Tab.Pane>
              <Tab.Pane eventKey="help">
                <Help />
              </Tab.Pane>
            </Tab.Content>
          </Col>
        </Row>
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
