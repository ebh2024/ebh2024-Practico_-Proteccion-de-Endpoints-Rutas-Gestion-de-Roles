const express = require('express');
const { User } = require('../config/database');
const { authenticateToken, authorizeRole } = require('../middleware/auth');

const router = express.Router();

router.get('/', authenticateToken, authorizeRole(['admin']), async (req, res) => {
  try {
    const users = await User.findAll({ attributes: ['id', 'username', 'role'] });
    res.json(users);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

router.put('/:id/role', authenticateToken, authorizeRole(['admin']), async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).send('User not found');
    user.role = req.body.role;
    await user.save();
    res.send('User role updated');
  } catch (error) {
    res.status(400).send(error.message);
  }
});

module.exports = router;
