import React, { useEffect, useState } from "react";
import styles from "./AdminPages.module.css";
import { adsController } from "../../../util/Http";
import { useQuery } from "@tanstack/react-query";
import {
  faArrowUpRightFromSquare,
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
import { Link, useNavigate } from "react-router-dom";
import AddAd from "./ADSForms/AddAd";
import UpdateAd from "./ADSForms/UpdateAd";
import NoDataPage from "../../../Components/Ui/NoDataPage";

const Ads = () => {
  const [updateModalShow, setUpdateModalShow] = useState(false);
  const [selectedAdData, setSelectedAdData] = useState({});
  const { t: key } = useTranslation();
  const token = JSON.parse(localStorage.getItem("token"));
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

  const notifySuccess = (message) => toast.success(message);
  const notifyError = (message) => toast.error(message);

  const { data: ads, refetch } = useQuery({
    queryKey: ["ads", token],
    queryFn: () => adsController({ token: token, type: "get" }),
    staleTime: Infinity,
    enabled: !!token,
  });

  const deleteAd = async (adId) => {
    try {
      const response = await axios.delete(
        `${process.env.REACT_APP_Base_API_URl}ads/${adId}`,
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

  const openUpdateShopModal = (ad) => {
    setSelectedAdData(ad);
    setUpdateModalShow(true);
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <div className={styles.main_body}>
        <div className={styles.configs_body}>
          <div>
            <h4 className="fw-bold text-secondary">
              {key("add")} {key("ADs")}
            </h4>
            <AddAd refetch={refetch} />
          </div>
        </div>

        <hr />
        <h4 className="fw-bold">{key("Ads")}</h4>
        <Row className="justify-content-center">
          {ads ? (
            ads?.data?.length > 0 ? (
              ads.data?.map((ad) => (
                <Col
                  key={ad._id}
                  sm={4}
                  className="d-flex flex-column justify-content-center align-items-center"
                >
                  <div className={styles.shop_div}>
                    <div className={styles.shop_control}>
                      <Link
                        to={`${ad.link}`}
                        rel="noopener noreferrer"
                        target="_blank"
                      >
                        <FontAwesomeIcon
                          className={styles.shop_control_icon}
                          icon={faArrowUpRightFromSquare}
                          title={`${key("adLink")}`}
                        />
                      </Link>

                      <FontAwesomeIcon
                        className={styles.shop_control_icon}
                        icon={faWrench}
                        onClick={() => openUpdateShopModal(ad)}
                        title={`${key("update")}`}
                      />

                      <FontAwesomeIcon
                        className={styles.shop_control_icon}
                        icon={faTrash}
                        onClick={() => deleteAd(ad._id)}
                        title={`${key("delete")}`}
                      />
                    </div>
                    <img
                      src={`${process.env.REACT_APP_Host}ads/${ad.image}`}
                      alt="ad"
                    />
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
      </div>

      {updateModalShow && (
        <UpdateAd
          show={updateModalShow}
          onHide={() => setUpdateModalShow(false)}
          adData={selectedAdData}
          refetch={refetch}
        />
      )}
    </>
  );
};

export default Ads;
