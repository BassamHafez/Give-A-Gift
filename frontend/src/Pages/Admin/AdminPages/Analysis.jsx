import { useQuery } from "@tanstack/react-query";
import React, { useEffect } from "react";
import styles from "./AdminPages.module.css";
import { getStatistics } from "../../../util/Http";
import { useTranslation } from "react-i18next";
import LoadingOne from "../../../Components/Ui/LoadingOne";
import Col from "react-bootstrap/esm/Col";
import Row from "react-bootstrap/esm/Row";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCreditCard,
  faDownload,
  faSackXmark,
  faStore,
  faUsers,
} from "@fortawesome/free-solid-svg-icons";
import TopStores from "../../../Components/Charts/TopStores";
import LastMonthsIncome from "../../../Components/Charts/LastMonthsIncome";
import * as XLSX from "xlsx";
import TopShapesCharts from "../../../Components/Charts/TopShapesCharts";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const Analysis = () => {
  const { t: key } = useTranslation();
  const token = JSON.parse(localStorage.getItem("token"));
  let isArLang = localStorage.getItem("i18nextLng") === "ar";

  const role = useSelector((state) => state.userInfo.role);
  const profileData = useSelector((state) => state.profileInfo.data);
  const navigate = useNavigate();

  useEffect(() => {
    if (role === "user") {
      navigate(`/`);
    } else if (role === "merchant") {
      navigate(`/merchant/${profileData?._id}`);
    }
  }, [role, navigate, profileData]);

  const { data } = useQuery({
    queryKey: ["successTransactions", token],
    queryFn: () => getStatistics({ token }),
    enabled: !!token,
    staleTime: Infinity,
  });

  const handleDownloadExcelSheet = (data, msg) => {
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(data);
    XLSX.utils.book_append_sheet(wb, ws, "LastMonthData");

    XLSX.writeFile(wb, `${msg}`);
  };
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  return (
    <div className={styles.statics_body}>
      {data ? (
        <>
          <section className={styles.static_section}>
            <h4 className="text-secondary">
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
            </Row>
          </section>

          <h4
            className={`${
              isArLang ? "text-end" : "text-start"
            } text-secondary mx-3 my-5`}
          >
            {key("topthreeShops")}{" "}
            <FontAwesomeIcon
              className={styles.download_icon}
              onClick={() =>
                handleDownloadExcelSheet(
                  data?.data?.topShops,
                  "Top_stores.xlsx"
                )
              }
              icon={faDownload}
              title={key("download")}
            />
          </h4>
          <section className={styles.chart_div} dir={isArLang ? "ltr" : "ltr"}>
            <TopStores topShops={data?.data?.topShops} />
          </section>

          <h4
            className={`${
              isArLang ? "text-end" : "text-start"
            } text-secondary mx-3 my-5`}
          >
            {key("topthreeShapes")}
            <FontAwesomeIcon
              className={styles.download_icon}
              onClick={() =>
                handleDownloadExcelSheet(
                  data?.data?.topShapes,
                  "Top_shapes.xlsx"
                )
              }
              icon={faDownload}
              title={key("download")}
            />
          </h4>
          <section className={styles.chart_div} dir={isArLang ? "ltr" : "ltr"}>
            <TopShapesCharts topShapes={data?.data?.topShapes} />
          </section>

          <h4
            className={`${
              isArLang ? "text-end" : "text-start"
            } fw-bold text-secondary mx-3 my-5`}
          >
            {key("LastMonthsIncome")}
            <FontAwesomeIcon
              className={styles.download_icon}
              onClick={() =>
                handleDownloadExcelSheet(
                  data?.data?.lastMonthsIncome,
                  "last_months_income.xlsx"
                )
              }
              icon={faDownload}
              title={key("download")}
            />
          </h4>
          <section className={styles.chart_div} dir={isArLang ? "ltr" : "ltr"}>
            <LastMonthsIncome lastMonthData={data?.data?.lastMonthsIncome} />
          </section>
        </>
      ) : (
        <LoadingOne />
      )}
    </div>
  );
};

export default Analysis;
