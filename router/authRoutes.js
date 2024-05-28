const express = require('express');
const router = express.Router();
const passport = require('passport');
const authController = require('../controllers/authController');
const sendMail = require('../config/mailer');
const sendSMS = require('../config/twilio');

// Ruta GET para el formulario de registro
router.get('/register', (req, res) => {
  res.render('register');
});

router.post('/register', async (req, res, next) => {
  console.log('Registro recibido:', req.body); // Agregar console.log aquí

  const { first_name, last_name, email, age, password, phoneNumber } = req.body;
  try {
    const user = await authController.register(req, first_name, last_name, email, age, password, phoneNumber);
    req.login(user, function(err) {
      if (err) {
        return next(err);
      }
      const mailOptions = {
        to: email,
        subject: 'Gracias por registrarte en nuestra página',
        text: 'Hola, gracias por registrarte en nuestra página. ¡Que tengas un buen día!'
      };
      sendMail(mailOptions);
      sendSMS(phoneNumber, 'Gracias por registrarte en nuestra página. ¡Que tengas un buen día!');
      console.log('Usuario registrado:', user);
      return res.redirect('/home'); // Redirigir a home después del registro
    });
  } catch (error) {
    res.redirect('/register');
  }
});

// Ruta GET para el formulario de inicio de sesión
router.get('/login', (req, res) => {
  res.render('login');
});

router.post('/login', passport.authenticate('local', {
  failureRedirect: '/login',
}), (req, res) => {
  console.log('Inicio de sesión recibido:', req.body);
  res.redirect('/home');
});

// Rutas para autenticación de GitHub
router.get('/auth/github', passport.authenticate('github'));
router.get('/auth/github/callback', passport.authenticate('github', { failureRedirect: '/login' }), (req, res) => {
  res.redirect('/home');
});

// Ruta POST para logout
router.post('/logout', (req, res) => {
  console.log('Logout recibido:', req.body);
  req.logout(function(err) {
    if (err) { 
      return next(err); 
    }
    req.session.destroy(() => {
      res.clearCookie('connect.sid');
      res.redirect('/login');
    });
  });
});

// Ruta GET para el perfil del usuario
router.get('/profile', (req, res) => {
  if (!req.user) {
  return res.redirect('/login');
  }
  
  // Crear un DTO del usuario con solo la información necesaria
  const userDto = {
    id: req.user.id,
    first_name: req.user.first_name,
    last_name: req.user.last_name,
    email: req.user.email,
    age: req.user.age,
  };

  res.render('profile', { user: userDto });
});

// Rutas para recuperar y restablecer la contraseña
router.get('/forgot-password', (req, res) => {
  res.render('forgotPassword');
});

router.post('/forgot-password', async (req, res) => {
  console.log('Recuperar contraseña recibido:', req.body);
  const { email } = req.body;
  try {
    await authController.forgotPassword(req, email);
    res.redirect('/login');
  } catch (error) {
    res.redirect('/forgot-password');
  }
});

router.get('/reset-password', (req, res) => {
  const { token } = req.query;
  res.render('resetPassword', { token });
});

router.post('/reset-password', async (req, res) => {
  console.log('Restablecer contraseña recibido:', req.body);
  try {
    await authController.resetPassword(req, res);
  } catch (error) {
    res.redirect('/reset-password');
  }
});

module.exports = router;