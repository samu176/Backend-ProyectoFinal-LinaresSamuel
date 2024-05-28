const twilio = require('twilio');
const config = require('./config');

const client = twilio(config.twilioAccountSid, config.twilioAuthToken);

async function sendSMS(to, body) {
  try {
    await client.messages.create({
      body: body,
      from: config.twilioPhoneNumber,
      to: to
    });
    console.log(`SMS enviado a ${to}`);
  } catch (error) {
    console.log(`Error enviando SMS a ${to}: ${error}`);
  }
}

module.exports = sendSMS;