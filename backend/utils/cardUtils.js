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

exports.createCardWhatsappMessage = (card, user) => {
  return {
    phone: card.recipient.whatsappNumber,
    caption: `You have received a gift card from ${user.name}. Click here to view: ${process.env.CARD_PREVIEW_URL}/${card.id}`,
    fileUrl:
      "https://nypost.com/wp-content/uploads/sites/2/2023/11/gift-card.jpg",
    scheduledAt: card.receiveAt ? new Date(card.receiveAt) : new Date(),
  };
};

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
