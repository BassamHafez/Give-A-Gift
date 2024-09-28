import React, { useEffect } from "react";
import styles from "../../Admin/AdminPages/Orders/Orders.module.css";
import OrdersDataView from "../../Admin/AdminPages/Orders/OrdersDataView";

const ProfileOrders = () => {

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className={styles.orders_body}>
      <OrdersDataView isUser={true} />
    </div>
  );
};

export default ProfileOrders;
