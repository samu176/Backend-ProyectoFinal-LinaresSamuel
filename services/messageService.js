const MessageRepository = require('../repositories/messageRepository');

class MessageService {
  // Método para obtener todos los mensajes
  async getMessages() {
    try {
      const messages = await MessageRepository.getMessages();
      return messages;
    } catch (error) {
      throw new Error('GetMessagesError: ' + error.message);
    }
  }

  // Método para agregar un nuevo mensaje
  async addMessage(name, message) {
    try {
      const newMessage = await MessageRepository.createMessage({name, message});
      return newMessage;
    } catch (error) {
      throw new Error('AddMessageError: ' + error.message);
    }
  }
}

module.exports = new MessageService();