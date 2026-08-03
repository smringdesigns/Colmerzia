# Graph Report - Colmerzia  (2026-07-31)

## Corpus Check
- 269 files · ~49,995 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 1379 nodes · 2449 edges · 185 communities (122 shown, 63 thin omitted)
- Extraction: 93% EXTRACTED · 7% INFERRED · 0% AMBIGUOUS · INFERRED: 172 edges (avg confidence: 0.8)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `3645d33d`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- .parent
- StoreCreated
- composer.json
- AuthController.php
- dependencies
- Illuminate\Database\Eloquent\SoftDeletes
- devDependencies
- Customers.tsx
- scripts
- router.tsx
- Product
- compilerOptions
- User
- compilerOptions
- Illuminate\Database\Eloquent\Factories\Factory
- App\Models\Concerns\BelongsToStore
- BaseRequest
- Illuminate\Database\Eloquent\Model
- PlanRegistry
- devDependencies
- Customer
- App\Models\Concerns\BelongsToStoreOrNull
- Illuminate\Http\Request
- Illuminate\Foundation\Http\FormRequest
- Tenant
- BaseApiException
- Illuminate\Database\Eloquent\Factories\HasFactory
- Store
- authApi.ts
- Brand
- static
- ProductForm.tsx
- CustomerForm.tsx
- BaseResource
- BelongsToStoreOrNullScope.php
- App.tsx
- ToastProvider.tsx
- Category
- UpdateCustomerRequest
- StoreProductRequest
- UpdateProductRequest
- Cart
- Inventory
- Warehouse
- CleanupTokens
- ExampleTest
- Dashboard.tsx
- AuthLayout.tsx
- BelongsToStoreOrNull.php
- BaseService
- TestCase
- InfoCard.tsx
- tsconfig.json
- copilot-instructions.md
- OrderController.php
- Role
- ProductPlanLimitTest
- frontend/package.json
- RegisterStaffLimitTest
- ProductControllerTest
- require-dev
- setup
- CouponFactory
- StoreOnboardingResource.php
- config
- DiscountRuleFactory
- CustomerControllerTest
- SubscriptionTest
- EnsureFeatureAvailableTest
- OrderItem
- psr-4
- require
- StoreOwnerIsolationTest
- post-create-project-cmd
- extra
- eslint
- @eslint/js
- eslint-plugin-react-refresh
- react
- globals
- typescript
- ComingSoon.tsx
- NotFound.tsx
- App\Http\Requests\Auth\LoginRequest
- App\Http\Requests\Auth\RegisterRequest
- App\Http\Requests\BaseRequest
- App\Http\Requests\Product\StoreProductRequest
- App\Http\Requests\Product\UpdateProductRequest
- App\Http\Resources\Auth\LoginResource
- App\Http\Resources\User\UserResource
- App\Models\Order
- App\Models\Product
- App\Models\ProductVariant
- App\Models\Store
- App\Models\User
- User
- Product
- Store
- Store
- Store
- Store
- Store
- Product
- Store
- ProductVariant
- Tests\TestCase
- HorizonServiceProvider
- composer.json
- 2026_07_30_114428_create_telescope_entries_table.php
- OrderItem
- Payment
- Brand

## God Nodes (most connected - your core abstractions)
1. `User` - 76 edges
2. `Store` - 76 edges
3. `Tenant` - 55 edges
4. `Product` - 49 edges
5. `Subscription` - 39 edges
6. `TestCase` - 34 edges
7. `Customer` - 31 edges
8. `CartTest` - 23 edges
9. `BaseRequest` - 22 edges
10. `Cart` - 22 edges

## Surprising Connections (you probably didn't know these)
- `bootBelongsToStore()` --calls--> `Tenant`  [INFERRED]
  backend/app/Models/Concerns/BelongsToStore.php → backend/app/Support/Tenancy/Tenant.php
- `logout()` --references--> `User`  [EXTRACTED]
  backend/app/Contracts/Auth/AuthServiceInterface.php → backend/app/Models/User.php
- `LoginResponseDTO` --references--> `User`  [EXTRACTED]
  backend/app/DTOs/Auth/LoginResponseDTO.php → backend/app/Models/User.php
- `StoreOnboardingResponseDTO` --references--> `User`  [EXTRACTED]
  backend/app/DTOs/Onboarding/StoreOnboardingResponseDTO.php → backend/app/Models/User.php
- `createUserWithPermissions()` --references--> `User`  [EXTRACTED]
  backend/tests/Concerns/CreatesStoreUsers.php → backend/app/Models/User.php

## Import Cycles
- None detected.

## Communities (185 total, 63 thin omitted)

### Community 1 - "StoreCreated"
Cohesion: 0.06
Nodes (20): ProductCreated, StoreCreated, UserLoggedIn, GenerateProductImagesJob, SendWelcomeEmailJob, LogUserLogin, SendWelcomeEmail, WelcomeMail (+12 more)

### Community 2 - "composer.json"
Cohesion: 0.14
Nodes (13): autoload-dev, psr-4, description, keywords, license, minimum-stability, name, prefer-stable (+5 more)

### Community 3 - "AuthController.php"
Cohesion: 0.20
Nodes (6): App\Contracts\Auth\AuthServiceInterface, login(), logout(), register(), LoginResponseDTO, AuthService

### Community 4 - "dependencies"
Cohesion: 0.10
Nodes (21): axios, clsx, dependencies, axios, clsx, @hookform/resolvers, lucide-react, react-dom (+13 more)

### Community 5 - "Illuminate\Database\Eloquent\SoftDeletes"
Cohesion: 0.17
Nodes (6): Permission, Role, RoleSeeder, UserSeeder, createUserWithPermissions(), Illuminate\Database\Eloquent\SoftDeletes

### Community 6 - "devDependencies"
Cohesion: 0.11
Nodes (19): eslint-plugin-react-hooks, devDependencies, eslint-plugin-react-hooks, tailwindcss, @tailwindcss/vite, @types/node, @types/react, @types/react-dom (+11 more)

### Community 7 - "Customers.tsx"
Cohesion: 0.22
Nodes (11): PageHeader(), PageHeaderProps, createProduct(), getProduct(), ProductPayload, ProductsResponse, updateProduct(), ProductForm() (+3 more)

### Community 8 - "scripts"
Cohesion: 0.14
Nodes (14): scripts, dev, post-autoload-dump, post-update-cmd, pre-package-uninstall, test, Composer\\Config::disableProcessTimeout, Illuminate\\Foundation\\ComposerScripts::postAutoloadDump (+6 more)

### Community 9 - "router.tsx"
Cohesion: 0.07
Nodes (30): App(), ProtectedRoute(), PublicRoute(), Header(), menu, ToastContext, ToastContextValue, ToastInput (+22 more)

### Community 10 - "Product"
Cohesion: 0.10
Nodes (4): Tenant, EnsureFeatureAvailableTest, StoreOwnerIsolationTest, StoreScopingTest

### Community 11 - "compilerOptions"
Cohesion: 0.09
Nodes (22): compilerOptions, allowImportingTsExtensions, erasableSyntaxOnly, jsx, lib, module, moduleDetection, moduleResolution (+14 more)

### Community 13 - "compilerOptions"
Cohesion: 0.10
Nodes (19): compilerOptions, allowImportingTsExtensions, erasableSyntaxOnly, lib, module, moduleDetection, noEmit, noFallthroughCasesInSwitch (+11 more)

### Community 14 - "Illuminate\Database\Eloquent\Factories\Factory"
Cohesion: 0.06
Nodes (15): BrandFactory, CategoryFactory, CouponFactory, static, CustomerFactory, DiscountRuleFactory, static, ProductFactory (+7 more)

### Community 15 - "App\Models\Concerns\BelongsToStore"
Cohesion: 0.14
Nodes (8): App\Models\Concerns\BelongsToStore, CustomerAddress, DiscountRule, ProductImage, Transaction, Warehouse, Illuminate\Database\Eloquent\Factories\HasFactory, Illuminate\Database\Eloquent\Model

### Community 16 - "BaseRequest"
Cohesion: 0.15
Nodes (4): StoreCustomerRequest, StoreStoreRequest, UpdateStoreRequest, Illuminate\Foundation\Http\FormRequest

### Community 18 - "PlanRegistry"
Cohesion: 0.08
Nodes (7): App\Contracts\Onboarding\StoreOnboardingServiceInterface, StoreOnboardingController, StoreOnboardingRequest, AppServiceProvider, PlanRegistry, PlanRegistryTest, Illuminate\Support\ServiceProvider

### Community 19 - "devDependencies"
Cohesion: 0.11
Nodes (17): devDependencies, concurrently, laravel-vite-plugin, tailwindcss, @tailwindcss/vite, vite, tailwindcss, @tailwindcss/vite (+9 more)

### Community 20 - "Customer"
Cohesion: 0.15
Nodes (6): User, CustomerPolicy, Illuminate\Contracts\Auth\MustVerifyEmail, Illuminate\Foundation\Auth\User, Illuminate\Notifications\Notifiable, Laravel\Sanctum\HasApiTokens

### Community 21 - "App\Models\Concerns\BelongsToStoreOrNull"
Cohesion: 0.16
Nodes (4): App\Models\Concerns\BelongsToStoreOrNull, AuditLog, Notification, Setting

### Community 23 - "Illuminate\Foundation\Http\FormRequest"
Cohesion: 0.13
Nodes (23): CustomerSnapshot, getOrder(), Order, OrderItem, OrdersResponse, OrderStatus, PaymentStatus, ShippingAddress (+15 more)

### Community 25 - "BaseApiException"
Cohesion: 0.07
Nodes (10): CartException, CheckoutController, Cart, CartItem, Coupon, ProductVariant, CartService, CheckoutService (+2 more)

### Community 26 - "Illuminate\Database\Eloquent\Factories\HasFactory"
Cohesion: 0.06
Nodes (26): App\Http\Controllers\Controller, App\Http\Requests\Auth\LoginRequest, App\Http\Requests\Auth\RegisterRequest, App\Http\Resources\Auth\LoginResource, App\Http\Resources\User\UserResource, AuthController, EnsureFeatureAvailable, EnsureStoreIsActive (+18 more)

### Community 28 - "authApi.ts"
Cohesion: 0.05
Nodes (42): 1. Clonar el repositorio, 2. Configurar las variables de entorno, 3. Construir y levantar el proyecto, 4. Verificar los contenedores, 5. Ver los logs, 🏗️ Arquitectura del proyecto, 🏪 Arquitectura Multiempresa, 🔐 Autenticación (+34 more)

### Community 29 - "Brand"
Cohesion: 0.25
Nodes (5): CustomerSeeder, DatabaseSeeder, PermissionSeeder, StoreSeeder, Illuminate\Database\Seeder

### Community 31 - "ProductForm.tsx"
Cohesion: 0.16
Nodes (3): CartController, AddCartItemRequest, UpdateCartItemRequest

### Community 32 - "CustomerForm.tsx"
Cohesion: 0.23
Nodes (10): api, createCustomer(), Customer, CustomerPayload, CustomersResponse, getCustomer(), updateCustomer(), CustomerForm() (+2 more)

### Community 33 - "BaseResource"
Cohesion: 0.25
Nodes (7): BadgeProps, Panel(), PanelProps, getOrders(), formatDate(), formatMoney(), Orders()

### Community 34 - "BelongsToStoreOrNullScope.php"
Cohesion: 0.18
Nodes (5): bootBelongsToStore(), BelongsToStoreOrNullScope, BelongsToStoreScope, Illuminate\Database\Eloquent\Builder, Illuminate\Database\Eloquent\Scope

### Community 35 - "App.tsx"
Cohesion: 0.18
Nodes (5): Store, TestCase, Illuminate\Foundation\Testing\RefreshDatabase, Illuminate\Foundation\Testing\TestCase, Tests\Concerns\CreatesStoreUsers

### Community 36 - "ToastProvider.tsx"
Cohesion: 0.19
Nodes (14): ConfirmDialog(), ConfirmDialogProps, useToast(), deleteCustomer(), getCustomers(), deleteProduct(), getProducts(), Product (+6 more)

### Community 37 - "Category"
Cohesion: 0.25
Nodes (4): Category, CatalogSeeder, Illuminate\Database\Eloquent\Relations\BelongsTo, Illuminate\Database\Eloquent\Relations\HasMany

### Community 38 - "UpdateCustomerRequest"
Cohesion: 0.26
Nodes (7): Button(), ButtonProps, ButtonVariant, TextField(), TextFieldProps, forgotPassword(), ForgotPassword()

### Community 39 - "StoreProductRequest"
Cohesion: 0.15
Nodes (5): register(), StoreOnboardingResponseDTO, Subscription, StoreOnboardingService, ProductPlanLimitTest

### Community 47 - "AuthLayout.tsx"
Cohesion: 0.50
Nodes (3): AuthState, useAuthStore, User

### Community 48 - "BelongsToStoreOrNull.php"
Cohesion: 0.19
Nodes (5): ApiException, InactiveUserException, InvalidCredentialsException, BaseApiException, Exception

### Community 123 - "OrderController.php"
Cohesion: 0.15
Nodes (3): RegisterRequest, BaseRequest, CheckoutRequest

### Community 126 - "frontend/package.json"
Cohesion: 0.20
Nodes (9): name, private, scripts, build, dev, lint, preview, type (+1 more)

### Community 129 - "require-dev"
Cohesion: 0.22
Nodes (9): require-dev, fakerphp/faker, laravel/pail, laravel/pao, laravel/pint, laravel/telescope, mockery/mockery, nunomaduro/collision (+1 more)

### Community 130 - "setup"
Cohesion: 0.25
Nodes (8): post-root-package-install, setup, composer install, npm install --ignore-scripts, npm run build, @php artisan key:generate, @php artisan migrate --force, @php -r \"file_exists('.env') || copy('.env.example', '.env');\

### Community 131 - "CouponFactory"
Cohesion: 0.25
Nodes (7): About Laravel, Agentic Development, Code of Conduct, Contributing, Learning Laravel, License, Security Vulnerabilities

### Community 133 - "config"
Cohesion: 0.29
Nodes (7): pestphp/pest-plugin, php-http/discovery, config, allow-plugins, optimize-autoloader, preferred-install, sort-packages

### Community 134 - "DiscountRuleFactory"
Cohesion: 0.20
Nodes (3): OrderController, Order, OrderService

### Community 139 - "psr-4"
Cohesion: 0.40
Nodes (5): autoload, psr-4, App\\, Database\\Factories\\, Database\\Seeders\\

### Community 140 - "require"
Cohesion: 0.29
Nodes (7): require, laravel/framework, laravel/horizon, laravel/sanctum, laravel/tinker, php, predis/predis

### Community 141 - "StoreOwnerIsolationTest"
Cohesion: 0.50
Nodes (3): Expanding the ESLint configuration, React Compiler, React + TypeScript + Vite

### Community 142 - "post-create-project-cmd"
Cohesion: 0.50
Nodes (4): post-create-project-cmd, @php artisan key:generate --ansi, @php artisan migrate --graceful --ansi, @php -r \"file_exists('database/database.sqlite') || touch('database/database.sqlite');\

### Community 143 - "extra"
Cohesion: 0.67
Nodes (3): extra, laravel, dont-discover

### Community 178 - "composer.json"
Cohesion: 0.40
Nodes (4): require, require-dev, laravel/telescope, predis/predis

### Community 179 - "2026_07_30_114428_create_telescope_entries_table.php"
Cohesion: 0.83
Nodes (3): down(), getConnection(), up()

## Knowledge Gaps
- **212 isolated node(s):** `graphify`, `📌 Estado del proyecto`, `🏗️ Arquitectura del proyecto`, `Backend`, `Frontend` (+207 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **63 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `Product` connect `ProductControllerTest` to `App.tsx`, `Illuminate\Database\Eloquent\SoftDeletes`, `DiscountRuleFactory`, `Category`, `StoreProductRequest`, `Cart`, `OrderItem`, `Inventory`, `Product`, `App\Models\Concerns\BelongsToStore`, `Illuminate\Http\Request`, `BaseApiException`, `Store`?**
  _High betweenness centrality (0.040) - this node is a cross-community bridge._
- **Why does `Store` connect `App.tsx` to `.parent`, `ProductControllerTest`, `Illuminate\Database\Eloquent\SoftDeletes`, `Category`, `StoreProductRequest`, `CustomerControllerTest`, `EnsureFeatureAvailableTest`, `Product`, `Warehouse`, `UpdateProductRequest`, `Cart`, `Inventory`, `App\Models\Concerns\BelongsToStore`, `TestCase`, `Tenant`, `BaseApiException`, `Illuminate\Database\Eloquent\Factories\HasFactory`, `RegisterStaffLimitTest`?**
  _High betweenness centrality (0.038) - this node is a cross-community bridge._
- **Why does `Subscription` connect `StoreProductRequest` to `ProductControllerTest`, `App.tsx`, `Illuminate\Database\Eloquent\SoftDeletes`, `SubscriptionTest`, `Cart`, `Product`, `Illuminate\Database\Eloquent\Factories\Factory`, `App\Models\Concerns\BelongsToStore`, `PlanRegistry`, `RegisterStaffLimitTest`?**
  _High betweenness centrality (0.035) - this node is a cross-community bridge._
- **Are the 17 inferred relationships involving `User` (e.g. with `.forgotPassword()` and `.register()`) actually correct?**
  _`User` has 17 INFERRED edges - model-reasoned connections that need verification._
- **Are the 13 inferred relationships involving `Store` (e.g. with `.handle()` and `.handle()`) actually correct?**
  _`Store` has 13 INFERRED edges - model-reasoned connections that need verification._
- **Are the 48 inferred relationships involving `Tenant` (e.g. with `.abortIfPlanLimitReached()` and `.currentStoreId()`) actually correct?**
  _`Tenant` has 48 INFERRED edges - model-reasoned connections that need verification._
- **What connects `graphify`, `📌 Estado del proyecto`, `🏗️ Arquitectura del proyecto` to the rest of the system?**
  _212 weakly-connected nodes found - possible documentation gaps or missing edges._