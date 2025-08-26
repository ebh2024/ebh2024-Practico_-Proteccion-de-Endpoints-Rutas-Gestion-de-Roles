const { Sequelize, DataTypes } = require('sequelize');

// Inicializa Sequelize para conectarse a una base de datos SQLite.
// La base de datos se almacenará en el archivo 'database.sqlite'.
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: 'database.sqlite'
});

/**
 * Define el modelo 'User' (Usuario) para la base de datos.
 * Representa la tabla de usuarios con sus atributos.
 */
const User = sequelize.define('User', {
  // Nombre de usuario: cadena de texto, no puede ser nulo y debe ser único.
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  // Contraseña: cadena de texto, no puede ser nulo.
  password: {
    type: DataTypes.STRING,
    allowNull: false
  },
  // Rol del usuario: cadena de texto, por defecto 'user'.
  role: {
    type: DataTypes.STRING,
    defaultValue: 'user'
  }
});

/**
 * Define el modelo 'Product' (Producto) para la base de datos.
 * Representa la tabla de productos con sus atributos.
 */
const Product = sequelize.define('Product', {
  // Nombre del producto: cadena de texto, no puede ser nulo.
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  // Precio del producto: número de punto flotante, no puede ser nulo.
  price: {
    type: DataTypes.FLOAT,
    allowNull: false
  },
  // Descripción del producto: cadena de texto (opcional).
  description: {
    type: DataTypes.STRING
  }
});

// Sincroniza todos los modelos definidos con la base de datos.
// Esto creará las tablas si no existen.
sequelize.sync();

// Exporta la instancia de Sequelize y los modelos User y Product para ser usados en otras partes de la aplicación.
module.exports = { sequelize, User, Product };
