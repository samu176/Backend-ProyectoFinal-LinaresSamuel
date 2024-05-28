const ProductService = require('../services/productService');

let io; // Declarar 'io'

// función para establecer 'io'
function setIo(socketIo) {
  io = socketIo;
}

// Función para agregar un producto
async function addProduct(productData) {
  try {
    const product = await ProductService.addProduct(productData);
    io.emit('updateProducts', product);
    return { status: 'success', payload: product };
  } catch (error) {
    return { status: 'error', message: error.message };
  }
}

// Función para obtener los productos
async function getProducts(req) {
  try {
    const options = req.query;
    const products = await ProductService.getProducts(options);
    return { status: 'success', payload: products };
  } catch (error) {
    throw new Error(error.message);
  }
}

// Función para obtener un producto por su ID
async function getProductById(req, res) {
  try {
    const productId = req.params.pid;
    const product = await ProductService.getProductById(productId);
    res.json({ status: 'success', payload: product });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
}

// Función para actualizar un producto
async function updateProduct(req, res) {
  try {
    const productId = req.params.pid;
    const newData = req.body;
    const product = await ProductService.updateProduct(productId, newData, req.user.id, req.user.role);
    res.json({ status: 'success', payload: product });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
}

// Función para eliminar un producto
async function deleteProduct(req, res) {
  try {
    const productId = req.params.pid;
    await ProductService.deleteProduct(productId, req.user.id, req.user.role);
    res.json({ status: 'success', message: 'Product deleted' });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
}

module.exports = { setIo, addProduct, getProducts, getProductById, updateProduct, deleteProduct };