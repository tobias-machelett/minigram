MINIGRAM

Minigram es una aplicación web tipo red social simple que estoy desarrollando como proyecto personal para practicar backend, frontend, bases de datos y servicios cloud en AWS.

La idea es construir una app donde un usuario pueda registrarse, iniciar sesión, subir imágenes, ver publicaciones, comentar y dar likes/dislikes. Todavía está en desarrollo, pero ya tiene una base funcional desplegada en AWS.

Demo: https://dkk95jncs305s.cloudfront.net

Nota: la demo puede estar pausada temporalmente para evitar costos de AWS. Si EC2 o RDS están apagadas, el frontend puede abrir, pero login, posts, comentarios o subida de imágenes pueden fallar.

OBJETIVO DEL PROYECTO: El objetivo principal es practicar una arquitectura más cercana a un proyecto real, separando frontend, backend, base de datos y almacenamiento de archivos.

Con este proyecto estoy trabajando:

- backend con Node.js y Express;
- base de datos PostgreSQL en RDS;
- almacenamiento de imágenes en S3;
- frontend estático;
- autenticación con JWT;
- contraseñas protegidas con bcrypt;
- despliegue en EC2;
- CloudFront para exponer la app con HTTPS;
- organización del código en rutas, controladores, configuración y middleware;
- permisos con IAM Role para que EC2 pueda acceder a S3 sin guardar access keys en el código.

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
- IAM Role
- Elastic IP
- Security Groups

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
- Comentarios asociados a usuarios mediante user_id.
- Los comentarios devuelven username y profile_image_url.
- Columna profile_image_url preparada para futuras fotos de perfil.
- Eliminación de publicaciones.
- Eliminación de posts protegida con JWT.
- Validación para que solo el dueño del post pueda eliminarlo.
- Eliminación de comentarios protegida con JWT.
- Rutas protegidas con middleware.
- Backend corriendo en EC2 con PM2.
- Frontend servido mediante S3 y CloudFront.
- Frontend actualizado para mandar token al comentar y eliminar.

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

- las contraseñas no se guardan en texto plano;
- bcrypt se usa para proteger las contraseñas;
- JWT se usa para manejar autenticación;
- varias rutas están protegidas con middleware;
- las credenciales sensibles se manejan con variables de entorno;
- el archivo `.env` real no se sube al repositorio;
- la instancia EC2 usa un IAM Role para acceder a S3 sin guardar access keys dentro del código;
- CloudFront permite usar HTTPS para acceder a la aplicación;
- la eliminación de posts valida que el usuario autenticado sea dueño del post;
- los comentarios nuevos se asocian al usuario que los escribió.

VARIABLES DE ENTORNO:

El proyecto necesita un archivo `.env` basado en `.env.example`.

Ejemplo:

    DB_HOST=
    DB_USER=
    DB_PASSWORD=
    DB_NAME=
    DB_PORT=5432

    AWS_REGION=
    S3_BUCKET=

    PORT=3000

    JWT_SECRET=

El archivo `.env` real contiene datos sensibles y no debe subirse a GitHub.

CÓMO CORRERLO LOCALMENTE:

Para probar el backend en local hay que clonar el repo, instalar dependencias con `npm install` y crear un archivo `.env` usando `.env.example` como guía.

    git clone https://github.com/tobias-machelett/minigram.git
    cd minigram
    npm install

Después se puede levantar con:

    node server.js

En la instancia EC2 lo dejo corriendo con PM2:

    pm2 start server.js --name minigram

ESTADO ACTUAL:

El proyecto ya tiene una versión funcional desplegada en AWS.

Actualmente funciona el registro, login, autenticación con JWT, subida de imágenes, guardado en S3, guardado de datos en PostgreSQL, feed de publicaciones, comentarios asociados a usuarios, likes/dislikes, CloudFront como entrada HTTPS y backend en EC2 administrado con PM2.

Los comentarios nuevos quedan asociados al usuario que los escribió y el backend ya devuelve username y profile_image_url para poder mostrar comentarios más parecidos a una red social real.

PRÓXIMAS MEJORAS:

Algunas mejoras que quiero agregar:

- permitir que el dueño del comentario también pueda eliminar su propio comentario;
- agregar subida de foto de perfil;
- mostrar avatar del usuario en los comentarios;
- mejorar el diseño de los comentarios con CSS;
- mejorar el sistema de likes para evitar votos repetidos;
- validar mejor el tamaño y formato de las imágenes;
- mejorar mensajes de error en el frontend;
- mejorar el diseño responsive;
- migrar AWS SDK for JavaScript v2 a v3;
- agregar Docker;
- agregar dominio propio;
- agregar tests básicos;
- documentar mejor la arquitectura con un diagrama;
- evaluar AWS Secrets Manager para manejar secretos sensibles.

QUÉ APRENDÍ:

Con este proyecto practiqué separar frontend, backend, base de datos y almacenamiento, desplegar una app real en AWS, usar S3 para archivos e imágenes, usar RDS PostgreSQL, correr un backend en EC2, usar CloudFront para HTTPS, manejar autenticación con JWT, proteger rutas con middleware, trabajar con variables de entorno, usar IAM Role para acceso a S3 y debuggear errores reales de backend, CORS, CloudFront, RDS, S3, JWT y despliegue.

También practiqué comandos de Linux y herramientas como ssh, nano, grep, curl, psql, PM2 y GitHub.

AUTOR:

Proyecto desarrollado por Tobias Machelett como parte de mi formación en backend, cloud computing y arquitectura AWS.
