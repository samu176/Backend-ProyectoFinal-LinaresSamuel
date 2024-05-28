const { faker } = require('@faker-js/faker');

function generateProducts() {
  const products = [];
  for (let i = 0; i < 100; i++) {
    products.push({
      title: faker.lorem.words(5),
      description: faker.lorem.paragraphs(),
      code: faker.string.alphanumeric(10),
      price: faker.number.int({ min: 0, max: 1000 }),
      status: faker.datatype.boolean(),
      stock: faker.number.int({ min: 0, max: 100 }),
      category: 'Libros',
      thumbnails: [faker.image.url()],
    });
  }
  return products;
}

module.exports = generateProducts;
