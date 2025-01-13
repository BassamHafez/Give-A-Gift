import React, { useState } from "react";
import styles from "./Pagination.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faArrowRight } from "@fortawesome/free-solid-svg-icons";

const Pagination = ({ settingPageNum, results, pageLimit }) => {
  const [isActive, setIsActive] = useState(1);
  let isArLang = localStorage.getItem("i18nextLng") === "ar";

  const limit = pageLimit || 100;
  const maxPageNum = Math.ceil(results / limit);

  const hanldeActivePage = (num) => {
    if (isActive < 1 || num < 1) {
      setIsActive(1);
      settingPageNum(1);
      return;
    }
    if (isActive > maxPageNum || num > maxPageNum) {
      setIsActive(maxPageNum);
      settingPageNum(maxPageNum);
      return;
    }
    setIsActive(num);
    settingPageNum(num);
  };

  return (
    <div
      className={`${styles.pages} m-auto d-flex justify-content-center align-items-center my-3 px-1`}
    >
      <div
        className={`${styles.page_arrow} ${styles.arrow_left}`}
        onClick={() => hanldeActivePage(isActive - 1)}
      >
        <FontAwesomeIcon icon={isArLang?faArrowRight:faArrowLeft} />
      </div>
      <div
        onClick={() => hanldeActivePage(1)}
        className={`${styles.page_num} ${styles.hidden_item_on_mobile2} ${
          isActive === 1 ? styles.active_num : ""
        }`}
      >
        <h5>1</h5>
      </div>
      <div
        onClick={() => hanldeActivePage(2)}
        className={`${styles.page_num} ${styles.hidden_item_on_mobile2}  ${
          isActive === 2 ? styles.active_num : ""
        }`}
      >
        <h5>2</h5>
      </div>
      <div
        onClick={() => hanldeActivePage(3)}
        className={`${styles.page_num} ${styles.hidden_item_on_mobile} ${
          isActive === 3 ? styles.active_num : ""
        }`}
      >
        <h5>3</h5>
      </div>
      <div
        className={`${styles.page_arrow}  ${styles.arrow_right}`}
        onClick={() => hanldeActivePage(isActive + 1)}
      >
        <FontAwesomeIcon icon={isArLang?faArrowLeft:faArrowRight} />
      </div>
    </div>
  );
};

export default Pagination;
