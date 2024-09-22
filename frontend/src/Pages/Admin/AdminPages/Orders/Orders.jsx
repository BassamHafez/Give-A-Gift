import React from "react";
import styles from "./Orders.module.css";
import OrdersDataView from "./OrdersDataView";

const Orders = () => {


  return (
    <>
      <div className={styles.orders_body}>
        <OrdersDataView/>
      </div>
    </>
  );
};

export default Orders;
