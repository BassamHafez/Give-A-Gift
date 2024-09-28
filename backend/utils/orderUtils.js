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
