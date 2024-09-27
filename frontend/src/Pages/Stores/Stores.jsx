import React, {useState } from "react";
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
import toast from "react-hot-toast";
import { Link } from "react-router-dom";

const Stores = () => {
  const { t: key } = useTranslation();
  const [searchInput, setSearchInput] = useState("");

  const notifySuccess = (message) => {
    toast.success((t) => (
      <div
        onClick={() => toast.dismiss(t.id)}
      >
        {message}
      </div>
    ));
  };

  const { data: shops, isFetching } = useQuery({
    queryKey: ["shops"],
    queryFn: getShops,
    staleTime: Infinity,
  });

  const handleSearch = (e, searchTerm) => {
    e.preventDefault();
    if (searchTerm !== "" && searchTerm !== searchInput) {
      setSearchInput(searchTerm);
      notifySuccess(key("searchFilterApplied"));
    }
  };

  const filteredShops = shops
    ? shops.data.filter((shop) =>
        shop.name.toLowerCase().includes(searchInput.toLowerCase())
      )
    : [];

  return (
    <>
      <Container className="my-5 page_height">
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
              filteredShops?.length > 0 ? (
                filteredShops?.map((shop) => (
                  <Col
                    sm={6}
                    lg={4}
                    className="d-flex justify-content-center align-items-center"
                    key={shop._id}
                  >
                    <Link
                      target="_blank"
                      to={`${shop.link}`}
                      rel="noopener noreferrer"
                    >
                      <div className={styles.store_card}>
                        <div className={styles.store_item}>
                          <div className={styles.store_logo}>
                            <img
                              alt={shop.name}
                              className="w-100"
                              src={`${process.env.REACT_APP_Host}shops/${shop.logo}`}
                            />
                          </div>
                          <div className="text-center">
                            <h5 className=" fw-bold">{shop.name}</h5>
                            <span className=" text-secondary">
                              {shop.description}
                            </span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </Col>
                ))
              ) : (
                <>
                  {shops?.data?.map((shop) => (
                    <Col
                      xs={12}
                      sm={6}
                      lg={4}
                      className="d-flex justify-content-center align-items-center"
                      key={shop._id}
                    >
                      <Link
                        target="_blank"
                        to={`${shop.link}`}
                        rel="noopener noreferrer"
                      >
                        <div className={styles.store_card}>
                          <div className={styles.store_item}>
                            <div className={styles.store_logo}>
                              <img
                                alt={shop.name}
                                className="w-100"
                                src={`${process.env.REACT_APP_Host}shops/${shop.logo}`}
                              />
                            </div>
                            <div className="text-center">
                              <h5 className=" fw-bold">{shop.name}</h5>
                              <span className="  text-secondary">
                                {shop.description}
                              </span>
                            </div>
                          </div>
                        </div>
                      </Link>
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
