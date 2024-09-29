const Config = require("../models/configModel");

exports.calculateTotalCardPrice = (
  card,
  iconPrice,
  linkPrice,
  VAT,
  repeat = true
) => {
  if (repeat && card.priceAfterDiscount >= 0) return card.priceAfterDiscount;
  let cardPrice = card.price.value;

  card.shapes.forEach((shape) => {
    cardPrice += parseFloat(shape.shape.price);
  });
  if (card.proColor) cardPrice += parseFloat(card.proColor.price);
  if (card.celebrateIcon) cardPrice += parseFloat(iconPrice);
  if (card.celebrateQR) cardPrice += parseFloat(linkPrice);
  return cardPrice + cardPrice * (parseFloat(VAT.value) / 100);
};

exports.createCardWhatsappMessage = async (card, user) => {
  try {
    const cardMsg = await Config.findOne({ key: "WHATSAPP_CARD_MESSAGE" });

    caption = cardMsg.value
      .replace("[USER_NAME]", user.name)
      .replace("[CARD_LINK]", `${process.env.CARD_PREVIEW_URL}/${card.id}`);

    return {
      phone: card.recipient.whatsappNumber,
      caption,
      fileUrl:
        "https://nypost.com/wp-content/uploads/sites/2/2023/11/gift-card.jpg",
      scheduledAt: card.receiveAt ? new Date(card.receiveAt) : new Date(),
    };
  } catch (error) {
    console.log(error);
  }
};
