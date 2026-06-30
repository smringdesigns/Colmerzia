# Commerzia
Plataforma E-Commerce

Commerzia es una plataforma eCommerce construida con:

* **Backend:** Laravel 13 + PostgreSQL
* **Frontend:** React 19 + Vite + TypeScript
* **Estado global:** Zustand
* **Fetching:** React Query
* **Formularios:** React Hook Form + Zod

---

# Requisitos previos

Instalar previamente:

* Git
* PHP 8.5+
* Composer 2+
* Node.js 22+
* PostgreSQL 16+
* Extensiones PHP necesarias para Laravel

Verificar:

```bash
php -v
composer -V
node -v
npm -v
psql --version
```

---

# 1. Clonar el repositorio

```bash
git clone https://github.com/TU-USUARIO/Commerzia.git

cd Commerzia
```

---

# 2. Instalar Backend (Laravel)

Entrar al backend:

```bash
cd backend
```

Instalar dependencias:

```bash
composer install
```

Copiar variables de entorno:

```bash
cp .env.example .env
```

Generar clave:

```bash
php artisan key:generate
```

Configurar la conexión PostgreSQL en `.env`:

```env
DB_CONNECTION=pgsql
DB_HOST=127.0.0.1
DB_PORT=5432
DB_DATABASE=dbcommerzia
DB_USERNAME=postgres
DB_PASSWORD=tu_password
```

Crear el enlace de almacenamiento:

```bash
php artisan storage:link
```

Limpiar caché:

```bash
php artisan optimize:clear
```

Ejecutar migraciones y seeders:

```bash
php artisan migrate:fresh --seed
```

Levantar servidor:

```bash
php artisan serve
```

El backend quedará disponible en:

```
http://localhost:8000
```

---

# 3. Instalar Frontend (React)

Abrir otra terminal:

```bash
cd frontend
```

Instalar dependencias:

```bash
npm install
```

Verificar que se instalaron correctamente:

```bash
npm list
```

Ejecutar servidor de desarrollo:

```bash
npm run dev
```

El frontend quedará disponible en:

```
http://localhost:5173
```

---

# Estructura del proyecto

```
Commerzia
│
├── backend
│   ├── app
│   ├── database
│   ├── routes
│   └── storage
│
└── frontend
    ├── src
    ├── public
    └── package.json
```

---

# Dependencias Frontend

El proyecto utiliza:

```json
{
  "react": "^19",
  "react-dom": "^19",
  "react-router-dom": "^7",
  "@tanstack/react-query": "^5",
  "axios": "^1",
  "zustand": "^5",
  "react-hook-form": "^7",
  "zod": "^4",
  "lucide-react": "^1",
  "clsx": "^2",
  "tailwindcss": "^4"
}
```

Instalación manual:

```bash
npm install \
react-router-dom \
axios \
@tanstack/react-query \
react-hook-form \
zod \
zustand \
lucide-react \
clsx
```

---

# Comandos útiles

## Backend

```bash
php artisan serve
php artisan migrate:fresh --seed
php artisan optimize:clear
php artisan route:list
php artisan about
```

## Frontend

```bash
npm run dev
npm run build
npm run preview
npm run lint
```

---

# Stack Tecnológico

* Laravel 13
* PHP 8.5
* PostgreSQL
* React 19
* Vite 8
* TypeScript 6
* TailwindCSS 4
* React Query
* Zustand
* Axios
* React Hook Form
* Zod

---

# Inicio rápido

```bash
git clone <repo>

cd backend
composer install
cp .env.example .env
php artisan key:generate
php artisan storage:link
php artisan migrate:fresh --seed
php artisan serve

cd ../frontend
npm install
npm run dev
```
