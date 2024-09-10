import React, { useState } from "react";
import styles from "./Stores.module.css";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import SearchField from "../../Components/Ui/SearchField";
import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import { getShops } from "../../util/Http";
import Placeholders from "../../Components/Ui/Placeholders";
import LoadingOne from "../../Components/Ui/LoadingOne";
import toast, { Toaster } from "react-hot-toast";

const notifySuccess = (message) => toast.success(message);

const Stores = () => {
  const { t: key } = useTranslation();
  const [searchInput, setSearchInput] = useState("");
  const { data: shops, isFetching } = useQuery({
    queryKey: ["shops"],
    queryFn: getShops,
    staleTime: 300000,
  });

  const handleSearch = (e, searchTerm) => {
    e.preventDefault();
    setSearchInput(searchTerm);
    notifySuccess("Search filter applied successfully.");
  };

  const filteredShops = shops
    ? shops.data.filter((shop) =>
        shop.name.toLowerCase().includes(searchInput.toLowerCase())
      )
    : [];
      
  return (
    <>
      <Toaster position="top-right" />
      <Container className="my-5">
        <h2 className="text-center my-3 mb-5">{key("storesTitle")}</h2>
        <div
          className={`${styles.controllers} d-flex justify-content-between my-5`}
        >
          <div onClick={() => setSearchInput("")} className={styles.filter_box}>
            <span className={styles.filter}>{key("default")}</span>
          </div>
          <div>
            <SearchField onSearch={handleSearch} text={key("search")} />
          </div>
        </div>
        <Row className="gy-5 position-relative">
          {!isFetching ? (
            shops ? (
              filteredShops.length > 0 ? (
                filteredShops.map((shop) => (
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
                          <img
                            alt={shop.name}
                            className="w-100"
                            src={`http://127.0.0.1:3001/shops/${shop.logo}`}
                          />
                        </div>
                        <div>
                          <h5 className="text-center">{shop.name}</h5>
                        </div>
                      </div>
                    </div>
                  </Col>
                ))
              ) : (
                <>
                  {shops.data.map((shop) => (
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
                            <img
                              alt={shop.name}
                              className="w-100"
                              src={`http://127.0.0.1:3001/shops/${shop.logo}`}
                            />
                          </div>
                          <div>
                            <h5 className="text-center">{shop.name}</h5>
                          </div>
                        </div>
                      </div>
                    </Col>
                  ))}
                </>
              )
            ) : (
              <LoadingOne />
            )
          ) : (
            <Placeholders />
          )}
        </Row>
      </Container>
    </>
  );
};

export default Stores;
