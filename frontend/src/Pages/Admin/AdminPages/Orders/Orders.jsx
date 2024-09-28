import React, { useEffect } from "react";
import styles from "./Orders.module.css";
import OrdersDataView from "./OrdersDataView";

const Orders = () => {
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <div className={styles.orders_body}>
        <OrdersDataView isUser={false}/>
      </div>
    </>
  );
};

export default Orders;
