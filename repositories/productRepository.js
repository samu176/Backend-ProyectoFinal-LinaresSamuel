const productFactory = require('../factory/productFactory');

class ProductRepository {
  async getProductById(id) {
    const product = await productFactory.getProductById(id);
    return product;
  }

  async createProduct(product) {
    const createdProduct = await productFactory.createProduct(product);
    return createdProduct;
  }

  async updateProduct(id, product) {
    const updatedProduct = await productFactory.updateProduct(id, product);
    return updatedProduct;
  }

  async deleteProduct(id) {
    const deletedProduct = await productFactory.deleteProduct(id);
    return deletedProduct;
  }

  async getProducts(options = {}) {
    const products = await productFactory.getProducts(options);
    return products;
  }

  async addProduct(productData) {
    const addedProduct = await productFactory.addProduct(productData);
    return addedProduct;
  }
}

module.exports = new ProductRepository();