const express = require('express');
const router = express.Router();
const Agendamento = require('../models/Agendamento');
const { auth } = require('../middleware/auth');

// Listar todos os agendamentos
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

// Criar novo agendamento
router.post('/', auth, async (req, res) => {
  try {
    const { barbeiro, data, horario, servico, valor } = req.body;
    
    const agendamento = new Agendamento({
      cliente: req.userId,
      barbeiro,
      data,
      horario,
      servico,
      valor
    });

    await agendamento.save();

    res.status(201).json({
      erro: false,
      mensagem: 'Agendamento criado com sucesso',
      agendamento
    });
  } catch (error) {
    console.error('Erro ao criar agendamento:', error);
    res.status(500).json({
      erro: true,
      mensagem: 'Erro ao criar agendamento'
    });
  }
});

// Atualizar agendamento
router.put('/:id', auth, async (req, res) => {
  try {
    const agendamento = await Agendamento.findById(req.params.id);
    
    if (!agendamento) {
      return res.status(404).json({
        erro: true,
        mensagem: 'Agendamento não encontrado'
      });
    }

    // Verifica se é o cliente do agendamento ou admin
    if (agendamento.cliente.toString() !== req.userId && req.userTipo !== 'admin') {
      return res.status(403).json({
        erro: true,
        mensagem: 'Você não tem permissão para atualizar este agendamento'
      });
    }

    const { barbeiro, data, horario, servico, valor, status, observacoes } = req.body;
    
    Object.assign(agendamento, {
      barbeiro: barbeiro || agendamento.barbeiro,
      data: data || agendamento.data,
      horario: horario || agendamento.horario,
      servico: servico || agendamento.servico,
      valor: valor || agendamento.valor,
      status: status || agendamento.status,
      observacoes: observacoes || agendamento.observacoes
    });

    await agendamento.save();

    res.json({
      erro: false,
      mensagem: 'Agendamento atualizado com sucesso',
      agendamento
    });
  } catch (error) {
    console.error('Erro ao atualizar agendamento:', error);
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

    // Verifica se é o cliente do agendamento ou admin
    if (agendamento.cliente.toString() !== req.userId && req.userTipo !== 'admin') {
      return res.status(403).json({
        erro: true,
        mensagem: 'Você não tem permissão para cancelar este agendamento'
      });
    }

    agendamento.status = 'cancelado';
    await agendamento.save();

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