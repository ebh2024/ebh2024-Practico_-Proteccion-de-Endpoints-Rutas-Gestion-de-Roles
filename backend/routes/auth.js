const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User } = require('../config/database');

const router = express.Router();

router.post('/register', async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const user = await User.create({ username: req.body.username, password: hashedPassword, role: req.body.role || 'user' });
    res.status(201).send('Usuario registrado');
  } catch (error) {
    res.status(400).send(error.message);
  }
});

router.post('/login', async (req, res) => {
  const user = await User.findOne({ where: { username: req.body.username } });
  if (user == null) return res.status(400).send('No se encontró el usuario');

  try {
    if (await bcrypt.compare(req.body.password, user.password)) {
      const accessToken = jwt.sign({ username: user.username, role: user.role }, 'secretkey');
      res.json({ accessToken: accessToken });
    } else {
      res.send('Contraseña incorrecta');
    }
  } catch (error) {
    res.status(500).send();
  }
});

module.exports = router;
