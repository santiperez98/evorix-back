const express = require('express');
const { check } = require('express-validator');
const passport = require('../config/passport');
const { register, login } = require('../controllers/auth.controller');
const User = require('../models/User'); // solo si exportás el modelo directo
const router = express.Router();
const jwt = require('jsonwebtoken');
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

router.post('/google', async (req, res) => {
  const { email, name } = req.body;

  try {
    let user = await User.findOne({ where: { email } });

    if (!user) {
      user = await User.create({
        name,
        email,
        googleId: "google_" + Math.random().toString(36).substring(7), // o pasás el ID real
      });
    }

    const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });

    res.json({ token, user });
  } catch (err) {
    console.error("Error en login con Google:", err);
    res.status(500).json({ msg: "Error en el login con Google" });
  }
});

module.exports = router;