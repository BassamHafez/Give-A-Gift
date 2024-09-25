const cron = require("node-cron");
const ScheduledMessage = require("./models/scheduledMessageModel");
const { sendWhatsappFile } = require("./utils/sendWhatsappMsg");

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

const startCronJobs = () => {
  cron.schedule("*/5 * * * *", sendScheduledMessages); // every 5 minutes
  cron.schedule("0 0 * * 0", deleteOldMessages); // every week
};

module.exports = startCronJobs;
