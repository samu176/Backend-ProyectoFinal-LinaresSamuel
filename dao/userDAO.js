const User = require('../models/userModel');

class UserDAO {
  async getUserById(id) {
    const user = await User.findById(id);
    return user ? this.toDTO(user) : null;
  }

  async getUserByEmail(email) {
    const user = await User.findOne({ email: email });
    if (!user) {
      return null; // Devuelve null si no se encuentra un usuario
    }
    return this.toDTO(user);
  }

  async createUser(user) {
    user.role = user.role || 'usuario';
    const newUser = new User(user);
      
    const savedUser = await newUser.save();
  
    return this.toDTO(savedUser);
  }

  async updateUser(id, user) {
    try {
      const updatedUser = await User.findByIdAndUpdate(id, user, { new: true });
      return updatedUser ? this.toDTO(updatedUser) : null;
    } catch (error) {
      throw new Error('Error al actualizar el usuario');
    }
  }
  // Encontrar usuario por token de restablecimiento
  async findUserByResetToken(resetToken) {
    const user = await User.findOne({ resetPasswordToken: resetToken, resetPasswordExpires: { $gt: Date.now() } });
    return user ? this.toDTO(user) : null;
  }

  async deleteUser(id) {
    const deletedUser = await User.findByIdAndDelete(id);
    return deletedUser ? this.toDTO(deletedUser) : null;
  }

  async findUserByGithubId(githubId) {
    const user = await User.findOne({ githubId });
    return user ? this.toDTO(user) : null;
  }

  async findUser(email) {
    const user = await User.findOne({ email });
    return user ? this.toDTO(user) : null;
  }

  toDTO(user) {
    return {
      id: user._id,
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
      age: user.age,
      role: user.role,
      password: user.password,
      cart: user.cart, // modelo de usuario tiene un campo para almacenar cartid
      resetPasswordToken: user.resetPasswordToken,
      resetPasswordExpires: user.resetPasswordExpires
    };
  }
}

module.exports = new UserDAO();