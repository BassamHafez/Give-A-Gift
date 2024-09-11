import React, { useEffect, useState } from "react";
import styles from "./SpecialCards.module.css";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";
import SearchField from "../../Components/Ui/SearchField";
import { useTranslation } from "react-i18next";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { useQuery } from "@tanstack/react-query";
import { getSpecialCards } from "../../util/Http";
import Placeholders from "../../Components/Ui/Placeholders";
import LoadingOne from "../../Components/Ui/LoadingOne";
import MainButton from "../../Components/Ui/MainButton";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Popover from "react-bootstrap/Popover";
import ConfirmationModal from "../../Components/Ui/ConfirmationModal";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import { useQueryClient } from "@tanstack/react-query";
import { useSelector } from "react-redux";

const notifySuccess = (message) => toast.success(message);
const notifyError = (message) => toast.error(message);

const SpecialCards = () => {
  const { t: key } = useTranslation();
  const [searchInput, setSearchInput] = useState("");
  const [priceFilter, setPriceFilter] = useState(null);
  const [modalShow, setModalShow] = useState(false);
  const [loginModalShow, setLoginModalShow] = useState(false);
  const [shopId, setShopId] = useState("");
  const [priceValue, setPriceValue] = useState(0);
  const queryClient = useQueryClient();
  const isLogin = useSelector((state) => state.userInfo.isLogin);

  let isArLang = localStorage.getItem("i18nextLng") === "ar";
  const token = JSON.parse(localStorage.getItem("token"));
  const navigate = useNavigate();

  const { data, isFetching } = useQuery({
    queryKey: ["special-cards", token],
    queryFn: getSpecialCards,
    staleTime: 300000,
  });

  let frontShape = `${process.env.REACT_APP_Host}shapes/${data?.data?.frontShape}`;
  let backShape = `${process.env.REACT_APP_Host}shapes/${data?.data?.backShape}`;

  const searchName = (e, searchTerm) => {
    e.preventDefault();
    setSearchInput(searchTerm);
    notifySuccess(key("searchFilterApplied"));
  };

  const searchPrice = (e) => {
    e.preventDefault();
    const minPrice = Number(e.target.elements.minNum.value);
    const maxPrice = Number(e.target.elements.maxNum.value);

    if (minPrice < 0 || maxPrice < 0) {
      notifyError(key("negativePrice"));
      return;
    }

    if (minPrice > maxPrice) {
      notifyError(key("maxOverMin"));
      return;
    }
    setPriceFilter({ min: minPrice, max: maxPrice });
    notifySuccess(key("FilterPrice"));
  };

  const buyCard = async () => {
    const formData = {
      isSpecial: true,
      shop: shopId,
      price: { value: priceValue },
    };
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_Base_API_URl}cards`,
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const res = response.data;
      console.log(res);
      if (res.status === "success") {
        queryClient.invalidateQueries(["getCard", token]);
        setModalShow(false);
        navigate(`/recipient-information/${res.data?._id}`);
      } else {
        setModalShow(false);
        notifyError(key("purchaseFaild"));
      }
    } catch (error) {
      console.error(error);
      setModalShow(false);
      notifyError(key("purchaseFaild"));
    }
  };

  const navigateToLogin = () => {
    navigate("/login");
  };
  const popover = (
    <Popover id="popover-basic">
      <Popover.Header as="h3">{key("priceRange")}</Popover.Header>
      <Popover.Body>
        <form onSubmit={searchPrice}>
          <div className={styles.price_range}>
            <input type="number" name="minNum" placeholder={key("min")} />
            <input type="number" name="maxNum" placeholder={key("max")} />
            <button type="submit">
              <FontAwesomeIcon icon={faMagnifyingGlass} />
            </button>
          </div>
        </form>
      </Popover.Body>
    </Popover>
  );

  const filteredCards = data
    ? data.data?.cards.filter((card) =>
        card.shop?.name.toLowerCase().includes(searchInput.toLowerCase())
      )
    : [];

  const filteredPrice =
    filteredCards.length > 0
      ? filteredCards.filter((card) =>
          priceFilter !== null
            ? Number(card.price) >= Number(priceFilter.min) &&
              Number(card.price) <= Number(priceFilter.max)
            : true
        )
      : [];

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const checkLogin = (shopId, price) => {
    if (isLogin) {
      setModalShow(true);
      setShopId(`${shopId}`);
      setPriceValue(price);
    } else {
      setLoginModalShow(true);
    }
  };

  return (
    <>
      <Container fluid className="my-5">
        <Toaster position="top-right" />
        <h2 className="text-center my-3 mb-5">
          {key("specialCardsPageTitle")}
        </h2>
        <div
          className={`${styles.controllers} d-flex justify-content-between my-4 px-4`}
        >
          <div className="d-flex">
            <OverlayTrigger
              rootClose={true}
              trigger="click"
              placement="top"
              overlay={popover}
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
                  {key("filter")}{" "}
                </span>
              </div>
            </OverlayTrigger>
            <div className="mx-3">
              <MainButton
                onClick={() => {
                  setSearchInput("");
                  setPriceFilter(null);
                  notifySuccess("Filters cleared Successfully");
                }}
                type={"white"}
                text={key("default")}
              />
            </div>
          </div>

          <div className={styles.search_field}>
            <SearchField onSearch={searchName} text={key("search")} />
          </div>
        </div>
        <Row>
          {isFetching ? (
            <Placeholders />
          ) : (
            <>
              {data ? (
                filteredPrice !== null ? (
                  <>
                    {filteredPrice.map((card) => (
                      <Col
                        key={card._id}
                        md={4}
                        className="d-flex justify-content-center"
                      >
                        <div className={styles.store_card}>
                          <Card className={styles.card_body}>
                            <div className={styles.card_img_div}>
                              <Card.Img
                                className={styles.front_img}
                                variant="top"
                                src={frontShape}
                              />
                              <div className={styles.card_img_div_layer}>
                                <Card.Img
                                  className={styles.back_img}
                                  variant="top"
                                  src={backShape}
                                />
                              </div>
                            </div>

                            <Card.Body>
                              <div className="d-flex align-items-center position-relative pt-3">
                                <div
                                  className={
                                    isArLang
                                      ? styles.controllers_icon_ar
                                      : styles.controllers_icon
                                  }
                                >
                                  <FontAwesomeIcon
                                    title="Buy card"
                                    icon={faPlus}
                                    className={styles.arrow_icon}
                                    onClick={() =>
                                      checkLogin(card.shop._id, card.price)
                                    }
                                  />
                                </div>
                                <div
                                  title={card.shop?.name}
                                  className={styles.store_logo}
                                >
                                  <img
                                    src={`${process.env.REACT_APP_Host}shops/${card.shop?.logo}`}
                                    alt={card.shop?.name}
                                    className="w-100"
                                  />
                                </div>
                                <h5
                                  className={`${
                                    isArLang ? "ms-4  me-auto" : "me-4  ms-auto"
                                  } ${styles.card_price} my-3`}
                                >
                                  {card.price} {key("sar")}
                                </h5>
                              </div>
                            </Card.Body>
                          </Card>
                        </div>
                      </Col>
                    ))}
                  </>
                ) : filteredCards.length > 0 ? (
                  <>
                    {filteredCards.map((card) => (
                      <Col
                        key={card._id}
                        md={4}
                        className="d-flex justify-content-center"
                      >
                        <div className={styles.store_card}>
                          <Card className={styles.card_body}>
                            <div className={styles.card_img_div}>
                              <Card.Img
                                className={styles.front_img}
                                variant="top"
                                src={frontShape}
                              />
                              <div className={styles.card_img_div_layer}>
                                <Card.Img
                                  className={styles.back_img}
                                  variant="top"
                                  src={backShape}
                                />
                              </div>
                            </div>

                            <Card.Body>
                              <div className="d-flex align-items-center position-relative pt-3">
                                <div
                                  className={
                                    isArLang
                                      ? styles.controllers_icon_ar
                                      : styles.controllers_icon
                                  }
                                >
                                  <FontAwesomeIcon
                                    title="Buy card"
                                    icon={faPlus}
                                    className={styles.arrow_icon}
                                    onClick={() => {
                                      setModalShow(true);
                                      setShopId(`${card.shop._id}`);
                                      setPriceValue(card.price);
                                    }}
                                  />
                                </div>
                                <div
                                  title={card.shop?.name}
                                  className={styles.store_logo}
                                >
                                  <img
                                    src={`${process.env.REACT_APP_Host}shops/${card.shop?.logo}`}
                                    alt={card.shop?.name}
                                    className="w-100"
                                  />
                                </div>
                                <h5
                                  className={`${
                                    isArLang ? "ms-4  me-auto" : "me-4  ms-auto"
                                  } ${styles.card_price} my-3`}
                                >
                                  {card.price} {key("sar")}
                                </h5>
                              </div>
                            </Card.Body>
                          </Card>
                        </div>
                      </Col>
                    ))}
                  </>
                ) : (
                  <>
                    {data.data?.cards.map((card) => (
                      <Col
                        key={card._id}
                        md={4}
                        className="d-flex justify-content-center"
                      >
                        <div className={styles.store_card}>
                          <Card className={styles.card_body}>
                            <div className={styles.card_img_div}>
                              <Card.Img
                                className={styles.front_img}
                                variant="top"
                                src={frontShape}
                              />
                              <div className={styles.card_img_div_layer}>
                                <Card.Img
                                  className={styles.back_img}
                                  variant="top"
                                  src={backShape}
                                />
                              </div>
                            </div>

                            <Card.Body>
                              <div className="d-flex align-items-center position-relative pt-3">
                                <div
                                  className={
                                    isArLang
                                      ? styles.controllers_icon_ar
                                      : styles.controllers_icon
                                  }
                                >
                                  <FontAwesomeIcon
                                    title="Buy card"
                                    icon={faPlus}
                                    className={styles.arrow_icon}
                                    onClick={() => {
                                      setModalShow(true);
                                      setShopId(`${card.shop._id}`);
                                      setPriceValue(card.price);
                                    }}
                                  />
                                </div>
                                <div
                                  title={card.shop?.name}
                                  className={styles.store_logo}
                                >
                                  <img
                                    src={`${process.env.REACT_APP_Host}shops/${card.shop?.logo}`}
                                    alt={card.shop?.name}
                                    className="w-100"
                                  />
                                </div>
                                <h5
                                  className={`${
                                    isArLang ? "ms-4  me-auto" : "me-4  ms-auto"
                                  } ${styles.card_price} my-3`}
                                >
                                  {card.price} {key("sar")}
                                </h5>
                              </div>
                            </Card.Body>
                          </Card>
                        </div>
                      </Col>
                    ))}
                  </>
                )
              ) : (
                <LoadingOne />
              )}
            </>
          )}
        </Row>
      </Container>
      {modalShow && (
        <ConfirmationModal
          show={modalShow}
          onHide={() => setModalShow(false)}
          func={buyCard}
          message={key("processPurchase")}
        />
      )}
      {loginModalShow && (
        <ConfirmationModal
          show={loginModalShow}
          onHide={() => setLoginModalShow(false)}
          func={navigateToLogin}
          message={key("loginFirst")}
        />
      )}
    </>
  );
};

export default SpecialCards;
