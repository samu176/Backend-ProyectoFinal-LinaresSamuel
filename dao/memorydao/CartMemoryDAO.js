let carts = [];

class CartMemoryDAO {
  async createCart(cart) {
    carts.push(cart);
    return cart;
  }

  async getCartById(id) {
    return carts.find(cart => cart.id === id);
  }

  async updateCart(id, cart) {
    const index = carts.findIndex(cart => cart.id === id);
    if (index > -1) {
      carts[index] = cart;
      return cart;
    }
  }

  async deleteCart(id) {
    carts = carts.filter(cart => cart.id !== id);
  }
}

module.exports = new CartMemoryDAO();