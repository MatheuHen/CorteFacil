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

const DB_URI = process.env.DB_URI || 'mongodb+srv://admin:admin123@cluster0.p8w3rsa.mongodb.net/cortefacildb?retryWrites=true&w=majority&appName=Cluster0';

// Conexão com o MongoDB
mongoose.connect(DB_URI, {
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

// Rota raiz com mensagem amigável
app.get('/', (req, res) => {
  res.json({
    status: 'online',
    message: 'API CorteFácil está online e funcionando!',
    version: '1.0.0',
    endpoints: {
      usuarios: '/api/usuarios',
      agendamentos: '/api/agendamentos'
    }
  });
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
