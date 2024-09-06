import React from "react";
import styles from "./Stores.module.css";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import SearchField from "../../Components/Ui/SearchField";
import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import { getShops } from "../../util/Http";
import LoadingOne from "../../Components/Ui/LoadingOne";

const Stores = () => {
  const { t: key } = useTranslation();
  // let isArLang = localStorage.getItem("i18nextLng") === "ar";

  const { data: shops } = useQuery({
    queryKey: ["shops"],
    queryFn: getShops,
    staleTime: 300000, 
  });

  return (
    <>
      <Container className="my-5">
        <h2 className="text-center my-3 mb-5">{key("storesTitle")}</h2>
        <div
          className={`${styles.controllers} d-flex justify-content-between my-4`}
        >
          <div className={styles.filter_box}>
            <span className={styles.filter}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="25"
                height="25"
                fill="currentColor"
                className="bi bi-filter"
                viewBox="0 0 16 16"
              >
                <path d="M6 10.5a.5.5 0 0 1 .5-.5h3a.5.5 0 0 1 0 1h-3a.5.5 0 0 1-.5-.5m-2-3a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5m-2-3a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5" />
              </svg>{" "}
              Filter{" "}
            </span>
          </div>
          <div>
            <SearchField text={key("search")} />
          </div>
        </div>
        <Row className="gy-5 position-relative">
          {shops ? (
            shops.data.map((shop) => (
              <Col
                xs={12}
                sm={6}
                md={4}
                className="d-flex justify-content-center align-items-center"
                key={shop._id}
              >
                <div className={styles.store_card}>
                  <div className={styles.store_item}>
                    <div className={styles.store_logo}>
                      <img alt={shop.name} className="w-100" src={`http://127.0.0.1:3001/shops/${shop.logo}`} />
                    </div>
                    <div>
                      <h5 className="text-center">{shop.name}</h5>
                    </div>
                  </div>
                </div>
              </Col>
            ))
          ) : (
            <LoadingOne />
          )}
        </Row>
      </Container>
    </>
  );
};

export default Stores;
