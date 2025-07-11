const jwt = require("jsonwebtoken");

const checkAuth = (req, res, next) => {
  let token = req.cookies.token;

  if (!token && req.headers.authorization) {
    const authHeader = req.headers.authorization;
    if (authHeader.startsWith("Bearer ")) {
      token = authHeader.split(" ")[1];
    }
  }

  if (!token) {
    req.user = null;
    return next(); // No hay token, pero continuamos
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
  } catch (err) {
    console.warn("Token inválido:", err.message);
    req.user = null; // Token inválido, pero no cortamos
  }

  next();
};

module.exports = checkAuth;
