const express = require('express');
const { check } = require('express-validator');
const passport = require('../config/passport');
const { register, login } = require('../controllers/auth.controller');

const router = express.Router();

router.post(
  '/register',
  [
    check('name', 'El nombre es obligatorio').not().isEmpty(),
    check('email', 'Debe ser un email válido').isEmail(),
    check('password', 'La contraseña debe tener al menos 6 caracteres').isLength({ min: 6 }),
  ],
  register
);

router.post('/login', login);

// Ruta para iniciar sesión con Google
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

// Ruta de callback después de la autenticación
router.get(
  '/google/callback',
  passport.authenticate('google', { failureRedirect: '/' }),
  (req, res) => {
    // Generar token JWT
    const token = jwt.sign({ id: req.user.id, email: req.user.email }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });

    res.json({ token, user: req.user });
  }
);

module.exports = router;