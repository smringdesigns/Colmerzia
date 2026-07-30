# 🛒 Colmerzia

Colmerzia es una plataforma web para la gestión comercial y administrativa de tiendas y negocios.

El proyecto busca centralizar diferentes procesos de una operación comercial, incluyendo la gestión de productos, categorías, marcas, inventario, clientes, ventas, usuarios y otros módulos administrativos.

La aplicación está construida con una arquitectura separada entre **Backend** y **Frontend**, comunicados mediante una API REST.

Todo el entorno de desarrollo se ejecuta utilizando **Docker y Docker Compose**. Docker se encarga de proporcionar el entorno de ejecución de la aplicación, incluyendo las dependencias necesarias para el Backend y el Frontend.

---

## 📌 Estado del proyecto

> 🚧 Colmerzia se encuentra actualmente en desarrollo activo.

Actualmente se está construyendo la base de la plataforma, incluyendo:

- Arquitectura de la aplicación.
- Infraestructura Docker.
- Sistema de autenticación.
- Gestión de usuarios.
- Arquitectura multiempresa.
- Gestión de tiendas.
- API REST.
- Gestión de productos.
- Categorías.
- Marcas.
- Frontend administrativo.
- Persistencia de datos en PostgreSQL.

---

## 🏗️ Arquitectura del proyecto

Colmerzia utiliza una arquitectura desacoplada entre Backend y Frontend.

```text
┌──────────────────────────────────────┐
│                                      │
│               FRONTEND               │
│                                      │
│          React + TypeScript          │
│               + Vite                 │
│                                      │
└──────────────────┬───────────────────┘
                   │
                   │ HTTP / REST API
                   │
┌──────────────────▼───────────────────┐
│               BACKEND                │
│                                      │
│               Laravel                │
│                 PHP                  │
│                                      │
└───────────────┬───────────┬──────────┘
                │           │
                │           │
      ┌─────────▼──────┐ ┌──▼──────────┐
      │                │ │             │
      │   PostgreSQL   │ │    Redis    │
      │                │ │             │
      └────────────────┘ └─────────────┘
```

Los servicios son administrados mediante: **Docker Compose**

---

## 🧰 Tecnologías utilizadas

### Backend
- PHP
- Laravel
- Laravel Sanctum
- Spatie Permission
- Eloquent ORM
- REST API

### Frontend
- React
- TypeScript
- Vite
- Material UI
- TanStack Query
- Zustand
- React Hook Form
- Zod

### Base de datos
- PostgreSQL

### Infraestructura
- Docker
- Docker Compose
- Nginx
- Redis
- Mailpit

### Herramientas
- Git
- GitHub
- Visual Studio Code
- Postman

---

## 🐳 Docker

El proyecto utiliza Docker para ejecutar los diferentes servicios de la aplicación. La configuración principal se encuentra en: `docker-compose.yml`

Docker se encarga de proporcionar el entorno de ejecución completo del proyecto. Esto incluye:

- **Entorno de ejecución del Backend:** PHP, Composer, Dependencias de Laravel.
- **Entorno de ejecución del Frontend:** Node.js, npm, Dependencias de React.
- **Servicios adicionales:** PostgreSQL, Redis, Nginx, Mailpit.

**Los principales servicios son:**

| Servicio | Descripción |
|----------|-------------|
| `backend` | API desarrollada con Laravel |
| `frontend` | Aplicación web desarrollada con React |
| `postgres` | Base de datos PostgreSQL |
| `redis` | Sistema de cache y colas |
| `nginx` | Servidor web y proxy |
| `mailpit` | Servidor de correo electrónico para desarrollo |

---

## 📋 Requisitos

Para ejecutar el proyecto se requiere tener instalado:

- Docker Desktop
- Git
- Visual Studio Code (opcional)

**No es necesario instalar directamente en el sistema local:** PHP, Composer, Node.js, npm, PostgreSQL o Redis. Estas herramientas y servicios son gestionados mediante los contenedores Docker del proyecto.

---

## 🚀 Instalación

### 1. Clonar el repositorio

```bash
git clone https://github.com/smringdesigns/Colmerzia.git
cd colmerzia
```

### 2. Configurar las variables de entorno

Configurar los archivos `.env` requeridos por el proyecto. El Backend utiliza `backend/.env`.

Las variables de entorno deben coincidir con los servicios definidos en `docker-compose.yml`.

**Ejemplo de configuración:**
```env
APP_NAME=Colmerzia
APP_ENV=local
APP_DEBUG=true

DB_CONNECTION=pgsql
DB_HOST=postgres
DB_PORT=5432
DB_DATABASE=colmerzia
DB_USERNAME=postgres
DB_PASSWORD=postgres

REDIS_HOST=redis
```
*(Los valores reales pueden variar según la configuración definida en el archivo docker-compose.yml).*

### 3. Construir y levantar el proyecto

Desde la raíz del proyecto ejecutar:

```bash
docker compose up -d --build
```

Este comando se encarga de construir las imágenes Docker, crear la red y volúmenes, instalar dependencias de Backend y Frontend, e iniciar los servicios.

### 4. Verificar los contenedores

```bash
docker compose ps
```
Los servicios deben aparecer activos y funcionando.

### 5. Ver los logs

Para ver los logs de todos los servicios:
```bash
docker compose logs -f
```
Para ver los logs del Backend:
```bash
docker compose logs -f backend
```
Para ver los logs del Frontend:
```bash
docker compose logs -f frontend
```

---

## ⚙️ Backend

El Backend de Colmerzia está desarrollado utilizando **Laravel + PHP**.

Su responsabilidad principal es gestionar la lógica de negocio, autenticación, usuarios, permisos, tiendas, productos, categorías, marcas, la base de datos, y exponer la API REST.

### 📂 Estructura del Backend
```text
backend/
│
├── app/
│   ├── Http/
│   │   ├── Controllers/Api/V1/
│   │   ├── Requests/
│   │   └── Resources/
│   ├── Models/
│   └── Services/
├── database/
│   ├── factories/
│   ├── migrations/
│   └── seeders/
├── routes/
│   ├── api.php
│   └── web.php
├── config/
├── storage/
├── Dockerfile
├── composer.json
└── .env
```

### 🔐 Autenticación

La autenticación de la API se realiza mediante **Laravel Sanctum**. El usuario autenticado puede acceder a los recursos autorizados de la aplicación.
La arquitectura utiliza el concepto de tienda: `store_id`. Esto permite relacionar los usuarios y los recursos con una tienda específica.

### 🏪 Arquitectura Multiempresa

Colmerzia está diseñada para soportar múltiples tiendas. Los datos pertenecientes a una tienda se filtran mediante `store_id`.

**Ejemplo:**
```text
Usuario
   │
   └── store_id = 1
          │
          ├── Productos
          ├── Categorías
          ├── Clientes
          └── Pedidos
```
Esto permite evitar que los datos de una tienda sean visibles para otra tienda.

### 🛍️ Módulo de productos

Actualmente el Backend cuenta con un módulo de productos que permite: Crear, consultar (específico o listado), actualizar, eliminar, buscar, filtrar y paginar productos.

**Endpoints de productos:**
```http
GET    /api/v1/products
POST   /api/v1/products
GET    /api/v1/products/{id}
PUT    /api/v1/products/{id}
DELETE /api/v1/products/{id}
```

**Funcionalidades del listado:**
- **Búsqueda (name, sku):** `/api/v1/products?search=laptop`
- **Filtro por estado:** `/api/v1/products?is_active=true`
- **Filtro por categoría:** `/api/v1/products?category_id=1`
- **Paginación:** `/api/v1/products?per_page=15`

**Slugs:** Los productos generan automáticamente un slug único por tienda.
- `Laptop Lenovo IdeaPad` ➡️ `laptop-lenovo-ideapad`
- Si existe ➡️ `laptop-lenovo-ideapad-1`

---

## 🖥️ Frontend

El Frontend está desarrollado utilizando **React + TypeScript + Vite**. Su responsabilidad es proporcionar la interfaz visual de la plataforma.

### 📂 Estructura del Frontend
```text
frontend/
│
├── src/
│   ├── components/  (Componentes reutilizables)
│   ├── features/    (Funcionalidades agrupadas por módulo)
│   ├── hooks/       (Hooks personalizados)
│   ├── layouts/     (Layouts de la aplicación)
│   ├── pages/       (Páginas de la aplicación)
│   ├── services/    (Comunicación con la API)
│   ├── stores/      (Estados globales)
│   ├── types/       (Tipos TypeScript)
│   └── App.tsx
│
├── Dockerfile
├── package.json
├── tsconfig.json
└── vite.config.ts
```

---

## 🗄️ Base de datos (PostgreSQL)

La base de datos se ejecuta dentro de un contenedor Docker. El Backend se conecta al servicio mediante: `DB_HOST=postgres`.

**Migraciones y Seeders:**
```bash
# Migraciones
docker compose exec backend php artisan migrate

# Migraciones y seeders
docker compose exec backend php artisan migrate --seed

# Solo seeders
docker compose exec backend php artisan db:seed
```

---

## 🔴 Otros Servicios Auxiliares

### Redis
Se utiliza como servicio auxiliar para cache, colas y procesamiento de tareas en segundo plano. Se ejecuta mediante Docker.

### 📧 Mailpit
Se utiliza durante el desarrollo para capturar los correos enviados por la aplicación (recuperación de contraseña, notificaciones, etc.) sin necesidad de enviar correos reales.

### 🌐 Nginx
Funciona como servidor web y proxy. Recibe solicitudes, redirige peticiones, sirve la aplicación y comunica el Frontend con el Backend.

---

## 📁 Estructura general del proyecto

```text
colmerzia/
│
├── backend/
│   ├── app/
│   ├── config/
│   ├── database/
│   ├── routes/
│   ├── storage/
│   ├── Dockerfile
│   ├── composer.json
│   └── .env
│
├── frontend/
│   ├── src/
│   ├── public/
│   ├── Dockerfile
│   ├── package.json
│   └── vite.config.ts
│
├── docker/
│   ├── backend/
│   ├── frontend/
│   └── nginx/
│
├── docker-compose.yml
├── .gitignore
└── README.md
```
# 1. Instalar Spatie Permission para manejar los roles (SuperAdmin, Owner, Manager, etc.)
composer require spatie/laravel-permission

# 2. Instalar el cliente de Redis (necesario para caché y colas)
composer require predis/predis

# 3. Instalar y configurar Laravel Horizon (panel de monitoreo de colas)
composer require laravel/horizon
php artisan horizon:install

# 4. Instalar y configurar Laravel Telescope (herramienta de depuración)
composer require laravel/telescope --dev
php artisan telescope:install
---

## 🐳 Comandos Útiles

### Docker
```bash
# Iniciar los servicios
docker compose up -d

# Construir y levantar los servicios
docker compose up -d --build

# Construir las imágenes
docker compose build

# Ver el estado y logs
docker compose ps
docker compose logs -f
docker compose logs -f backend
docker compose logs -f frontend

# Detener servicios (y eliminar contenedores/volúmenes)
docker compose stop
docker compose down
docker compose down -v  # ⚠️ Elimina datos persistentes
docker compose restart
```

### Backend (Artisan)
```bash
docker compose exec backend php artisan
docker compose exec backend php artisan migrate
docker compose exec backend php artisan migrate --seed
docker compose exec backend php artisan optimize:clear
docker compose exec backend bash
```

### Frontend (npm)
```bash
docker compose exec frontend npm run build
docker compose exec frontend npm <comando>
```

---

## 🔧 Flujo de desarrollo general

1. Iniciar el entorno: `docker compose up -d` (usar `--build` si hay cambios en configuración).
2. Verificar: `docker compose ps`
3. Ejecutar migraciones si es necesario: `docker compose exec backend php artisan migrate`
4. Limpiar caché si es necesario: `docker compose exec backend php artisan optimize:clear`
5. Revisar logs en caso de error: `docker compose logs -f`

---

## 🌿 Git y Convenciones

El proyecto utiliza Git para el control de versiones.

### Flujo recomendado
```bash
git checkout -b feature/nombre-de-la-funcionalidad
git status
git add .
git commit -m "feat: descripción del cambio"
git push origin feature/nombre-de-la-funcionalidad
```

### Convención de commits
- `feat:` agrega nueva funcionalidad (ej. *feat: agrega módulo de productos*)
- `fix:` corrige un error (ej. *fix: corrige filtro de productos*)
- `refactor:` reorganiza el código sin cambiar comportamiento
- `docs:` actualiza documentación
- `chore:` tareas de mantenimiento (ej. *chore: actualiza configuración de Docker*)

---

## 🔒 Variables de entorno

Los archivos `.env` contienen información sensible y **no deben subirse al repositorio**.
El `.gitignore` debe incluir `.env` y `.env.*` pero permitir `!.env.example`. 
Mantén siempre el `.env.example` actualizado con la estructura, pero sin datos reales.

---

## 📌 Funcionalidades actuales y 🚧 Próximos módulos

**Actualmente implementado:**
- Arquitectura separada (Laravel + React) con Docker Compose.
- Base de datos en PostgreSQL, Cache en Redis, Proxy Nginx, Mailpit.
- Autenticación con Laravel Sanctum y Gestión de usuarios.
- Arquitectura multiempresa (separación por `store_id`).
- Módulo de productos, categorías y marcas con búsqueda, filtrado, paginación y slugs únicos.
- Soft Delete y UUIDs.

**Próximos módulos a implementar:**
- Gestión avanzada de tiendas e inventario (movimientos).
- Gestión de clientes, pedidos y ventas.
- Gestión de empleados (roles y permisos avanzados).
- Configuración de tienda y métodos de pago.
- Reportes, dashboard con métricas y estadísticas comerciales.

---

## 🤝 Contribución
Las contribuciones al proyecto son bienvenidas. Sigue el flujo de ramas recomendado, verifica el funcionamiento antes de hacer commit, y crea un Pull Request.

## 📄 Licencia
Este proyecto se encuentra actualmente en desarrollo. La licencia definitiva del proyecto será definida posteriormente.

---

**🚀 Colmerzia**  
*Gestión comercial moderna, modular y escalable.*  
Construido con: Laravel | React | TypeScript | PostgreSQL | Redis | Docker
