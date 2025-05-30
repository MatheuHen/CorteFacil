const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../backend/index');
const Usuario = require('../backend/models/Usuario');

describe('Testes de Usuário', () => {
  beforeAll(async () => {
    // Limpa o banco de dados antes dos testes
    await Usuario.deleteMany({});
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  it('deve criar um novo usuário', async () => {
    const res = await request(app)
      .post('/api/usuarios')
      .send({
        nome: 'Teste',
        email: 'teste@teste.com',
        senha: '123456',
        tipo: 'cliente'
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.erro).toBe(false);
  });

  it('deve fazer login com sucesso', async () => {
    const res = await request(app)
      .post('/api/usuarios/login')
      .send({
        email: 'teste@teste.com',
        senha: '123456'
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.erro).toBe(false);
    expect(res.body.token).toBeDefined();
  });

  it('não deve permitir login com senha incorreta', async () => {
    const res = await request(app)
      .post('/api/usuarios/login')
      .send({
        email: 'teste@teste.com',
        senha: 'senhaerrada'
      });

    expect(res.statusCode).toBe(401);
    expect(res.body.erro).toBe(true);
  });
});
