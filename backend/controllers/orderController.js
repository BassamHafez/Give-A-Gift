const Order = require("../models/orderModel");
const factory = require("./handlerFactory");

exports.setUserId = (req, res, next) => {
  if (req.user.role !== "admin") req.query.customer_id = req.user.id;
  next();
};

exports.getAllOrders = factory.getAll(Order);
