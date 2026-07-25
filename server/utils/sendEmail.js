const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
  const transporter = nodemailer.createTransport({
    host: process.env.MAILTRAP_HOST, // SMTP host
    port: process.env.MAILTRAP_PORT, // SMTP port
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  const emailOptions = {
    from: `Car-Parts App <${process.env.EMAIL_FROM}>`,
    to: options.to, // Recipient email address
    subject: options.subject, // Email subject
    text: options.text, // Plain text version of the message
    html: options.html, // HTML version of the message
  };

  await transporter.sendMail(emailOptions);
};

module.exports = sendEmail;
