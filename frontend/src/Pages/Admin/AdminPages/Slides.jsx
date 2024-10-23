import React, { useEffect, useState } from "react";
import styles from "./AdminPages.module.css";
import { slidesController } from "../../../util/Http";
import { useQuery } from "@tanstack/react-query";
import { faTrash, faWrench } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useTranslation } from "react-i18next";
import Row from "react-bootstrap/esm/Row";
import Col from "react-bootstrap/esm/Col";
import LoadingOne from "../../../Components/Ui/LoadingOne";
import axios from "axios";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import AddSlide from "./SlidesForms/AddSlide";
import UpdateSlide from "./SlidesForms/UpdateSlide";
import NoDataPage from "../../../Components/Ui/NoDataPage";

const Slides = () => {
  const [updateModalShow, setUpdateModalShow] = useState(false);
  const [selectedSlideData, setSelectedSlideData] = useState({});
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

  const { data: slides, refetch } = useQuery({
    queryKey: ["slides", token],
    queryFn: () => slidesController({ token: token, type: "get" }),
    staleTime: Infinity,
    enabled: !!token,
  });

  const deleteSlide = async (slideId) => {
    try {
      const response = await axios.delete(
        `${process.env.REACT_APP_Base_API_URl}slides/${slideId}`,
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

  const openUpdateSlideModal = (slide) => {
    setSelectedSlideData(slide);
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
              {key("add")} {key("slide")}
            </h4>
            <AddSlide refetch={refetch} />
          </div>
        </div>

        <hr />
        <Row className="justify-content-center">
          {slides ? (
            slides.data.length > 0 ? (
              slides.data?.map((slide) => (
                <Col
                  key={slide._id}
                  sm={4}
                  className="d-flex flex-column justify-content-center align-items-center"
                >
                  <div className={`${styles.slider_div}`}>
                    <div className={styles.shop_control}>
                      <FontAwesomeIcon
                        className={styles.shop_control_icon}
                        icon={faWrench}
                        onClick={() => openUpdateSlideModal(slide)}
                        title={`${key("update")}`}
                      />

                      <FontAwesomeIcon
                        className={styles.shop_control_icon}
                        icon={faTrash}
                        onClick={() => deleteSlide(slide._id)}
                        title={`${key("delete")}`}
                      />
                    </div>
                    <img
                      src={`${process.env.REACT_APP_Host}slides/${slide.image}`}
                      alt="slide_img"
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
        <UpdateSlide
          show={updateModalShow}
          onHide={() => setUpdateModalShow(false)}
          slideData={selectedSlideData}
          refetch={refetch}
        />
      )}
    </>
  );
};

export default Slides;
