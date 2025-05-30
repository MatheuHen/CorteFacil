const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Usuario = require('../models/Usuario');
const { auth, isAdmin } = require('../middleware/auth');

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

    // Verifica se o usuário está ativo
    if (!usuario.ativo) {
      return res.status(401).json({ 
        erro: true,
        mensagem: 'Usuário inativo' 
      });
    }

    // Verifica a senha
    const senhaValida = await bcrypt.compare(senha, usuario.senha);
    if (!senhaValida) {
      return res.status(401).json({ 
        erro: true,
        mensagem: 'Email ou senha inválidos' 
      });
    }

    // Atualiza último login
    await usuario.atualizarUltimoLogin();

    // Gera o token JWT
    const token = jwt.sign(
      { 
        id: usuario._id,
        tipo: usuario.tipo 
      },
      process.env.JWT_SECRET || 'segredo',
      { expiresIn: '24h' }
    );

    res.json({ 
      erro: false,
      token,
      user: {
        id: usuario._id,
        nome: usuario.nome,
        email: usuario.email,
        tipo: usuario.tipo,
        telefone: usuario.telefone
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

// Listar usuários (apenas admin)
router.get('/', auth, isAdmin, async (req, res) => {
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

// Criar usuário (apenas admin)
router.post('/', auth, isAdmin, async (req, res) => {
  try {
    const { nome, email, senha, tipo, telefone } = req.body;

    // Validações básicas
    if (!nome || !email || !senha) {
      return res.status(400).json({
        erro: true,
        mensagem: 'Nome, email e senha são obrigatórios'
      });
    }

    // Validação de email
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        erro: true,
        mensagem: 'Email inválido'
      });
    }

    // Validação de senha
    if (senha.length < 6) {
      return res.status(400).json({
        erro: true,
        mensagem: 'A senha deve ter no mínimo 6 caracteres'
      });
    }

    // Validação de telefone (se fornecido)
    if (telefone) {
      const telefoneRegex = /^\(\d{2}\) \d{5}-\d{4}$/;
      if (!telefoneRegex.test(telefone)) {
        return res.status(400).json({
          erro: true,
          mensagem: 'Telefone inválido. Use o formato (99) 99999-9999'
        });
      }
    }

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
      tipo: tipo || 'cliente',
      telefone
    });

    // Salva o usuário (a senha será criptografada pelo middleware)
    await usuario.save();

    res.status(201).json({ 
      erro: false,
      mensagem: 'Usuário cadastrado com sucesso',
      usuario: {
        id: usuario._id,
        nome: usuario.nome,
        email: usuario.email,
        tipo: usuario.tipo,
        telefone: usuario.telefone
      }
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

// Atualizar usuário (apenas admin ou próprio usuário)
router.put('/:id', auth, async (req, res) => {
  try {
    // Verifica se é admin ou o próprio usuário
    if (req.userTipo !== 'admin' && req.userId !== req.params.id) {
      return res.status(403).json({
        erro: true,
        mensagem: 'Você não tem permissão para atualizar este usuário'
      });
    }

    const { nome, email, senha, tipo, telefone } = req.body;
    const updates = { nome, email, tipo, telefone };

    // Se não for admin, não pode mudar o tipo
    if (req.userTipo !== 'admin') {
      delete updates.tipo;
    }

    // Se uma nova senha foi fornecida, criptografa
    if (senha) {
      if (senha.length < 6) {
        return res.status(400).json({
          erro: true,
          mensagem: 'A senha deve ter no mínimo 6 caracteres'
        });
      }
      const salt = await bcrypt.genSalt(10);
      updates.senha = await bcrypt.hash(senha, salt);
    }

    // Validação de telefone (se fornecido)
    if (telefone) {
      const telefoneRegex = /^\(\d{2}\) \d{5}-\d{4}$/;
      if (!telefoneRegex.test(telefone)) {
        return res.status(400).json({
          erro: true,
          mensagem: 'Telefone inválido. Use o formato (99) 99999-9999'
        });
      }
    }

    const usuario = await Usuario.findByIdAndUpdate(
      req.params.id,
      updates,
      { new: true, runValidators: true }
    ).select('-senha');

    if (!usuario) {
      return res.status(404).json({
        erro: true,
        mensagem: 'Usuário não encontrado'
      });
    }

    res.json({
      erro: false,
      mensagem: 'Usuário atualizado com sucesso',
      usuario
    });
  } catch (error) {
    console.error('Erro ao atualizar usuário:', error);

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

// Excluir usuário (apenas admin)
router.delete('/:id', auth, isAdmin, async (req, res) => {
  try {
    const usuario = await Usuario.findById(req.params.id);
    
    if (!usuario) {
      return res.status(404).json({
        erro: true,
        mensagem: 'Usuário não encontrado'
      });
    }

    // Em vez de excluir, apenas desativa
    await usuario.desativar();

    res.json({
      erro: false,
      mensagem: 'Usuário desativado com sucesso'
    });
  } catch (error) {
    console.error('Erro ao excluir usuário:', error);
    res.status(500).json({
      erro: true,
      mensagem: 'Erro interno do servidor'
    });
  }
});

// Rota para obter perfis disponíveis
router.get('/perfis', auth, async (req, res) => {
  try {
    const usuario = await Usuario.findById(req.userId);
    const perfis = [];

    if (usuario.tipo === 'admin') {
      perfis.push('admin');
    }
    if (usuario.tipo === 'barbeiro' || usuario.tipo === 'admin') {
      perfis.push('barbeiro');
    }
    if (usuario.tipo === 'cliente' || usuario.tipo === 'admin') {
      perfis.push('cliente');
    }

    res.json({
      erro: false,
      perfis
    });
  } catch (error) {
    console.error('Erro ao obter perfis:', error);
    res.status(500).json({
      erro: true,
      mensagem: 'Erro ao obter perfis'
    });
  }
});

module.exports = router; 