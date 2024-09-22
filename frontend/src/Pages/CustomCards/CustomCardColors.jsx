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
import toast from "react-hot-toast";

const CustomCardColors = ({ saveColorValues }) => {
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

  const { data: colors } = useQuery({
    queryKey: ["colors"],
    queryFn: getColors,
    staleTime: Infinity,
  });

  const settingColors = (type, value, colorId, price) => {
    if (type === "pro") {
      saveColorValues("pro", value, colorId);
      notifyError(`${key("proColorMsg")} ${price} ${key("sar")}`);
    } else {
      saveColorValues("color", value, colorId);
    }
  };

  return (
    <>
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
                    onClick={() =>
                      settingColors("pro", color.image, color._id, color.price)
                    }
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
    </>
  );
};

export default CustomCardColors;
