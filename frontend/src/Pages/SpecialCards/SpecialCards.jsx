import React from 'react'
import styles from "./SpecialCards.module.css";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";
import giftCard from "../../Images/giftCard.jpg";
import shop from "../../Images/Stores/shop1.png";
import SearchField from "../../Components/Ui/SearchField";

const SpecialCards = () => {
  return (
    <Container className="my-5">
    <h2 className="text-center my-3 mb-5">Special Cards For You</h2>
    <div className="d-flex justify-content-between my-4">
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
      <div className="w-25">
        <SearchField
          text="search Stores"
        />
      </div>
    </div>
    <Row>
      <Col md={4}>
        <div className={styles.store_card}>
          <Card className={styles.card_body}>
            <Card.Img variant="top" src={giftCard} />
            <Card.Body>
              <Card.Text>
                <div className="d-flex align-items-center">
                <div className={styles.store_logo}>
                  <img src={shop} alt="shop logo" className="w-100" />
                </div>
                <h5 className="me-4 my-3 ms-auto">
                  400 SAR
                </h5>
                </div>
       
              </Card.Text>
            </Card.Body>
          </Card>
        </div>
      </Col>
      <Col md={4}>
        <div className={styles.store_card}>
          <Card className={styles.card_body}>
            <Card.Img variant="top" src={giftCard} />
            <Card.Body>
              <Card.Text>
                <div className="d-flex align-items-center">
                <div className={styles.store_logo}>
                  <img src={shop} alt="shop logo" className="w-100" />
                </div>
                <h5 className="me-4 my-3 ms-auto">
                  400 SAR
                </h5>
                </div>
       
              </Card.Text>
            </Card.Body>
          </Card>
        </div>
      </Col>
      <Col md={4}>
        <div className={styles.store_card}>
          <Card className={styles.card_body}>
            <Card.Img variant="top" src={giftCard} />
            <Card.Body>
              <Card.Text>
                <div className="d-flex align-items-center">
                <div className={styles.store_logo}>
                  <img src={shop} alt="shop logo" className="w-100" />
                </div>
                <h5 className="me-4 my-3 ms-auto">
                  400 SAR
                </h5>
                </div>
       
              </Card.Text>
            </Card.Body>
          </Card>
        </div>
      </Col>
      <Col md={4}>
        <div className={styles.store_card}>
          <Card className={styles.card_body}>
            <Card.Img variant="top" src={giftCard} />
            <Card.Body>
              <Card.Text>
                <div className="d-flex align-items-center">
                <div className={styles.store_logo}>
                  <img src={shop} alt="shop logo" className="w-100" />
                </div>
                <h5 className="me-4 my-3 ms-auto">
                  400 SAR
                </h5>
                </div>
       
              </Card.Text>
            </Card.Body>
          </Card>
        </div>
      </Col>
      <Col md={4}>
        <div className={styles.store_card}>
          <Card className={styles.card_body}>
            <Card.Img variant="top" src={giftCard} />
            <Card.Body>
              <Card.Text>
                <div className="d-flex align-items-center">
                <div className={styles.store_logo}>
                  <img src={shop} alt="shop logo" className="w-100" />
                </div>
                <h5 className="me-4 my-3 ms-auto">
                  400 SAR
                </h5>
                </div>
       
              </Card.Text>
            </Card.Body>
          </Card>
        </div>
      </Col>
      <Col md={4}>
        <div className={styles.store_card}>
          <Card className={styles.card_body}>
            <Card.Img variant="top" src={giftCard} />
            <Card.Body>
              <Card.Text>
                <div className="d-flex align-items-center">
                <div className={styles.store_logo}>
                  <img src={shop} alt="shop logo" className="w-100" />
                </div>
                <h5 className="me-4 my-3 ms-auto">
                  400 SAR
                </h5>
                </div>
       
              </Card.Text>
            </Card.Body>
          </Card>
        </div>
      </Col>
      <Col md={4}>
        <div className={styles.store_card}>
          <Card className={styles.card_body}>
            <Card.Img variant="top" src={giftCard} />
            <Card.Body>
              <Card.Text>
                <div className="d-flex align-items-center">
                <div className={styles.store_logo}>
                  <img src={shop} alt="shop logo" className="w-100" />
                </div>
                <h5 className="me-4 my-3 ms-auto">
                  400 SAR
                </h5>
                </div>
       
              </Card.Text>
            </Card.Body>
          </Card>
        </div>
      </Col>
      <Col md={4}>
        <div className={styles.store_card}>
          <Card className={styles.card_body}>
            <Card.Img variant="top" src={giftCard} />
            <Card.Body>
              <Card.Text>
                <div className="d-flex align-items-center">
                <div className={styles.store_logo}>
                  <img src={shop} alt="shop logo" className="w-100" />
                </div>
                <h5 className="me-4 my-3 ms-auto">
                  400 SAR
                </h5>
                </div>
       
              </Card.Text>
            </Card.Body>
          </Card>
        </div>
      </Col>
      <Col md={4}>
        <div className={styles.store_card}>
          <Card className={styles.card_body}>
            <Card.Img variant="top" src={giftCard} />
            <Card.Body>
              <Card.Text>
                <div className="d-flex align-items-center">
                <div className={styles.store_logo}>
                  <img src={shop} alt="shop logo" className="w-100" />
                </div>
                <h5 className="me-4 my-3 ms-auto">
                  400 SAR
                </h5>
                </div>
       
              </Card.Text>
            </Card.Body>
          </Card>
        </div>
      </Col>
     
    </Row>
  </Container>
  )
}

export default SpecialCards
