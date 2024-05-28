const ProductDAO = require('../dao/productDAO');
const ProductMemoryDAO = require('../dao/memorydao/ProductMemoryDAO');
require('dotenv').config();

const env = process.env.NODE_ENV;

let productFactory;

if(env === 'dev') {
    productFactory = ProductMemoryDAO;
} else {
    productFactory = ProductDAO;
}

module.exports = productFactory;