const express = require('express'); // Importa Express para crear el enrutador
const { User } = require('../config/database'); // Importa el modelo User desde la configuración de la base de datos
const { authenticateToken, authorizeRole } = require('../middleware/auth'); // Importa los middlewares de autenticación y autorización

const router = express.Router(); // Crea una nueva instancia de enrutador de Express

/**
 * Ruta GET para obtener todos los usuarios.
 * Requiere autenticación y que el usuario tenga el rol de 'admin'.
 */
router.get('/', authenticateToken, authorizeRole(['admin']), async (req, res) => {
  try {
    // Busca todos los usuarios en la base de datos, seleccionando solo id, username y role
    const users = await User.findAll({ attributes: ['id', 'username', 'role'] });
    res.json(users); // Devuelve los usuarios como respuesta JSON
  } catch (error) {
    res.status(500).send(error.message); // Envía un error 500 si ocurre un problema en el servidor
  }
});

/**
 * Ruta PUT para actualizar el rol de un usuario por su ID.
 * Requiere autenticación y que el usuario tenga el rol de 'admin'.
 */
router.put('/:id/role', authenticateToken, authorizeRole(['admin']), async (req, res) => {
  try {
    // Busca el usuario por su ID
    const user = await User.findByPk(req.params.id);
    // Si el usuario no se encuentra, devuelve un error 404
    if (!user) return res.status(404).send('Usuario no encontrado');
    // Actualiza el rol del usuario con el nuevo rol proporcionado en el cuerpo de la solicitud
    user.role = req.body.role;
    await user.save(); // Guarda los cambios en la base de datos
    res.send('Rol de usuario actualizado exitosamente'); // Envía una respuesta de éxito
  } catch (error) {
    res.status(400).send(error.message); // Envía un error si la actualización del rol falla
  }
});

module.exports = router; // Exporta el enrutador para ser utilizado en el archivo principal del servidor
