import React, { useEffect } from "react";
import styles from "./SpecialCards.module.css";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";
import SearchField from "../../Components/Ui/SearchField";
import { useTranslation } from "react-i18next";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight, faPlus } from "@fortawesome/free-solid-svg-icons";
import { useQuery } from "@tanstack/react-query";
import { getSpecialCards } from "../../util/Http";
import Placeholders from "../../Components/Ui/Placeholders";

const SpecialCards = () => {
  const { t: key } = useTranslation();
  let isArLang = localStorage.getItem("i18nextLng") === "ar";
  const token = JSON.parse(localStorage.getItem("token"));

  const { data, isFetching } = useQuery({
    queryKey: ["special-cards", token],
    queryFn: getSpecialCards,
    staleTime: 300000,
  });
  console.log(data);

  let frontShape = `${process.env.REACT_APP_Host}shapes/${data?.data?.frontShape}`;
  let backShape = `${process.env.REACT_APP_Host}shapes/${data?.data?.backShape}`;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <Container fluid className="my-5">
      <h2 className="text-center my-3 mb-5">{key("specialCardsPageTitle")}</h2>
      <div
        className={`${styles.controllers} d-flex justify-content-between my-4 px-4`}
      >
        <div className={styles.filter_box}>
          <span className={styles.filter}>
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
            Filter{" "}
          </span>
        </div>
        <div>
          <SearchField text={key("search")} />
        </div>
      </div>
      <Row>
        {isFetching ? (
        <Placeholders/>
        ) : (
          <>
            {data?.data?.cards.map((card) => (
              <Col
                key={card._id}
                md={4}
                className="d-flex justify-content-center"
              >
                <div className={styles.store_card}>
                  <Card className={styles.card_body}>
                    <div className={styles.card_img_div}>
                      <Card.Img
                        className={styles.front_img}
                        variant="top"
                        src={frontShape}
                      />
                      <div className={styles.card_img_div_layer}>
                        <Card.Img
                          className={styles.back_img}
                          variant="top"
                          src={backShape}
                        />
                      </div>
                    </div>

                    <Card.Body>
                      <div className="d-flex align-items-center position-relative pt-3">
                        <div
                          className={
                            isArLang
                              ? styles.controllers_icon_ar
                              : styles.controllers_icon
                          }
                        >
                          <FontAwesomeIcon
                            title="Add to cart"
                            icon={faPlus}
                            className={styles.cart_icon}
                          />
                          <FontAwesomeIcon
                            title="Buy card"
                            icon={faArrowRight}
                            className={styles.arrow_icon}
                          />
                        </div>
                        <div title={card.shop?.name} className={styles.store_logo}>
                          <img src={`${process.env.REACT_APP_Host}shops/${card.shop?.logo}`} alt={card.shop?.name} className="w-100" />
                        </div>
                        <h5
                          className={`${
                            isArLang ? "ms-4  me-auto" : "me-4  ms-auto"
                          } ${styles.card_price} my-3`}
                        >
                          {card.price} {key("sar")}
                        </h5>
                      </div>
                    </Card.Body>
                  </Card>
                </div>
              </Col>
            ))}
          </>
        )}
      </Row>
    </Container>
  );
};

export default SpecialCards;
