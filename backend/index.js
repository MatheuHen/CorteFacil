const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const router = require('./routes');
require('dotenv').config();

const app = express();

// Middlewares
app.use(cors({
  origin: ['https://corte-facil.vercel.app'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Rota inicial
app.get('/', (req, res) => {
  res.json({
    status: 'online',
    message: 'API CorteFácil está online e funcionando!',
    version: '1.0.0',
    environment: process.env.NODE_ENV || 'development',
    endpoints: {
      usuarios: '/api/usuarios',
      agendamentos: '/api/agendamentos'
    }
  });
});

// Rotas da API
app.use('/api', router);

// Tratamento de erros global
app.use((err, req, res, next) => {
  console.error('Erro na aplicação:', err);
  res.status(500).json({
    erro: true,
    mensagem: 'Erro interno do servidor',
    detalhes: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Conexão MongoDB e inicialização do servidor
const PORT = process.env.PORT || 3333;

const startServer = async () => {
  try {
    await mongoose.connect(process.env.DB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000
    });
    console.log('MongoDB conectado com sucesso!');

    app.listen(PORT, () => {
      console.log(`Servidor rodando na porta ${PORT} em ambiente ${process.env.NODE_ENV || 'development'}`);
    });
  } catch (error) {
    console.error('Erro ao iniciar o servidor:', error);
    process.exit(1);
  }
};

startServer();

module.exports = app;
