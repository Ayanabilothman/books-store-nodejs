import nodemailer from "nodemailer";
import dotenv from "dotenv";
import { HTML } from "./emailtemplate.js";
dotenv.config();

export const sendEmail = async ({
  to = "",
  subject = "",
  activationCode,
  attachments = [],
} = {}) => {
  const transporter = nodemailer.createTransport({
    service: "outlook",
    auth: {
      user: process.env.EMAIL,
      pass: process.env.PASSWORD,
    },
  });

  // send mail with defined transport object
  const info = await transporter.sendMail({
    from: `"Route 👻" <${process.env.EMAIL}>`,
    to,
    subject,
    html: HTML(activationCode),
  });

  return info.accepted.length ? true : false;
};
