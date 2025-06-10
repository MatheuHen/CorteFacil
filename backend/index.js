const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');

// Configuração do dotenv
dotenv.config();

// Criação do app Express
const app = express();

// Configuração do CORS
const corsOptions = {
  origin: process.env.FRONTEND_URL || 'https://corte-facil-seven.vercel.app',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
  optionsSuccessStatus: 204
};

// Middlewares
app.use(cors(corsOptions));
app.use(express.json());

// Log de requisições
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Conexão com MongoDB
console.log('🔄 Conectando ao MongoDB...');
mongoose.connect(process.env.DB_URI)
  .then(() => console.log('🟢 Conectado ao MongoDB Atlas com sucesso!'))
  .catch((erro) => {
    console.error('🔴 Erro ao conectar ao MongoDB:', erro);
    process.exit(1); // Encerra o processo se não conseguir conectar ao banco
  });

// Handler para erros de conexão do MongoDB
mongoose.connection.on('error', (err) => {
  console.error('🔴 Erro na conexão com MongoDB:', err);
});

mongoose.connection.on('disconnected', () => {
  console.warn('🟡 Desconectado do MongoDB');
});

// Rotas
const usuarioRoutes = require('./routes/usuarioRoutes');
const agendamentoRoutes = require('./routes/agendamentoRoutes');

app.use('/api/usuarios', usuarioRoutes);
app.use('/api/agendamentos', agendamentoRoutes);

// Rota de status/health check
app.get(['/status', '/health', '/api/status'], (req, res) => {
  res.json({ 
    status: 'online',
    environment: process.env.NODE_ENV,
    timestamp: new Date().toISOString(),
    mongodb: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
  });
});

// Middleware para rotas não encontradas
app.use((req, res) => {
  res.status(404).json({ 
    error: 'Rota não encontrada',
    path: req.path
  });
});

// Middleware de erro global
app.use((err, req, res, next) => {
  console.error('❌ Erro na aplicação:', err);
  res.status(500).json({ 
    error: 'Erro interno do servidor',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Tratamento de erros não capturados
process.on('uncaughtException', (err) => {
  console.error('❌ Erro não capturado:', err);
  process.exit(1);
});

process.on('unhandledRejection', (err) => {
  console.error('❌ Promise rejeitada não tratada:', err);
  process.exit(1);
});

// exporta o app para uso nos testes
module.exports = app;

// inicia o servidor apenas se não estiver em modo de teste
if (require.main === module) {
  const PORT = process.env.PORT || 3333;
  
  const server = app.listen(PORT, () => {
    console.log(`
🚀 Servidor iniciado:
- Porta: ${PORT}
- Ambiente: ${process.env.NODE_ENV || 'development'}
- URL do Frontend: ${process.env.FRONTEND_URL || 'não definida'}
    `);
  });

  // Graceful shutdown
  const shutdown = () => {
    console.log('\n🔄 Iniciando shutdown graceful...');
    server.close(() => {
      console.log('👋 Servidor HTTP fechado');
      mongoose.connection.close(false, () => {
        console.log('📦 Conexão MongoDB fechada');
        process.exit(0);
      });
    });

    // Se o servidor não fechar em 10 segundos, força o encerramento
    setTimeout(() => {
      console.error('⚠️ Não foi possível fechar as conexões em 10s, forçando shutdown');
      process.exit(1);
    }, 10000);
  };

  process.on('SIGTERM', shutdown);
  process.on('SIGINT', shutdown);
}
