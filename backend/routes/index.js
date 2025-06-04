const express = require('express');
const router = express.Router();
const usuariosRoutes = require('./usuarios');
const agendamentosRoutes = require('./agendamentos');

router.use('/usuarios', usuariosRoutes);
router.use('/agendamentos', agendamentosRoutes);

module.exports = router; 