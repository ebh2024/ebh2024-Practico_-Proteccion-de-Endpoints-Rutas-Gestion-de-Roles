const jwt = require('jsonwebtoken');

// Middleware de autenticación
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (token == null) return res.sendStatus(401);

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

// Middleware de autorización por rol
const authorizeRole = (roles) => (req, res, next) => {
  if (!roles.includes(req.user.role)) {
    return res.sendStatus(403);
  }
  next();
};

module.exports = { authenticateToken, authorizeRole };
