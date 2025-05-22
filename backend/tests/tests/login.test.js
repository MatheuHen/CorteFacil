const request = require('supertest');
const app = require('../index');
const mongoose = require('mongoose');

describe('Testes de autenticação - Login', () => {

  it('Deve fazer login com sucesso e retornar token', async () => {
    const resposta = await request(app)
      .post('/api/usuarios/login')
      .send({
        email: 'usuario@email.com',
        senha: '123456' // use um usuário real do seu banco
      });

    expect(resposta.status).toBe(200);
    expect(resposta.body).toHaveProperty('token');
  });

  it('Deve falhar ao logar com credenciais inválidas', async () => {
    const resposta = await request(app)
      .post('/api/usuarios/login')
      .send({
        email: 'invalido@email.com',
        senha: 'senhaerrada'
      });

    expect(resposta.status).toBe(401); // ou 400, dependendo da sua API
    expect(resposta.body).toHaveProperty('erro');
  });
});

afterAll(async () => {
  await mongoose.connection.close();
});

it('Deve negar acesso à rota protegida sem token', async () => {
  const resposta = await request(app)
    .get('/agendamentos'); // ajuste se essa rota não for protegida

  expect(resposta.status).toBe(401); // ou 403, conforme sua API
});

it('Deve impedir cadastro de usuário já existente', async () => {
  const resposta = await request(app)
    .post('/api/usuarios/cadastro')
    .send({
      nome: 'Usuário Teste',
      email: 'usuario@email.com', // já deve existir no banco
      senha: '123456'
    });

  expect(resposta.status).toBe(400); // ou 409 se sua API usar código de conflito
  expect(resposta.body).toHaveProperty('erro');
});

