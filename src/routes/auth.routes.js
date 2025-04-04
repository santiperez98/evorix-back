const express = require('express');
const { check } = require('express-validator');
const { register, login } = require('../controllers/auth.controller');

const router = express.Router();

router.post(
  '/register',
  [
    check('name', 'El nombre es obligatorio').not().isEmpty(),
    check('email', 'Debe ser un email válido').isEmail(),
    check('password', 'La contraseña debe tener al menos 6 caracteres').isLength({ min: 6 })
  ],
  register
);

router.post('/login', login);

module.exports = router;
