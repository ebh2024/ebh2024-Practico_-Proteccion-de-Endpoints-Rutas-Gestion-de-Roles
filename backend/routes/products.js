const express = require('express'); // Importa Express para crear el enrutador
const { Product } = require('../config/database'); // Importa el modelo Product desde la configuración de la base de datos
const { authenticateToken, authorizeRole } = require('../middleware/auth'); // Importa los middlewares de autenticación y autorización

const router = express.Router(); // Crea una nueva instancia de enrutador de Express

/**
 * Ruta GET para obtener todos los productos.
 * Requiere autenticación.
 */
router.get('/', authenticateToken, async (req, res) => {
  // Busca todos los productos en la base de datos
  const products = await Product.findAll();
  res.json(products); // Devuelve los productos como respuesta JSON
});

/**
 * Ruta POST para crear un nuevo producto.
 * Requiere autenticación y que el usuario tenga el rol de 'admin'.
 */
router.post('/', authenticateToken, authorizeRole(['admin']), async (req, res) => {
  try {
    // Crea un nuevo producto con los datos proporcionados en el cuerpo de la solicitud
    const product = await Product.create(req.body);
    res.status(201).send('Producto creado exitosamente'); // Envía una respuesta de éxito
  } catch (error) {
    res.status(400).send(error.message); // Envía un error si la creación del producto falla
  }
});

/**
 * Ruta PUT para actualizar un producto existente por su ID.
 * Requiere autenticación y que el usuario tenga el rol de 'admin'.
 */
router.put('/:id', authenticateToken, authorizeRole(['admin']), async (req, res) => {
  try {
    // Busca el producto por su ID
    const product = await Product.findByPk(req.params.id);
    // Si el producto no se encuentra, devuelve un error 404
    if (!product) return res.status(404).send('Producto no encontrado');
    // Actualiza el producto con los datos proporcionados
    await product.update(req.body);
    res.send('Producto actualizado exitosamente'); // Envía una respuesta de éxito
  } catch (error) {
    res.status(400).send(error.message); // Envía un error si la actualización del producto falla
  }
});

/**
 * Ruta DELETE para eliminar un producto por su ID.
 * Requiere autenticación y que el usuario tenga el rol de 'admin'.
 */
router.delete('/:id', authenticateToken, authorizeRole(['admin']), async (req, res) => {
  try {
    // Busca el producto por su ID
    const product = await Product.findByPk(req.params.id);
    // Si el producto no se encuentra, devuelve un error 404
    if (!product) return res.status(404).send('Producto no encontrado');
    // Elimina el producto de la base de datos
    await product.destroy();
    res.send('Producto eliminado exitosamente'); // Envía una respuesta de éxito
  } catch (error) {
    res.status(500).send(error.message); // Envía un error si la eliminación del producto falla
  }
});

module.exports = router; // Exporta el enrutador para ser utilizado en el archivo principal del servidor
