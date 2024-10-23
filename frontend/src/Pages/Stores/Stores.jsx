import React, { useEffect, useState } from "react";
import styles from "./Stores.module.css";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import SearchField from "../../Components/Ui/SearchField";
import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import { getCategories, getShops } from "../../util/Http";
import Placeholders from "../../Components/Ui/Placeholders";
import LoadingOne from "../../Components/Ui/LoadingOne";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Select from "react-select";
import noData from "../../Images/noData.jpg";

const Stores = () => {
  const [searchInput, setSearchInput] = useState("");
  const [categoriesOptions, setCategoriesOptions] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [filteredShops, setFilteredShops] = useState([]);
  const { t: key } = useTranslation();
  const notifySuccess = (message) => toast.success(message);
  const navigate = useNavigate();

  const { data: shops, isFetching } = useQuery({
    queryKey: ["shops"],
    queryFn: () => getShops({ type: "all" }),
    staleTime: Infinity,
  });

  const { data: categories } = useQuery({
    queryKey: ["categories"],
    queryFn: getCategories,
    staleTime: Infinity,
  });

  useEffect(() => {
    if (categories) {
      const myCategories = categories?.data.map((category) => {
        return {
          label: (
            <div className={styles.category_label}>
              <img
                src={`${process.env.REACT_APP_Host}categories/${category.icon}`}
                alt={`${category.name}`}
              />
              <h4>{category.name}</h4>
            </div>
          ),
          value: category._id,
        };
      });
      setCategoriesOptions(myCategories);
    }
  }, [categories, key]);

  const handleSearch = (e, searchTerm) => {
    e.preventDefault();
    if (searchTerm !== "" && searchTerm !== searchInput) {
      setSearchInput(searchTerm);
      notifySuccess(key("searchFilterApplied"));
    }
  };

  const handleCategoriesSelection = (cat) => {
    setSelectedCategory(cat);
  };

  useEffect(() => {
    const myFilteredShops = shops
      ? shops.data.filter(
          (shop) =>
            shop.name.toLowerCase().includes(searchInput.toLowerCase()) &&
            (selectedCategory ? shop.category._id === selectedCategory : true)
        )
      : [];
    setFilteredShops(myFilteredShops);
  }, [shops, selectedCategory, searchInput]);

  const clearFilters = () => {
    setFilteredShops([]);
    setSearchInput("");
    setSelectedCategory("");
  };

  return (
    <>
      <Container className="my-5 page_height">
        <h2 className="text-center my-3 mb-5">{key("storesTitle")}</h2>
        <div
          className={`${styles.controllers} d-flex justify-content-between my-5`}
        >
          <div onClick={clearFilters} className={styles.filter_box}>
            <span className={styles.filter}>{key("default")}</span>
          </div>

          <div>
            <SearchField onSearch={handleSearch} text={key("search")} />
          </div>
        </div>
        <div className={`${styles.select_category_field} my-5`}>
          <label className="fw-bold fs-4">{key("storeCategories")}</label>
          <Select
            isClearable={true}
            isSearchable={false}
            options={categoriesOptions}
            onChange={(value) => {
              value !== null
                ? handleCategoriesSelection(value.value)
                : setSelectedCategory("");
            }}
          />
        </div>
        <Row className="gy-5 position-relative">
          {!isFetching ? (
            shops ? (
              filteredShops.length > 0 ? (
                filteredShops?.map((shop) => (
                  <Col
                    sm={6}
                    lg={4}
                    className="d-flex justify-content-center align-items-center"
                    key={shop._id}
                  >
                    <div
                      onClick={() => navigate(`/store/${shop._id}`)}
                      className={styles.store_card}
                    >
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
                          <span className=" text-secondary ellipsis">
                            {shop.description} {shop.category.name}
                          </span>
                        </div>
                      </div>
                    </div>
                  </Col>
                ))
              ) : (
                <div className={styles.noData}>
                  <img src={noData} alt="noData" />
                  <span>{key("noData")}</span>
                </div>
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
