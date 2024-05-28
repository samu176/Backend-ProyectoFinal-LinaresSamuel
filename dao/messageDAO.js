const Message = require('../models/messageModel');

class MessageDAO {
  async getMessageById(id) {
    const message = await Message.findById(id);
    return message ? this.toDTO(message) : null;
  }

  async createMessage(message) {
    const newMessage = new Message(message);
    const savedMessage = await newMessage.save();
    return this.toDTO(savedMessage);
  }

  async getMessages() {
    const messages = await Message.find();
    return messages.map(message => this.toDTO(message));
  }

  toDTO(message) {
    return {
      id: message._id,
      name: message.name,
      message: message.message,
      timestamp: message.timestamp,
    };
  }
}

module.exports = new MessageDAO();