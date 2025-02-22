import axios from "axios";
import React, { useState } from "react";
import Col from "react-bootstrap/esm/Col";
import Row from "react-bootstrap/esm/Row";
import { useTranslation } from "react-i18next";
import styles from "../AdminPages.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCrown, faTrash, faWrench } from "@fortawesome/free-solid-svg-icons";
import LoadingOne from "../../../../Components/Ui/LoadingOne";
import { toast } from "react-toastify";
import UpdateProColor from "./UpdateProColor";

const AllProColors = ({ refetch, proColors }) => {
  const notifyError = (message) => toast.error(message);
  const { t: key } = useTranslation();
  const [showUpdateColorModal, setShowUpdateColorModal] = useState(false);
  const [selectedColorData, setSelectedColorData] = useState({});

  const token = JSON.parse(localStorage.getItem("token"));

  const deleteColor = async (colorId) => {
    try {
      const response = await axios.delete(
        `${process.env.REACT_APP_Base_API_URl}pro-colors/${colorId}`,
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
      notifyError(key("wrong"));
    }
  };

  const openUpdateProColorModal = (color) => {
    setSelectedColorData(color);
    setShowUpdateColorModal(true);
  };

  return (
    <>
      <h4>{key("allProColors")}</h4>
      <Row className="justify-content-center">
        {proColors ? (
          proColors?.map((color) => (
            <Col
              key={color._id}
              xs={6}
              sm={3}
              className="d-flex justify-content-center align-items-center"
              title={`${color.price} ${key("sar")}`}
            >
              <div className={styles.color_pro_square}>
                <div className={styles.shop_control}>
                  <FontAwesomeIcon
                    className={styles.shop_control_icon}
                    icon={faWrench}
                    onClick={() => openUpdateProColorModal(color)}
                    title={`${key("update")}`}
                  />

                  <FontAwesomeIcon
                    className={styles.shop_control_icon}
                    icon={faTrash}
                    onClick={() => deleteColor(color._id)}
                    title={`${key("delete")}`}
                  />
                </div>
                <FontAwesomeIcon icon={faCrown} className={styles.crown} />
                <img
                  src={`${process.env.REACT_APP_Host}colors/${color.image}`}
                  alt={`${color._id}`}
                />
              </div>
            </Col>
          ))
        ) : (
          <LoadingOne />
        )}
      </Row>

      {showUpdateColorModal && (
        <UpdateProColor
          show={showUpdateColorModal}
          onHide={() => setShowUpdateColorModal(false)}
          proColorData={selectedColorData}
          refetch={refetch}
        />
      )}
    </>
  );
};

export default AllProColors;
