// src/middlewares/isAdmin.js
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const isAdmin = async (req, res, next) => {
  const token = req.cookies.token;

  if (!token) return res.status(401).json({ message: 'No hay token, acceso denegado' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findByPk(decoded.id);

    if (!user) return res.status(404).json({ message: 'Usuario no encontrado' });

    if (user.role !== 'admin') {
      return res.status(403).json({ message: 'Acceso denegado: No sos admin' });
    }

    req.user = user; // opcional, por si lo querés usar después
    next();
  } catch (err) {
    return res.status(403).json({ message: 'Token inválido o expirado' });
  }
};

module.exports = isAdmin;
