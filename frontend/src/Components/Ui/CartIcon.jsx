import React from "react";

import Badge from "react-bootstrap/Badge";
import styles from "./Loading.module.css";
import { useSelector } from "react-redux";

const CartIcon = () => {
  const cartCount = useSelector((state) => state.cartCounter.counter);
  const isLogin = useSelector((state) => state.userInfo.isLogin);

  return (
    <>
      <Badge className={styles.cart_badge} bg="danger">
        {isLogin?cartCount:0}
      </Badge>
    </>
  );
};

export default CartIcon;
