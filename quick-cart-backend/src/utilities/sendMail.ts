import nodemailer from "nodemailer";
import { EmailOptions } from "../types/index.js";

const sendMail = async (options: EmailOptions): Promise<void> => {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    service: process.env.SMTP_SERVICE,
    auth: {
      user: process.env.SMTP_MAIL,
      pass: process.env.SMTP_PASSWORD,
    },
  });

  const mailOptions = {
    from: process.env.SMTP_MAIL,
    to: options.email || options.to,
    subject: options.subject,
    html: options.message || options.text,
  };

  await transporter.sendMail(mailOptions);
};

export default sendMail;
