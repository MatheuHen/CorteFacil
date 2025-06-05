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

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    const usuario = await Usuario.findOne({ 
      _id: decoded.id,
      ativo: true 
    }).select('-senha');

    if (!usuario) {
      return res.status(401).json({ 
        erro: true,
        mensagem: 'Usuário não encontrado ou inativo' 
      });
    }

    // Adiciona informações do usuário ao request
    req.usuario = usuario;
    req.userId = usuario._id;
    req.userTipo = usuario.tipo;
    
    next();
  } catch (error) {
    console.error('Erro de autenticação:', error);
    
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ 
        erro: true,
        mensagem: 'Token inválido' 
      });
    }
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ 
        erro: true,
        mensagem: 'Token expirado' 
      });
    }
    
    res.status(500).json({ 
      erro: true,
      mensagem: 'Erro interno do servidor' 
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