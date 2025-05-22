const request = require('supertest');
const app = require('../../index');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const Usuario = require('../../backend/models/Usuario');

beforeAll(async () => {
  const senhaCriptografada = await bcrypt.hash('123456', 10);

  await Usuario.deleteMany({ email: 'usuario@email.com' });

  await Usuario.create({
    nome: 'Usuário de Teste',
    email: 'usuario@email.com',
    senha: senhaCriptografada
  });
});

describe('Testes de autenticação', () => {
  it('Deve fazer login com sucesso e retornar token', async () => {
    const resposta = await request(app)
      .post('/api/usuarios/login')
      .send({
        email: 'usuario@email.com',
        senha: '123456'
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

    expect(resposta.status).toBe(401);
    expect(resposta.body).toHaveProperty('erro');
  });

  it('Deve negar acesso à rota protegida sem token', async () => {
    const resposta = await request(app).get('/agendamentos');
    expect([401, 403]).toContain(resposta.status);
  });

  it('Deve impedir cadastro de usuário já existente', async () => {
    const resposta = await request(app)
      .post('/api/usuarios/cadastro')
      .send({
        nome: 'Usuário Teste',
        email: 'usuario@email.com',
        senha: '123456'
      });

    expect([400, 409]).toContain(resposta.status);
    expect(resposta.body).toHaveProperty('erro');
  });

  it('Deve acessar rota protegida com token válido', async () => {
    const login = await request(app)
      .post('/api/usuarios/login')
      .send({
        email: 'usuario@email.com',
        senha: '123456'
      });

    const token = login.body.token;

    const resposta = await request(app)
      .get('/agendamentos')
      .set('Authorization', `Bearer ${token}`);

    expect(resposta.status).toBe(200);
  });
});

afterAll(async () => {
  await mongoose.connection.close();
});
