import React from "react";
import Col from "react-bootstrap/esm/Col";
import Row from "react-bootstrap/esm/Row";
import LoadingOne from "../../Components/Ui/LoadingOne";
import styles from "./CustomCards.module.css";
import { useQuery } from "@tanstack/react-query";
import { getShops } from "../../util/Http";
import { useTranslation } from "react-i18next";

const CustomCardShops = ({ saveShop }) => {
  const token = JSON.parse(localStorage.getItem("token"));
  const { t: key } = useTranslation();

  const { data: shops } = useQuery({
    queryKey: ["shops", token],
    queryFn: () => getShops({ type: "all"}),
    staleTime: Infinity,
  });

  const settingShop = (value, shopId) => {
    saveShop(value, shopId);
  };

  return (
    <div className={`${styles.choose_shape} d-flex mx-4`}>
      <h4 className={`${styles.title} text-start mb-3`}>
        {key("choose")} {key("store")}
      </h4>
      <Row className={styles.logo_container}>
        {shops ? (
          shops?.data?.map((shop) => (
            <Col
              xs={4}
              sm={4}
              lg={3}
              className="d-flex justify-content-center"
              onClick={() => settingShop(shop.logo, shop._id)}
              key={shop._id}
            >
              <div className={styles.logo_div}>
                <img
                  src={`${process.env.REACT_APP_Host}shops/${shop.logo}`}
                  alt={`${shop.name}`}
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

export default CustomCardShops;
