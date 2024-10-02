import React, { useEffect } from "react";
import styles from "./AdminPages.module.css";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCaretDown } from "@fortawesome/free-solid-svg-icons";
import { useSelector } from "react-redux";

const Docs = () => {

  const role = useSelector((state) => state.userInfo.role);
  const profileData = useSelector((state) => state.profileInfo.data);
  const navigate = useNavigate();

  useEffect(() => {
    if (role === "user") {
      navigate(`/`);
    } else if (role === "merchant") {
      navigate(`/merchant/${profileData?._id}`);
    }
  }, [role, navigate, profileData]);

  const { t: key } = useTranslation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  return (
    <div className={styles.docs_body}>
      <div>
        <div className="text-center">
          <h1 className="m-0">Connect stores</h1>
          <FontAwesomeIcon icon={faCaretDown} className="text-danger fs-4" />
        </div>
        <p className="fs-4">
          {key("contactDocs")}{" "}
          <Link
            target="_blank"
            to={`https://wa.me/966557299119`}
            rel="noopener noreferrer"
            className="text-primary"
          >
            {key("here")}
          </Link>
        </p>
      </div>
      <div className="my-4" >
        <h4 className="fw-bold">{key("reqApi")}</h4>
        <div className={styles.request_api} dir="ltr">
          <span>POST http://127.0.0.1:3001/api/v1/docs</span>
        </div>
      </div>
      <div className="my-4">
        <h4 className="fw-bold">{key("reqBody")}</h4>
        <div className={styles.request_body} dir="ltr">
          <ul>
            <li>{`{`}</li>
            <li>
              <span>name:</span> "FREE",
            </li>
            <li>
              <span>"expire"</span> "2025-09-08T19:58:27.768Z",
            </li>
            <li>
              <span>"discount"</span> 20,
            </li>
            <li>
              <span>"PaymentMethodId":</span> 2,
            </li>
            <li>
              <span>"InvoiceValue":</span> 31,
            </li>
            <li>
              <span>"cardId":</span>
              66f953f8fa3ea75c678ac671,
            </li>
            <li> {`}`}</li>
          </ul>
        </div>
      </div>
      <div className="my-4">
        <h4 className="fw-bold">{key("exRes")}</h4>
        <div className={styles.request_body} dir="ltr">
          <ul>
            <li>{`{`}</li>
            <li>
              <span>"status"</span> "success",
            </li>
            <li>
              <span>"name":</span> "B",
            </li>
            <li>
              <span>"expire"</span> "2025-09-08T19:58:27.768Z",
            </li>
            <li>
              <span>"expire"</span> "2025-09-08T19:58:27.768Z",
            </li>
            <li>
              <span>"discount"</span> 10,
            </li>
            <li>
              <span>"_id":</span> "66fc8320b26b4bb2ed6f85db",
            </li>
            <li>
              <span>"createdAt":</span> 2024-10-01T23:17:52.905Z,
            </li>
            <li>
              <span>"updatedAt":</span> 2024-10-01T23:17:52.905Z,
            </li>
            <li>
              <span>"__v"</span> 0 {`}`}
            </li>
            <li>{`}`}</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Docs;
