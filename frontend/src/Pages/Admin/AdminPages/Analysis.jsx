import { useQuery } from "@tanstack/react-query";
import React from "react";
import styles from "./AdminPages.module.css";
import { getStatistics } from "../../../util/Http";
import { useTranslation } from "react-i18next";
import LoadingOne from "../../../Components/Ui/LoadingOne";
import Col from "react-bootstrap/esm/Col";
import Row from "react-bootstrap/esm/Row";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCreditCard,
  faSackXmark,
  faStore,
  faUsers,
} from "@fortawesome/free-solid-svg-icons";
import TopShapes from "../../../Components/Charts/TopSHapes";
import TopStores from "../../../Components/Charts/TopStores";

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
    <div>
      {data ? (
        <>
          <section className={styles.chart_div}>
            <h4 className="fw-bold text-secondary mx-3">
              {key("topthreeShops")}
            </h4>

            <TopStores />
          </section>
          <section className={styles.chart_div}>
            <h4 className="fw-bold text-secondary mx-3">
              {key("topthreeShapes")}
            </h4>

            <TopShapes />
          </section>

          <section className={styles.static_section}>
            <h4 className="fw-bold text-secondary">
              {key("importantNumbers")}
            </h4>
            <Row className={`${styles.section_row} py-3`}>
              <Col xs={6} md={3} className="d-flex justify-content-center">
                <div className={styles.thrd_sec_div}>
                  <FontAwesomeIcon
                    className={styles.thrd_sec_icon}
                    icon={faCreditCard}
                  />
                  <h4>{data?.data?.cardsPaid}</h4>
                  <span>{key("cardsPaid")}</span>
                </div>
              </Col>
              <Col xs={6} md={3} className="d-flex justify-content-center">
                <div className={styles.thrd_sec_div}>
                  <FontAwesomeIcon
                    className={styles.thrd_sec_icon}
                    icon={faSackXmark}
                  />
                  <h4>{data?.data?.cardsNotPaid}</h4>
                  <span>{key("cardNotPaid")}</span>
                </div>
              </Col>
              <Col xs={6} md={3} className="d-flex justify-content-center">
                <div className={styles.thrd_sec_div}>
                  <FontAwesomeIcon
                    className={styles.thrd_sec_icon}
                    icon={faUsers}
                  />
                  <h4>{data?.data?.usersCount}</h4>
                  <span>{key("users")}</span>
                </div>
              </Col>
              <Col xs={6} md={3} className="d-flex justify-content-center">
                <div className={styles.thrd_sec_div}>
                  <FontAwesomeIcon
                    className={styles.thrd_sec_icon}
                    icon={faStore}
                  />
                  <h4>{data?.data?.shopsCount}</h4>
                  <span>{key("stores")}</span>
                </div>
              </Col>
              {/* <Col
                  xs={6}
                  md={4}
                  className="d-flex justify-content-center"
                >
                  <div className={styles.thrd_sec_div}>
                    <FontAwesomeIcon className={styles.thrd_sec_icon} icon={faCoins}/>
                      <h4>{data?.data?.lastMonthsIncome[0]?.totalIncome}</h4>
                    <span>{key("lastMonthIncome")}</span>
                  </div>
                </Col> */}
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
