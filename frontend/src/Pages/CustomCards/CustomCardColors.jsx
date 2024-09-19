import React from "react";
import Col from "react-bootstrap/esm/Col";
import Row from "react-bootstrap/esm/Row";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCrown } from "@fortawesome/free-solid-svg-icons";
import styles from "./CustomCards.module.css";
import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import { getColors } from "../../util/Http";
import LoadingOne from "../../Components/Ui/LoadingOne";

const CustomCardColors = ({ saveColorValues }) => {
  const { t: key } = useTranslation();

  const { data: colors } = useQuery({
    queryKey: ["colors"],
    queryFn: getColors,
    staleTime: Infinity,
  });

  const settingColors = (type, value, colorId) => {
    if (type === "pro") {
      saveColorValues("pro", value, colorId);
    } else {
      saveColorValues("color", value, colorId);
    }
  };

  return (
    <div className={styles.choose_color}>
      <h4 className={`${styles.title} text-center mb-4`}>
        {key("choose")} {key("cardColor")}
      </h4>
      <Row className={styles.color_group}>
        {colors ? (
          <>
            {colors.data?.colors.map((color) => (
              <Col
                key={color._id}
                xs={4}
                sm={2}
                className="d-flex justify-content-center align-items-center"
              >
                <div
                  onClick={() => settingColors("color", color.hex, color._id)}
                  style={{ backgroundColor: `${color.hex}` }}
                  className={styles.color_circle}
                ></div>
              </Col>
            ))}
            {colors.data?.proColors.map((color) => (
              <Col
                key={color._id}
                xs={4}
                sm={2}
                className="d-flex justify-content-center align-items-center"
              >
                <div
                  onClick={() => settingColors("pro", color.image, color._id)}
                  className={`${styles.color_circle} ${styles.color_pro_square} position-relative`}
                >
                  <FontAwesomeIcon icon={faCrown} className={styles.crown} />

                  <img
                    src={`${process.env.REACT_APP_Host}colors/${color.image}`}
                    alt={`${color._id}`}
                  />
                </div>
              </Col>
            ))}
          </>
        ) : (
          <LoadingOne />
        )}
      </Row>
    </div>
  );
};

export default CustomCardColors;
