const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Usuario = require('../models/Usuario');

// Rota de login
router.post('/login', async (req, res) => {
  try {
    const { email, senha } = req.body;

    // Busca o usuário pelo email
    const usuario = await Usuario.findOne({ email });
    if (!usuario) {
      return res.status(401).json({ 
        erro: true,
        mensagem: 'Email ou senha inválidos' 
      });
    }

    // Verifica a senha
    const senhaValida = await usuario.verificarSenha(senha);
    if (!senhaValida) {
      return res.status(401).json({ 
        erro: true,
        mensagem: 'Email ou senha inválidos' 
      });
    }

    // Gera o token JWT
    const token = jwt.sign(
      { 
        id: usuario._id,
        tipo: usuario.tipo 
      },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({ 
      erro: false,
      token,
      usuario: {
        id: usuario._id,
        nome: usuario.nome,
        email: usuario.email,
        tipo: usuario.tipo
      }
    });
  } catch (error) {
    console.error('Erro no login:', error);
    res.status(500).json({ 
      erro: true,
      mensagem: 'Erro interno do servidor' 
    });
  }
});

// Listar usuários
router.get('/', async (req, res) => {
  try {
    const usuarios = await Usuario.find().select('-senha');
    res.json({ 
      erro: false,
      usuarios 
    });
  } catch (error) {
    console.error('Erro ao listar usuários:', error);
    res.status(500).json({ 
      erro: true,
      mensagem: 'Erro ao listar usuários' 
    });
  }
});

// Criar usuário
router.post('/', async (req, res) => {
  try {
    const { nome, email, senha, tipo, telefone } = req.body;

    // Verifica se o email já existe
    const usuarioExistente = await Usuario.findOne({ email });
    if (usuarioExistente) {
      return res.status(400).json({ 
        erro: true,
        mensagem: 'Este email já está cadastrado' 
      });
    }

    // Cria o novo usuário
    const usuario = new Usuario({
      nome,
      email,
      senha,
      tipo: tipo || 'cliente', // Se não especificar, será cliente
      telefone
    });

    // Salva o usuário (a senha será criptografada pelo middleware)
    await usuario.save();

    res.status(201).json({ 
      erro: false,
      mensagem: 'Usuário cadastrado com sucesso' 
    });
  } catch (error) {
    console.error('Erro ao criar usuário:', error);
    
    // Verifica se é erro de validação do Mongoose
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        erro: true,
        mensagem: 'Erro de validação',
        detalhes: Object.values(error.errors).map(err => err.message)
      });
    }

    res.status(500).json({ 
      erro: true,
      mensagem: 'Erro interno do servidor' 
    });
  }
});

module.exports = router; 