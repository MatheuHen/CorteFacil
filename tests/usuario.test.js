function soma(a, b) {
  return a + b;
}

test('deve somar 2 + 3 e retornar 5', () => {
  expect(soma(2, 3)).toBe(5);
});

const mongoose = require('mongoose');

afterAll(async () => {
  await mongoose.connection.close();
});

