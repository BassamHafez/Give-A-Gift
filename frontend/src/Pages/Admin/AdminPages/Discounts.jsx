import { useQuery } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import { getAdminDiscount } from "../../../util/Http";
import styles from "./AdminPages.module.css";
import { useTranslation } from "react-i18next";
import Row from "react-bootstrap/Row";
import MainButton from "../../../Components/Ui/MainButton";
import LoadingOne from "../../../Components/Ui/LoadingOne";
import noData from "../../../Images/noData.jpg";
import Table from "react-bootstrap/Table";

const Discounts = () => {
  const [usedData, setUsedData] = useState(false);

  const token = JSON.parse(localStorage.getItem("token"));
  const { t: key } = useTranslation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const { data } = useQuery({
    queryKey: ["discounts", token],
    queryFn: () => getAdminDiscount({ token }),
    staleTime: Infinity,
    enabled: !!token,
  });

  const usedCount = data?.data?.filter((disc) => disc.isUsed).length || 0;
  const unusedCount = data?.data?.filter((disc) => !disc.isUsed).length || 0;

  return (
    <div className={styles.discount_body}>
      <Row>
        {data ? (
          data.data?.length > 0 ? (
            <>
              <div className="d-flex flex-wrap justify-content-between align-items-venter mb-3">
                <h4 className="fw-bolder">
                  {key("allDisount")} ({usedData ? key("used") : key("notUsed")}
                  )
                </h4>
                <div className="d-flex flex-wrap">
                  <div className="m-2">
                    <MainButton
                      onClick={() => setUsedData(true)}
                      text={`${key("used")} (${usedCount})`}
                    />
                  </div>
                  <div className="m-2">
                    <MainButton
                      onClick={() => setUsedData(false)}
                      type="white"
                      text={`${key("notUsed")} (${unusedCount})`}
                    />
                  </div>
                </div>
              </div>
              <hr />
              <Table striped bordered hover>
                <thead>
                  <tr className="text-center">
                    <th>{key("name")}</th>
                    <th>{key("userId")}</th>
                    <th>{key("isUsed")}</th>
                  </tr>
                </thead>
                <tbody className={styles.cart_tbody}>
                  {data.data?.map(
                    (disc) =>
                      (usedData ? disc.isUsed : !disc.isUsed) && (
                        <tr
                          key={disc.id}
                        >
                          <td className="text-center">{disc.user_name}</td>
                          <td className="text-center">{disc.user_id}</td>
                          <td className="text-center">{disc.isUsed?key("Yes"):key("No")}</td>
                        </tr>
                      )
                  )}
                </tbody>
              </Table>
            </>
          ) : (
            <div className={styles.noData}>
              <div className={styles.noData_img}>
                <img src={noData} alt="noData" />
              </div>
              <span>{key("noDisc")}</span>
            </div>
          )
        ) : (
          <LoadingOne />
        )}
      </Row>
    </div>
  );
};

export default Discounts;
