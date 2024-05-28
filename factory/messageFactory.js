const MessageDAO = require('../dao/messageDAO');
const MessageMemoryDAO = require('../dao/memorydao/MessageMemoryDAO');
require('dotenv').config();

const env = process.env.NODE_ENV;

let messageFactory;

if(env === 'dev') {
    messageFactory = MessageMemoryDAO;
} else {
    messageFactory = MessageDAO;
}

module.exports = messageFactory;