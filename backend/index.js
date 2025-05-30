const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Conexão com o MongoDB
mongoose.connect(process.env.DB_URI || 'mongodb+srv://admin:admin@cluster0.iqbqbxe.mongodb.net/cortefacil?retryWrites=true&w=majority', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('Conectado ao MongoDB'))
.catch(err => console.error('Erro ao conectar ao MongoDB:', err));

// Rotas da API
app.use('/api/usuarios', require('./routes/usuarios'));
app.use('/api/agendamentos', require('./routes/agendamentos'));

// Servir arquivos estáticos do frontend
app.use(express.static(path.join(__dirname, '../frontend/build')));

// Rota inicial
app.get('/api', (req, res) => {
  res.json({ message: 'API CorteFacil funcionando!' });
});

// Rota para todas as outras requisições
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/build', 'index.html'));
});

// Porta fixa para o servidor
const PORT = process.env.PORT || 3001;

// Função para tentar iniciar o servidor
const startServer = () => {
  try {
    app.listen(PORT, () => {
      console.log(`Servidor rodando na porta ${PORT}`);
    });
  } catch (error) {
    console.error('Erro ao iniciar servidor:', error);
    process.exit(1);
  }
};

startServer();

module.exports = app;
