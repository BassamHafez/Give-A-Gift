exports.calculateTotalCardPrice = (card, iconPrice, linkPrice, VAT) => {
  // let cardPrice =
  //   card.priceAfterDiscount >= 0 ? card.priceAfterDiscount : card.price.value;
  if (card.priceAfterDiscount >= 0) return card.priceAfterDiscount;
  let cardPrice = card.price.value;

  if (card.shape) cardPrice += parseFloat(card.shape.price);
  if (card.proColor) cardPrice += parseFloat(card.proColor.price);
  if (card.celebrateIcon) cardPrice += parseFloat(iconPrice);
  if (card.celebrateQR) cardPrice += parseFloat(linkPrice);
  return cardPrice + cardPrice * (parseFloat(VAT.value) / 100);
};

exports.createWhatsAppMessage = (card, user) => {
  return {
    phone: card.recipient.whatsappNumber,
    caption: `You have received a gift card from ${user.name}. Click here to view: https://example.com/cards/preview/${card.id}`,
    fileUrl:
      "https://nypost.com/wp-content/uploads/sites/2/2023/11/gift-card.jpg",
    scheduledAt: new Date(card.receiveAt),
  };
};

exports.createOrderData = (
  card,
  user,
  totalAmount,
  VAT,
  iconPrice,
  linkPrice
) => {
  return {
    card_id: card.id,
    customer_id: user.id,
    customer_name: user.name,
    customer_email: user.email,
    customer_phone: user.phone,
    value: card.price.value,
    price_after_discount: card.priceAfterDiscount,
    shape_price: card.shape ? parseFloat(card.shape.price) : 0,
    color_price: card.proColor ? parseFloat(card.proColor.price) : 0,
    celebrate_icon_price: card.celebrateIcon ? +iconPrice : 0,
    celebrate_qr_link_price: card.celebrateQR ? +linkPrice : 0,
    VAT: `${VAT}%`,
    total_paid: totalAmount,
    shop: card.shop.name,
    order_date: card.receiveAt,
    recipient_name: card.recipient.name,
    recipient_whatsapp: card.recipient.whatsappNumber,
  };
};
