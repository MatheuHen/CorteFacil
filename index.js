const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// suas rotas aqui
const usuarioRoutes = require('./routes/usuarioRoutes');
const agendamentoRoutes = require('./routes/agendamentoRoutes');

app.use('/api/usuarios', usuarioRoutes);
app.use('/agendamentos', agendamentoRoutes);

// exporta o app para uso nos testes
module.exports = app;

// inicia o servidor apenas se não estiver em modo de teste
if (require.main === module) {
  const PORT = process.env.PORT || 5000;

  mongoose.connect(process.env.DB_URI)
    .then(() => {
      console.log('MongoDB conectado com sucesso!');
      app.listen(PORT, () => {
        console.log(`Servidor rodando na porta ${PORT}`);
      });
    })
    .catch(err => console.error('Erro ao conectar no MongoDB:', err));
}
