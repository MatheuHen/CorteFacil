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
mongoose.connect('mongodb+srv://admin:admin123@cluster0.p8w3rsa.mongodb.net/cortefacildb?retryWrites=true&w=majority&appName=Cluster0', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('MongoDB conectado com sucesso!');
}).catch(err => {
  console.error('Erro ao conectar ao MongoDB:', err);
});

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
    const PORT = process.env.PORT || 3333;
    
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`Servidor rodando na porta ${PORT}`);
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
