const bcrypt = require('bcrypt');
const UserService = require('../services/userService');
const CartRepository = require('../repositories/cartRepository');

// Cantidad de rondas para el algoritmo de hashing
const saltRounds = 10;

class AuthService {
  constructor() {
    this.userService = new UserService();
    this.cartRepository = new CartRepository();
  }

  // Método para registrar un usuario
  async register(req, first_name, last_name, email, age, password, phoneNumber, githubId) {

    // Comprueba si ya existe un usuario con este correo electrónico
    const existingUser = await this.userService.getUserByEmail(email);
    if (existingUser) {
      throw new Error('User already exists');
    }

  // Crear un carrito para el usuario
  const newCart = await this.cartRepository.createCart();

  // Crear el usuario y asociar el carrito creado con el usuario
  const user = await this.userService.registerUser({
    githubId,
    first_name,
    last_name,
    email,
    phoneNumber,
    age,
    password,
    cart: newCart._id
  });


  // Almacenar el ID del carrito en la sesión del usuario 
  req.session.cart = newCart._id;

  return user;
}

  // Método para verificar las credenciales de un usuario
  async verifyCredentials(email, password) {

    // Buscar el usuario en la base de datos
    const user = await this.userService.loginUser(email, password);
    if (!user) {
      
      throw new Error('User not found');
    }

    // Comparar la contraseña proporcionada con la contraseña hasheada almacenada en la base de datos
    let match;
    try {
      match = await bcrypt.compare(password, user.password);
    } catch (err) {
      throw err;
    }
    if (!match) {
      throw new Error('Invalid password');
    }

    // Si las credenciales son correctas, se devuelve el usuario
    return user;
  }

  // Método para iniciar sesión
  async login(req, email, password) {

    // Verificar las credenciales del usuario
    const user = await this.verifyCredentials(email, password);

    // Si el usuario existe y las credenciales son correctas
    if (user) {
      // Verificar que el usuario tenga un cart antes de intentar reasignarlo
      if (user.cart) {
        // Reasignar el cart del usuario a la sesión
        req.session.cart = user.cart;
      }

      return user;
    }
    return null;
  }

  // Método para obtener un usuario por su ID
  async getUserById(id) {

    // Usar el método getUserById de UserService para obtener el usuario
    const user = await this.userService.getUserById(id);
    if (!user) {
      throw new Error('User not found');
    }

    // Si todo está bien, devolver el usuario
    return user;
  }

  // Método para obtener un usuario por su ID de GitHub
  async findUserByGithubId(githubId) {

    // Usar el método findUserByGithubId de UserService para obtener el usuario
    const user = await this.userService.findUserByGithubId(githubId);
    if (!user) {
      return null; // Devolver null en lugar de lanzar un error
    }

    // Si todo está bien, devolver el usuario
    return user;
  }
}

module.exports = AuthService;