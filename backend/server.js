const app = require('./index');
require('dotenv').config();

const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.DB_URI)
  .then(() => {
    console.log('MongoDB conectado com sucesso!');
    app.listen(PORT, () => {
      console.log(`Servidor rodando na porta ${PORT}`);
    });
  })
  .catch(err => console.error('Erro ao conectar no MongoDB:', err));
