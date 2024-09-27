import React from "react";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import axios from "axios";
import Row from "react-bootstrap/esm/Row";
import Col from "react-bootstrap/esm/Col";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import styles from "../AdminPages.module.css";
import LoadingOne from "../../../../Components/Ui/LoadingOne";

const AllColors = ({ refetch,Colors }) => {
  const notifySuccess = (message) => {
    toast.success((t) => (
      <div
        onClick={() => toast.dismiss(t.id)}
      >
        {message}
      </div>
    ));
  };

  const notifyError = (message) => {
    toast.error((t) => (
      <div
        onClick={() => toast.dismiss(t.id)}
      >
        {message}
      </div>
    ));
  };
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
      <h4>{key("allColors")}</h4>
      <Row className="justify-content-center">
        {Colors ? (
          Colors.map((color) => (
            <Col
              key={color._id}
              xs={6}
              sm={3}
              className="d-flex justify-content-center align-items-center"
            >
              <div
                className={styles.color_square}
                style={{ backgroundColor: `${color?.hex}` }}
              >
                <FontAwesomeIcon
                  className={styles.delete_icon}
                  icon={faTrash}
                  onClick={() => deleteColor(color._id)}
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

export default AllColors;
