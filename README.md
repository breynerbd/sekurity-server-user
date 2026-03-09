# 🔐 Sekurity Server - User Service

**Sekurity Server User** es un microservicio encargado de gestionar funcionalidades relacionadas con **seguridad, reputación y moderación de usuarios** dentro de una plataforma.

Este servicio permite a los usuarios:

- Crear y administrar comentarios
- Crear y gestionar reportes
- Calificar reportes (ratings)
- Consultar estadísticas de reportes
- Administrar su perfil
- Consultar zonas disponibles

El servicio está desarrollado con **Node.js, Express y PostgreSQL**, utilizando **JWT para autenticación** y múltiples **middlewares para reforzar la seguridad del sistema**.

---

# 🚀 Tecnologías Utilizadas

- **Node.js**
- **Express.js**
- **PostgreSQL**
- **Sequelize (ORM)**
- **Helmet** – Seguridad de cabeceras HTTP
- **CORS** – Control de acceso entre dominios
- **JWT** – Autenticación de usuarios
- **Docker** – Contenerización del servicio

---

# 📁 Estructura del Proyecto

```
sekurity-server-user
│
├── configs
│   ├── app.js
│   ├── cors-configuration.js
│   ├── db.js
│   └── helmet-configuration.js
│
├── middlewares
│   ├── authenticateUser.js
│   ├── daily-limit-validators.js
│   ├── handle-errors.js
│   └── request-limit.js
│
├── src
│   ├── comments
│   ├── ratings
│   ├── reports
│   ├── users
│   ├── zones
│   ├── utils
│   └── associations.js
│
├── Dockerfile
├── .env
├── index.js
├── package.json
└── README.md
```

---

# ⚙️ Instalación

## 1️⃣ Clonar el repositorio

```bash
git clone https://github.com/tu-repositorio/sekurity-server-user.git
cd sekurity-server-user
```

## 2️⃣ Instalar dependencias

```bash
npm install
```

## 3️⃣ Configurar variables de entorno

Crear el archivo `.env` en la raíz del proyecto:

```
PORT=3006

DB_NAME=sekurity
DB_USER=postgres
DB_PASSWORD=admin
DB_HOST=db
DB_PORT=5432

JWT_SECRET=F8dK92msLxQ1pZtW7eHrC4nVuY5aGbT3jRkP6qXsDfL8vNmH2wEcY9uBiO1zT4sR
```

---

# 🗄️ Base de Datos

El servicio utiliza **PostgreSQL** como sistema de base de datos.

Las principales entidades del sistema incluyen:

- **Users**
- **Comments**
- **Reports**
- **Ratings**
- **Zones**

Las relaciones entre los modelos se definen en:

```
src/associations.js
```

---

# 🔐 Autenticación

Los endpoints protegidos utilizan el middleware:

```
authenticateUser
```

Este middleware:

- Verifica el **token JWT**
- Decodifica la información del usuario
- Permite acceder a las rutas protegidas

Archivo:

```
middlewares/authenticateUser.js
```

---

# 📡 Endpoints de la API

## 💬 Comentarios

Permite a los usuarios crear y administrar comentarios.

| Método | Endpoint |
|------|------|
| POST | `/comments` |
| GET | `/comments/myComments` |
| GET | `/comments` |
| PUT | `/comments/:id` |
| DELETE | `/comments/:id` |

---

# ⭐ Ratings

Permite a los usuarios calificar reportes dentro del sistema.

| Método | Endpoint |
|------|------|
| GET | `/ratings/myRatings` |
| POST | `/ratings` |

---

# 🚨 Reportes

Sistema que permite a los usuarios reportar incidentes o problemas.

| Método | Endpoint |
|------|------|
| POST | `/reports` |
| GET | `/reports/myReports` |
| GET | `/reports` |
| GET | `/reports/stats` |
| GET | `/reports/severityStats` |
| GET | `/reports/reportsByStatus/:status` |
| PUT | `/reports/:id` |
| DELETE | `/reports/:id` |

Ejemplo:

```
GET /reports/reportsByStatus/pending
```

---

# 👤 Usuarios

Gestión del perfil del usuario autenticado.

| Método | Endpoint |
|------|------|
| GET | `/users/me` |
| PUT | `/users/me` |

---

# 📍 Zonas

Permite consultar las zonas disponibles dentro del sistema.

| Método | Endpoint |
|------|------|
| GET | `/zones` |

---

# 🛡️ Seguridad del Sistema

El servicio implementa múltiples **capas de seguridad**.

## 🔐 Autenticación JWT

Protección de endpoints mediante **tokens JWT**.

---

## 🚫 Rate Limiting

Previene abuso de la API limitando la cantidad de solicitudes.

Middleware:

```
middlewares/request-limit.js
```

---

## 📅 Límites diarios

Controla la cantidad de acciones que un usuario puede realizar por día.

Ejemplos:

- Comentarios diarios
- Reportes diarios
- Calificaciones diarias

Middleware:

```
middlewares/daily-limit-validators.js
```

---

## ⚠️ Manejo global de errores

El sistema utiliza un **middleware centralizado** para manejar errores.

```
middlewares/handle-errors.js
```

---

# 🔗 Asociaciones de Modelos

Las relaciones entre entidades del sistema se definen en:

```
src/associations.js
```

Esto permite manejar relaciones entre:

- Usuarios
- Comentarios
- Reportes
- Ratings
- Zonas

---

# 🐳 Docker

El proyecto incluye soporte para **contenedores Docker**.

## Construir imagen

```bash
docker build -t sekurity-server-user .
```

## Ejecutar contenedor

```bash
docker run -p 3006:3006 sekurity-server-user
```