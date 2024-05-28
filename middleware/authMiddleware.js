function ensureAuthenticated(req, res, next) {
  if (req.user) {
    // Verificar si el usuario es administrador o premium para la pagina de productos en tiempo real
    if (req.path === '/realtimeProducts' && !['admin', 'premium'].includes(req.user.role)) {
      return res.redirect('/home'); // redirige a los usuarios que no son rol "admin" o "premium" a la página de inicio
    }

    // Verificar si el usuario es un usuario normal para las rutas de chat y carrito
    if ((req.path.startsWith('/chat') || req.path.startsWith('/cart')) && req.user.role !== 'usuario') {
      return res.redirect('/home'); // redirige a los usuarios que no son rol "usuario" a la página de inicio
    }

    return next();
  } else {
    res.redirect('/login');
  }
}

module.exports = ensureAuthenticated;