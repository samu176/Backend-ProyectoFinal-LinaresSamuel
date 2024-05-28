const express = require('express');
const cartController = require('../controllers/cartController');
const productService = require('../services/productService');
const Ticket = require('../models/ticketModel');
const router = express.Router();

// Crear un nuevo carrito
router.post('/', async (req, res) => {
  try {
    const newCart = await cartController.createCart();
    res.json(newCart);
  } catch (error) {
    res.status(500).json({ error: 'Error creando el carrito' });
  }
});

// Obtener el carrito del usuario en sesión
router.get('/', async (req, res) => {
  const cartId = req.user.cart;
  if (!cartId) {
    return res.status(404).json({ error: 'Carrito no encontrado. El usuario no tiene un carrito asociado.' });
  }

  try {
    const cart = await cartController.getCartById(cartId);
    res.render('carts', { cart });
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener el carrito.' });
  }
});

// Agregar un producto al carrito
router.post('/product/:pid', async (req, res) => {
  const productId = req.params.pid;
  const quantity = Number(req.body.quantity) || 1;

  const cartId = req.user.cart;

  if (!cartId) {
    return res.status(404).json({ error: 'Carrito no encontrado.' });
  }

  try {
    const result = await cartController.addProductToCart(cartId, productId, quantity);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: 'Error agregando producto al carrito' });
  }
});

// Eliminar un producto del carrito
router.delete('/:cid/products/:pid', async (req, res) => {
  const { cid, pid } = req.params;
  try {
    const result = await cartController.removeProduct(cid, pid);
    res.send(result);
  } catch (error) {
    res.status(500).send({ error: 'Error al eliminar producto del carrito' });
  }
});

// Actualizar un carrito
router.put('/:cid', async (req, res) => {
  const { cid } = req.params;
  const products = req.body;
  try {
    const result = await cartController.updateCart(cid, products);
    res.send(result);
  } catch (error) {
    res.status(500).send({ error: 'Error al actualizar el carrito' });
  }
});

// Eliminar un carrito
router.delete('/:cid', async (req, res) => {
  const { cid } = req.params;
  try {
    const result = await cartController.clearCart(cid);
    res.send({ message: 'Carrito eliminado con éxito', data: result });
  } catch (error) {
    res.status(500).send({ error: 'Error al eliminar el carrito' });
  }
});

// Actualizar la cantidad de un producto específico en el carrito
router.put('/:cid/products/:pid', async (req, res) => {
  const { cid, pid } = req.params;
  const { quantity } = req.body;
  try {
    const result = await cartController.updateProductQuantity(cid, pid, quantity);
    res.send(result);
  } catch (error) {
    res.status(500).send({ error: 'Error al actualizar cantidad del producto en el carrito' });
  }
});

// Finalizar la compra del carrito
router.post('/:cid/purchase', async (req, res) => {
  const cartId = req.params.cid;
  try {
    const ticketId = await cartController.finalizePurchase(cartId, req.user.id);
    res.redirect(`/cart/${cartId}/ticket/${ticketId}`);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Ruta para ver el ticket de compra
router.get('/:cid/ticket/:tid', async (req, res) => {
  const ticketId = req.params.tid;
  try {
    const ticket = await Ticket.findById(ticketId);
    res.render('ticket', { ticket });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;