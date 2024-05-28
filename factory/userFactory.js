const UserDAO = require('../dao/userDAO');
const UserMemoryDAO = require('../dao/memorydao/UserMemoryDAO');
require('dotenv').config();

const env = process.env.NODE_ENV;

let userFactory;

if(env === 'dev') {
    userFactory = UserMemoryDAO;
} else {
    userFactory = UserDAO;
}

module.exports = userFactory;