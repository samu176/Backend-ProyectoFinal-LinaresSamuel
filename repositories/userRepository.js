const UserDAO = require('../dao/userDAO');

class UserRepository {
  // Método para obtener un usuario por su ID
  async getUserById(id) {
    // Se usa el método getUserById del DAO para obtener el usuario
    const user = await UserDAO.getUserById(id);
    return user;
  }

  // Método para obtener un usuario por su email
  async getUserByEmail(email) {
    // Se usa el método getUserByEmail del DAO para obtener el usuario
    const user = await UserDAO.getUserByEmail(email);
    return user;
  }

  // Método para crear un usuario
  async createUser(user) {
    // Si no se especifica un rol, se asigna 'usuario' por defecto
    user.role = user.role || 'usuario';
    // Se usa el método createUser del DAO para crear el usuario
    const createdUser = await UserDAO.createUser(user);
    return createdUser;
  }

  // Método para actualizar un usuario
  async updateUser(id, user) {
    // Se usa el método updateUser del DAO para actualizar el usuario
    const updatedUser = await UserDAO.updateUser(id, user);
    return updatedUser;
  }

  // Método para eliminar un usuario
  async deleteUser(id) {
    // Se usa el método deleteUser del DAO para eliminar el usuario
    await UserDAO.deleteUser(id);
  }

  // Método para encontrar un usuario por su ID de Github
  async findUserByGithubId(githubId) {
    // Se usa el método findUserByGithubId del DAO para encontrar el usuario
    const user = await UserDAO.findUserByGithubId(githubId);
    return user;
  }

  // Método para encontrar un usuario por su email
  async findUser(email) {
    // Se usa el método findUser del DAO para encontrar el usuario
    const user = await UserDAO.findUser(email);
    return user;
  }
}

module.exports = new UserRepository();