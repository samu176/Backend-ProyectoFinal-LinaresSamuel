const UserRepository = require('../repositories/userRepository');
const UserService = require('../services/userService');
const userService = new UserService(); // <-- Añadido

async function createUser(first_name, last_name, email, age, password, githubId = null, cartId = null) {
  // Agrega un campo de cart al objeto del usuario si se proporciona cartId
  const user = {
    first_name,
    last_name,
    email,
    age,
    password,
    githubId,
    role: 'usuario',
    cart: cartId
  };
  return UserRepository.createUser(user);
}

async function findUser(email) {
  return UserRepository.findUser(email);
}

async function findUserById(id) {
  return UserRepository.getUserById(id);
}

async function findUserByGithubId(githubId) {
  return UserRepository.findUserByGithubId(githubId);
}

// Función para cambiar el rol de un usuario
async function changeUserRole(req, res) {
  try {
    const userId = req.params.uid;
    const newRole = req.body.role;
    const user = await userService.changeUserRole(userId, newRole);
    res.json({ status: 'success', payload: user });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
}

// Función para obtener todos los usuarios
async function getAllUsers(req, res) {
  try {
    // Usamos la instancia de UserService que creamos
    const users = await userService.getAllUsers(); // <-- Modificado
    res.render('users', { users });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
}

// Función para eliminar un usuario
async function deleteUser(req, res) {
  try {
    await userService.deleteUser(req.params.id);
    res.redirect('/users');
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  createUser,
  findUser,
  findUserById,
  findUserByGithubId,
  changeUserRole,
  getAllUsers,
  deleteUser,
};
