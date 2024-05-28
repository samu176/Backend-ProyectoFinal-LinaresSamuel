const productController = require('../controllers/productController');
const messageController = require('../controllers/messageController');

// Exportar una función que toma 'io' como argumento
module.exports = function(io) {
  // Escuchar el evento 'connection' que se emite cuando un cliente se conecta
  io.on('connection', async (socket) => {
    // Envía todos los productos existentes al cliente que acaba de conectarse
    try {
      const products = await productController.getProducts({});
      socket.emit('updateProducts', products);
    } catch (error) {}

    // Escuchar el evento 'chatMessage' que se emite cuando un cliente envía un mensaje de chat
    socket.on('chatMessage', async (data) => {
      try {
        const newMessage = await messageController.addMessage(data.name, data.message);
        // Emitimos el evento 'chatMessage' a todos los clientes con el nuevo mensaje
        io.emit('chatMessage', newMessage);
      } catch (error) {}
    });

    // Escuchar el evento 'newProduct' que se emite cuando un cliente agrega un nuevo producto
    socket.on('newProduct', async (productData) => {
      try {
        const newProduct = await productController.addProduct(productData);
        const products = await productController.getProducts({});
        // Emitir el evento 'updateProducts' a todos los clientes con los productos actualizados
        io.emit('updateProducts', products);
      } catch (error) {}
    });

    // Escuchar el evento 'disconnect' que se emite cuando un cliente se desconecta
    socket.on('disconnect', () => {});
  });
};