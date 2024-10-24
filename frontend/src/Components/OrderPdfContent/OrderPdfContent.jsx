import React from "react";
import qr from "../../Images/qr.png";
import styles from "./OrderPdfContent.module.css";
import { useTranslation } from "react-i18next";

const OrderPdfContent = ({ order }) => {
  const { t: key } = useTranslation();

  const formatDateTime = (dateTimeString) => {
    const date = new Date(dateTimeString);
    const formattedDate = date.toLocaleDateString("en-GB");
    const formattedTime = date.toLocaleTimeString("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
    });
    return { formattedDate, formattedTime };
  };

  return (
    <>
      <div className={`${styles.header_details} ${styles.min_width_fixed}`}>
        <p className="m-0 fw-bold text-secondary">
          {key("orderFatora")} ({`${order.order_number}`})
        </p>

        <h4 className="text-center my-3">
          شركة أعط الهدية للتجارة والتسويق
        </h4>

        <h4 className="text-center text-secondary">الرياض</h4>
      </div>

      <div className={styles.min_width_fixed}>
        <div className="my-4 w-75 m-auto">
          <p>
            {key("date")}: {formatDateTime(order.order_date).formattedDate}
          </p>

          <p>
            {key("time")}: {formatDateTime(order.order_date).formattedTime}
          </p>
          <p>
            {key("store")}: {order.shop}
          </p>
          <p>
            {key("taxNum")}: 12345678910
          </p>
        </div>
        <ul className={styles.order_ul}>
          <li className={styles.item_header}>
            <span>{key("categories")}</span> {key("price")}
          </li>
          <li>
            <span>{key("cardPrice")}</span> {order.value} {key("sar")}
          </li>
          {order.shapes_price
            ? order.shapes_price > 0 && (
                <li>
                  <span>{key("shapePrice")}</span> {order.shapes_price}{" "}
                  {key("sar")}
                </li>
              )
            : ""}
          {order.color_price
            ? Number(order.color_price) > 0 && (
                <li>
                  <span>{key("colorPrice")}</span>
                  {order.color_price} {key("sar")}
                </li>
              )
            : ""}

          {order.celebrate_icon_price
            ? order.celebrate_icon_price > 0 && (
                <li>
                  <span>
                    {key("celebrateIcon")} {key("price")}:
                  </span>
                  {order.celebrate_icon_price} {key("sar")}
                </li>
              )
            : ""}
          {order.celebrate_qr_link_price
            ? order.celebrate_qr_link_price > 0 && (
                <li>
                  <span>
                    {key("celebrateLink")} {key("price")}:
                  </span>
                  {order.celebrate_qr_link_price} {key("sar")}
                </li>
              )
            : ""}
          <li>
            <span>{key("Vatvalue")}</span>
            {order.VAT}
          </li>

          {order.price_after_discount
            ? order.price_after_discount > 0 && (
                <li>
                  <span>{key("afterDisc")}</span>
                  {order.price_after_discount} {key("sar")}
                </li>
              )
            : ""}
          {!order.price_after_discount && (
            <li>
              <span>{key("totalPrice")}</span>
              {order.total_paid} {key("sar")}
            </li>
          )}
        </ul>
        <div className={styles.qr_code_img}>
          <img className="w-100" src={qr} alt="qrCode" />
        </div>
      </div>
    </>
  );
};

export default OrderPdfContent;
