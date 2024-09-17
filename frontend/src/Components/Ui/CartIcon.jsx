import { useQuery } from "@tanstack/react-query";
import React from "react";
import { getMyCards } from "../../util/Http";
import Badge from "react-bootstrap/Badge";
import styles from "./Loading.module.css";

const CartIcon = () => {
  const token = JSON.parse(localStorage.getItem("token"));

  const { data } = useQuery({
    queryKey: ["getCard", token],
    queryFn: () => getMyCards(token),
    enabled: !!token,
  });

  return (
    <Badge className={styles.cart_badge} bg="danger">
      {data?.results}
    </Badge>
  );
};

export default CartIcon;
