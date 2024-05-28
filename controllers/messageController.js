const MessageService = require('../services/messageService');

// Obtener todos los mensajes
const getMessages = async () => {
  try {
    return await MessageService.getMessages();
  } catch (error) {
    throw new Error('Error al leer los mensajes de la base de datos');
  }
};

// Agregar un nuevo mensaje
const addMessage = async (name, message) => {
  try {
    return await MessageService.addMessage(name, message);
  } catch (error) {
    throw new Error('Error al guardar el mensaje en la base de datos');
  }
};

module.exports = {
  getMessages,
  addMessage,
};