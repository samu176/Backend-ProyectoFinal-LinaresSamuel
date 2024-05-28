const UserRepository = require('../repositories/userRepository');
const bcrypt = require('bcrypt');

class UserService {
  constructor() {
    this.userRepository = UserRepository;
  }

  // Método para registrar un usuario
  async registerUser(userData) {

    // Primero, hashear la contraseña del usuario
    const hashedPassword = await bcrypt.hash(userData.password, 10);

    // Despues, crear un nuevo objeto de usuario con la contraseña hasheada
    const newUser = {
      ...userData,
      password: hashedPassword
    };

    // Usar el método createUser de UserRepository para crear el usuario
    // El método también guardará el ID del carrito en la base de datos
    const createdUser = await this.userRepository.createUser(newUser);

    return createdUser;
  }

  // Método para iniciar sesión de un usuario
  async loginUser(email, password) {

    // Usar el método getUserByEmail de UserRepository para obtener el usuario
    const user = await this.userRepository.getUserByEmail(email);
    if (!user) {
      throw new Error('Usuario no encontrado');
    }

    // Verificar si la contraseña es válida
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new Error('Contraseña incorrecta');
    }

    // Si todo está bien, devolver el usuario
    return user;
  }

  // Método para obtener un usuario por su ID
  async getUserById(id) {

    // Usar el método getUserById de UserRepository para obtener el usuario
    const user = await this.userRepository.getUserById(id);
    if (!user) {
      throw new Error('Usuario no encontrado');
    }

    // Si todo está bien, devolver el usuario
    return user;
  }

// Método para obtener un usuario por su ID de GitHub
async findUserByGithubId(githubId) {

  // Usar el método findUserByGithubId de UserRepository para obtener el usuario
  const user = await this.userRepository.findUserByGithubId(githubId);
  if (!user) {
    return null; // Devolvemos null en lugar de lanzar un error
    }

  // Si todo está bien, devolver el usuario
  return user;
}

 // Método para obtener un usuario por su correo electrónico
 async getUserByEmail(email) {

  // Usar el método getUserByEmail de UserRepository para obtener el usuario
  const user = await this.userRepository.getUserByEmail(email);
  if (!user) {
    return null; // Devolvemos null en lugar de lanzar un error
  }

  // Si todo está bien, devolver el usuario
  return user;
}

// Método para cambiar el rol de un usuario
async changeUserRole(userId, newRole) {
  try {
    const user = await this.userRepository.getUserById(userId);
    if (!user) {
      throw new Error('User not found');
    }
    user.role = newRole;
    await user.save();
    return user;
  } catch (error) {
    throw new Error('ChangeUserRoleError: ' + error.message);
  }
}

}

module.exports = UserService;