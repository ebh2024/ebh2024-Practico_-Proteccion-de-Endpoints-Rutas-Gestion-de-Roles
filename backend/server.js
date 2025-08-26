require('dotenv').config(); // Carga las variables de entorno desde el archivo .env
const express = require('express');
const cors = require('cors'); // Importa el middleware CORS para permitir solicitudes de origen cruzado
const authRoutes = require('./routes/auth'); // Importa las rutas de autenticación
const productRoutes = require('./routes/products'); // Importa las rutas de productos
const userRoutes = require('./routes/users'); // Importa las rutas de usuarios

const app = express(); // Crea una instancia de la aplicación Express
app.use(cors()); // Habilita CORS para todas las solicitudes
app.use(express.json()); // Habilita el middleware para parsear cuerpos de solicitud JSON

// Define las rutas de la API
app.use('/auth', authRoutes); // Rutas para autenticación (registro, login)
app.use('/products', productRoutes); // Rutas para la gestión de productos (CRUD)
app.use('/users', userRoutes); // Rutas para la gestión de usuarios (obtener, actualizar roles)

// Configura el puerto del servidor, usando el puerto de las variables de entorno o 3000 por defecto
const PORT = process.env.PORT || 3000;
// Inicia el servidor y lo pone a escuchar en el puerto especificado
app.listen(PORT, () => console.log(`Servidor corriendo en el puerto ${PORT}`));
