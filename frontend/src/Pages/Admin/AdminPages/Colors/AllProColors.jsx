import axios from "axios";
import React from "react";
import Col from "react-bootstrap/esm/Col";
import Row from "react-bootstrap/esm/Row";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import styles from "../AdminPages.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCrown, faTrash } from "@fortawesome/free-solid-svg-icons";
import LoadingOne from "../../../../Components/Ui/LoadingOne";

const AllProColors = ({ refetch, proColors }) => {
  const notifySuccess = (message) => toast.success(message);
  const notifyError = (message) => toast.error(message);
  const { t: key } = useTranslation();

  const token = JSON.parse(localStorage.getItem("token"));

  const deleteColor = async (colorId) => {
    try {
      const response = await axios.delete(
        `${process.env.REACT_APP_Base_API_URl}colors/${colorId}`,
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
      notifyError(key("wrong"));
    }
  };

  return (
    <>
      <h4>{key("allProColors")}</h4>
      <Row className="justify-content-center">
        {proColors ? (
          proColors.map((color) => (
            <Col
              key={color._id}
              xs={6}
              sm={3}
              className="d-flex justify-content-center align-items-center"
              title={`${color.price} ${key("sar")}`}
            >
              <div className={styles.color_pro_square}>
                <FontAwesomeIcon
                  className={styles.delete_icon}
                  icon={faTrash}
                  onClick={() => deleteColor(color._id)}
                />
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
    </>
  );
};

export default AllProColors;
