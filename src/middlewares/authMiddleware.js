const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  let token = req.cookies.token;

  // También aceptamos token por header Authorization: Bearer xxx
  if (!token && req.headers.authorization) {
    const authHeader = req.headers.authorization;
    if (authHeader.startsWith("Bearer ")) {
      token = authHeader.split(" ")[1];
    }
  }

  if (!token) return res.status(401).json({ msg: "No token provided" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    console.error("Token inválido:", err);
    return res.status(401).json({ msg: "Token inválido" });
  }
};

module.exports = verifyToken;