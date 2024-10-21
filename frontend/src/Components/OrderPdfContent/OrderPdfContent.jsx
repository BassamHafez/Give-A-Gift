import React from "react";
import qr from "../../Images/qr.png";
import logo from "../../Images/logo.png";
import styles from "./OrderPdfContent.module.css";
import { useTranslation } from "react-i18next";

const OrderPdfContent = ({ order, isUser }) => {
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
  console.log(order);
  return (
    <div>
      <div className={styles.header_imgs}>
        <div className={styles.qr_code_img}>
          <img className="w-100" src={qr} alt="qrCode" />
        </div>
        <div>
          <div className={styles.logo}>
            <img className="w-100" src={logo} alt="logo" />
          </div>
          <h2 className="text-center fw-bold">Give A Gift</h2>
        </div>
      </div>

      <div>
        <h4 className={styles.main_title}>{key("orderData")}</h4>
        <ul className={styles.order_ul}>
          <li>
            <span>{key("price")}</span> {order.value} {key("sar")}
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
          <li>
            <span>{key("totalPrice")}</span>
            {order.total_paid} {key("sar")}
          </li>
          <li>
            <span>{key("store")}</span>
            {order.shop}
          </li>

          <li>
            <span>{key("customer")}</span>
            {order.customer_name}
          </li>
          <li>
            <span>{key("email")}</span>
            {order.customer_email}
          </li>
          <li>
            <span>{key("phone")}</span>
            {order.customer_phone}
          </li>

          <li>
            <span>{key("recipient")}</span>
            {order.recipient_name}
          </li>
          <li>
            <span>{key("recipientWhatsapp")}</span>
            {order.recipient_whatsapp}
          </li>

          <li>
            <span>{key("orderNumber")}</span>
            {`${order.order_number}`}
          </li>
          {!isUser && (
            <li>
              <span>{key("cardId")}</span>
              {order.card_id}
            </li>
          )}
          <li>
            <span>{key("date")}</span>
            {formatDateTime(order.order_date).formattedDate}
          </li>
          <li>
            <span>{key("time")}</span>
            {formatDateTime(order.order_date).formattedTime}
          </li>
        </ul>
        <div className="text-center my-2">
          <h4>Thank you for choosing Give A Gift</h4>
          <span>شكراً لاختياركم موقعنا </span>
        </div>
      </div>
    </div>
  );
};

export default OrderPdfContent;
