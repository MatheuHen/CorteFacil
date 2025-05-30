const express = require('express');
const router = express.Router();
const Agendamento = require('../models/Agendamento');

// Listar agendamentos
router.get('/', async (req, res) => {
  try {
    const agendamentos = await Agendamento.find();
    res.json(agendamentos);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao listar agendamentos' });
  }
});

// Criar agendamento
router.post('/', async (req, res) => {
  try {
    const agendamento = new Agendamento(req.body);
    await agendamento.save();
    res.status(201).json(agendamento);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao criar agendamento' });
  }
});

// Atualizar agendamento
router.put('/:id', async (req, res) => {
  try {
    const agendamento = await Agendamento.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!agendamento) {
      return res.status(404).json({ message: 'Agendamento não encontrado' });
    }
    res.json(agendamento);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao atualizar agendamento' });
  }
});

// Excluir agendamento
router.delete('/:id', async (req, res) => {
  try {
    const agendamento = await Agendamento.findByIdAndDelete(req.params.id);
    if (!agendamento) {
      return res.status(404).json({ message: 'Agendamento não encontrado' });
    }
    res.json({ message: 'Agendamento excluído com sucesso' });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao excluir agendamento' });
  }
});

module.exports = router; 