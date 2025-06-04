const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const usuariosRoutes = require('./routes/usuarios');
const agendamentosRoutes = require('./routes/agendamentos');
require('dotenv').config();

const app = express();

// Middlewares
app.use(cors({
  origin: [
    'http://localhost:3000',
    'https://corte-facil.vercel.app',
    'https://cortefacil-chat-6b9c1276ad86.herokuapp.com',
    'https://cortefacilapp-c1680ff5711d.herokuapp.com'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Conexão com o MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/cortefacil');
    console.log('Conectado ao MongoDB');
  } catch (error) {
    console.error('Erro ao conectar ao MongoDB:', error);
    process.exit(1);
  }
};

// Rotas
app.use('/api/usuarios', usuariosRoutes);
app.use('/api/agendamentos', agendamentosRoutes);

// Rota inicial
app.get('/api', (req, res) => {
  res.json({ message: 'API CorteFacil funcionando!' });
});

// Função para iniciar o servidor
const startServer = async () => {
  try {
    await connectDB();
    const port = process.env.PORT || 5000;
    
    app.listen(port, () => {
      console.log(`Servidor rodando na porta ${port}`);
    });
  } catch (error) {
    console.error('Erro ao iniciar o servidor:', error);
    process.exit(1);
  }
};

// Tratamento de erros não capturados
process.on('unhandledRejection', (err) => {
  console.error('Erro não tratado:', err);
  process.exit(1);
});

if (process.env.NODE_ENV !== 'test') {
  startServer();
}

module.exports = app;
