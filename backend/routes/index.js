const webhookRoutes = require("../routes/webhookRoutes");
const authRoutes = require("../routes/authRoutes");
const userRoutes = require("../routes/userRoutes");
const shapeRoutes = require("../routes/shapeRoutes");
const shopRoutes = require("../routes/shopRoutes");
const colorRoutes = require("../routes/colorRoutes");
const proColorRoutes = require("../routes/proColorRoutes");
const couponRoutes = require("../routes/couponRoutes");
const cardRoutes = require("../routes/cardRoutes");
const specialCardRoutes = require("../routes/specialCardRoutes");
const discountCodeRoutes = require("../routes/discountCodeRoutes");
const walletRoutes = require("../routes/walletRoutes");
const paymentRoutes = require("../routes/paymentRoutes");
const configRoutes = require("../routes/configRoutes");
const transactionRoutes = require("../routes/transactionRoutes");
const infoRoutes = require("../routes/infoRoutes");

const mountRoutes = (app) => {
  app.use("/api/v1/webhooks", webhookRoutes);
  app.use("/api/v1/auth", authRoutes);
  app.use("/api/v1/users", userRoutes);
  app.use("/api/v1/shapes", shapeRoutes);
  app.use("/api/v1/shops", shopRoutes);
  app.use("/api/v1/colors", colorRoutes);
  app.use("/api/v1/pro-colors", proColorRoutes);
  app.use("/api/v1/coupons", couponRoutes);
  app.use("/api/v1/cards", cardRoutes);
  app.use("/api/v1/special-cards", specialCardRoutes);
  app.use("/api/v1/discount-codes", discountCodeRoutes);
  app.use("/api/v1/wallets", walletRoutes);
  app.use("/api/v1/payments", paymentRoutes);
  app.use("/api/v1/configs", configRoutes);
  app.use("/api/v1/transactions", transactionRoutes);
  app.use("/api/v1/info", infoRoutes);
};

module.exports = mountRoutes;
