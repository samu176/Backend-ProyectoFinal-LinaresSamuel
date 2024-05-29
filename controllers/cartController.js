const CartService = require('../services/cartService');
const ProductService = require('../services/productService');
const Ticket = require('../models/ticketModel');
const productController = require('./productController');
const User = require('../models/userModel');

// Crear un nuevo carrito
const createCart = async () => {
  try {
    const cart = await CartService.createCart();
    return cart;
  } catch (error) {
    throw new Error('Error al crear un carrito'); 
  }
};

// Obtener un carrito por su ID
const getCartById = async (cartId) => {
  try {
    const cart = await CartService.getCartById(cartId);
    return cart;
  } catch (error) {
    throw new Error('Error al obtener el carrito por su ID');
  }
};

// Agregar un producto al carrito
const addProductToCart = async (cartId, productId, quantity) => {
  try {
    const result = await CartService.addProductToCart(cartId, productId, quantity);
    return result;
  } catch (error) {
    throw new Error('Error al agregar un producto al carrito');
  }
};

// Remover un producto del carrito
const removeProduct = async (cartId, productId) => {
  try {
    const result = await CartService.removeProduct(cartId, productId);
    return result;
  } catch (error) {
    throw new Error('Error al eliminar un producto del carrito');
  }
};

// Actualizar el carrito
const updateCart = async (cartId, products) => {
  try {
    const result = await CartService.updateCart(cartId, products);
    return result;
  } catch (error) {
    throw new Error('Error al actualizar el carrito');
  }
};

// Actualizar la cantidad de un producto en el carrito
const updateProductQuantity = async (cartId, productId, quantity) => {
  try {
    const result = await CartService.updateProductQuantity(cartId, productId, quantity);
    return result;
  } catch (error) {
    throw new Error('Error al actualizar la cantidad de un producto en el carrito');
  }
};

// Limpiar el carrito
const clearCart = async (cartId) => {
  try {
    const result = await CartService.clearCart(cartId);
    return result;
  } catch (error) {
    throw new Error('Error al vaciar el carrito');
  }
};

// Finalizar la compra del carrito
const finalizePurchase = async (cartId, userId) => {
  try {
    const cart = await CartService.getCartById(cartId);
    if (!cart) {
      console.log(`No se encontró el carrito con el ID: ${cartId}`);
      throw new Error('Carrito no encontrado');
    }
    const ticketProducts = [];
    let totalAmount = 0;
    let remainingProducts = [];
    for (const product of cart.products) {
      const dbProduct = await ProductService.getProductById(product.productId);
      if (!dbProduct) {
        console.log(`No se encontró el producto con el ID: ${product.productId}`);
        continue;
      }
      if (dbProduct.stock < product.quantity) {
        console.log(`No hay suficiente stock del producto con el ID: ${product.productId}`);
        remainingProducts.push(product);
        continue;
      }
      await ProductService.updateStock(dbProduct.id, dbProduct.stock - product.quantity);
      ticketProducts.push({
        product: dbProduct.id,
        quantity: product.quantity,
      });
      totalAmount += dbProduct.price * product.quantity;
    }
     // Obtiene el usuario de la base de datos
     const user = await User.findById(userId);
     if (!user) {
       throw new Error('Usuario no encontrado');
     }
    const ticket = new Ticket({
      purchaser: user.email,
      amount: totalAmount,
    });
    await ticket.save();
    await updateCart(cartId, remainingProducts);
    return ticket._id; // Devuelve el ID del ticket
  } catch (error) {
    console.error(`Error al obtener el carrito: ${error}`);
    throw new Error('Error finalizando la compra');
  }
};

module.exports = { createCart, getCartById, addProductToCart, removeProduct, updateCart, updateProductQuantity, clearCart, finalizePurchase };