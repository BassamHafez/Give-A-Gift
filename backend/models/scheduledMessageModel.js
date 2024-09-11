const mongoose = require("mongoose");

const scheduledMessageSchema = new mongoose.Schema(
  {
    phone: {
      type: String,
      required: true,
    },
    caption: {
      type: String,
      required: true,
    },
    fileUrl: {
      type: String,
      required: true,
    },
    scheduledAt: {
      type: Date,
      required: true,
    },
    sent: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const ScheduledMessage = mongoose.model(
  "ScheduledMessage",
  scheduledMessageSchema
);

module.exports = ScheduledMessage;
