const mongoose = require('mongoose');

const agendamentoSchema = new mongoose.Schema({
  cliente: {
    type: String,
    required: true
  },
  data: {
    type: Date,
    required: true
  },
  horario: {
    type: String,
    required: true
  },
  servico: {
    type: String,
    required: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Agendamento', agendamentoSchema); 