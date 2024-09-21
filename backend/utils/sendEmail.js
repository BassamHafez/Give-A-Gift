const nodemailer = require("nodemailer");

const isDev = process.env.NODE_ENV === "development";

const sendEmail = async (options) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
    ...(isDev && { secure: false, tls: { rejectUnauthorized: false } }),
  });

  const mailOpts = {
    from: "Give A Gift Website",
    to: options.email,
    subject: options.subject,
    text: options.text,
    html: options.html,
  };

  await transporter.sendMail(mailOpts);
};

module.exports = sendEmail;
