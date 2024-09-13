import React, { useState } from "react";
import styles from "./LogoutModal.module.css";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { useTranslation } from "react-i18next";
import SearchField from "./SearchField";
import { useQuery } from "@tanstack/react-query";
import { getSpecialCards } from "../../util/Http";
import LoadingOne from "./LoadingOne";

const FilterModal = ({ onHide, show, triggerFunc }) => {
  const { t: key } = useTranslation();
  let isArLang = localStorage.getItem("i18nextLng") === "ar";
  const token = JSON.parse(localStorage.getItem("token"));
  const [searchInput, setSearchInput] = useState("");
  const [selectedCards, setSelectedCards] = useState({});

  const searchName = (e, searchTerm) => {
    e.preventDefault();
    setSearchInput(searchTerm);
  };

  const { data } = useQuery({
    queryKey: ["special-cards", token],
    queryFn: getSpecialCards,
    staleTime: 300000,
  });

  const handleCheckboxChange = (cardName) => {
    setSelectedCards((prevState) => ({
      ...prevState,
      [cardName]: !prevState[cardName],
    }));
  };

  const handleConfirm = () => {
    const selectedNames = Object.keys(selectedCards).filter(
      (name) => selectedCards[name]
    );
    triggerFunc({ selectedNames });
    onHide()
  };

  const filteredCards = data
    ? data.data?.cards.filter((card) =>
        card.shop?.name.toLowerCase().includes(searchInput.toLowerCase())
      )
    : [];

  return (
    <Modal
      show={show}
      onHide={onHide}
      size="md"
      aria-labelledby="contained-modal-title-vcenter"
      centered
      className={styles.modal_container}
    >
      <Modal.Body className={`${styles.modal_body} text-center`}>
        <div className={styles.search_field}>
          <SearchField onSearch={searchName} text={key("search")} />
        </div>

        <div className="position-relative">
          {data ? (
            filteredCards?.length > 0 ? (
              <ul>
                {filteredCards.map((card) => (
                  <li key={card.shop?.name} className="my-3 text-end fw-bold">
                    {isArLang ? (
                      <label>
                        <input
                          type="checkbox"
                          checked={!!selectedCards[card.shop?.name]}
                          onChange={() => handleCheckboxChange(card.shop?.name)}
                          className="mx-3"
                        />
                        {card.shop?.name}
                      </label>
                    ) : (
                      <label>
                        {card.shop?.name}

                        <input
                          type="checkbox"
                          checked={!!selectedCards[card.shop?.name]}
                          onChange={() => handleCheckboxChange(card.shop?.name)}
                          className="mx-3"
                        />
                      </label>
                    )}
                  </li>
                ))}
              </ul>
            ) : (
              <ul>
                {data.data?.cards.map((card) => (
                  <li key={card.shop?.name} className="my-3 text-end fw-bold">
                    {isArLang ? (
                      <label>
                        <input
                          type="checkbox"
                          checked={!!selectedCards[card.shop?.name]}
                          onChange={() => handleCheckboxChange(card.shop?.name)}
                          className="mx-3"
                        />
                        {card.shop?.name}
                      </label>
                    ) : (
                      <label>
                        {card.shop?.name}

                        <input
                          type="checkbox"
                          checked={!!selectedCards[card.shop?.name]}
                          onChange={() => handleCheckboxChange(card.shop?.name)}
                          className="mx-3"
                        />
                      </label>
                    )}
                  </li>
                ))}
              </ul>
            )
          ) : (
            <LoadingOne />
          )}
        </div>
      </Modal.Body>
      <Modal.Footer className={styles.modal_footer}>
        <Button
          variant="primary"
          className={isArLang ? styles.close_btn_ar : styles.close_btn}
          onClick={onHide}
        >
          {key("cancel")}
        </Button>
        <Button
          variant="danger"
          className={isArLang ? styles.logout_btn_ar : styles.logout_btn}
          onClick={handleConfirm}
        >
          {key("confirm")}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default FilterModal;
