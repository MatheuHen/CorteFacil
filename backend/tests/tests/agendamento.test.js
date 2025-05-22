const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../../index'); // ajuste se necessário

describe('Testes de integração - Agendamentos', () => {
  it('Deve retornar 200 ao acessar GET /agendamentos', async () => {
    const resposta = await request(app).get('/agendamentos');
    expect(resposta.status).toBe(200);
  });
});

afterAll(async () => {
  await mongoose.connection.close();
});
