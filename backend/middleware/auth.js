const jwt = require('jsonwebtoken'); // Importa la librería jsonwebtoken para trabajar con JWT

/**
 * Middleware para autenticar tokens JWT.
 * Verifica si la solicitud contiene un token de acceso válido.
 * Si el token es válido, decodifica la información del usuario y la adjunta a `req.user`.
 * Si no hay token o es inválido, envía una respuesta de error.
 */
const authenticateToken = (req, res, next) => {
  // Obtiene el encabezado de autorización de la solicitud
  const authHeader = req.headers['authorization'];
  // Extrae el token del formato "Bearer TOKEN"
  const token = authHeader && authHeader.split(' ')[1];
  // Si no hay token, devuelve un estado 401 (No autorizado)
  if (token == null) return res.sendStatus(401);

  // Verifica el token usando la clave secreta JWT del entorno
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    // Si hay un error en la verificación (ej. token expirado o inválido), devuelve un estado 403 (Prohibido)
    if (err) return res.sendStatus(403);
    // Si el token es válido, adjunta la información del usuario decodificada a `req.user`
    req.user = user;
    next(); // Pasa al siguiente middleware o controlador de ruta
  });
};

/**
 * Middleware para autorizar el acceso basado en roles.
 * Recibe un array de roles permitidos y devuelve un middleware.
 * Si el rol del usuario autenticado no está incluido en los roles permitidos,
 * devuelve un estado 403 (Prohibido).
 * @param {string[]} roles - Un array de roles permitidos para acceder a la ruta.
 */
const authorizeRole = (roles) => (req, res, next) => {
  // Verifica si el rol del usuario autenticado está en la lista de roles permitidos
  if (!roles.includes(req.user.role)) {
    return res.sendStatus(403); // Si no está autorizado, devuelve un estado 403
  }
  next(); // Si está autorizado, pasa al siguiente middleware o controlador de ruta
};

// Exporta los middlewares para que puedan ser utilizados en las rutas
module.exports = { authenticateToken, authorizeRole };
