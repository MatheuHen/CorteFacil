const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const usuariosRoutes = require('./routes/usuarios');
const agendamentosRoutes = require('./routes/agendamentos');
require('dotenv').config();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Conexão com o MongoDB
const MONGODB_URI = 'mongodb+srv://admin:admin123@cluster0.p8w3rsa.mongodb.net/cortefacildb?retryWrites=true&w=majority&appName=Cluster0';

const connectDB = async () => {
  try {
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 30000,
      socketTimeoutMS: 30000,
    });
    console.log('Conectado ao MongoDB Atlas com sucesso!');
  } catch (error) {
    console.error('Erro ao conectar ao MongoDB:', error);
    process.exit(1);
  }
};

// Rotas
app.use('/api/usuarios', usuariosRoutes);
app.use('/api/agendamentos', agendamentosRoutes);

// Rota inicial
app.get('/', (req, res) => {
  res.json({ message: 'API CorteFacil funcionando!' });
});

// Função para iniciar o servidor
const startServer = async () => {
  try {
    await connectDB();
    const port = process.env.PORT || 3333;
    
    app.listen(port, '0.0.0.0', () => {
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
});

if (process.env.NODE_ENV !== 'test') {
  startServer();
}

module.exports = app;
