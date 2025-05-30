const mongoose = require('mongoose');

const agendamentoSchema = new mongoose.Schema({
  cliente: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Usuario',
    required: [true, 'Cliente é obrigatório']
  },
  barbeiro: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Usuario',
    required: [true, 'Barbeiro é obrigatório']
  },
  data: {
    type: Date,
    required: [true, 'Data é obrigatória']
  },
  horario: {
    type: String,
    required: [true, 'Horário é obrigatório'],
    validate: {
      validator: function(v) {
        return /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(v);
      },
      message: props => `${props.value} não é um horário válido! Use o formato HH:MM`
    }
  },
  servico: {
    type: String,
    required: [true, 'Serviço é obrigatório'],
    enum: {
      values: ['corte', 'barba', 'corte e barba', 'outros'],
      message: 'Serviço deve ser: corte, barba, corte e barba ou outros'
    }
  },
  valor: {
    type: Number,
    required: [true, 'Valor é obrigatório'],
    min: [0, 'Valor não pode ser negativo']
  },
  status: {
    type: String,
    enum: {
      values: ['pendente', 'confirmado', 'cancelado', 'finalizado'],
      message: 'Status deve ser: pendente, confirmado, cancelado ou finalizado'
    },
    default: 'pendente'
  },
  observacoes: {
    type: String,
    maxlength: [500, 'Observações não podem ter mais de 500 caracteres']
  }
}, {
  timestamps: true
});

// Índices para melhorar a performance das consultas
agendamentoSchema.index({ cliente: 1, data: 1 });
agendamentoSchema.index({ barbeiro: 1, data: 1 });
agendamentoSchema.index({ status: 1 });

// Middleware para validar a data do agendamento
agendamentoSchema.pre('save', function(next) {
  const agora = new Date();
  if (this.data < agora && this.isNew) {
    next(new Error('Não é possível criar agendamentos para datas passadas'));
  }
  next();
});

// Método para cancelar agendamento
agendamentoSchema.methods.cancelar = async function() {
  this.status = 'cancelado';
  return this.save();
};

// Método para confirmar agendamento
agendamentoSchema.methods.confirmar = async function() {
  this.status = 'confirmado';
  return this.save();
};

// Método para finalizar agendamento
agendamentoSchema.methods.finalizar = async function() {
  this.status = 'finalizado';
  return this.save();
};

module.exports = mongoose.model('Agendamento', agendamentoSchema); 