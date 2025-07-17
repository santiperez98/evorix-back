const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const User = require('../models/User');

// Registrar nuevo usuario
const register = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { name, email, password, role } = req.body;

  try {
    let user = await User.findOne({ where: { email } });
    if (user) {
      return res.status(400).json({ msg: 'El usuario ya existe' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    user = await User.create({
      name,
      email,
      password: hashedPassword,
      role,
    });

    const payload = { id: user.id, name: user.name, email: user.email };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Lax",
      maxAge: 3600000, // 1 hora
    }).status(201).json({ user });
  } catch (err) {
    console.error(err);
    res.status(500).send('Error en el servidor');
  }
};

// Iniciar sesión
const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    let user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(400).json({ msg: 'Usuario no encontrado' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: 'Contraseña incorrecta' });
    }

    const payload = { id: user.id, name: user.name, email: user.email };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Lax",
      maxAge: 3600000, // 1 hora
    }).json({ user });
  } catch (err) {
    console.error(err);
    res.status(500).send('Error en el servidor');
  }
};

// Obtener datos del usuario autenticado
const getMe = async (req, res) => {
  if (!req.user) {
    return res.status(200).json(null);
  }

  try {
    const user = await User.findByPk(req.user.id);
    if (!user) {
      return res.status(200).json(null);
    }

    res.status(200).json({
      name: user.name,
      email: user.email,
      picture: user.picture || null,
      role: user.role || 'user',
    });
  } catch (err) {
    console.error('Error al obtener usuario:', err);
    res.status(500).json({ msg: 'Error del servidor' });
  }
};

// Cerrar sesión
const logout = (req, res) => {
  res.clearCookie('token', {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "Lax",
  });
  res.status(200).json({ msg: 'Sesión cerrada con éxito' });
};

// ✅ Exportamos todo junto correctamente
module.exports = {
  register,
  login,
  getMe,
  logout,
};
