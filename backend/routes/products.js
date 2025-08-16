const express = require('express');
const { Product } = require('../config/database');
const { authenticateToken, authorizeRole } = require('../middleware/auth');

const router = express.Router();

router.get('/', authenticateToken, async (req, res) => {
  const products = await Product.findAll();
  res.json(products);
});

router.post('/', authenticateToken, authorizeRole(['admin']), async (req, res) => {
  try {
    const product = await Product.create(req.body);
    res.status(201).send('Producto creado');
  } catch (error) {
    res.status(400).send(error.message);
  }
});

router.put('/:id', authenticateToken, authorizeRole(['admin']), async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) return res.status(404).send('Producto no encontrado');
    await product.update(req.body);
    res.send('Producto actualizado');
  } catch (error) {
    res.status(400).send(error.message);
  }
});

router.delete('/:id', authenticateToken, authorizeRole(['admin']), async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) return res.status(404).send('Producto no encontrado');
    await product.destroy();
    res.send('Producto eliminado');
  } catch (error) {
    res.status(500).send(error.message);
  }
});

module.exports = router;
