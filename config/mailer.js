const nodemailer = require('nodemailer');
const config = require('./config');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: config.sendMessageEmail,
    pass: config.sendMessageEmailPassword
  }
});

async function sendMail(mailOptions) {
  mailOptions.from = config.sendMessageEmail;

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Email enviado a ${mailOptions.to}`);
  } catch (error) {
    console.log(`Error enviando email a ${mailOptions.to}: ${error}`);
  }
}

module.exports = sendMail;