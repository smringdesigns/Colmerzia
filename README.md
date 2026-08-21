# 🛒 Colmerzia

> Plataforma SaaS multi-tenant para la gestión comercial, administrativa y de comercio electrónico de múltiples negocios.

Colmerzia es una plataforma desarrollada para centralizar la operación de diferentes tiendas y negocios dentro de una misma aplicación.

El sistema permite gestionar usuarios, roles, productos, inventario, bodegas, clientes, pedidos y configuración de cada tienda. Además, incorpora un **Storefront público independiente** que permite a cada negocio ofrecer su catálogo, registrar clientes y realizar procesos de compra.

El proyecto está construido bajo una arquitectura desacoplada y está compuesto por tres aplicaciones principales:

* **Backend API** — Laravel + PostgreSQL.
* **Panel Administrativo** — React + TypeScript.
* **Storefront** — React + TypeScript.

Todo el entorno de desarrollo está orquestado mediante **Docker Compose**.

---

# 📋 Tabla de contenidos

* [Características](#-características)
* [Arquitectura](#️-arquitectura)
* [Multi-tenancy](#-multi-tenancy)
* [Stack tecnológico](#-stack-tecnológico)
* [Estructura del proyecto](#-estructura-del-proyecto)
* [Servicios Docker](#-servicios-docker)
* [Módulos principales](#-módulos-principales)
* [API](#-api)
* [Requisitos](#-requisitos)
* [Instalación](#-instalación)
* [Variables de entorno](#️-variables-de-entorno)
* [Comandos útiles](#-comandos-útiles)
* [Puertos y servicios](#-puertos-y-servicios)
* [Estado del proyecto](#-estado-del-proyecto)

---

# 🚀 Características

## 🏢 Gestión multi-tenant

Colmerzia está diseñada para gestionar múltiples tiendas o espacios de trabajo dentro de una misma plataforma.

Cada tenant mantiene sus propios datos, incluyendo:

* Usuarios.
* Productos.
* Clientes.
* Inventario.
* Bodegas.
* Pedidos.
* Configuración.
* Storefront.
* Suscripciones.

El aislamiento de datos se gestiona mediante la resolución del tenant y scopes aplicados a los modelos correspondientes.

---

## 🏪 Gestión de tiendas

La plataforma permite:

* Crear tiendas mediante onboarding.
* Crear nuevos espacios de trabajo.
* Configurar información de la tienda.
* Gestionar el estado de una tienda.
* Identificar cada tienda mediante UUID.
* Administrar información comercial.
* Gestionar el tipo de negocio.

---

## 👑 Administración de plataforma

Existe un nivel de administración global para usuarios con el rol:

```text
super-admin
```

El Super Admin puede operar fuera del contexto de un tenant y administrar información global de la plataforma, incluyendo:

* Visualización de tiendas.
* Consulta detallada de tiendas.
* Eliminación de tiendas.
* Gestión global de usuarios.

---

## 👥 Gestión de usuarios

El panel administrativo permite gestionar:

* Usuarios.
* Estado de usuarios.
* Activación y desactivación.
* Roles.
* Permisos.
* Último acceso.

Los usuarios administrativos se autentican mediante Laravel Sanctum.

---

## 🔐 Roles y permisos

El sistema incorpora control de acceso granular mediante permisos.

Algunos módulos protegidos incluyen:

```text
products.view
products.create
products.update
products.delete

customers.view
customers.create
customers.update
customers.delete

inventory.view
inventory.create
inventory.update

users.view
users.create
users.update
users.delete

roles.view
roles.create
roles.update
roles.delete

orders.view
orders.update

settings.view
settings.update
```

---

## 📦 Gestión de productos

El módulo administrativo permite:

* Crear productos.
* Consultar productos.
* Editar productos.
* Eliminar productos.
* Gestionar variantes.
* Gestionar imágenes.
* Asociar categorías.
* Gestionar disponibilidad.
* Exponer productos al Storefront.

---

## 🏷️ Categorías y marcas

La arquitectura del dominio contempla:

* Categorías.
* Marcas.
* Productos.
* Variantes.
* Imágenes.

Estos elementos forman parte del catálogo comercial de cada tienda.

---

## 🏬 Bodegas

Cada tienda puede gestionar múltiples bodegas.

Las funcionalidades incluyen:

* Crear bodegas.
* Consultar bodegas.
* Actualizar información.
* Eliminar bodegas.
* Definir una bodega como principal.

---

## 📊 Inventario

El inventario se administra mediante entidades específicas:

```text
Inventory
InventoryMovement
Warehouse
```

Cada registro de inventario permite controlar:

* Stock.
* Stock reservado.
* Stock mínimo.
* Producto o variante.
* Bodega.
* Movimientos de inventario.

El sistema incluye comandos y servicios para sincronización y administración de stock.

---

## 🛍️ Storefront

El proyecto incluye una aplicación pública independiente para comercio electrónico.

El Storefront permite:

* Consultar información de la tienda.
* Visualizar productos.
* Consultar detalle de productos.
* Navegar categorías.
* Registrar clientes.
* Iniciar sesión como cliente.
* Gestionar direcciones.
* Gestionar carrito de compras.
* Modificar cantidades.
* Eliminar productos.
* Aplicar cupones.
* Realizar checkout.

---

## 👤 Clientes

Los clientes del Storefront son independientes de los usuarios administrativos.

Las funcionalidades incluyen:

* Registro.
* Inicio de sesión.
* Autenticación.
* Perfil.
* Direcciones.
* Carrito.
* Pedidos.

---

## 🛒 Carrito de compras

El módulo de carrito permite:

* Consultar el carrito.
* Agregar productos.
* Actualizar cantidades.
* Eliminar productos.
* Aplicar cupones.
* Eliminar cupones.

El dominio está implementado mediante:

```text
Cart
CartItem
Coupon
CartService
```

---

## 💳 Checkout y pedidos

El flujo comercial incluye:

```text
Carrito
   │
   ▼
Validación de inventario
   │
   ▼
Aplicación de descuentos
   │
   ▼
Checkout
   │
   ▼
Pedido
   │
   ▼
Pago
```

El sistema incluye:

* Pedidos.
* Detalles de pedido.
* Estados.
* Pagos.
* Métodos de pago.
* Transacciones.
* Descuentos.
* Reglas comerciales.

---

## 💰 Suscripciones

La arquitectura incluye soporte para planes y suscripciones.

Algunas operaciones de escritura están protegidas mediante:

```text
subscription.writable
```

Esto permite controlar qué funcionalidades pueden ser modificadas dependiendo del estado de la suscripción.

---

# 🏗️ Arquitectura

La arquitectura general del sistema está compuesta por tres aplicaciones independientes:

```text
                         ┌──────────────────────┐
                         │       USUARIOS       │
                         └──────────┬───────────┘
                                    │
                    ┌───────────────┼───────────────┐
                    │                               │
                    ▼                               ▼
        ┌──────────────────────┐        ┌──────────────────────┐
        │  PANEL ADMINISTRATIVO│        │      STOREFRONT      │
        │                      │        │                      │
        │ React + TypeScript   │        │ React + TypeScript   │
        │      + Vite          │        │      + Vite          │
        │                      │        │                      │
        └──────────┬───────────┘        └──────────┬───────────┘
                   │                               │
                   └───────────────┬───────────────┘
                                   │
                                   │ HTTP / REST API
                                   ▼
                       ┌──────────────────────┐
                       │       NGINX          │
                       │      Puerto 8080     │
                       └──────────┬───────────┘
                                  │
                                  ▼
                       ┌──────────────────────┐
                       │       BACKEND        │
                       │                      │
                       │ Laravel 13 + PHP 8.3 │
                       │                      │
                       └───────┬──────┬───────┘
                               │      │
                ┌──────────────┘      └──────────────┐
                ▼                                    ▼
       ┌──────────────────┐                 ┌──────────────────┐
       │    PostgreSQL    │                 │      Redis       │
       │                  │                 │                  │
       │   Base de datos  │                 │ Cache y colas    │
       └──────────────────┘                 └──────────────────┘
                                                     │
                                                     ▼
                                            ┌──────────────────┐
                                            │     Horizon      │
                                            │ Gestión de colas │
                                            └──────────────────┘
```

---

# 🏢 Multi-tenancy

La API está organizada en tres niveles principales:

```text
/api/v1
│
├── Públicas
│   ├── onboarding
│   ├── business-types
│   ├── register
│   ├── login
│   ├── forgot-password
│   └── reset-password
│
├── Autenticadas sin tenant
│   ├── me
│   ├── logout
│   ├── stores
│   └── platform
│
└── Multi-tenant
    │
    ├── Storefront público
    │   ├── store
    │   ├── products
    │   ├── categories
    │   ├── auth
    │   ├── addresses
    │   ├── cart
    │   └── checkout
    │
    └── Panel administrativo
        ├── products
        ├── customers
        ├── warehouses
        ├── inventory
        ├── settings
        ├── users
        ├── roles
        ├── permissions
        └── orders
```

Las rutas dependientes de una tienda utilizan los middlewares:

```text
tenant
store.active
```

Esto permite resolver el contexto de la tienda antes de ejecutar las operaciones correspondientes.

---

# 🧠 Arquitectura del Backend

El Backend utiliza una organización orientada a responsabilidades:

```text
Request
   │
   ▼
Controller
   │
   ▼
Service
   │
   ├── DTO
   │
   ├── Model
   │
   ├── Event
   │
   ├── Job
   │
   └── External Contract
   │
   ▼
Resource
   │
   ▼
JSON Response
```

La estructura incorpora:

* Controllers.
* Services.
* Contracts.
* DTOs.
* Requests.
* Resources.
* Models.
* Events.
* Listeners.
* Jobs.
* Policies.
* Middleware.
* Notifications.
* Mail.
* Exceptions.
* Enums.
* Support.

---

# 🧰 Stack tecnológico

## Backend

* PHP 8.3+
* Laravel 13
* Laravel Sanctum
* Laravel Horizon
* Laravel Telescope
* Laravel Tinker
* Laravel Pail
* PHPUnit
* Predis

## Frontend administrativo

* React 19
* TypeScript
* Vite
* React Router
* TanStack Query
* Zustand
* React Hook Form
* Zod
* Axios
* Tailwind CSS
* Lucide React

## Storefront

* React 19
* TypeScript
* Vite
* React Router
* TanStack Query
* Zustand
* Axios
* Tailwind CSS

## Persistencia y servicios

* PostgreSQL 17
* Redis 7
* Nginx
* Mailpit

## Infraestructura

* Docker
* Docker Compose

---

# 📁 Estructura del proyecto

```text
Colmerzia/
│
├── backend/                  # API REST y lógica de negocio
│   │
│   ├── app/
│   │   ├── Console/
│   │   ├── Contracts/
│   │   ├── DTOs/
│   │   ├── Enums/
│   │   ├── Events/
│   │   ├── Exceptions/
│   │   ├── Http/
│   │   │   ├── Controllers/
│   │   │   ├── Middleware/
│   │   │   ├── Requests/
│   │   │   └── Resources/
│   │   ├── Jobs/
│   │   ├── Listeners/
│   │   ├── Mail/
│   │   ├── Models/
│   │   ├── Notifications/
│   │   ├── Policies/
│   │   ├── Providers/
│   │   ├── Services/
│   │   └── Support/
│   │
│   ├── config/
│   ├── database/
│   ├── routes/
│   ├── tests/
│   └── ...
│
├── frontend/                 # Panel administrativo
│   ├── src/
│   ├── public/
│   └── ...
│
├── storefront/               # Tienda pública
│   ├── src/
│   ├── public/
│   └── ...
│
├── docker/
│   ├── nginx/
│   ├── node/
│   └── php/
│
├── infrastructure/           # Recursos de infraestructura
│
├── scripts/                  # Scripts de automatización
│
├── docs/                     # Documentación adicional
│
├── docker-compose.yml
│
└── README.md
```

---

# 🐳 Servicios Docker

El proyecto se ejecuta mediante los siguientes servicios:

| Servicio   | Contenedor             | Función               |
| ---------- | ---------------------- | --------------------- |
| Backend    | `colmerzia_backend`    | API Laravel           |
| Frontend   | `colmerzia_frontend`   | Panel administrativo  |
| Storefront | `colmerzia_storefront` | Tienda pública        |
| Nginx      | `colmerzia_nginx`      | Servidor web          |
| PostgreSQL | `colmerzia_postgres`   | Base de datos         |
| Redis      | `colmerzia_redis`      | Cache y colas         |
| Mailpit    | `colmerzia_mailpit`    | Correos de desarrollo |

---

# 📦 Módulos principales

## Plataforma

```text
Platform
├── Stores
├── Users
└── Super Admin
```

## Administración de tienda

```text
Store
├── Products
├── Customers
├── Warehouses
├── Inventory
├── Settings
├── Users
├── Roles
├── Permissions
└── Orders
```

## Catálogo

```text
Catalog
├── Categories
├── Brands
├── Products
├── Product Variants
└── Product Images
```

## Inventario

```text
Inventory
├── Warehouses
├── Stock
├── Reserved Stock
├── Minimum Stock
└── Inventory Movements
```

## Comercio electrónico

```text
Storefront
├── Store
├── Catalog
├── Customers
├── Addresses
├── Cart
├── Coupons
├── Checkout
├── Orders
└── Payments
```

---

# 🌐 API

La API utiliza la siguiente base:

```text
http://localhost:8080/api/v1
```

Ejemplos:

## Autenticación

```text
POST /api/v1/login
POST /api/v1/register
GET  /api/v1/me
POST /api/v1/logout
```

## Onboarding

```text
POST /api/v1/onboarding
GET  /api/v1/business-types
```

## Productos

```text
GET    /api/v1/products
POST   /api/v1/products
GET    /api/v1/products/{product}
PUT    /api/v1/products/{product}
DELETE /api/v1/products/{product}
```

## Inventario

```text
GET   /api/v1/inventory
PATCH /api/v1/inventory/{inventory}
GET   /api/v1/inventory/{inventory}/movements
```

## Storefront

```text
GET /api/v1/storefront/store
GET /api/v1/storefront/products
GET /api/v1/storefront/products/{slug}
GET /api/v1/storefront/categories
```

## Carrito

```text
GET    /api/v1/storefront/cart
POST   /api/v1/storefront/cart/items
PATCH  /api/v1/storefront/cart/items/{item}
DELETE /api/v1/storefront/cart/items/{item}
```

## Checkout

```text
POST /api/v1/storefront/checkout
```

---

# ⚙️ Requisitos

Para ejecutar el proyecto se recomienda tener instalado:

* Docker Desktop.
* Docker Compose.
* Git.
* Visual Studio Code u otro editor.

No es necesario instalar directamente en el sistema:

* PHP.
* Composer.
* Node.js.
* npm.
* PostgreSQL.
* Redis.

Estos servicios son ejecutados mediante Docker.

---

# 🚀 Instalación

## 1. Clonar el repositorio

```bash
git clone <URL_DEL_REPOSITORIO>
```

```bash
cd Colmerzia
```

---

## 2. Configurar variables de entorno

Crear el archivo principal:

```bash
cp .env.example .env
```

Configurar las variables necesarias para Docker.

Luego configurar el Backend:

```bash
cp backend/.env.example backend/.env
```

---

## 3. Levantar los servicios

```bash
docker compose up -d --build
```

Verificar el estado:

```bash
docker compose ps
```

---

## 4. Instalar dependencias

### Backend

```bash
docker compose exec backend composer install
```

### Frontend administrativo

```bash
docker compose exec frontend npm install
```

### Storefront

```bash
docker compose exec storefront npm install
```

---

## 5. Generar la clave de Laravel

```bash
docker compose exec backend php artisan key:generate
```

---

## 6. Ejecutar migraciones

```bash
docker compose exec backend php artisan migrate
```

---

# 🔧 Variables de entorno

## Backend

Archivo:

```text
backend/.env
```

Configuración principal:

```env
APP_NAME=Colmerzia
APP_ENV=local
APP_DEBUG=true
APP_URL=http://localhost:8080
```

## Base de datos

```env
DB_CONNECTION=pgsql
DB_HOST=postgres
DB_PORT=5432
DB_DATABASE=db_colmerzia
DB_USERNAME=postgres
DB_PASSWORD=postgres
```

## Redis

```env
REDIS_HOST=redis
REDIS_PORT=6379
```

## Colas

```env
QUEUE_CONNECTION=redis
```

## Cache

```env
CACHE_STORE=redis
```

## Correo

```env
MAIL_MAILER=smtp
MAIL_HOST=mailpit
MAIL_PORT=1025
```

---

# 🔌 Puertos y servicios

| Servicio   | URL / Puerto                   |
| ---------- | ------------------------------ |
| API        | `http://localhost:8080`        |
| API V1     | `http://localhost:8080/api/v1` |
| Frontend   | `http://localhost:5173`        |
| Storefront | `http://localhost:5174`        |
| PostgreSQL | `localhost:5433`               |
| Redis      | `localhost:6379`               |
| Mailpit    | `http://localhost:8025`        |

---

# 🛠️ Comandos útiles

## Levantar servicios

```bash
docker compose up -d
```

## Reconstruir servicios

```bash
docker compose up -d --build
```

## Detener servicios

```bash
docker compose down
```

## Ver logs

```bash
docker compose logs -f
```

## Logs del Backend

```bash
docker compose logs -f backend
```

## Ejecutar comandos Artisan

```bash
docker compose exec backend php artisan
```

Ejemplo:

```bash
docker compose exec backend php artisan migrate
```

---

# 🧪 Pruebas

El Backend utiliza PHPUnit.

Para ejecutar las pruebas:

```bash
docker compose exec backend php artisan test
```

Para ejecutar una prueba específica:

```bash
docker compose exec backend php artisan test --filter=NombreDelTest
```

---

# 📈 Procesos asíncronos

El proyecto utiliza Redis como infraestructura para:

* Colas.
* Cache.
* Procesamiento asíncrono.

La arquitectura incluye Jobs como:

```text
GenerateProductImagesJob
SendWelcomeEmailJob
```

También utiliza:

```text
Events
Listeners
Notifications
Mail
```

Laravel Horizon está incluido para administrar y monitorear los procesos de cola.

---

# 🔒 Seguridad

La aplicación incorpora diferentes capas de seguridad:

* Autenticación mediante Laravel Sanctum.
* Roles y permisos.
* Policies.
* Middleware de autorización.
* Verificación de correo.
* Recuperación de contraseña.
* Rate limiting.
* URLs firmadas.
* Resolución del tenant.
* Validación de tienda activa.
* Control de suscripciones.
* Separación entre usuarios administrativos y clientes.

---

# 🚧 Estado del proyecto

> **Colmerzia se encuentra actualmente en desarrollo activo.**

La arquitectura base del sistema incluye los principales módulos administrativos y de comercio electrónico.

Actualmente se continúa trabajando en:

* Consolidación del flujo completo de inventario.
* Mejoras en el proceso de checkout.
* Integración y evolución de métodos de pago.
* Automatización de procesos.
* Cobertura de pruebas.
* Mejoras de experiencia de usuario.
* Optimización de la arquitectura multi-tenant.
* Evolución del Storefront.
* Nuevas funcionalidades administrativas.

---

# 📄 Licencia

Este proyecto se encuentra en desarrollo y la licencia será definida posteriormente.

---

<div align="center">

**Colmerzia** 🛒

*Plataforma SaaS para la gestión comercial y comercio electrónico.*

</div>