import React, { useEffect, useState } from "react";
import styles from "./AdminPages.module.css";
import { getShapes } from "../../../util/Http";
import { useQuery } from "@tanstack/react-query";
import { faCrown, faTrash, faWrench } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useTranslation } from "react-i18next";
import Row from "react-bootstrap/esm/Row";
import Col from "react-bootstrap/esm/Col";
import LoadingOne from "../../../Components/Ui/LoadingOne";
import axios from "axios";
import AddSpecialCardsShape from "./AddSpecialCardsShape";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import AddShape from "./ShapesForms/AddShape";
import UpdateShape from "./ShapesForms/UpdateShape";

const Shapes = () => {
  const { t: key } = useTranslation();
  const token = JSON.parse(localStorage.getItem("token"));
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [selectedShapeData, setSelectedShapeData] = useState({});

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

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const notifyError = (message) => toast.error(message);

  const { data: shapes, refetch } = useQuery({
    queryKey: ["shapes", token],
    queryFn:()=> getShapes({limit:Infinity}),
    staleTime: Infinity,
  });

  const deleteShape = async (shapeID) => {
    try {
      const response = await axios.delete(
        `${process.env.REACT_APP_Base_API_URl}shapes/${shapeID}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (response.status === 204) {
        refetch();
      } else {
        notifyError(key("wrong"));
      }
    } catch (error) {
      console.error(error);
      notifyError(key("wrong"));
    }
  };

  const openUpdatedShapeModal = (shape) => {
    setSelectedShapeData(shape);
    setShowUpdateModal(true);
  };



  return (
    <>
      <div className={styles.main_body}>
        <div className={styles.configs_body}>
          <div className="my-5">
            <h4 className="text-secondary">{key("changeReadyCards")}</h4>
            <AddSpecialCardsShape />
          </div>
          <div>
            <h4 className="text-secondary">{key("customCards")}</h4>
            <AddShape refetch={refetch} />
          </div>
        </div>

        <hr />
        <h4 className="fw-bold">{key("allShapes")}</h4>
        <Row className="justify-content-center">
          {shapes ? (
            shapes.data?.map((shape) => (
              <Col
                key={shape._id}
                sm={4}
                className="d-flex justify-content-center align-items-center"
              >
                <div className={styles.shape_div}>
                  <div className={styles.shop_control}>
                    <FontAwesomeIcon
                      className={styles.shop_control_icon}
                      icon={faWrench}
                      onClick={() => openUpdatedShapeModal(shape)}
                      title={`${key("update")}`}
                    />

                    <FontAwesomeIcon
                      className={styles.shop_control_icon}
                      icon={faTrash}
                      onClick={() => deleteShape(shape._id)}
                      title={`${key("delete")}`}
                    />
                  </div>
                  {shape.price > 0 && (
                    <FontAwesomeIcon
                      className={styles.shape_crown}
                      icon={faCrown}
                    />
                  )}
                  <img
                    src={`${process.env.REACT_APP_Host}shapes/${shape.image}`}
                    alt="shape"
                  />
                </div>
              </Col>
            ))
          ) : (
            <LoadingOne />
          )}
        </Row>
      </div>

      {showUpdateModal && (
        <UpdateShape
          show={showUpdateModal}
          onHide={() => setShowUpdateModal(false)}
          shapeData={selectedShapeData}
          refetch={refetch}
        />
      )}
    </>
  );
};

export default Shapes;
