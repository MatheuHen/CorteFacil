const express = require('express');
const router = express.Router();
const Agendamento = require('../models/Agendamento');
const auth = require('../middleware/auth');

// Listar todos os agendamentos (apenas admin)
router.get('/', auth, async (req, res) => {
  try {
    const agendamentos = await Agendamento.find()
      .populate('cliente', 'nome email telefone')
      .populate('barbeiro', 'nome email telefone')
      .sort({ data: 1, horario: 1 });
    
    res.json({ 
      erro: false,
      agendamentos 
    });
  } catch (error) {
    console.error('Erro ao listar agendamentos:', error);
    res.status(500).json({ 
      erro: true,
      mensagem: 'Erro ao listar agendamentos' 
    });
  }
});

// Listar agendamentos do cliente
router.get('/cliente', auth, async (req, res) => {
  try {
    const agendamentos = await Agendamento.find({ cliente: req.userId })
      .populate('barbeiro', 'nome email telefone')
      .sort({ data: 1, horario: 1 });
    
    res.json({ 
      erro: false,
      agendamentos 
    });
  } catch (error) {
    console.error('Erro ao listar agendamentos do cliente:', error);
    res.status(500).json({ 
      erro: true,
      mensagem: 'Erro ao listar agendamentos' 
    });
  }
});

// Listar agendamentos do barbeiro
router.get('/barbeiro', auth, async (req, res) => {
  try {
    const agendamentos = await Agendamento.find({ barbeiro: req.userId })
      .populate('cliente', 'nome email telefone')
      .sort({ data: 1, horario: 1 });
    
    res.json({ 
      erro: false,
      agendamentos 
    });
  } catch (error) {
    console.error('Erro ao listar agendamentos do barbeiro:', error);
    res.status(500).json({ 
      erro: true,
      mensagem: 'Erro ao listar agendamentos' 
    });
  }
});

// Criar agendamento
router.post('/', auth, async (req, res) => {
  try {
    const { barbeiro, data, horario, servico, valor, observacoes } = req.body;

    // Verifica se já existe agendamento no mesmo horário
    const agendamentoExistente = await Agendamento.findOne({
      barbeiro,
      data,
      horario,
      status: { $nin: ['cancelado', 'finalizado'] }
    });

    if (agendamentoExistente) {
      return res.status(400).json({
        erro: true,
        mensagem: 'Já existe um agendamento neste horário'
      });
    }

    const agendamento = new Agendamento({
      cliente: req.userId,
      barbeiro,
      data,
      horario,
      servico,
      valor,
      observacoes
    });

    await agendamento.save();
    
    const agendamentoPopulado = await Agendamento.findById(agendamento._id)
      .populate('cliente', 'nome email telefone')
      .populate('barbeiro', 'nome email telefone');

    res.status(201).json({ 
      erro: false,
      mensagem: 'Agendamento criado com sucesso',
      agendamento: agendamentoPopulado 
    });
  } catch (error) {
    console.error('Erro ao criar agendamento:', error);
    
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        erro: true,
        mensagem: 'Erro de validação',
        detalhes: Object.values(error.errors).map(err => err.message)
      });
    }

    res.status(500).json({ 
      erro: true,
      mensagem: 'Erro ao criar agendamento' 
    });
  }
});

// Atualizar agendamento
router.put('/:id', auth, async (req, res) => {
  try {
    const { status, observacoes } = req.body;
    const agendamento = await Agendamento.findById(req.params.id);

    if (!agendamento) {
      return res.status(404).json({
        erro: true,
        mensagem: 'Agendamento não encontrado'
      });
    }

    // Apenas o barbeiro pode atualizar o status
    if (status && agendamento.barbeiro.toString() !== req.userId) {
      return res.status(403).json({
        erro: true,
        mensagem: 'Apenas o barbeiro pode atualizar o status do agendamento'
      });
    }

    // Apenas o cliente pode atualizar observações
    if (observacoes && agendamento.cliente.toString() !== req.userId) {
      return res.status(403).json({
        erro: true,
        mensagem: 'Apenas o cliente pode atualizar as observações do agendamento'
      });
    }

    if (status) agendamento.status = status;
    if (observacoes) agendamento.observacoes = observacoes;

    await agendamento.save();
    
    const agendamentoAtualizado = await Agendamento.findById(req.params.id)
      .populate('cliente', 'nome email telefone')
      .populate('barbeiro', 'nome email telefone');

    res.json({
      erro: false,
      mensagem: 'Agendamento atualizado com sucesso',
      agendamento: agendamentoAtualizado
    });
  } catch (error) {
    console.error('Erro ao atualizar agendamento:', error);
    
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        erro: true,
        mensagem: 'Erro de validação',
        detalhes: Object.values(error.errors).map(err => err.message)
      });
    }

    res.status(500).json({
      erro: true,
      mensagem: 'Erro ao atualizar agendamento'
    });
  }
});

// Cancelar agendamento
router.delete('/:id', auth, async (req, res) => {
  try {
    const agendamento = await Agendamento.findById(req.params.id);
    
    if (!agendamento) {
      return res.status(404).json({
        erro: true,
        mensagem: 'Agendamento não encontrado'
      });
    }

    // Apenas o cliente ou o barbeiro podem cancelar
    if (agendamento.cliente.toString() !== req.userId && 
        agendamento.barbeiro.toString() !== req.userId) {
      return res.status(403).json({
        erro: true,
        mensagem: 'Você não tem permissão para cancelar este agendamento'
      });
    }

    await agendamento.cancelar();

    res.json({
      erro: false,
      mensagem: 'Agendamento cancelado com sucesso'
    });
  } catch (error) {
    console.error('Erro ao cancelar agendamento:', error);
    res.status(500).json({
      erro: true,
      mensagem: 'Erro ao cancelar agendamento'
    });
  }
});

module.exports = router; 