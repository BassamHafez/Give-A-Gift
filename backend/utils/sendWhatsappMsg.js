const axios = require("axios");

const sendWhatsappText = async (phone, message) => {
  try {
    const response = await axios({
      method: "GET",
      url: "https://api.4whats.net/sendMessage",
      params: {
        instanceid: process.env.WHATS4_INSTANCE_ID,
        token: process.env.WHATS4_TOKEN,
        phone,
        body: message,
      },
    });

    console.log("Message sent:", response.data);
  } catch (error) {
    console.error(
      "Error sending message:",
      error.response ? error.response.data : error.message
    );
  }
};

const sendWhatsappFile = async (phone, fileUrl, caption) => {
  try {
    const response = await axios({
      method: "GET",
      url: "https://api.4whats.net/sendFile",
      params: {
        instanceid: process.env.WHATS4_INSTANCE_ID,
        token: process.env.WHATS4_TOKEN,
        phone,
        body: fileUrl,
        caption,
      },
    });

    console.log("File sent:", response.data);
  } catch (error) {
    console.error(
      "Error sending file:",
      error.response ? error.response.data : error.message
    );
  }
};

module.exports = { sendWhatsappText, sendWhatsappFile };
