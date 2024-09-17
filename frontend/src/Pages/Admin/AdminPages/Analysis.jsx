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
import LastMonthsIncome from "../../../Components/Charts/LastMonthsIncome";

// const lastMonthData = [
//   {
//     month: "March",
//     totalIncome: 4000,
//   },
//   {
//     month: "April",
//     totalIncome: 3000,
//   },
//   {
//     month: "May",
//     totalIncome: 5000,
//   },
//   {
//     month: "June",
//     totalIncome: 3500,
//   },
//   {
//     month: "July",
//     totalIncome: 6000,
//   },
//   {
//     month: "August",
//     totalIncome: 4500,
//   },
// ];

// const topShapes = [
//   { _id: "a", image: "1OSMraS.png", cardsCount: 3 },
//   { _id: "b", image: "e4rKcS0.png", cardsCount: 4 },
//   { _id: "c", image: "v0NFtm0.png", cardsCount: 5 },
//   { _id: "d", image: "WBxoxBK.png", cardsCount: 6 },
//   { _id: "e", image: "oiPl2QX.png", cardsCount: 7 },
//   { _id: "f", image: "mmetlwc.png", cardsCount: 3 },
//   { _id: "g", image: "FruSxNc.png", cardsCount: 10 },
//   { _id: "h", image: "fhPyEBT.png", cardsCount: 8 },
//   { _id: "i", image: "RmpX0dp.png", cardsCount: 10 },
//   { _id: "j", image: "P5w31EM.png", cardsCount: 11 },
//   { _id: "k", image: "WjFaCGZ.png", cardsCount: 12 },
//   { _id: "l", image: "gSHwOPr.png", cardsCount: 3 },
//   { _id: "m", image: "KnIE0ry.png", cardsCount: 4 },
//   { _id: "p", image: "8Nnc16G.png", cardsCount: 5 },
//   { _id: "q", image: "removebg1.png", cardsCount: 1 },
//   { _id: "r", image: "removebg2.png", cardsCount: 0 },
// ];

// const topStores = [
//   { _id: "a", image: "shop1.png", cardsCount: 3 },
//   { _id: "b", image: "shop2.png", cardsCount: 4 },
//   { _id: "c", image: "shop3.png", cardsCount: 5 },
//   { _id: "d", image: "shop4.png", cardsCount: 6 },
//   { _id: "e", image: "shop5.png", cardsCount: 7 },
//   { _id: "f", image: "shop6.jpg", cardsCount: 3 },
//   { _id: "g", image: "shop7.png", cardsCount: 10 },
//   { _id: "h", image: "shop8.jpg", cardsCount: 8 },
//   { _id: "i", image: "shop9.jpg", cardsCount: 10 },
//   { _id: "j", image: "shop10.jpg", cardsCount: 11 },
//   { _id: "k", image: "shop11.png", cardsCount: 12 },
//   { _id: "l", image: "shop12.jpeg", cardsCount: 3 },
//   { _id: "m", image: "shop13.jpeg", cardsCount: 4 },
//   { _id: "p", image: "shop14.png", cardsCount: 5 },
//   { _id: "q", image: "shop15.png", cardsCount: 1 },
//   { _id: "r", image: "shop16.png", cardsCount: 0 },
// ];

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

            <TopStores topShops={data?.data?.topShops} />
          </section>
          <section className={styles.chart_div}>
            <h4 className="fw-bold text-secondary mx-3">
              {key("topthreeShapes")}
            </h4>

            <TopShapes topShapes={data?.data?.topShapes} />
          </section>

          <section className={styles.chart_div}>
            <h4 className="fw-bold text-secondary mx-3">
              {key("LastMonthsIncome")}
            </h4>

            <LastMonthsIncome lastMonthData={data?.data?.lastMonthsIncome} />
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
