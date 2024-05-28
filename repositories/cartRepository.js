const CartDAO = require('../dao/cartDAO');

class CartRepository {
  async getCartById(id) {
    const cart = await CartDAO.getCartById(id);
    return cart;
  }

  async createCart(cart) {
    return await CartDAO.createCart(cart);
  }

  async updateCart(id, cart) {
    return await CartDAO.updateCart(id, cart);
  }

  async deleteCart(id) {
    return await CartDAO.deleteCart(id);
  }

  async addProductToCart(cartId, productId, quantity) {
    return await CartDAO.addProductToCart(cartId, productId, quantity);
  }

  async removeProduct(cartId, productId) {
    return await CartDAO.removeProduct(cartId, productId);
  }

  async purchaseCart(cartId) {
    return await CartDAO.purchaseCart(cartId);
  }

  async clearCart(cartId) {
    return await CartDAO.clearCart(cartId);
  }

  async updateProductQuantity(cartId, productId, quantity) {
    return await CartDAO.updateProductQuantity(cartId, productId, quantity);
  }

}

module.exports = CartRepository;