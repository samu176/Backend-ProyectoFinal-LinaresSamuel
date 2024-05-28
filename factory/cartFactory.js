const CartDAO = require('../dao/cartDAO');
const CartMemoryDAO = require('../dao/memorydao/CartMemoryDAO');
require('dotenv').config();

const env = process.env.NODE_ENV;

let cartFactory;

if(env === 'dev') {
    cartFactory = CartMemoryDAO;
} else {
    cartFactory = CartDAO;
}

module.exports = cartFactory;