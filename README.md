# 🛒 Colmerzia

> Plataforma SaaS multi-tenant de comercio electrónico para pequeños negocios colombianos.

Colmerzia le da a cada negocio su propia tienda en línea completa: catálogo,
inventario, pedidos, clientes, informes de ventas y ganancias reales, todo
administrado desde un panel propio — sin que el dueño de la tienda tenga que
tocar código ni pagar por un desarrollador.

La plataforma está pensada específicamente para Colombia: pesos colombianos,
zona horaria de Bogotá, y un flujo de onboarding que arma cada tienda distinto
según el tipo de negocio (retail, moda, tecnología, restaurantes, servicios).

---

## Tabla de contenidos

- [Arquitectura](#arquitectura)
- [Multi-tenancy — cómo se aíslan los datos](#multi-tenancy--cómo-se-aíslan-los-datos)
- [Stack tecnológico](#stack-tecnológico)
- [Módulos y funciones implementadas](#módulos-y-funciones-implementadas)
- [Estructura del repositorio](#estructura-del-repositorio)
- [Puesta en marcha — desarrollo local](#puesta-en-marcha--desarrollo-local)
- [Variables de entorno](#variables-de-entorno)
- [Comandos útiles](#comandos-útiles)
- [Puesta en marcha — producción](#puesta-en-marcha--producción)
- [Seguridad — lo que ya está cubierto](#seguridad--lo-que-ya-está-cubierto)
- [Deuda técnica y limpieza pendiente](#deuda-técnica-y-limpieza-pendiente)
- [Hoja de ruta](#hoja-de-ruta)

---

## Arquitectura

Colmerzia son **4 aplicaciones independientes** más un backend, todas en el
mismo repo (monorepo), orquestadas con Docker Compose:

| App | Para qué | Stack | Puerto (dev) |
|---|---|---|---|
| `backend/` | API REST, la única que toca la base de datos | Laravel 13 + PostgreSQL | `8080` (vía nginx) |
| `frontend/` | Panel administrativo — lo usa el dueño/empleado de CADA tienda | React 19 + TypeScript + Vite | `5173` |
| `storefront/` | Tienda pública — la ve el cliente final, una instancia sirve a TODAS las tiendas (se diferencian por subdominio) | React 19 + TypeScript + Vite | `5174` |
| `landing/` | Sitio de marketing de Colmerzia (la plataforma), vive en el dominio raíz | React 19 + TypeScript + Vite | `5175` |

**Por qué 4 apps y no una sola:** cada una tiene una audiencia y un ciclo de
vida distinto. El panel admin lo usa el negocio para gestionar; el storefront
lo usa el cliente final para comprar; la landing le vende la plataforma a
negocios que todavía no son clientes. Mezclarlas en una sola app hubiera
significado cargar código innecesario en cada una (ej. el bundle del panel
admin no tiene por qué viajar al navegador de un comprador).

### Diagrama de dominios (producción)

```
colmerzia.com          -> landing (marketing)
www.colmerzia.com      -> landing
admin.colmerzia.com    -> frontend (panel admin, TODAS las tiendas)
{tienda}.colmerzia.com -> storefront (una instancia, resuelve la tienda por subdominio)
```

Un reverse-proxy nginx público (`docker/nginx/prod.conf`) es el único punto
de entrada desde internet y rutea por `Host` header a cada app. El backend
nunca se expone directo — cada dominio le habla a través de `/api` en su
propio origen (evita tener que configurar CORS).

---

## Multi-tenancy — cómo se aíslan los datos

Una sola base de datos, un solo despliegue del backend, aislamiento
**a nivel de modelo** (no solo en los controllers):

- `BelongsToStoreScope` — Global Scope de Eloquent que filtra automáticamente
  toda query de un modelo tenant (Product, Order, Customer, Category, Brand,
  Inventory, etc.) por el `store_id` de la tienda activa. Aplica incluso al
  *route model binding* (`Category $category` en la firma de un método) —
  un usuario de la tienda A no puede resolver ni por accidente un ID que
  pertenece a la tienda B.
- `BelongsToStoreOrNullScope` — variante para roles de **sistema** (como
  `super-admin`), que deben verse desde cualquier tienda (`store_id = NULL`).
- El tenant activo se resuelve por **subdominio** (storefront) o por header
  `X-Tenant` explícito (panel admin, que corre en un solo dominio para todas
  las tiendas — ver `TenantResolver.php`).
- El **super-admin** (equipo de Colmerzia) puede entrar al panel de
  cualquier tienda desde "Todas las tiendas" en el sidebar — es intencional,
  necesario para dar soporte. `Gate::before()` en `AppServiceProvider.php`
  le da bypass total a los permisos.

---

## Stack tecnológico

**Backend**
- Laravel 13, PHP 8.3+
- PostgreSQL 17
- Redis 7 (cache, colas, sesiones)
- Sanctum (autenticación por token Bearer, no cookies — sin esto no hace
  falta configurar CORS con credenciales)
- Laravel Horizon (dashboard de colas), Telescope (debug, solo dev)

**Los 3 frontends (admin, storefront, landing)**
- React 19 + TypeScript + Vite
- Tailwind CSS v4 (CSS-first, sin `tailwind.config.js`)
- TanStack Query (estado de servidor / cache)
- React Router
- Zustand (panel admin, estado de sesión)
- React Hook Form + Zod (panel admin, formularios)

**Infraestructura**
- Docker Compose (dev y producción, archivos separados)
- nginx (reverse-proxy en producción, servido estático en cada app)
- Certbot + Cloudflare (SSL wildcard, ver `CERTBOT_CLOUDFLARE.md`)

---

## Módulos y funciones implementadas

### Autenticación y acceso
- Login / registro / recuperación de contraseña / verificación de email
  (panel admin y clientes del storefront, por separado)
- Roles y permisos granulares por módulo (`products.view`, `orders.create`,
  etc.), editable desde Configuración → Roles
- Rol `super-admin` de plataforma (`store_id = NULL`), con panel propio
  ("Todas las tiendas") para gestionar cualquier tienda
- Rate limiting en login/registro/checkout (`throttle:login`,
  `throttle:register`, límite general de API)

### Catálogo
- Productos (con variantes, imágenes, SKU, costo vs. precio de venta)
- **Categorías** — CRUD completo, jerarquía (categoría padre), asignables a
  productos. Bloquea el borrado si la categoría tiene productos.
- **Marcas** — mismo patrón que categorías, sin jerarquía.
- Inventario multi-bodega, con umbral de stock mínimo configurable

### Ventas
- Carrito y checkout (storefront), con precios **siempre recalculados del
  lado del servidor** — el cliente nunca puede mandar un precio manipulado
- Pedidos con estados (pendiente, pagado, enviado, entregado, cancelado) y
  timestamps reales por estado (`paid_at`, `shipped_at`, `delivered_at`)
- **Informe de ventas** (`/reports/sales`): ingresos, costos, ganancia real
  y margen por mes, con desglose diario y top productos. El costo es un
  *snapshot* guardado en el momento de la venta (`unit_cost` en
  `order_items`), no el costo actual del producto — así un informe de un
  mes cerrado no cambia si ajustás costos hoy
- Exportación de informes a CSV
- Pasarela de pago abstraída (`ManualPaymentGateway` por defecto,
  extensible a pasarelas reales)

### Clientes
- Cuentas de cliente en el storefront, con direcciones múltiples
- CRM básico desde el panel admin (ver, buscar, activar/desactivar)

### Dashboard del panel admin
- 4 tarjetas KPI (productos, clientes, pedidos, ventas del mes) con
  **variación % real vs. el mes anterior** calculada en el backend — si no
  hay mes anterior con datos, muestra "Nuevo" en vez de inventar un
  porcentaje
- Gráfico de ventas de los últimos 12 meses (SVG propio, sin librería de
  charts externa)
- Feed de actividad reciente (pedidos nuevos/enviados, clientes nuevos,
  alertas de stock bajo) — derivado de datos reales, no un sistema de
  auditoría genérico
- Búsqueda global en el topbar (productos, clientes, pedidos en un solo
  cuadro, respeta permisos del usuario)
- Notificaciones reales (pedidos pendientes + stock bajo), no decorativas

### Configuración de tienda
- Datos generales, moneda, zona horaria, redes sociales
- **Logo de la tienda** — sube/reemplaza/quita, se ve en el storefront
  público (Header y Footer)
- Tipo de negocio (retail, moda, tecnología, restaurante, servicios) —
  define el layout del storefront público (ver abajo)

### Storefront público (multi-layout)
El mismo código sirve **distintos layouts** según el tipo de negocio de
cada tienda (`storefront_layout`, calculado en el backend):
- **`catalog`** (retail/moda/tecnología) — grilla de productos clásica
- **`menu`** (restaurantes) — carta con secciones por categoría, navegación
  de anclas, filas compactas con "+" de agregado rápido
- **`services`** (servicios) — tarjetas grandes con la descripción como
  protagonista, no el precio

### Botón "Ver mi tienda"
En el sidebar del panel admin, abre el storefront público de esa tienda en
una pestaña nueva — usa la misma lógica que ya usaba el panel de
super-admin para entrar a cualquier tienda.

### Landing de Colmerzia
Página de marketing de la plataforma (no es una tienda — no tiene
`store_id`), con hero, tipos de negocio soportados, funciones, planes
(reflejando límites reales de `config/plans.php`) y botón de registro que
enlaza al flujo de onboarding real del panel admin.

---

## Estructura del repositorio

```
Colmerzia/
├── backend/                  Laravel — API REST
│   ├── app/
│   │   ├── Http/Controllers/Api/V1/       Controllers admin
│   │   │   └── Storefront/                Controllers públicos (storefront)
│   │   ├── Models/                        Eloquent + Global Scopes de tenancy
│   │   ├── Services/                      Lógica de negocio (Checkout, Cart, Auth, Onboarding, Inventory)
│   │   └── Support/                       BusinessTypeRegistry, PlanRegistry
│   ├── config/business_types.php          Tipos de negocio + categorías por defecto + layout
│   ├── config/plans.php                   Límites por plan (Free/Starter/Pro/Business)
│   ├── database/
│   │   ├── migrations/                    39 migraciones
│   │   └── seeders/                       PermissionSeeder, RoleSeeder, UserSeeder (production-safe)
│   └── routes/api.php                     Todas las rutas de la API
│
├── frontend/                 Panel administrativo (React)
│   └── src/
│       ├── pages/                         Una página por ruta
│       ├── features/                      Cliente API + lógica por dominio (products, orders, categories...)
│       ├── components/layout/             Sidebar, Header, GlobalSearch, NotificationsBell
│       └── store/authStore.ts             Sesión (Zustand)
│
├── storefront/                Tienda pública (React)
│   └── src/
│       ├── pages/                         CatalogHome / MenuHome / ServicesHome + Home.tsx (switcher)
│       ├── components/                    Header, Footer, ProductCard, CartDrawer
│       └── features/                      cart, catalog, customer, store
│
├── landing/                   Marketing de Colmerzia (React)
│   └── src/
│       ├── components/                    Nav, Hero, ReceiptCard, BusinessTypes, Features, Pricing
│       └── data/content.ts                Contenido reflejado a mano desde la config del backend
│
├── docker/
│   ├── php/                               Dockerfile.prod (3 etapas: vendor, app, web) + entrypoint
│   ├── node/                              Dockerfile.prod parametrizado (ARG APP_DIR) para las 3 apps Vite
│   └── nginx/                             prod.conf — reverse-proxy público
│
├── docker-compose.yml                     Desarrollo (bind mounts, Vite dev servers)
├── docker-compose.prod.yml                Producción (builds estáticos, límites de memoria, sin bind mounts)
├── .dockerignore                          Cubre las 4 apps
│
├── DEPLOY.md                              Guía de deploy paso a paso
├── WSL2_SETUP.md                          Windows Server + WSL2 + Docker (si aplica)
├── CERTBOT_CLOUDFLARE.md                  SSL wildcard con Certbot + Cloudflare
└── README.md                              Este archivo
```

---

## Puesta en marcha — desarrollo local

### Requisitos
- Docker Desktop (con soporte de contenedores Linux)
- Git

### 1. Clonar y configurar variables de entorno

```bash
git clone <url-del-repo> colmerzia
cd colmerzia
cp backend/.env.example backend/.env
```

Abrí `backend/.env` y completá al menos:
- `APP_KEY` (se genera en el paso 3, dejalo vacío por ahora)
- `SEED_ADMIN_PASSWORD` — la contraseña que va a tener el super-admin de
  plataforma. **Obligatoria**: sin esto, el seeder falla a propósito.

### 2. Levantar los contenedores

```bash
docker compose up -d --build
```

Esto levanta: `postgres`, `redis`, `mailpit`, `backend` (PHP-FPM), `nginx`
(sirve la API en `:8080`), y los 3 frontends Vite (`frontend`, `storefront`,
`landing`).

**Primera vez únicamente** — instalar dependencias dentro de los
contenedores Node (el volumen de `node_modules` arranca vacío):

```bash
docker compose exec frontend npm install
docker compose exec storefront npm install
docker compose exec landing npm install
```

Y las dependencias de PHP:

```bash
docker compose exec backend composer install
```

### 3. Preparar la base de datos

```bash
docker compose exec backend php artisan key:generate
docker compose exec backend php artisan migrate
docker compose exec backend php artisan db:seed
```

`db:seed` crea **únicamente** el super-admin de plataforma (email fijo en
`UserSeeder.php`, contraseña = tu `SEED_ADMIN_PASSWORD`). Las tiendas reales
se crean por el flujo de onboarding normal (`/create-account` en el panel
admin), no por seeder.

### 4. Habilitar el acceso a archivos subidos (logos, etc.)

```bash
docker compose exec backend php artisan storage:link
```

> Si `backend/public/storage` ya existe como un archivo vacío (puede pasar
> al clonar en Windows), borralo primero: `rm backend/public/storage` antes
> de correr el comando de arriba.

### 5. Acceder a las apps

| App | URL |
|---|---|
| Panel admin | http://localhost:5173 |
| Storefront | http://localhost:5174 (o `http://{subdominio}.localhost:5174` para una tienda específica) |
| Landing | http://localhost:5175 |
| API | http://localhost:8080/api |
| Mailpit (bandeja de pruebas) | http://localhost:8025 |

Iniciá sesión en el panel admin con el email fijado en `UserSeeder.php` y tu
`SEED_ADMIN_PASSWORD`, o creá una tienda nueva de prueba desde
`/create-account`.

---

## Variables de entorno

Referencia rápida de las variables que **no** son autoexplicativas
(el resto está documentado inline en `backend/.env.example`):

| Variable | Para qué |
|---|---|
| `TENANCY_CENTRAL_DOMAINS` | Dominios que NO representan una tienda (landing, admin) — separados por coma |
| `SEED_ADMIN_PASSWORD` | Obligatoria. Contraseña del super-admin creado por el seeder |
| `SANCTUM_TOKEN_EXPIRATION` | Minutos de vida del token de sesión (default 10080 = 7 días) |
| `VITE_API_URL` | Build-time (frontend/storefront). En prod: `/api` (mismo origen, sin CORS) |
| `VITE_ADMIN_URL` | Build-time (landing). URL del panel admin para el botón de registro |
| `VITE_LANDING_URL` | Build-time (frontend). URL de la landing para el link del logo en el sidebar |

Para producción, ver `.env.production.example` en la raíz del repo — trae
comentarios sobre qué cambiar respecto al de desarrollo (`APP_DEBUG=false`,
contraseñas reales, `SESSION_SECURE_COOKIE=true`, etc.).

---

## Comandos útiles

```bash
# Ver logs de un servicio
docker compose logs -f backend

# Entrar a un shell dentro de un contenedor
docker compose exec backend bash

# Correr un comando artisan cualquiera
docker compose exec backend php artisan <comando>

# Re-seedear solo un seeder puntual (es seguro, son idempotentes)
docker compose exec backend php artisan db:seed --class=RoleSeeder

# IMPORTANTE: los comandos de arriba se corren desde tu terminal normal
# (bash/PowerShell), NO pegues código PHP directo ahí. Para probar
# código PHP puntual, primero entrá a Tinker:
docker compose exec backend php artisan tinker
# y recién ahí pegás el código PHP.

# Parar todo
docker compose down

# Parar y borrar también los volúmenes (reinicia la base de datos)
docker compose down -v
```

---

## Puesta en marcha — producción

La guía completa está en **`DEPLOY.md`** (raíz del repo). Resumen:

1. `docker-compose.prod.yml` construye builds estáticos (no Vite dev
   servers) y corre el backend con OPcache habilitado — nada de bind mounts.
2. Un solo nginx público hace SSL termination y rutea por dominio
   (`docker/nginx/prod.conf`).
3. Certificado SSL **wildcard** (`*.colmerzia.com` + `colmerzia.com`) vía
   Certbot + validación DNS-01 — ver `CERTBOT_CLOUDFLARE.md` si el DNS está
   en Cloudflare.
4. Si el servidor es **Windows Server** (sin Hyper-V dedicado, con recursos
   limitados), ver `WSL2_SETUP.md` para correr Docker dentro de WSL2 con
   límites de memoria ajustados y arranque automático desatendido.
5. Migraciones y seeders se corren **a mano**, no automático al levantar
   los contenedores:
   ```bash
   docker compose -f docker-compose.prod.yml exec backend php artisan migrate --force
   ```

---

## Seguridad — lo que ya está cubierto

Confirmado en auditoría (agosto 2026), para que quede documentado y no haya
que reverificar cada vez:

- ✅ Precios de checkout siempre recalculados server-side, ningún endpoint
  acepta un `price`/`unit_price` desde el cliente
- ✅ Stock revalidado con lock dentro de una transacción al confirmar un
  pedido (evita vender la misma última unidad dos veces en checkouts
  simultáneos)
- ✅ `.env` nunca estuvo en el historial de git
- ✅ CORS con orígenes explícitos, sin comodín `*`
- ✅ Rate limiting en login, registro y API general
- ✅ Aislamiento multi-tenant a nivel de modelo (Global Scopes), no solo en
  controllers — protege también el *route model binding*
- ✅ Tokens Sanctum con expiración (7 días por defecto)

---

## Deuda técnica y limpieza pendiente

Cosas encontradas que no rompen nada pero conviene resolver cuando haya
tiempo:

- `composer.json` / `composer.lock` sueltos en la **raíz** del repo (fuera
  de `backend/`) — parecen un `composer require` corrido por error desde la
  carpeta equivocada. No tienen `vendor/` asociado, no hacen nada. Se pueden
  borrar.
- `frontend/.dockerignore` no se usa nunca (Docker solo respeta el
  `.dockerignore` en la raíz del build context, que es la raíz del repo en
  todos los Dockerfiles de este proyecto). Inofensivo, se puede borrar.
- `database/seeders/StoreSeeder.php`, `CatalogSeeder.php`,
  `CustomerSeeder.php` ya no se llaman desde `DatabaseSeeder.php` (a
  propósito, para no sembrar una tienda de prueba en cada instalación) pero
  siguen existiendo como archivos, corribles a mano con `--class=` si hacen
  falta para testing.
- Si aparecen archivos con nombres raros tipo `Store::query()->first()` en
  la raíz de `backend/`: son restos de comandos de Tinker pegados
  directamente en una terminal que no estaba dentro de
  `php artisan tinker` — el shell interpretó `>` como redirección. Se
  pueden borrar sin problema; ver la nota en "Comandos útiles" arriba para
  evitar que vuelva a pasar.

---

## Hoja de ruta

Pendiente, en ningún orden particular:

- [ ] Servidor de producción: terminar de crear la instancia (Oracle Cloud
      u otro) y completar el primer deploy real
- [ ] Backups automáticos de la base de datos — hoy no existe nada, ni
      siquiera un cron de `pg_dump`
- [ ] Precios reales de los planes (`config/plans.php` no tiene precios en
      pesos todavía, la landing muestra "Hablar con nosotros")
- [ ] Proveedor de correo real para producción (`.env.production.example`
      lo deja en blanco a propósito)
- [ ] Migrar `FILESYSTEM_DISK` de `local` a `s3`/R2 el día que la
      plataforma corra en más de un servidor backend a la vez (no antes,
      no hace falta con un solo servidor)
- [ ] Documentación de modelo de negocio y demás (siguiente paso, aparte de
      este README)
