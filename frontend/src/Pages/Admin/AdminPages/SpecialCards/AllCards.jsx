import React, { useEffect, useState } from "react";
import styles from "./AllCards.module.css";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";
import { useTranslation } from "react-i18next";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import toast from "react-hot-toast";
import { getSpecialCards } from "../../../../util/Http";
import Placeholders from "../../../../Components/Ui/Placeholders";
import LoadingOne from "../../../../Components/Ui/LoadingOne";
import MainButton from "../../../../Components/Ui/MainButton";
import FilterModal from "../../../../Components/Ui/FilterModal";
import UpdateCard from "./UpdateCard";
import AddCard from "./AddCard";

const notifySuccess = (message) => toast.success(message);
const notifyError = (message) => toast.error(message);

const AllCards = () => {
  const { t: key } = useTranslation();
  const [filteredCards, setFilteredCards] = useState([]);
  const [searchInput, setSearchInput] = useState("");
  const [modalShow, setModalShow] = useState(false);
  const [cardId, setCardId] = useState("");
  const [shopId, setShopId] = useState("");
  const [showFilterModal, setShowFilterModal] = useState(false);
  let isArLang = localStorage.getItem("i18nextLng") === "ar";
  const token = JSON.parse(localStorage.getItem("token"));

  const { data, isFetching, refetch } = useQuery({
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
      const filtered = data?.data?.cards.filter((card) =>
        selectedNames.includes(card.shop?.name)
      );
      setFilteredCards(filtered);
    } else {
      setFilteredCards(data?.data?.cards);
    }
    if(searchInput){
      notifySuccess(key("searchFilterApplied"));
    }
  };

  const deleteCard = async (cardId) => {
    try {
      const response = await axios.delete(
        `${process.env.REACT_APP_Base_API_URl}special-cards/${cardId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (response.status === 204) {
        notifySuccess(key("opSuccess"));
        refetch();
      } else {
        notifyError(key("wrong"));
      }
    } catch (error) {
      console.error(error);
      notifyError(key("wrong"));
    }
  };

  return (
    <>
      <div className="p-4 my-5">
        <AddCard refetch={refetch} />
      </div>
      <hr />
      <Container fluid className="my-5">
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
                                  icon={faTrash}
                                  className={styles.arrow_icon}
                                  onClick={() => deleteCard(card._id)}
                                />
                              </div>
                            </div>
                            <div className="text-center mt-3 mb-2">
                              <MainButton
                                text={key("update")}
                                onClick={() => {setCardId(card._id); setShopId(card.shop?._id); setModalShow(true)}}
                              />
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

      {modalShow && (
        <UpdateCard
          show={modalShow}
          onHide={() => setModalShow(false)}
          cardId={cardId}
          refetch={refetch}
          shopId={shopId}
        />
      )}
    </>
  );
};

export default AllCards;
