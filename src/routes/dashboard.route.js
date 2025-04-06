const express = require('express');
const isAdmin = require('../middlewares/isAdmin');

const router = express.Router();

router.get('/dashboard', isAdmin, (req, res) => {
  res.status(200).json({ message: 'Bienvenido al panel de administrador 👑' });
});

module.exports = router;
