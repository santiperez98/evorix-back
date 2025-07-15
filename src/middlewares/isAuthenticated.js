// src/middlewares/isAuthenticated.js
import jwt from 'jsonwebtoken';

export const isAuthenticated = (req, res, next) => {
  const token = req.cookies.token;

  if (!token) return res.status(401).json({ message: 'No hay token, acceso denegado' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Aquí va el payload del token (ej: { id, email, role })
    next();
  } catch (error) {
    return res.status(403).json({ message: 'Token inválido' });
  }
};
