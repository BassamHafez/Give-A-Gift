import React, { useEffect, useState } from "react";
import styles from "./SpecialCards.module.css";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";
import { useTranslation } from "react-i18next";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { useQuery } from "@tanstack/react-query";
import { getSpecialCards } from "../../util/Http";
import Placeholders from "../../Components/Ui/Placeholders";
import LoadingOne from "../../Components/Ui/LoadingOne";
import MainButton from "../../Components/Ui/MainButton";
import ConfirmationModal from "../../Components/Ui/ConfirmationModal";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import { useQueryClient } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import FilterModal from "../../Components/Ui/FilterModal";

const notifySuccess = (message) => toast.success(message);
const notifyError = (message) => toast.error(message);

const SpecialCards = () => {
  const { t: key } = useTranslation();
  const [filteredCards, setFilteredCards] = useState([]);
  const [searchInput, setSearchInput] = useState("");
  const [modalShow, setModalShow] = useState(false);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [loginModalShow, setLoginModalShow] = useState(false);
  const [shopId, setShopId] = useState("");
  const [priceValue, setPriceValue] = useState(0);
  const queryClient = useQueryClient();
  const isLogin = useSelector((state) => state.userInfo.isLogin);
  const navigate = useNavigate();
  let isArLang = localStorage.getItem("i18nextLng") === "ar";
  const token = JSON.parse(localStorage.getItem("token"));

  // Fetch the special cards data
  const { data, isFetching } = useQuery({
    queryKey: ["special-cards", token],
    queryFn: getSpecialCards,
    staleTime: 300000,
  });

  useEffect(() => {
    if (data) {
      setFilteredCards(data.data?.cards);
    }
  }, [data]);

  const searchStores = ({ selectedNames }) => {
    if (selectedNames.length > 0) {
      const filtered = data?.data?.cards.filter((card) =>
        selectedNames.includes(card.shop?.name)
      );
      setFilteredCards(filtered);
    } else {
      setFilteredCards(data?.data?.cards);
    }
    notifySuccess(key("searchFilterApplied"));
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
        <h2 className="text-center my-3 mb-5">{key("buyCardPageTitle")}</h2>
        <div
          className={`${styles.controllers} d-flex justify-content-between my-4 px-4`}
        >
          <div className="d-flex">
            <div
              className={styles.filter_box}
              onClick={() => setShowFilterModal(true)}
            >
              <span className={styles.fiter}>
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
            <div className="mx-3">
              <MainButton
                onClick={() => {
                  setSearchInput("");
                  setFilteredCards(data?.data?.cards);
                  notifySuccess("Filters cleared Successfully");
                }}
                type={"white"}
                text={key("default")}
              />
            </div>
          </div>
          <div>
            <h5>
              {key("results")} ({filteredCards?.length})
            </h5>
          </div>
        </div>
        <Row>
          {isFetching ? (
            <Placeholders />
          ) : (
            <>
              {filteredCards.length > 0 ? (
                <>
                  {filteredCards.map((card) => (
                    <Col
                      key={card._id}
                      lg={6}
                      xl={4}
                      className="d-flex justify-content-center"
                    >
                      <div className={styles.store_card}>
                        <Card className={styles.card_body}>
                          <div className={styles.card_img_div}>
                            <Card.Img
                              className={styles.front_img}
                              variant="top"
                              src={`${process.env.REACT_APP_Host}shapes/${data?.data?.frontShape}`}
                            />
                            <div className={styles.card_img_div_layer}>
                              <Card.Img
                                className={styles.back_img}
                                variant="top"
                                src={`${process.env.REACT_APP_Host}shapes/${data?.data?.backShape}`}
                              />
                            </div>
                          </div>

                          <Card.Body>
                            <div className="d-flex align-items-center position-relative p-3">
                              <div className="d-flex align-items-center">
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
                                <h5 className={`${styles.card_price} m-3`}>
                                  {card.price} {key("sar")}
                                </h5>
                              </div>

                              <div
                                className={`${
                                  isArLang ? "me-4  me-auto" : "me-4  ms-auto"
                                } `}
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
                            </div>
                          </Card.Body>
                        </Card>
                      </div>
                    </Col>
                  ))}
                </>
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
      {showFilterModal && (
        <FilterModal
          show={showFilterModal}
          onHide={() => setShowFilterModal(false)}
          triggerFunc={searchStores} // Passing search function to FilterModal
        />
      )}
    </>
  );
};

export default SpecialCards;
