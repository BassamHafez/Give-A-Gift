import React, { useEffect, useState } from "react";
import styles from "./SpecialCards.module.css";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import { getSpecialCards } from "../../util/Http";
import Placeholders from "../../Components/Ui/Placeholders";
import LoadingOne from "../../Components/Ui/LoadingOne";
import MainButton from "../../Components/Ui/MainButton";
import FilterModal from "../../Components/Ui/FilterModal";
import SingleReadyCard from "../../Components/Ui/SingleReadyCard";
import { toast } from "react-toastify";



const SpecialCards = () => {
  const { t: key } = useTranslation();
  const [filteredCards, setFilteredCards] = useState([]);
  const [searchInput, setSearchInput] = useState("");
  const [showFilterModal, setShowFilterModal] = useState(false);
  const notifySuccess = (message) => toast.success(message);
  const notifyError = (message) => toast.error(message);
  const token = JSON.parse(localStorage.getItem("token"));


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
      let filtered = [];
      filtered = data?.data?.cards.filter((card) =>
        selectedNames.includes(card.shop?.name)
      );
      if (filtered.length > 0) {
        setFilteredCards(filtered);
      } else {
        notifyError(key("noDataSearch"));
        setFilteredCards(data?.data?.cards);
      }
    } else {
      setFilteredCards(data?.data?.cards);
    }
    if (searchInput) {
      notifySuccess(key("searchFilterApplied"));
    }
  };

  return (
    <>
      <Container fluid className={`page_height my-5`}>
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
                    <SingleReadyCard card={card}/>
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
