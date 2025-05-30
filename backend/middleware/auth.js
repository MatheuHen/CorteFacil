const jwt = require('jsonwebtoken');
const Usuario = require('../models/Usuario');

const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ 
        erro: true,
        mensagem: 'Token de autenticação não fornecido' 
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'segredo');
    const usuario = await Usuario.findById(decoded.id).select('-senha');

    if (!usuario) {
      return res.status(401).json({ 
        erro: true,
        mensagem: 'Usuário não encontrado' 
      });
    }

    req.userId = usuario._id;
    req.userTipo = usuario.tipo;
    next();
  } catch (error) {
    console.error('Erro de autenticação:', error);
    res.status(401).json({ 
      erro: true,
      mensagem: 'Token inválido ou expirado' 
    });
  }
};

// Middleware para verificar se é admin
const isAdmin = (req, res, next) => {
  if (req.userTipo !== 'admin') {
    return res.status(403).json({
      erro: true,
      mensagem: 'Acesso negado. Apenas administradores podem acessar este recurso.'
    });
  }
  next();
};

// Middleware para verificar se o usuário é barbeiro
const isBarbeiro = (req, res, next) => {
  if (req.userTipo !== 'barbeiro' && req.userTipo !== 'admin') {
    return res.status(403).json({ 
      erro: true,
      mensagem: 'Acesso negado. Apenas barbeiros podem acessar este recurso.' 
    });
  }
  next();
};

// Middleware para verificar se o usuário é cliente
const isCliente = (req, res, next) => {
  if (req.userTipo !== 'cliente' && req.userTipo !== 'admin') {
    return res.status(403).json({ 
      erro: true,
      mensagem: 'Acesso negado. Apenas clientes podem acessar este recurso.' 
    });
  }
  next();
};

module.exports = {
  auth,
  isAdmin,
  isBarbeiro,
  isCliente
}; 