import React, { useState } from "react";
import styles from "./LogoutModal.module.css";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { useTranslation } from "react-i18next";
import SearchField from "./SearchField";
import { useQuery } from "@tanstack/react-query";
import { getShops } from "../../util/Http";
import LoadingOne from "./LoadingOne";

const FilterModal = ({ onHide, show, triggerFunc }) => {
  const { t: key } = useTranslation();
  let isArLang = localStorage.getItem("i18nextLng") === "ar";
  const [searchInput, setSearchInput] = useState("");
  const [selectedShop, setSelectedShop] = useState({});


  const searchName = (e, searchTerm) => {
    e.preventDefault();
    setSearchInput(searchTerm);
  };

  const { data } = useQuery({
    queryKey: ["shops"],
    queryFn: getShops,
    staleTime: Infinity,
  });

  const handleCheckboxChange = (shpName) => {
    setSelectedShop((prevState) => ({
      ...prevState,
      [shpName]: !prevState[shpName],
    }));
  };

  const handleConfirm = () => {
    const selectedNames = Object.keys(selectedShop).filter(
      (name) => selectedShop[name]
    );
    triggerFunc({ selectedNames });
    onHide()
  };

  const filteredCards = data
    ? data.data.filter((shop) =>
        shop.name.toLowerCase().includes(searchInput.toLowerCase())
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
                {filteredCards?.map((shop,index) => (
                  <li key={`${shop.name}_${index}`} className="my-3 text-end fw-bold">
                    {isArLang ? (
                      <label>
                        <input
                          type="checkbox"
                          checked={!!selectedShop[shop.name]}
                          onChange={() => handleCheckboxChange(shop.name)}
                          className="mx-3"
                        />
                        {shop.name}
                      </label>
                    ) : (
                      <label>
                        {shop.name}

                        <input
                          type="checkbox"
                          checked={!!selectedShop[shop.name]}
                          onChange={() => handleCheckboxChange(shop.name)}
                          className="mx-3"
                        />
                      </label>
                    )}
                  </li>
                ))}
              </ul>
            ) : (
              <ul>
                {data?.data?.map((shop) => (
                  <li key={shop.name} className="my-3 text-end">
                    {isArLang ? (
                      <label>
                        <input
                          type="checkbox"
                          checked={!!selectedShop[shop.name]}
                          onChange={() => handleCheckboxChange(shop.name)}
                          className="mx-3"
                        />
                        {shop.name}
                      </label>
                    ) : (
                      <label>
                        {shop.name}

                        <input
                          type="checkbox"
                          checked={!!selectedShop[shop.name]}
                          onChange={() => handleCheckboxChange(shop.name)}
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
