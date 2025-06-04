const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const app = require('../index');
const Usuario = require('../models/Usuario');

let mongoServer;
let token;

beforeAll(async () => {
  // Configura banco de dados em memória para testes
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  await mongoose.connect(mongoUri);

  // Limpa o banco de dados de teste
  await Usuario.deleteMany({});

  // Cria usuário admin para testes
  await Usuario.create({
    nome: 'Admin Teste',
    email: 'admin@teste.com',
    senha: '123456',
    tipo: 'admin',
    ativo: true
  });
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

describe('Testes de Autenticação', () => {
  it('Deve fazer login com sucesso', async () => {
    const response = await request(app)
      .post('/api/usuarios/login')
      .send({
        email: 'admin@teste.com',
        senha: '123456'
      });

    expect(response.status).toBe(200);
    expect(response.body.token).toBeDefined();
    expect(response.body.erro).toBe(false);
    
    // Salva o token para outros testes
    token = response.body.token;
  });

  it('Não deve fazer login com credenciais inválidas', async () => {
    const response = await request(app)
      .post('/api/usuarios/login')
      .send({
        email: 'admin@teste.com',
        senha: 'senhaerrada'
      });

    expect(response.status).toBe(401);
    expect(response.body.erro).toBe(true);
  });
});

describe('Testes de Usuários', () => {
  it('Deve cadastrar um novo usuário', async () => {
    const novoUsuario = {
      nome: 'Teste API',
      email: `teste${Date.now()}@teste.com`,
      senha: '123456',
      tipo: 'cliente'
    };

    const response = await request(app)
      .post('/api/usuarios')
      .set('Authorization', `Bearer ${token}`)
      .send(novoUsuario);

    expect(response.status).toBe(201);
    expect(response.body.erro).toBe(false);
  });

  it('Deve listar usuários com autenticação', async () => {
    const response = await request(app)
      .get('/api/usuarios')
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body.usuarios)).toBe(true);
  });

  it('Não deve listar usuários sem autenticação', async () => {
    const response = await request(app)
      .get('/api/usuarios');

    expect(response.status).toBe(401);
    expect(response.body.erro).toBe(true);
  });
}); 