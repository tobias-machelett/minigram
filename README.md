MINIGRAM

Minigram es una aplicación web tipo red social simple que estoy desarrollando como proyecto personal para practicar backend, frontend, bases de datos y servicios cloud en AWS.

La idea es construir una app donde un usuario pueda registrarse, iniciar sesión, subir imágenes, ver publicaciones, comentar y dar likes/dislikes. Todavía está en desarrollo, pero ya tiene una base funcional desplegada en AWS.

Demo: https://dkk95jncs305s.cloudfront.net
Nota: la demo puede estar pausada temporalmente para evitar costos de AWS.

OBJETIVO DEL PROYECTO: El objetivo principal es practicar una arquitectura más cercana a un proyecto real, separando frontend, backend, base de datos y almacenamiento de archivos.

Con este proyecto estoy trabajando:

- backend con Node.js y Express
- base de datos PostgreSQL en RDS
- almacenamiento de imágenes en S3
- frontend estático
- autenticación con JWT
- contraseñas protegidas con bcrypt
- despliegue en EC2
- CloudFront para exponer la app con HTTPS
- organización del código en rutas, controladores, configuración y middleware.

ARQUITECTURA GENERAL:

    Usuario
      ↓
    CloudFront HTTPS
      ↓
    Frontend estático en S3
      ↓
    API mediante CloudFront
      ↓
    Backend Node.js / Express en EC2
      ↓
    RDS PostgreSQL + S3 para imágenes

TECNOLOGÍAS USADAS:

Frontend:

- HTML
- CSS
- JavaScript
- LocalStorage
- Fetch API

Backend:

- Node.js
- Express
- Multer
- bcrypt
- JSON Web Token
- dotenv
- CORS
- PM2

Cloud y base de datos:

- AWS EC2
- AWS S3
- AWS RDS PostgreSQL
- AWS CloudFront
- Elastic IP

FUNCIONALIDADES ACTUALES:

- Registro de usuarios.
- Inicio de sesión.
- Autenticación con JWT.
- Contraseñas hasheadas con bcrypt.
- Subida de imágenes.
- Guardado de imágenes en S3.
- Guardado de posts en PostgreSQL.
- Feed de publicaciones.
- Likes y dislikes.
- Comentarios.
- Eliminación de publicaciones.
- Rutas protegidas con middleware.
- Backend corriendo en EC2 con PM2.
- Frontend servido mediante S3 y CloudFront.

ESTRUCTURA DEL BACKEND:

    app/
    ├── config/
    │   ├── db.js
    │   └── s3.js
    ├── controllers/
    │   ├── postController.js
    │   └── authController.js
    ├── routes/
    │   ├── postRoutes.js
    │   └── authRoutes.js
    ├── middleware/
    │   └── authMiddleware.js
    ├── server.js
    ├── package.json
    ├── package-lock.json
    ├── .env.example
    ├── .gitignore
    └── README.md

ENDPOINTS PRINCIPALES:

Auth:

    POST /auth/register
    POST /auth/login

Posts:

    GET /posts
    POST /posts/upload
    DELETE /posts/:id
    POST /posts/:id/like
    POST /posts/:id/dislike
    POST /posts/:id/comments
    DELETE /posts/:postId/comments/:commentId

SEGURIDAD:

En el proyecto estoy aplicando algunas prácticas básicas de seguridad:

- las contraseñas no se guardan en texto plano
- bcrypt se usa para proteger las contraseñas
- JWT se usa para manejar autenticación
- algunas rutas están protegidas con middleware
- las credenciales se manejan con variables de entorno
- el archivo `.env` real no se sube al repositorio
- CloudFront permite usar HTTPS para acceder a la aplicación

VARIABLES DE ENTORNO:

El proyecto necesita un archivo .env basado en .env.example

Ejemplo:

    db_HOST=
    DB_USER=
    DB_PASSWORD=
    DB_NAME=
    DB_PORT=5432

    AWS_REGION=
    S3_BUCKET=

    PORT=3000

    JWT_SECRET=


INSTALACIÓN LOCAL:

Clonar el repositorio:

    git clone https://github.com/tobias-machelett/minigram.git

    cd minigram

    npm install

    
Instalar dependencias:

    npm install

Crear un archivo .env usando como guía .env.example

Ejecutar el servidor:

    node server.js

O usando PM2:

    pm2 start server.js --name minigram

ESTADO ACTUAL:

El proyecto ya tiene una versión funcional desplegada en AWS.

Actualmente funciona el registro, login, autenticación con JWT, subida de imágenes, guardado en S3, guardado de datos en PostgreSQL, feed de publicaciones, comentarios, likes/dislikes, CloudFront como entrada HTTPS y backend en EC2 administrado con PM2.

PRÓXIMAS MEJORAS:

Algunas mejoras que quiero agregar:

- hacer que solo el dueño de un post pueda eliminarlo.
- asociar comentarios a usuarios reales,
- mejorar el sistema de likes para evitar votos repetidos.
- validar mejor el tamaño y formato de las imágenes.
- mejorar mensajes de error en el frontend.
- mejorar el diseño responsive.
- agregar Docker
- agregar dominio propio.
- agregar tests básicos.
- documentar mejor la arquitectura.

QUE APRENDÍ:

Con este proyecto practiqué separar frontend, backend, base de datos y almacenamiento, desplegar una app real en AWS, usar S3 para archivos e imágenes, usar RDS PostgreSQL, correr un backend en EC2, usar CloudFront para HTTPS, manejar autenticación con JWT, proteger rutas con middleware, trabajar con variables de entorno y debuggear errores reales de backend, CORS, CloudFront y despliegue.

AUTOR:
 Tobias Valentin  Machelett Sanhuesa
