import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import styles from "./Loading.module.css";

const LoadingOne = () => {
  return (
    <div className="w-100 h-100 d-flex justify-content-center align-items-center">
      <FontAwesomeIcon className={`fa-3x fa-spin ${styles.loading_spinner}`} icon={faSpinner} />
    </div>
  );
};

export default LoadingOne;
