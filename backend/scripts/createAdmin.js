const mongoose = require('mongoose');
const Usuario = require('../models/Usuario');
require('dotenv').config();

async function createAdmin() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/cortefacil');
    
    const adminData = {
      nome: 'Administrador',
      email: 'admin@cortefacil.com',
      senha: '123456',
      tipo: 'admin',
      ativo: true
    };

    const adminExists = await Usuario.findOne({ email: adminData.email });
    if (adminExists) {
      console.log('Administrador já existe!');
      process.exit(0);
    }

    const admin = new Usuario(adminData);
    await admin.save();
    
    console.log('Administrador criado com sucesso!');
    console.log('Email:', adminData.email);
    console.log('Senha:', adminData.senha);
  } catch (error) {
    console.error('Erro ao criar administrador:', error);
  } finally {
    await mongoose.disconnect();
  }
}

createAdmin(); 