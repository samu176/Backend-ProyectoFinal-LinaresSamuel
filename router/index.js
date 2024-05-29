// Rutas para el home, la API, los carritos, los mensajes, la autenticación y los productos en tiempo real
const homeRoutes = require('./homeRoutes');
const apiRoutes = require('./apiRoutes');
const cartRoutes = require('./cartRoutes');
const messageRoutes = require('./messageRoutes');
const authRoutes = require('./authRoutes');
const realtimeRoutes = require('./realtimeRoutes');
const ensureAuthenticated = require('../middleware/authMiddleware');

module.exports = function(app) {
  app.use('/home', ensureAuthenticated, homeRoutes);
  app.use('/api', ensureAuthenticated, apiRoutes);
  app.use('/cart', ensureAuthenticated, cartRoutes);
  app.use('/messages', messageRoutes);
  app.use('/', authRoutes);
  app.use('/realtime', realtimeRoutes);

  // Redirección de la ruta raíz a /home
  app.get('/', (req, res) => {
    res.redirect('/home');
  });
};