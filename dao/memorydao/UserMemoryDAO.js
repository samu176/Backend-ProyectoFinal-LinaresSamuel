let users = [];

class UserMemoryDAO {
  async createUser(user) {
    users.push(user);
    return user;
  }

  async getUserById(id) {
    return users.find(user => user.id === id);
  }

  async updateUser(id, user) {
    const index = users.findIndex(user => user.id === id);
    if (index > -1) {
      users[index] = user;
      return user;
    }
  }

  async deleteUser(id) {
    users = users.filter(user => user.id !== id);
  }
}

module.exports = new UserMemoryDAO();