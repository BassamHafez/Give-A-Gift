import React, { useState } from "react";
import styles from "./Cart.module.css";
import Offcanvas from "react-bootstrap/Offcanvas";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowRight,
  faHandHoldingDollar,
  faStore,
  faTrash,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getMyCards } from "../../util/Http";
import Placeholders from "../Ui/Placeholders";
import ConfirmationModal from "../Ui/ConfirmationModal";
import toast, { Toaster } from "react-hot-toast";
import axios from "axios";

const notifySuccess = (message) => toast.success(message);
const notifyError = (message) => toast.error(message);

const Cart = ({ onClose, show }) => {
  const [modalShow, setModalShow] = useState(false);
  const [cardId, setCardId] = useState("");
  const token = JSON.parse(localStorage.getItem("token"));
  const queryClient = useQueryClient();

  const { data, isFetching, refetch } = useQuery({
    queryKey: ["getCard", token],
    queryFn: () => getMyCards(token),
    enabled: !!token,
    staleTime: 300000,
  });

  const deleteCard = async () => {
    setModalShow(false);
    if (cardId && token) {
      try {
        const response = await axios.delete(
          `${process.env.REACT_APP_Base_API_URl}cards/${cardId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        console.log(response);
        if (response.status === 204) {
          queryClient.invalidateQueries(["getCards", token]);
          notifySuccess("Card deleted successfully.");
          refetch();
        } else {
          notifyError("something went wrong please try again later!");
        }
      } catch (error) {
        notifyError("something went wrong please try again later!");
        console.error(error);
      }
    } else {
      notifyError(
        "The card no longer exists, or something went wrong. Unable to delete."
      );
    }
  };

  return (
    <>
      <Toaster position="top-right" />

      <Offcanvas
        show={show}
        onHide={onClose}
        placement="end"
        className={styles.side_bar}
      >
        <Offcanvas.Header className={styles.header}>
          <div className="d-flex justify-content-between align-items-center w-100">
            <h2>Your Cart</h2>
            <FontAwesomeIcon
              className={styles.close_icon}
              onClick={onClose}
              icon={faXmark}
            />
          </div>
        </Offcanvas.Header>

        <Offcanvas.Body>
          <ul className={styles.list}>
            {isFetching ? (
              <Placeholders isList={true} />
            ) : (
              data?.data?.map((card) => (
                <li key={card._id} className={styles.list_item}>
                  <div className={styles.item}>
                    <h4>{card.isSpecial ? "Ready Card" : "Custom Card"}</h4>
                    <div className={styles.item_content}>
                      <ul className="p-0">
                        <li className={styles.sub_list_item}>
                          <FontAwesomeIcon
                            className={styles.sub_list_icon}
                            icon={faStore}
                          />
                          <span className="fw-bold">Store: </span>
                          {card.shop?.name}
                        </li>
                        <li className={styles.sub_list_item}>
                          <FontAwesomeIcon
                            className={styles.sub_list_icon}
                            icon={faHandHoldingDollar}
                          />
                          <span className="fw-bold">Price: </span>
                          {card.price?.value} SAR
                        </li>
                      </ul>
                      <div className={styles.controllers}>
                        <FontAwesomeIcon
                          className={styles.trash_icon}
                          icon={faTrash}
                          onClick={() => {
                            setCardId(card._id);
                            setModalShow(true);
                          }}
                        />
                        <FontAwesomeIcon
                          className={styles.arrow_right_icon}
                          icon={faArrowRight}
                        />
                      </div>
                    </div>
                  </div>
                </li>
              ))
            )}
          </ul>
        </Offcanvas.Body>
      </Offcanvas>
      <ConfirmationModal
        show={modalShow}
        onHide={() => setModalShow(false)}
        func={deleteCard}
        message="Are you sure you want to delete card"
        btnMsg="Delete"
      />
    </>
  );
};

export default Cart;
