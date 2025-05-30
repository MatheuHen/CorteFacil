const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Conexão com o MongoDB com retry
const connectDB = async (retryCount = 0) => {
  try {
    await mongoose.connect(process.env.DB_URI || 'mongodb+srv://admin:admin@cluster0.iqbqbxe.mongodb.net/cortefacil?retryWrites=true&w=majority', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Conectado ao MongoDB');
  } catch (err) {
    console.error('Erro ao conectar ao MongoDB:', err);
    if (retryCount < 3) {
      console.log(`Tentando reconectar... Tentativa ${retryCount + 1}`);
      await new Promise(resolve => setTimeout(resolve, 3000));
      return connectDB(retryCount + 1);
    }
    process.exit(1);
  }
};

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

// Função para encontrar uma porta disponível
const findAvailablePort = async (preferredPort, maxAttempts = 10) => {
  const net = require('net');
  
  const isPortAvailable = (port) => {
    return new Promise((resolve) => {
      const server = net.createServer();
      server.once('error', () => {
        resolve(false);
      });
      server.once('listening', () => {
        server.close();
        resolve(true);
      });
      server.listen(port);
    });
  };

  // Primeiro tenta a porta preferida
  if (await isPortAvailable(preferredPort)) {
    return preferredPort;
  }

  // Se não conseguir, tenta portas alternativas
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    const port = preferredPort + attempt;
    if (await isPortAvailable(port)) {
      console.log(`Porta ${preferredPort} está em uso. Usando porta alternativa: ${port}`);
      return port;
    }
  }

  throw new Error(`Não foi possível encontrar uma porta disponível após ${maxAttempts} tentativas`);
};

// Iniciar servidor
const startServer = async () => {
  await connectDB();
  try {
    const preferredPort = process.env.PORT || 5000;
    const port = await findAvailablePort(preferredPort);
    
    app.listen(port, () => {
      console.log(`Servidor rodando na porta ${port}`);
    });
  } catch (error) {
    console.error('Erro ao iniciar servidor:', error);
    process.exit(1);
  }
};

startServer();

module.exports = app;
