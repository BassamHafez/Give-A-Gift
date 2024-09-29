const Config = require("../models/configModel");
const axios = require("axios");
const catchAsync = require("../utils/catchAsync");

const token = process.env.MYFATOORAH_API_KEY;
const baseURL = process.env.MYFATOORAH_API_URL;

exports.getPaymentMethods = catchAsync(async (req, res, next) => {
  const data = [
    {
      PaymentMethodId: 2,
      PaymentMethodAr: "فيزا / ماستر",
      PaymentMethodEn: "VISA/MASTER",
      ImageUrl: "https://sa.myfatoorah.com/imgs/payment-methods/vm.png",
    },
    {
      PaymentMethodId: 6,
      PaymentMethodAr: "مدى",
      PaymentMethodEn: "mada",
      ImageUrl: "https://sa.myfatoorah.com/imgs/payment-methods/md.png",
    },
    {
      PaymentMethodId: 11,
      PaymentMethodAr: "أبل باي",
      PaymentMethodEn: "Apple Pay",
      ImageUrl: "https://sa.myfatoorah.com/imgs/payment-methods/ap.png",
    },
  ];

  res.status(200).json({
    status: "success",
    data,
  });
});

exports.executePayment = catchAsync(async (req, res, next) => {
  const { PaymentMethodId, InvoiceValue, cardId } = req.body;

  const response = await axios.post(
    `${baseURL}/v2/ExecutePayment`,
    {
      PaymentMethodId,
      CustomerName: req.user.name,
      DisplayCurrencyIso: "SAR",
      CustomerEmail: req.user.email,
      InvoiceValue,
      UserDefinedField: cardId,
    },
    {
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  );

  res.status(200).json({
    status: "success",
    data: response.data,
  });
});

exports.verifyPayment = catchAsync(async (req, res, next) => {
  const { PaymentId } = req.body;

  const response = await axios.post(
    `${baseURL}/v2/GetPaymentStatus`,
    {
      Key: PaymentId,
      KeyType: "PaymentId",
    },
    {
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  );

  if (response.data.Data.PaymentStatus === "Paid") {
    console.log("Payment is successful");
  } else {
    console.log("Payment failed");
  }

  res.status(200).json({
    status: "success",
    data: response.data,
  });
});

/*
exports.initiatePayment = catchAsync(async (req, res, next) => {
  const { InvoiceAmount } = req.body;

  const response = await axios.post(
    `${baseURL}/v2/InitiatePayment`,
    {
      InvoiceAmount,
      CurrencyIso: "SAR",
    },
    {
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  );

  res.status(200).json({
    status: "success",
    data: response.data,
  });
});

exports.payInvoice = catchAsync(async (req, res, next) => {
  const { paymentURL } = req.body;

  const response = await axios.post(
    // `${baseURL}/v2/DirectPayment/${invoiceKey}/${paymentGatewayId}`
    // `${baseURL}/v2/DirectPayment/06081113863323361171-601e1f8a/35`,
    paymentURL,
    {
      paymentType: "card",
      card: {
        // Number: "5123450000000008",
        Number: "5454545454545454",
        expiryMonth: "05",
        // expiryYear: "21",
        expiryYear: "25",
        securityCode: "100",
      },
      saveToken: false,
    },
    {
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  );

  res.status(200).json({
    status: "success",
    data: response.data,
  });
});

exports.sendPayment = catchAsync(async (req, res, next) => {
  const { InvoiceValue } = req.body;

  const response = await axios.post(
    `${baseURL}/v2/SendPayment`,
    {
      InvoiceValue,
      DisplayCurrencyIso: "SAR",
      CustomerName: req.user.name,
      CustomerEmail: req.user.email,
      // NotificationOption: "EML",
      NotificationOption: "LNK",
      CallBackUrl: "https://example.com/success",
      ErrorUrl: "https://example.com/error",
    },
    {
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  );

  res.status(200).json({
    status: "success",
    data: response.data,
  });
});

exports.initiateSession = catchAsync(async (req, res, next) => {
  const response = await axios.post(
    `${baseURL}/v2/InitiateSession`,
    {
      CustomerIdentifier: req.user.email,
      // SaveToken: false,
      // IsRecurring: false,
    },
    {
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  );

  res.status(200).json({
    status: "success",
    data: response.data,
  });
});
*/
