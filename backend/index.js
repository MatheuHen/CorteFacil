const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const router = require('./routes/index');
require('dotenv').config();

const app = express();

// Middlewares
const allowedOrigins = [
  process.env.FRONTEND_URL || 'http://localhost:3000',
  'https://corte-facil.vercel.app',
  'https://cortefacil-chat.vercel.app',
  'http://localhost:3000'
];

app.use(cors({
  origin: allowedOrigins,
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

// Conexão MongoDB
const connectDB = async () => {
  if (mongoose.connection.readyState === 0) {
    try {
      await mongoose.connect(process.env.DB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        serverSelectionTimeoutMS: 5000
      });
      console.log('MongoDB conectado com sucesso!');
    } catch (error) {
      console.error('Erro ao conectar MongoDB:', error);
      throw error;
    }
  }
};

// Conectar ao banco antes de processar requisições
app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (error) {
    res.status(500).json({ erro: true, mensagem: 'Erro de conexão com o banco de dados' });
  }
});

// Para desenvolvimento local
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 3333;
  app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT} em ambiente ${process.env.NODE_ENV || 'development'}`);
  });
}

module.exports = app;
