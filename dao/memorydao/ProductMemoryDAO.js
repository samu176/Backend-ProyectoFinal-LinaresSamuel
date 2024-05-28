const generateProducts = require('../../utils/mocking');

let products = generateProducts();

class ProductMemoryDAO {
  async getProducts() {
    return products;
  }

  async createProduct(product) {
    products.push(product);
    return product;
  }

  async getProductById(id) {
    return products.find(product => product.id === id);
  }

  async updateProduct(id, product) {
    const index = products.findIndex(product => product.id === id);
    if (index > -1) {
      products[index] = product;
      return product;
    }
  }

  async deleteProduct(id) {
    products = products.filter(product => product.id !== id);
  }
}

module.exports = new ProductMemoryDAO();