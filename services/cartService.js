const CartRepository = require('../repositories/cartRepository');

class CartService {
  constructor() {
    this.cartRepository = new CartRepository();
  }

  async createCart() {
    return this.cartRepository.createCart();
  }

  async getCartById(cartId) {
    return this.cartRepository.getCartById(cartId);
  }

async addProductToCart(cartId, productId, quantity) {
    try {
      return await this.cartRepository.addProductToCart(cartId, productId, quantity);
    } catch (error) {
      console.error(`Error in CartService.addProductToCart: ${error}`);
      throw error; // pasa el error al middleware de manejo de errores
    }
  }

  async removeProduct(cartId, productId) {
    return this.cartRepository.removeProduct(cartId, productId);
  }

  async updateCart(cartId, products) {
    return this.cartRepository.updateCart(cartId, products);
  }

  async purchaseCart(cartId) {
    return this.cartRepository.purchaseCart(cartId);
  }

  async clearCart(cartId) {
    return this.cartRepository.clearCart(cartId);
  }

  async updateProductQuantity(cartId, productId, quantity) {
    return this.cartRepository.updateProductQuantity(cartId, productId, quantity);
  }
}

module.exports = new CartService();