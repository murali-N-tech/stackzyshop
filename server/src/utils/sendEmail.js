import nodemailer from 'nodemailer';
import 'dotenv/config';

const sendEmail = async (options) => {
  // 1. Create a transporter object using SMTP transport
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  // 2. Define the email options
  const mailOptions = {
    from: 'ShopSphere <noreply@shopsphere.com>',
    to: options.to,
    subject: options.subject,
    html: options.html,
    // We can also add a plain text version for email clients that don't support HTML
    text: options.text,
  };

  // 3. Actually send the email
  await transporter.sendMail(mailOptions);
};

export default sendEmail;