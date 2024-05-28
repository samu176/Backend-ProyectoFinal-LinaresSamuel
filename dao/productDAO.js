const Product = require('../models/productModel');

class ProductDAO {
  async getProductById(id) {
    try {
      const product = await Product.findById(id);
      // Si el producto existe, lo convierte a DTO, de lo contrario devuelve null
      return product ? this.toDTO(product) : null;
    } catch (error) {
      throw new Error('Error al obtener un producto por su ID');
    }
  }

  async createProduct(product) {
    try {
      const newProduct = new Product(product);
      const savedProduct = await newProduct.save();
      // Convierte el producto guardado a DTO antes de devolverlo
      return this.toDTO(savedProduct);
    } catch (error) {
      throw new Error('Error al crear un producto');
    }
  }

  async updateProduct(id, product) {
    try {
      const updatedProduct = await Product.findByIdAndUpdate(id, product, { new: true });
      // Si el producto se actualizó correctamente, lo convierte a DTO, de lo contrario devuelve null
      return updatedProduct ? this.toDTO(updatedProduct) : null;
    } catch (error) {
      throw new Error('Error al actualizar un producto');
    }
  }

  async deleteProduct(id) {
    try {
      const deletedProduct = await Product.findByIdAndDelete(id);
      // Si el producto se eliminó correctamente, lo convierte a DTO, de lo contrario devuelve null
      return deletedProduct ? this.toDTO(deletedProduct) : null;
    } catch (error) {
      throw new Error('Error al eliminar un producto');
    }
  }

  async getProducts(options = {}) {
    try {
      const { limit, page, sort, query } = options;
      const filter = query ? { category: query } : {};
      const sortOptions = sort ? { price: sort === 'asc' ? 1 : -1 } : {};

      if (limit && page) {
        const result = await Product.paginate(filter, {
          limit,
          page,
          sort: sortOptions,
          lean: true, 
        });

        // Verificar si los productos son 'undefined'
        if (!result) {
          throw new Error('No se pudieron obtener los productos');
        }

        return {
          ...result,
          payload: result.docs.map(doc => this.toDTO(doc))
        };
      } else {
        const result = await Product.find(filter).sort(sortOptions).lean();

        // Verificar si los productos son 'undefined'
        if (!result) {
          throw new Error('No se pudieron obtener los productos');
        }

        return result.map(doc => this.toDTO(doc));
      }
    } catch (error) {
      throw new Error('Error al obtener los productos');
    }
  }

  async addProduct(productData) {
    try {
      const newProduct = new Product(productData);
      const savedProduct = await newProduct.save();
      // Convierte el producto guardado a DTO antes de devolverlo
      return this.toDTO(savedProduct);
    } catch (error) {
      throw new Error('Error al agregar un producto');
    }
  }

  // Convierte un producto a DTO (Data Transfer Object)
  toDTO(product) {
    return {
      id: product._id,
      title: product.title,
      description: product.description,
      price: product.price,
      thumbnails: product.thumbnails,
      code: product.code,
      stock: product.stock,
      category: product.category,
      owner: product.owner,
    };
  }
}

module.exports = new ProductDAO();