import React, { useEffect, useState } from "react";
import styles from "./SpecialCards.module.css";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";
import { useTranslation } from "react-i18next";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { useQuery,useQueryClient } from "@tanstack/react-query";
import { getSpecialCards } from "../../util/Http";
import Placeholders from "../../Components/Ui/Placeholders";
import LoadingOne from "../../Components/Ui/LoadingOne";
import MainButton from "../../Components/Ui/MainButton";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import { useDispatch } from "react-redux";
import FilterModal from "../../Components/Ui/FilterModal";
import { cartActions } from "../../Store/cartCounter-slice";

const notifySuccess = (message) => toast.success(message);
const notifyError = (message) => toast.error(message);

const SpecialCards = () => {
  const { t: key } = useTranslation();
  const [filteredCards, setFilteredCards] = useState([]);
  const [searchInput, setSearchInput] = useState("");
  const [showFilterModal, setShowFilterModal] = useState(false);
  const queryClient = useQueryClient();

  const navigate = useNavigate();
  let isArLang = localStorage.getItem("i18nextLng") === "ar";
  const token = JSON.parse(localStorage.getItem("token"));
  const dispatch=useDispatch();

  const { data, isFetching } = useQuery({
    queryKey: ["special-cards", token],
    queryFn: getSpecialCards,
    staleTime: Infinity,
  });

  useEffect(() => {
    if (data) {
      setFilteredCards(data.data?.cards);
    }
  }, [data]);

  const searchStores = ({ selectedNames }) => {
    if (selectedNames.length > 0) {
      let filtered=[];
       filtered = data?.data?.cards.filter((card) =>
        selectedNames.includes(card.shop?.name)
      );
      if(filtered.length>0){
        setFilteredCards(filtered);
      }else{
        notifyError(key("noDataSearch"))
        setFilteredCards(data?.data?.cards)
      }
    } else {
      setFilteredCards(data?.data?.cards);
    }
    if(searchInput){
      notifySuccess(key("searchFilterApplied"));
    }
  };

  const buyCard = async (shopId,price) => {
    const formData = {
      isSpecial: true,
      shop: shopId,
      price: { value: price },
    };
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_Base_API_URl}cards`,
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const res = response.data;
      if (res.status === "success") {
        dispatch(cartActions.addItem())
        queryClient.invalidateQueries(["getMyCards",token]);
        navigate(`/recipient-information/${res.data?._id}`);
      } else {
        notifyError(key("purchaseFaild"));
      }
    } catch (error) {
      console.error(error);
      notifyError(key("purchaseFaild"));
    }
  };


  const checkLogin = (shopId, price) => {
      buyCard(shopId,price)
  };

  return (
    <>
      <Container fluid className={`page_height my-5`}>
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
              {filteredCards?.length > 0 ? (
                <>
                  {filteredCards?.map((card) => (
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
                              src={`${process.env.REACT_APP_Host}specialCards/front-shape.webp`}
                            />
                            <div className={styles.card_img_div_layer}>
                              <Card.Img
                                className={styles.back_img}
                                variant="top"
                                src={`${process.env.REACT_APP_Host}specialCards/back-shape.webp`}
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
      {showFilterModal && (
        <FilterModal
          show={showFilterModal}
          onHide={() => setShowFilterModal(false)}
          triggerFunc={searchStores}
        />
      )}
    </>
  );
};

export default SpecialCards;
