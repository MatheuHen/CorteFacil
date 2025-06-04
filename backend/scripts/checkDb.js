require('dotenv').config();
const mongoose = require('mongoose');

async function checkDbConnection() {
  try {
    console.log('Tentando conectar ao MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Conexão com MongoDB estabelecida com sucesso!');
    console.log(`Host: ${mongoose.connection.host}`);
    console.log(`Database: ${mongoose.connection.name}`);
    
    // Verifica as coleções existentes
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log('\nColeções existentes:');
    collections.forEach(collection => {
      console.log(`- ${collection.name}`);
    });
    
  } catch (error) {
    console.error('Erro ao conectar com MongoDB:', error.message);
    if (error.name === 'MongooseError') {
      console.error('Verifique se a string de conexão está correta no arquivo .env');
    }
  } finally {
    await mongoose.disconnect();
    process.exit();
  }
}

checkDbConnection(); 