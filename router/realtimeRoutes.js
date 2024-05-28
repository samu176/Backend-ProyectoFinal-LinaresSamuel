const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const ensureAuthenticated = require('../middleware/authMiddleware');

router.get('/realtimeProducts', ensureAuthenticated, async (req, res) => {
  try {
    if (req.user && ['admin', 'premium'].includes(req.user.role)) { // Permitir el acceso a los usuarios con rol 'admin' y 'premium'
      const result = await productController.getProducts(req);
      res.render('realtimeProducts', { 
        user: req.user, 
        products: result.payload, 
      });
    } else {
      res.status(403).send('Acceso denegado');
    }
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

module.exports = router;