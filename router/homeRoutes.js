const express = require('express');
const productController = require('../controllers/productController');
const router = express.Router();
const ensureAuthenticated = require('../middleware/authMiddleware');

// Ruta para obtener todos los productos con paginación, filtros y ordenamiento
router.get('/', async (req, res) => {
  try {
    const { limit = 10, page = 1, sort, query } = req.query;
    const options = { limit: parseInt(limit), page: parseInt(page), sort, query };
    const result = await productController.getProducts(req);

    if (!result) {
      throw new Error('No se pudo obtener los productos');
    }

    const { payload, totalPages, prevPage, nextPage, page: currentPage, hasPrevPage, hasNextPage } = result;

    const prevLink = hasPrevPage ? `/home?page=${prevPage}` : null;
    const nextLink = hasNextPage ? `/home?page=${nextPage}` : null;

    // El cartId se obtiene de req.user.cart
    const cartId = req.user.cart;

    res.render('home', { 
      user: req.user, 
      cartId, // Pasar el cartId a la vista
      products: payload, 
      totalPages, 
      prevPage, 
      nextPage, 
      currentPage, 
      hasPrevPage, 
      hasNextPage, 
      prevLink, 
      nextLink
    });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

// Ruta para la vista de productos
router.get('/products', async (req, res) => {
  try {
    const filter = req.query.filter || {};
    const limit = parseInt(req.query.limit) || 10;
    const page = parseInt(req.query.page) || 1;
    const options = {
      filter,
      limit,
      page
    };

    const productsData = await productController.getProducts(req);

    // Agrega los datos del usuario a los datos que se pasan a la vista
    res.render('home', { products: productsData.payload, user: req.user });
  } catch (error) {
    res.status(500).send("Error interno del servidor");
  }
});

module.exports = router;