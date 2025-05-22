const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();

app.use(express.json());
app.use(cors());

// Importa as rotas depois de configurar o app
const usuarioRoutes = require('./routes/usuarioRoutes');
const agendamentoRoutes = require('./routes/agendamentoRoutes');
app.use('/api/usuarios', usuarioRoutes);
app.use('/agendamentos', agendamentoRoutes);


// Conecta no banco
mongoose.connect(process.env.DB_URI)
  .then(() => console.log('MongoDB conectado com sucesso!'))
  .catch(err => console.log('Erro ao conectar com MongoDB:', err));

// Rota principal de teste
app.get('/', (req, res) => {
  res.send('Backend rodando com sucesso!');
});

// Sobe o servidor
module.exports = app;

