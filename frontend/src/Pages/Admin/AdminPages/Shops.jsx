import React, { useEffect, useState } from "react";
import styles from "./AdminPages.module.css";
import { getShops, getShopToken } from "../../../util/Http";
import { useQuery } from "@tanstack/react-query";
import {
  faArrowPointer,
  faCircle,
  faCopy,
  faTrash,
  faWrench,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useTranslation } from "react-i18next";
import Row from "react-bootstrap/esm/Row";
import Col from "react-bootstrap/esm/Col";
import LoadingOne from "../../../Components/Ui/LoadingOne";
import axios from "axios";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import UpdateShop from "./ShopsForms/UpdateShop";
import AddShop from "./ShopsForms/AddShop";
import MainButton from "../../../Components/Ui/MainButton";
import StoresMessage from "./ShopsForms/StoresMessage";

const Shops = () => {
  const { t: key } = useTranslation();
  const token = JSON.parse(localStorage.getItem("token"));
  const [updateModalShow, setUpdateModalShow] = useState(false);
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [selectedShopData, setSelectedShopData] = useState({});
  const [selectedIds, setSelectedIds] = useState([]);

  const notifySuccess = (message) => toast.success(message);
  const notifyError = (message) => toast.error(message);
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

  const { data: shops, refetch } = useQuery({
    queryKey: ["shops", token],
    queryFn: getShops,
    staleTime: Infinity,
  });
  const { data: shopTokens } = useQuery({
    queryKey: ["shopToken", token],
    queryFn: () => getShopToken(token),
    staleTime: Infinity,
    enabled: !!token,
  });

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const deleteShop = async (shopID) => {
    try {
      const response = await axios.delete(
        `${process.env.REACT_APP_Base_API_URl}shops/${shopID}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (response.status === 204) {
        notifySuccess(key("opSuccess"));
        refetch();
      } else {
        notifyError(key("wrong"));
      }
    } catch (error) {
      console.error(error);
      notifyError(key("wrong"));
    }
  };

  const handleTokenCopy = (shopId) => {
    let myTargetStoreToken;
    if (shopTokens) {
      const targetStore = shopTokens.data.find((shop) => shop._id === shopId);
      myTargetStoreToken = targetStore.token;
    } else {
      notifyError(key("copyError"));
    }
    navigator.clipboard.writeText(myTargetStoreToken).then(
      () => {
        notifySuccess(key("tokenCopied"));
      },
      () => {
        notifyError(key("copyError"));
      }
    );
  };

  const openUpdateShopModal = (shop) => {
    setSelectedShopData(shop);
    setUpdateModalShow(true);
  };

  const handleCheckboxChange = (id) => {
    setSelectedIds((prevSelected) => {
      if (prevSelected.includes(id)) {
        return prevSelected.filter((selectedId) => selectedId !== id);
      } else {
        return [...prevSelected, id];
      }
    });
  };

  return (
    <>
      <div className={styles.main_body}>
        <div className={styles.configs_body}>
          <AddShop refetch={refetch} />
        </div>

        <hr />
        <div className="d-flex justify-content-between align-items-center">
          <h4 className="fw-bold">{key("storesPageTitle")} </h4>
          <div className="d-flex">
            <span className="mini_word mx-2 d-flex align-items-center">
              <FontAwesomeIcon className="text-success mx-1" icon={faCircle} />
              {key("online")}
            </span>
            <span className="mini_word mx-2">
              <FontAwesomeIcon className="text-danger mx-1" icon={faCircle} />
              {key("physical")}
            </span>
          </div>
        </div>
        <div className="my-4 text-end">
          {selectedIds.length > 0 && (
            <MainButton
              onClick={() => setShowMessageModal(true)}
              type="blue"
              text={key("sendMessage")}
            />
          )}
        </div>
        <Row className="justify-content-center">
          {shops ? (
            shops.data?.map((shop) => (
              <Col
                key={shop._id}
                sm={4}
                className="d-flex flex-column justify-content-center align-items-center"
              >
                <div
                  className={`${styles.shop_div} ${
                    selectedIds.includes(shop._id) ? styles.checked_store : ""
                  }`}
                >
                  <div className={styles.shop_control}>
                    <FontAwesomeIcon
                      className={styles.shop_control_icon}
                      icon={faCopy}
                      onClick={() => handleTokenCopy(shop._id)}
                      title="token"
                    />
                    <FontAwesomeIcon
                      className={styles.shop_control_icon}
                      icon={faWrench}
                      onClick={() => openUpdateShopModal(shop)}
                      title={`${key("update")}`}
                    />

                    <FontAwesomeIcon
                      className={styles.shop_control_icon}
                      icon={faTrash}
                      onClick={() => deleteShop(shop._id)}
                      title={`${key("delete")}`}
                    />
                    <FontAwesomeIcon
                      className={styles.shop_control_icon}
                      icon={faArrowPointer}
                      onClick={() => handleCheckboxChange(shop._id)}
                      title={`${key("select")}`}
                    />
                  </div>

                  <FontAwesomeIcon
                    className={
                      shop.isOnline
                        ? styles.online_store
                        : styles.physical_store
                    }
                    icon={faCircle}
                  />
                  <img
                    src={`${process.env.REACT_APP_Host}shops/${shop.logo}`}
                    alt="shop"
                  />
                </div>
              </Col>
            ))
          ) : (
            <LoadingOne />
          )}
        </Row>
      </div>
      {updateModalShow && (
        <UpdateShop
          show={updateModalShow}
          onHide={() => setUpdateModalShow(false)}
          shopData={selectedShopData}
          refetch={refetch}
        />
      )}
      {showMessageModal && (
        <StoresMessage
          show={showMessageModal}
          onHide={() => setShowMessageModal(false)}
          storeIds={selectedIds}
        />
      )}
    </>
  );
};

export default Shops;
