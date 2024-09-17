import { useQuery } from "@tanstack/react-query";
import React from "react";
import styles from "./AdminPages.module.css";
import { getStatistics } from "../../../util/Http";
import { useTranslation } from "react-i18next";
import LoadingOne from "../../../Components/Ui/LoadingOne";
import Col from "react-bootstrap/esm/Col";
import Row from "react-bootstrap/esm/Row";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {faCcApplePay} from "@fortawesome/free-brands-svg-icons";

const Analysis = () => {
  const { t: key } = useTranslation();
  const token = JSON.parse(localStorage.getItem("token"));

  const { data } = useQuery({
    queryKey: ["successTransactions", token],
    queryFn: () => getStatistics({ token }),
    enabled: !!token,
    staleTime: Infinity,
  });

  return (
    <div className={styles.main_body}>
      {data ? (
        <>
          <section className={styles.static_section}>
            <h4>{key("topthreeShapes")}</h4>
            <Row className={styles.section_row}>
              {data?.data?.topThreeShapes.map((shape) => (
                <Col
                  sm={4}
                  key={shape._id}
                  className="d-flex justify-content-center"
                >
                  <div className="text-center">
                    <div className={styles.shape_div}>
                      <img
                        src={`${process.env.REACT_APP_Host}shapes/${shape.image}`}
                        alt="shape"
                      />
                    </div>
                    <span className="mini_word">{key("cardCount")} : {shape.cardsCount}</span>
                  </div>
                </Col>
              ))}
            </Row>
          </section>

          <section className={styles.static_section}>
            <h4>{key("topthreeShops")}</h4>
            <Row className={styles.section_row}>
              {data?.data?.topThreeShops.map((shop) => (
                <Col
                  sm={4}
                  key={shop._id}
                  className="d-flex justify-content-center"
                >
                  <div className="text-center">
                    <div className={styles.shop_div}>
                      {/* <img
                        src={`${process.env.REACT_APP_Host}shops/${shop.logo}`}
                        alt="shop"
                      /> */}
                      <h4>{shop.name}</h4>
                    </div>
                    <span className="mini_word">{key("cardCount")} : {shop.cardsCount}</span>
                  </div>
                </Col>
              ))}
            </Row>
          </section>

          <section className={styles.static_section}>
            <h4>{key("importantNumbers")}</h4>
            <Row className={styles.section_row}>
                <Col
                  sm={4}
                  className="d-flex justify-content-center"
                >
                  <div className="text-center">
                    <FontAwesomeIcon icon={faCcApplePay}/>
                      <h4>{data?.data?.cardsPaid}</h4>
                    <span className="mini_word">{key("cardsPaid")}</span>
                  </div>
                </Col>
            </Row>
          </section>
        </>
      ) : (
        <LoadingOne />
      )}
    </div>
  );
};

export default Analysis;
