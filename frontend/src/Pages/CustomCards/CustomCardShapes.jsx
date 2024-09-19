import React from "react";
import Col from "react-bootstrap/esm/Col";
import Row from "react-bootstrap/esm/Row";
import LoadingOne from "../../Components/Ui/LoadingOne";
import styles from "./CustomCards.module.css";
import { useQuery } from "@tanstack/react-query";
import { getShapes } from "../../util/Http";
import { useTranslation } from "react-i18next";

const CustomCardShapes = ({ saveShape }) => {
  const token = JSON.parse(localStorage.getItem("token"));
  const { t: key } = useTranslation();

  const { data: shapes } = useQuery({
    queryKey: ["shapes", token],
    queryFn: getShapes,
    staleTime: Infinity,
  });

  const settingShape = (value, shapeId, showBack) => {
    saveShape(value, shapeId, showBack);
  };

  return (
    <div className={`${styles.choose_shape}  position-relative`}>
      <h4 className={`${styles.title} text-center mb-4`}>
        {key("cardBackground")}
      </h4>
      <Row className={styles.shapes_container}>
        {shapes ? (
          shapes?.data.map((shape) => (
            <Col
              xs={6}
              sm={4}
              lg={3}
              xl={2}
              className="d-flex justify-content-center align-items-center"
              onClick={() => settingShape(shape.image, shape._id, true)}
              key={shape._id}
            >
              <div className={styles.shape_div}>
                <img
                  src={`${process.env.REACT_APP_Host}shapes/${shape.image}`}
                  alt={`${shape}_${shape._id}`}
                  className="w-100"
                />
              </div>
            </Col>
          ))
        ) : (
          <LoadingOne />
        )}
      </Row>
    </div>
  );
};

export default CustomCardShapes;
