const express = require('express');
const { check } = require('express-validator');
const passport = require('../config/passport');
const { register, login } = require('../controllers/auth.controller');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const verifyToken = require("../middlewares/authMiddleware.js");
const router = express.Router();
const { getMe } = require("../controllers/auth.controller");
// Register
router.post(
  '/register',
  [
    check('name', 'El nombre es obligatorio').not().isEmpty(),
    check('email', 'Debe ser un email válido').isEmail(),
    check('password', 'La contraseña debe tener al menos 6 caracteres').isLength({ min: 6 }),
  ],
  register
);

// Login
router.post('/login', login);

// Google login - inicio
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

// Google callback
router.get(
  '/google/callback',
  passport.authenticate('google', { failureRedirect: '/' }),
  (req, res) => {
    const token = jwt.sign({ id: req.user.id, email: req.user.email }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });

    res
      .cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "Lax",
        maxAge: 3600000,
      })
      .redirect('/'); // o respondé con JSON si estás en API
  }
);

// Google login manual (por front)
router.post('/google', async (req, res) => {
  console.log("Body recibido en /google:", req.body); // 👈 AGREGÁ ESTE

  const { email, name } = req.body;

  if (!email || !name) {
    return res.status(400).json({ msg: "Faltan datos del usuario de Google" });
  }

  try {
    let user = await User.findOne({ where: { email } });

    if (!user) {
      user = await User.create({
        name,
        email,
        googleId: "google_" + Math.random().toString(36).substring(7),
      });
    }

    const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });

    res
      .cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "Lax",
        maxAge: 3600000,
      })
      .json({ user });
  } catch (err) {
    console.error("Error en login con Google:", err);
    res.status(500).json({ msg: "Error en el login con Google" });
  }
});


// 🔓 Logout (cerrar sesión)
router.post('/logout', (req, res) => {
  res.clearCookie('token').json({ msg: 'Sesión cerrada correctamente' });
});

router.get("/me", verifyToken, getMe);



module.exports = router;
