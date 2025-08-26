const express = require('express'); // Importa Express para crear el enrutador
const bcrypt = require('bcryptjs'); // Importa bcryptjs para el hash de contraseñas
const jwt = require('jsonwebtoken'); // Importa jsonwebtoken para la creación de tokens JWT
const { User } = require('../config/database'); // Importa el modelo User desde la configuración de la base de datos

const router = express.Router(); // Crea una nueva instancia de enrutador de Express

/**
 * Ruta POST para el registro de nuevos usuarios.
 * Hashea la contraseña del usuario y crea una nueva entrada en la base de datos.
 */
router.post('/register', async (req, res) => {
  try {
    // Hashea la contraseña proporcionada por el usuario
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    // Crea un nuevo usuario en la base de datos con el nombre de usuario, contraseña hasheada y rol (por defecto 'user')
    const user = await User.create({ username: req.body.username, password: hashedPassword, role: req.body.role || 'user' });
    res.status(201).send('Usuario registrado exitosamente'); // Envía una respuesta de éxito
  } catch (error) {
    res.status(400).send(error.message); // Envía un error si el registro falla (ej. nombre de usuario duplicado)
  }
});

/**
 * Ruta POST para el inicio de sesión de usuarios.
 * Verifica las credenciales del usuario y, si son válidas, emite un token JWT.
 */
router.post('/login', async (req, res) => {
  // Busca un usuario en la base de datos por su nombre de usuario
  const user = await User.findOne({ where: { username: req.body.username } });
  // Si el usuario no se encuentra, devuelve un error 400
  if (user == null) return res.status(400).send('Usuario no encontrado');

  try {
    // Compara la contraseña proporcionada con la contraseña hasheada almacenada
    if (await bcrypt.compare(req.body.password, user.password)) {
      // Si las contraseñas coinciden, crea un token de acceso JWT
      const accessToken = jwt.sign({ username: user.username, role: user.role }, process.env.JWT_SECRET);
      res.json({ accessToken: accessToken }); // Envía el token de acceso en la respuesta
    } else {
      res.send('Contraseña incorrecta'); // Envía un mensaje si la contraseña es incorrecta
    }
  } catch (error) {
    res.status(500).send(); // Envía un error 500 si ocurre un problema en el servidor
  }
});

module.exports = router; // Exporta el enrutador para ser utilizado en el archivo principal del servidor
