const cron = require("node-cron");
const Card = require("./models/cardModel");
const Config = require("./models/configModel");
const ScheduledMessage = require("./models/scheduledMessageModel");
const {
  sendWhatsappFile,
  sendWhatsappText,
} = require("./utils/sendWhatsappMsg");

const sendScheduledMessages = async () => {
  const messages = await ScheduledMessage.find({
    scheduledAt: { $lte: new Date() },
    sent: false,
  });

  // Send WhatsApp messages in parallel
  await Promise.allSettled(
    messages.map((message) =>
      sendWhatsappFile(message.phone, message.fileUrl, message.caption)
    )
  );

  // Bulk update all messages as sent
  const bulkOps = messages.map((message) => ({
    updateOne: {
      filter: { _id: message._id },
      update: { $set: { sent: true } },
    },
  }));

  if (bulkOps.length > 0) {
    await ScheduledMessage.bulkWrite(bulkOps);
  }
};

const deleteOldMessages = async () => {
  await ScheduledMessage.deleteMany({
    scheduledAt: { $lte: new Date() },
    sent: true,
  });
};

const sendCartReminders = async () => {
  const [reminderMessage, cards] = await Promise.all([
    Config.findOne({ key: "CART_REMINDER_MESSAGE" }).lean(),
    Card.find({
      isPaid: false,
      autoReminderSent: false,
      createdAt: { $lte: new Date(Date.now() - 6 * 60 * 60 * 1000) },
    })
      .populate([{ path: "user", select: "phone" }])
      .lean(),
  ]);

  if (!cards.length) return;

  const message = reminderMessage.value;
  cards.forEach((card) => sendWhatsappText(card.user.phone, message));

  const cardIds = cards.map((card) => card._id);
  await Card.updateMany(
    { _id: { $in: cardIds } },
    { $set: { autoReminderSent: true } }
  );
};

const startCronJobs = () => {
  cron.schedule("*/5 * * * *", sendScheduledMessages); // every 5 minutes
  cron.schedule("0 0 * * 0", deleteOldMessages); // every week
  cron.schedule("0 * * * *", sendCartReminders); // every hour
};

module.exports = startCronJobs;
