import { faSearch, faTruckLoading } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState } from "react";
import styles from "./SearchField.module.css";

const SearchField = ({ onSearch, text, isSearching }) => {
  const [searchInput, setSearchInput] = useState("");

  const saveSearchData = (e) => {
    setSearchInput(e.target.value);
  };

  let isArLang = localStorage.getItem("i18nextLng") === "ar";

  return (
    <form
      onSubmit={(e) => onSearch(e, searchInput)} // Pass the search input to the parent component
      className={`${styles.search_container}  ${
        isArLang ? "me-auto" : "ms-auto"
      } bg-warinig`}
    >
      <input onChange={saveSearchData} type="search" placeholder={text} />
      <button
        type="submit"
        className={`${styles.search_icon} ${
          isArLang ? styles.search_icon_ar : styles.search_icon_en
        }`}
      >
        {isSearching ? (
          <FontAwesomeIcon className="fa-spin" icon={faTruckLoading} />
        ) : (
          <FontAwesomeIcon title="search" icon={faSearch} />
        )}
      </button>
    </form>
  );
};

export default SearchField;
