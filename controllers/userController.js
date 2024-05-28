const UserRepository = require('../repositories/userRepository');
const UserService = require('../services/userService');

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
    const user = await UserService.changeUserRole(userId, newRole);
    res.json({ status: 'success', payload: user });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
}

module.exports = {
  createUser,
  findUser,
  findUserById,
  findUserByGithubId,
  changeUserRole,
};
