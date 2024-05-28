let messages = [];

class MessageMemoryDAO {
  async createMessage(message) {
    messages.push(message);
    return message;
  }

  async getMessageById(id) {
    return messages.find(message => message.id === id);
  }

  async updateMessage(id, message) {
    const index = messages.findIndex(message => message.id === id);
    if (index > -1) {
      messages[index] = message;
      return message;
    }
  }

  async deleteMessage(id) {
    messages = messages.filter(message => message.id !== id);
  }
}

module.exports = new MessageMemoryDAO();