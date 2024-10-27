import React, { useEffect } from "react";
import styles from "./AdminPages.module.css";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCaretDown } from "@fortawesome/free-solid-svg-icons";

const Docs = () => {

  let isArLang = localStorage.getItem("i18nextLng") === "ar";
  const { t: key } = useTranslation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className={`${styles.docs_body} ${!isArLang?styles.new_font:""}`}>
      <div>
        <div className="text-center">
          <h2 className="m-0">{key("connectStores")}</h2>
          <FontAwesomeIcon icon={faCaretDown} className="text-danger fs-5" />
        </div>
        <p className="fs-5">
          {key("contactDocs")}{" "}
          <Link
            target="_blank"
            to={`https://wa.me/966530281151`}
            rel="noopener noreferrer"
            className="text-primary"
          >
            {key("here")}
          </Link>
        </p>
      </div>
      <div className="my-4">
        <h5>{key("reqApi")}</h5>
        <div className={styles.request_api} dir="ltr">
          <span>POST https://api.giveagift.com.sa/api/v1/discount-codes</span>
        </div>
      </div>
      <div className="my-4">
        <h5>{key("reqBody")}</h5>
        <div className={styles.request_body} dir="ltr">
          <ul>
            <li>{`{`}</li>
            <li>
              <span>token:</span> "0031.......",
            </li>
            <li>
              <span>"code"</span> "66fa....",
            </li>
            <li> {`}`}</li>
          </ul>
        </div>
      </div>
      <div className="my-4">
        <h5>{key("exRes")}</h5>
        <h5 className="text-success fw-bold ms-3" dir="ltr">Code 200</h5>
        <div className={styles.request_body} dir="ltr">
          <ul>
            <li>{`{`}</li>
            <li>
              <span>"status"</span> "success",
            </li>
            <li>
              <span>data:</span>
              {`{`}
            </li>
            <li className="ms-2">
              <span>"value":</span> "20",
            </li>
            <li className="ms-2">{`},`}</li>
            <li>{`}`}</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Docs;
