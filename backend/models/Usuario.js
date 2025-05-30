const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const usuarioSchema = new mongoose.Schema({
  nome: {
    type: String,
    required: [true, 'Nome é obrigatório'],
    trim: true,
    minlength: [2, 'Nome deve ter no mínimo 2 caracteres'],
    maxlength: [100, 'Nome deve ter no máximo 100 caracteres']
  },
  email: {
    type: String,
    required: [true, 'Email é obrigatório'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, 'Por favor, use um email válido']
  },
  senha: {
    type: String,
    required: [true, 'Senha é obrigatória'],
    minlength: [6, 'A senha deve ter no mínimo 6 caracteres']
  },
  tipo: {
    type: String,
    enum: {
      values: ['cliente', 'barbeiro', 'admin'],
      message: 'Tipo deve ser cliente, barbeiro ou admin'
    },
    default: 'cliente'
  },
  telefone: {
    type: String,
    required: false,
    validate: {
      validator: function(v) {
        return !v || /^\(\d{2}\) \d{5}-\d{4}$/.test(v);
      },
      message: props => `${props.value} não é um número de telefone válido! Use o formato (99) 99999-9999`
    }
  },
  ativo: {
    type: Boolean,
    default: true
  },
  ultimoLogin: {
    type: Date
  }
}, {
  timestamps: true
});

// Middleware para criptografar a senha antes de salvar
usuarioSchema.pre('save', async function(next) {
  if (!this.isModified('senha')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.senha = await bcrypt.hash(this.senha, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Middleware para atualizar o último login
usuarioSchema.pre('save', function(next) {
  if (this.isNew) {
    this.ultimoLogin = new Date();
  }
  next();
});

// Método para verificar senha
usuarioSchema.methods.verificarSenha = async function(senhaInformada) {
  return await bcrypt.compare(senhaInformada, this.senha);
};

// Método para atualizar último login
usuarioSchema.methods.atualizarUltimoLogin = async function() {
  this.ultimoLogin = new Date();
  return this.save();
};

// Método para desativar usuário
usuarioSchema.methods.desativar = async function() {
  this.ativo = false;
  return this.save();
};

// Método para ativar usuário
usuarioSchema.methods.ativar = async function() {
  this.ativo = true;
  return this.save();
};

module.exports = mongoose.model('Usuario', usuarioSchema);
