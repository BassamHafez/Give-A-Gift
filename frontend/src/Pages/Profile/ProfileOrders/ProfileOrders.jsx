import React from "react";
import styles from "../../Admin/AdminPages/Orders/Orders.module.css";
import OrdersDataView from "../../Admin/AdminPages/Orders/OrdersDataView";

const ProfileOrders = () => {
  return (
    <div className={styles.orders_body}>
      <OrdersDataView />
    </div>
  );
};

export default ProfileOrders;
