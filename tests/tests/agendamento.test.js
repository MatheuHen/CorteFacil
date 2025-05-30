const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../../backend/index');
const Agendamento = require('../../backend/models/Agendamento');

describe('📅 Testes de Agendamentos', () => {
  beforeAll(async () => {
    // Limpa o banco de dados antes dos testes
    await Agendamento.deleteMany({});
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  it('🔍 Deve retornar 200 ao listar agendamentos', async () => {
    const resposta = await request(app).get('/api/agendamentos');
    expect(resposta.status).toBe(200);
    expect(Array.isArray(resposta.body)).toBe(true);
  });

  it('✅ Deve criar um novo agendamento', async () => {
    const novoAgendamento = {
      cliente: 'Cliente Teste',
      data: new Date(),
      horario: '14:00',
      servico: 'Corte de Cabelo'
    };

    const resposta = await request(app)
      .post('/api/agendamentos')
      .send(novoAgendamento);

    expect(resposta.status).toBe(201);
    expect(resposta.body.cliente).toBe(novoAgendamento.cliente);
    expect(resposta.body.horario).toBe(novoAgendamento.horario);
    expect(resposta.body.servico).toBe(novoAgendamento.servico);
  });

  it('🔄 Deve atualizar um agendamento existente', async () => {
    // Primeiro cria um agendamento
    const agendamento = new Agendamento({
      cliente: 'Cliente Original',
      data: new Date(),
      horario: '15:00',
      servico: 'Barba'
    });
    await agendamento.save();

    // Depois atualiza
    const atualizacao = {
      horario: '16:00'
    };

    const resposta = await request(app)
      .put(`/api/agendamentos/${agendamento._id}`)
      .send(atualizacao);

    expect(resposta.status).toBe(200);
    expect(resposta.body.horario).toBe(atualizacao.horario);
  });

  it('❌ Deve excluir um agendamento', async () => {
    // Primeiro cria um agendamento
    const agendamento = new Agendamento({
      cliente: 'Cliente para Excluir',
      data: new Date(),
      horario: '17:00',
      servico: 'Corte e Barba'
    });
    await agendamento.save();

    // Depois exclui
    const resposta = await request(app)
      .delete(`/api/agendamentos/${agendamento._id}`);

    expect(resposta.status).toBe(200);
    expect(resposta.body.message).toBe('Agendamento excluído com sucesso');

    // Verifica se realmente foi excluído
    const agendamentoExcluido = await Agendamento.findById(agendamento._id);
    expect(agendamentoExcluido).toBeNull();
  });
});
