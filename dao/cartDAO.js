const Cart = require('../models/cartModel');

class CartDAO {
  async createCart() {
    try {
      const newCart = new Cart();
      return newCart.save();
    } catch (error) {
      throw new Error('Error al crear un carrito');
    }
  }

  async getCartById(cartId) {
    try {
      return Cart.findById(cartId).populate('products.productId');
    } catch (error) {
      throw new Error('Error al obtener el carrito por su ID');
    }
  }

  async addProductToCart(cartId, productId, quantity) {
    try {
      const cart = await Cart.findById(cartId);
      const productIndex = cart.products.findIndex((p) => p.productId.toString() === productId);
      if (productIndex > -1) {
        cart.products[productIndex].quantity += quantity;
      } else {
        cart.products.push({ productId, quantity });
      }
      const updatedCart = await cart.save();
      return updatedCart;
    } catch (error) {
      throw new Error('Error al agregar un producto al carrito');
    }
  }

  async removeProduct(cartId, productId) {
    try {
      const cart = await Cart.findById(cartId);
      cart.products = cart.products.filter((product) => product.productId.toString() !== productId);
      return cart.save();
    } catch (error) {
      throw new Error('Error al eliminar un producto del carrito');
    }
  }

  async updateCart(cartId, products) {
    try {
      const cart = await Cart.findById(cartId);
      cart.products = products;
      return cart.save();
    } catch (error) {
      throw new Error('Error al actualizar el carrito');
    }
  }

  async updateProductQuantity(cartId, productId, quantity) {
    try {
      const cart = await Cart.findById(cartId);
      const productIndex = cart.products.findIndex((p) => p.productId.toString() === productId);
      if (productIndex > -1) {
        cart.products[productIndex].quantity = quantity;
        return cart.save();
      }
    } catch (error) {
      throw new Error('Error al actualizar la cantidad de un producto en el carrito');
    }
  }

  async clearCart(cartId) {
    try {
      const cart = await Cart.findById(cartId);
      cart.products = [];
      return cart.save();
    } catch (error) {
      throw new Error('Error al vaciar el carrito');
    }
  }
}

module.exports = new CartDAO();