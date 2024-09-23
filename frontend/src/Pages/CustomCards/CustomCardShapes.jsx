import React from "react";
import Col from "react-bootstrap/esm/Col";
import Row from "react-bootstrap/esm/Row";
import LoadingOne from "../../Components/Ui/LoadingOne";
import styles from "./CustomCards.module.css";
import { useQuery } from "@tanstack/react-query";
import { getShapes } from "../../util/Http";
import { useTranslation } from "react-i18next";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCrown } from "@fortawesome/free-solid-svg-icons";
import toast from "react-hot-toast";

const CustomCardShapes = ({ saveShape, setScale, scale }) => {
  const token = JSON.parse(localStorage.getItem("token"));
  const { t: key } = useTranslation();

  const notifyError = (message) =>
    toast(
      (t) => (
        <div>
          <span>{message}</span>

          <div style={{ textAlign: "end" }}>
            <button
              onClick={() => toast.dismiss(t.id)}
              style={{
                borderRadius: "1.5625rem",
                minWidth: "6.25rem",
                fontSize: "1.125rem",
                fontWeight: "700",
                boxShadow: "0 0 0.1875rem rgba(0, 0, 0, 0.5)",
                padding: "0.625rem 0.9375rem",
                marginTop: "10px",
                backgroundColor: "#FFF",
                color: "#000",
              }}
            >
              {key("confirm")}
            </button>
          </div>
        </div>
      ),
      {
        icon: "🔔",
        style: {
          padding: "16px",
          color: "#FFF",
          fontWeight: "600",
          backgroundColor: "#b62026",
        },
        position: "bottom-right",
      }
    );

  const { data: shapes } = useQuery({
    queryKey: ["shapes", token],
    queryFn: getShapes,
    staleTime: Infinity,
  });

  const settingShape = (value, shapeId, showBack, price) => {
    saveShape(value, shapeId, showBack);
    if (price > 0) {
      notifyError(`${key("proShape")} ${price} ${key("sar")}`);
    }
  };

  const handleScaleChange = (e) => {
    const scaleValue = parseFloat(e.target.value);
    setScale(scaleValue);
  };

  return (
    <div className={`${styles.choose_shape}  position-relative`}>
      <h4 className={`${styles.title} text-center mb-4`}>
        {key("cardBackground")}
      </h4>
      <div>
        <label>Scale:</label>
        <input
          type="range"
          min="0.5"
          max="2"
          step="0.01"
          value={scale}
          onChange={handleScaleChange}
        />
      </div>
      <Row className={styles.shapes_container}>
        {shapes ? (
          shapes?.data.map((shape) => (
            <Col
              xs={6}
              sm={4}
              lg={3}
              xl={2}
              className="d-flex justify-content-center align-items-center"
              onClick={() =>
                settingShape(shape.image, shape._id, true, shape.price)
              }
              key={shape._id}
            >
              <div className={styles.shape_div}>
                {shape.price > 0 && (
                  <FontAwesomeIcon
                    className={styles.shape_crown}
                    icon={faCrown}
                  />
                )}
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
