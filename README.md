# Proyecto Full-Stack con Autenticación por Token

Este es un proyecto de aplicación web full-stack que incluye un backend con Node.js y Express, y un frontend con React. La aplicación gestiona productos y usuarios, e implementa un sistema de autenticación y autorización seguro basado en JSON Web Tokens (JWT).

## Características

- **Gestión de Productos**: Crear, leer, actualizar y eliminar productos (accesible para `admin` y `moderator`).
- **Gestión de Usuarios**: Ver la lista de usuarios y gestionar sus roles.
- **Autenticación por Token**: Sistema de registro y login que genera un JWT para autenticar las solicitudes.
- **Autorización por Roles**: Rutas protegidas que solo permiten el acceso a usuarios con roles específicos (ej. `admin`, `moderator`).
- **Frontend Reactivo**: Interfaz de usuario construida con React y PrimeReact para una experiencia de usuario moderna.

## Tecnologías Utilizadas

**Backend:**
- **Node.js**: Entorno de ejecución para JavaScript.
- **Express**: Framework para construir la API REST.
- **Sequelize**: ORM para la interacción con la base de datos SQLite.
- **bcryptjs**: Librería para el hash de contraseñas.
- **jsonwebtoken**: Para la creación y verificación de JWT.
- **dotenv**: Para gestionar variables de entorno.

**Frontend:**
- **React**: Librería para construir interfaces de usuario.
- **React Router**: Para la navegación en la aplicación.
- **Axios**: Cliente HTTP para realizar peticiones a la API.
- **PrimeReact**: Librería de componentes de UI para React.
- **jwt-decode**: Para decodificar los tokens JWT en el cliente.

## Instalación y Ejecución

### Backend
1. Navega al directorio `Practico/backend`.
   ```sh
   cd Practico/backend
   ```
2. Instala las dependencias.
   ```sh
   npm install
   ```
3. Inicia el servidor de desarrollo.
   ```sh
   npm start
   ```
El servidor se ejecutará en `http://localhost:3000`.

### Frontend
1. Navega al directorio `Practico/frontend`.
   ```sh
   cd Practico/frontend
   ```
2. Instala las dependencias.
   ```sh
   npm install
   ```
3. Inicia el cliente de desarrollo.
   ```sh
   npm run dev
   ```
La aplicación se abrirá en `http://localhost:5173`.

## Endpoints de la API

### Autenticación (`/auth`)
- `POST /register`: Registra un nuevo usuario.
- `POST /login`: Autentica un usuario y devuelve un JWT.

### Productos (`/products`)
- `GET /`: Obtiene todos los productos (requiere autenticación).
- `POST /`: Crea un nuevo producto (requiere rol de `admin` o `moderator`).
- `PUT /:id`: Actualiza un producto existente (requiere rol de `admin` o `moderator`).
- `DELETE /:id`: Elimina un producto (requiere rol de `admin` o `moderator`).

### Usuarios (`/users`)
- `GET /`: Obtiene todos los usuarios (requiere rol de `admin`).
- `PUT /:id/role`: Actualiza el rol de un usuario (requiere rol de `admin`).
