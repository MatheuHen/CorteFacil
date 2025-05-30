const request = require('supertest');
const app = require('../index');
const mongoose = require('mongoose');

describe('Testes de Agendamentos', () => {
  let token;
  let agendamentoId;

  beforeAll(async () => {
    // Login para obter token
    const response = await request(app)
      .post('/api/usuarios/login')
      .send({
        email: 'teste@teste.com',
        senha: 'teste123'
      });
    token = response.body.token;
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  test('Deve criar um novo agendamento', async () => {
    const response = await request(app)
      .post('/api/agendamentos')
      .set('Authorization', `Bearer ${token}`)
      .send({
        data: '2024-01-20',
        horario: '14:00',
        servico: 'corte'
      });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('_id');
    agendamentoId = response.body._id;
  });

  test('Deve listar agendamentos', async () => {
    const response = await request(app)
      .get('/api/agendamentos')
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  test('Deve atualizar status do agendamento', async () => {
    const response = await request(app)
      .put(`/api/agendamentos/${agendamentoId}/confirmar`)
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body.status).toBe('Confirmado');
  });
}); 