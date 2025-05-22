const express = require('express');
const router = express.Router();

// Rota de teste
router.get('/', (req, res) => {
  res.status(200).send('Rota de agendamentos funcionando');
});

module.exports = router;
