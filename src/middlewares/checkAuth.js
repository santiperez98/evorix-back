const jwt = require('jsonwebtoken');
const User = require('../models/User');

const checkAuth = async (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ message: 'No autenticado' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findByPk(decoded.id);
    if (!user) {
      return res.status(401).json({ message: 'Usuario no encontrado' });
    }

    req.user = user; // ✔️ Ahora req.user está definido
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Token inválido' });
  }
};

module.exports = checkAuth;
