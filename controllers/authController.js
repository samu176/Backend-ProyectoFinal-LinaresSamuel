const AuthService = require('../services/authService');
const crypto = require('crypto');
const UserRepository = require('../repositories/userRepository');
const UserDAO = require('../dao/userDAO'); 
const sendMail = require('../config/mailer');
const UserService = require('../services/userService');
const bcrypt = require('bcrypt');

const authService = new AuthService();
const userService = new UserService();

// Función para registrar un usuario
async function register(req, first_name, last_name, email, age, password, phoneNumber) {
  const user = await authService.register(req, first_name, last_name, email, age, password, phoneNumber);

  return user;
}

// Función para iniciar sesión
async function login(req, email, password) {
  const user = await authService.login(req, email, password);

  return user;
}

  // Funciones para recuperar y restablecer la contraseña
  async function forgotPassword(req, email) {
    const user = await userService.getUserByEmail(email);
    if (!user) {
      throw new Error('No existe un usuario con ese mail.');
    }
  
    const token = crypto.randomBytes(20).toString('hex');
  
    const update = {
      resetPasswordToken: token,
      resetPasswordExpires: Date.now() + 3600000, // 1 hora hasta que vence el token
    };
  
    try {
      await UserRepository.updateUser(user.id, update);
    } catch (error) {
      console.log('Error en UserRepository.updateUser: ' + error);
      throw new Error('Hubo un problema al actualizar la información del usuario.');
    }
  
    const mailOptions = {
      to: user.email,
      subject: 'Restablecimiento de contraseña',
      text: 'Estás recibiendo esto porque has solicitado el restablecimiento de la contraseña de tu cuenta.\n\n' +
        'Por favor haz clic en el siguiente enlace para continuar con el proceso de restablecimiento:\n\n' +
        'http://' + req.headers.host + '/reset-password?token=' + token + '\n\n' +
        'Si no solicitaste esto, por favor ignora este correo electrónico y tu contraseña permanecerá sin cambios.\n'
    };

    try {
      await sendMail(mailOptions);
    } catch (error) {
      console.log('Error al enviar el correo de recuperación: ', error);
    }
  }
  
  async function resetPassword(req, res) {
    const { token, password } = req.body;
  
    try {
     // Buscar al usuario con el token
    const user = await UserDAO.findUserByResetToken(token);
    if (!user || Date.now() > user.resetPasswordExpires) {
      return res.render('forgotPassword', { error: 'Tu link de restablecimiento expiró, necesitas generar uno nuevo.' });
    }
  
    // Comprobar si la nueva contraseña es igual a la que tenia
    const isSamePassword = await bcrypt.compare(password, user.password);
    if (isSamePassword) {
      return res.render('resetPassword', { token, error: 'No puedes usar la misma contraseña que ya tenías antes.' });
    }
  
    // Hashear la nueva contraseña
    const hashedPassword = await bcrypt.hash(password, 10);
  
    // Actualizar al usuario con la nueva contraseña
    const update = {
      password: hashedPassword,
      resetPasswordToken: undefined,
      resetPasswordExpires: undefined,
    };
  
    await UserRepository.updateUser(user.id, update);
  
    res.redirect('/login');
  } catch (error) {
    res.status(500).send('Hubo un error al restablecer la contraseña');
  }
}

module.exports = {
  register,
  login,
  forgotPassword,
  resetPassword,
};