const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const router = require('./routes');

const app = express();

// Middlewares
app.use(cors({
  origin: ['https://corte-facil-seven.vercel.app', 'http://localhost:3000'],
  credentials: true
}));
app.use(express.json());

// Conexão MongoDB
const DB_URI = process.env.DB_URI || 'mongodb+srv://admin:admin123@cluster0.p8w3rsa.mongodb.net/cortefacildb?retryWrites=true&w=majority&appName=Cluster0';

mongoose.connect(DB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('MongoDB conectado com sucesso!');
}).catch(err => {
  console.error('Erro ao conectar ao MongoDB:', err);
});

// Rota inicial
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

// Rotas da API
app.use('/api', router);

// Inicialização do servidor
const PORT = process.env.PORT || 3333;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});

module.exports = app;
