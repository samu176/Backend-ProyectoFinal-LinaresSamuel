const MessageDAO = require('../dao/messageDAO');

class MessageRepository {
  async getMessageById(id) {
    return await MessageDAO.getMessageById(id);
  }

  async createMessage(message) {
    return await MessageDAO.createMessage(message);
  }

  async getMessages() {
    return await MessageDAO.getMessages();
  }
}

module.exports = new MessageRepository();