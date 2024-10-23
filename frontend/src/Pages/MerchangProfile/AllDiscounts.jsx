import { useQuery } from "@tanstack/react-query";
import React, { useState } from "react";
import { getDiscounts } from "../../util/Http";
import styles from "./MerchantProfile.module.css";
import { useTranslation } from "react-i18next";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import MainButton from "../../Components/Ui/MainButton";
import LoadingOne from "../../Components/Ui/LoadingOne";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCalendar,
  faClock,
  faCreditCard,
  faHandHoldingDollar,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import NoDataPage from "../../Components/Ui/NoDataPage";

const AllDiscounts = () => {
  const [usedData, setUsedData] = useState(false);
  let isArLang = localStorage.getItem("i18nextLng") === "ar";

  const token = JSON.parse(localStorage.getItem("token"));
  const { t: key } = useTranslation();

  const { data } = useQuery({
    queryKey: ["discounts", token],
    queryFn: () => getDiscounts({ token }),
    staleTime: Infinity,
    enabled: !!token,
  });

  const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    const formattedDate = date.toLocaleDateString();
    const formattedTime = date.toLocaleTimeString();
    return { formattedDate, formattedTime };
  };

  const usedCount = data?.data?.filter((disc) => disc.isUsed).length || 0;
  const unusedCount = data?.data?.filter((disc) => !disc.isUsed).length || 0;

  return (
    <>
      <div className={styles.discount_body}>
        <Row>
          {data ? (
            data.data?.length > 0 ? (
              <>
                <div className="d-flex flex-wrap justify-content-between align-items-venter mb-3">
                  <h4 className="fw-bolder">
                    {key("allDisount")} (
                    {usedData ? key("used") : key("notUsed")})
                  </h4>
                  <div className="d-flex flex-wrap">
                    <div className="m-2">
                      <MainButton
                        onClick={() => setUsedData(true)}
                        text={`${key("used")} ${usedCount}`}
                      />
                    </div>
                    <div className="m-2">
                      <MainButton
                        onClick={() => setUsedData(false)}
                        type="white"
                        text={`${key("notUsed")} ${unusedCount}`}
                      />
                    </div>
                  </div>
                </div>
                <hr />
                {data.data?.map(
                  (disc) =>
                    (usedData ? disc.isUsed : !disc.isUsed) && (
                      <Col key={disc.id} className="my-4" md={6} lg={4} xl={3}>
                        <div
                          className={`${styles.disc_content} ${
                            disc.isUsed && styles.red_shadow
                          }`}
                        >
                          <ul>
                            <li className="fs-5">
                              <FontAwesomeIcon
                                className={`${styles.list_icon} ${
                                  isArLang ? "ms-3" : "me-3"
                                }`}
                                icon={faUser}
                              />
                              <span className="fw-bolder">
                                {key("recipient")}:
                              </span>{" "}
                              {disc.recipient
                                ? disc.recipient
                                : key("notSpecified")}
                            </li>
                            <li className="fs-5">
                              <FontAwesomeIcon
                                className={`${styles.list_icon} ${
                                  isArLang ? "ms-3" : "me-3"
                                }`}
                                icon={faHandHoldingDollar}
                              />
                              <span className="fw-bolder">
                                {key("isPaid")}:
                              </span>{" "}
                              {disc.isPaid ? key("yes") : key("no")}
                            </li>
                            <li className="fs-5">
                              <FontAwesomeIcon
                                className={`${styles.list_icon} ${
                                  isArLang ? "ms-3" : "me-3"
                                }`}
                                icon={faCreditCard}
                              />
                              <span className="fw-bolder">
                                {key("isUsed")}:
                              </span>{" "}
                              {disc.isUsed ? key("yes") : key("no")}
                            </li>
                            {disc.usedAt && (
                              <>
                                <li className="fs-5">
                                  <FontAwesomeIcon
                                    className={`${styles.list_icon} ${
                                      isArLang ? "ms-3" : "me-3"
                                    }`}
                                    icon={faCalendar}
                                  />
                                  <span className="fw-bolder">
                                    {key("usedDate")}:
                                  </span>{" "}
                                  {formatDateTime(disc.usedAt).formattedDate}
                                </li>
                                <li className="fs-5">
                                  <FontAwesomeIcon
                                    className={`${styles.list_icon} ${
                                      isArLang ? "ms-3" : "me-3"
                                    }`}
                                    icon={faClock}
                                  />
                                  <span className="fw-bolder">
                                    {key("usedTime")}:
                                  </span>{" "}
                                  {formatDateTime(disc.usedAt).formattedTime}
                                </li>
                              </>
                            )}
                          </ul>
                        </div>
                      </Col>
                    )
                )}{" "}
              </>
            ) : (
              <NoDataPage text={`${key("noDisc")}`}/>
            )
          ) : (
            <LoadingOne />
          )}
        </Row>
      </div>
    </>
  );
};

export default AllDiscounts;
