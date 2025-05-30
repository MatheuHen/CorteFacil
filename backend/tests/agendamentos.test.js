const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const app = require('../index');
const Usuario = require('../models/Usuario');
const Agendamento = require('../models/Agendamento');

let mongoServer;

describe('Testes de Agendamentos', () => {
  let token;
  let agendamentoId;
  let barbeiroId;

  beforeAll(async () => {
    // Configura banco de dados em memória para testes
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();
    await mongoose.connect(mongoUri);

    // Limpa o banco de dados de teste
    await Usuario.deleteMany({});
    await Agendamento.deleteMany({});

    // Cria um barbeiro de teste
    const barbeiro = await Usuario.create({
      nome: 'Barbeiro Teste',
      email: 'barbeiro@teste.com',
      senha: 'teste123',
      tipo: 'barbeiro'
    });
    barbeiroId = barbeiro._id;

    // Cria um cliente de teste
    const cliente = await Usuario.create({
      nome: 'Cliente Teste',
      email: 'cliente@teste.com',
      senha: 'teste123',
      tipo: 'cliente'
    });

    // Login para obter token
    const response = await request(app)
      .post('/api/usuarios/login')
      .send({
        email: 'cliente@teste.com',
        senha: 'teste123'
      });

    token = response.body.token;
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  test('Deve criar um novo agendamento', async () => {
    const response = await request(app)
      .post('/api/agendamentos')
      .set('Authorization', `Bearer ${token}`)
      .send({
        barbeiro: barbeiroId,
        data: '2024-01-20',
        horario: '14:00',
        servico: 'corte',
        valor: 50
      });

    expect(response.status).toBe(201);
    expect(response.body.agendamento).toHaveProperty('_id');
    agendamentoId = response.body.agendamento._id;
  });

  test('Deve listar agendamentos do cliente', async () => {
    const response = await request(app)
      .get('/api/agendamentos/cliente')
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('agendamentos');
    expect(Array.isArray(response.body.agendamentos)).toBe(true);
  });

  test('Deve atualizar observações do agendamento', async () => {
    const response = await request(app)
      .put(`/api/agendamentos/${agendamentoId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ observacoes: 'Teste de observação' });

    expect(response.status).toBe(200);
    expect(response.body.agendamento).toHaveProperty('observacoes', 'Teste de observação');
  });

  test('Deve cancelar agendamento', async () => {
    const response = await request(app)
      .delete(`/api/agendamentos/${agendamentoId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body.mensagem).toBe('Agendamento cancelado com sucesso');
  });
}); 