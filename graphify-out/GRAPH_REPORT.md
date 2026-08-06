# Graph Report - Colmerzia  (2026-08-05)

## Corpus Check
- 319 files · ~62,642 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 1663 nodes · 2982 edges · 189 communities (140 shown, 49 thin omitted)
- Extraction: 95% EXTRACTED · 5% INFERRED · 0% AMBIGUOUS · INFERRED: 162 edges (avg confidence: 0.8)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `ba7df92d`
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
- App\Http\Requests\BaseRequest
- App\Http\Requests\Product\StoreProductRequest
- App\Http\Requests\Product\UpdateProductRequest
- ProductVariant
- CustomerController
- App\Models\Order
- LoginTenantIsolationTest
- WarehouseControllerTest
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
- HorizonServiceProvider
- composer.json
- 2026_07_30_114428_create_telescope_entries_table.php
- CustomerControllerTest
- InventoryControllerTest
- Customers.tsx
- Inventory
- HorizonServiceProvider
- ApplyCouponRequest
- AppServiceProvider.php
- Login.tsx

## God Nodes (most connected - your core abstractions)
1. `User` - 75 edges
2. `Store` - 65 edges
3. `Tenant` - 49 edges
4. `Product` - 39 edges
5. `Customer` - 31 edges
6. `Subscription` - 30 edges
7. `TestCase` - 28 edges
8. `InventoryService` - 27 edges
9. `CartTest` - 24 edges
10. `Inventory` - 23 edges

## Surprising Connections (you probably didn't know these)
- `bootBelongsToStore()` --calls--> `Tenant`  [INFERRED]
  backend/app/Models/Concerns/BelongsToStore.php → backend/app/Support/Tenancy/Tenant.php
- `lib` --extends--> `DOM`  [EXTRACTED]
  frontend/tsconfig.app.json → storefront/tsconfig.app.json
- `types` --extends--> `vite/client`  [EXTRACTED]
  frontend/tsconfig.app.json → storefront/tsconfig.app.json
- `include` --extends--> `src`  [EXTRACTED]
  frontend/tsconfig.app.json → storefront/tsconfig.app.json
- `types` --extends--> `node`  [EXTRACTED]
  frontend/tsconfig.node.json → storefront/tsconfig.node.json

## Import Cycles
- None detected.

## Communities (189 total, 49 thin omitted)

### Community 0 - ".parent"
Cohesion: 0.24
Nodes (4): App\Http\Controllers\Controller, StoreController, CategoryController, CategoryResource

### Community 1 - "StoreCreated"
Cohesion: 0.06
Nodes (20): ProductCreated, StoreCreated, UserLoggedIn, GenerateProductImagesJob, SendWelcomeEmailJob, LogUserLogin, SendWelcomeEmail, WelcomeMail (+12 more)

### Community 2 - "composer.json"
Cohesion: 0.14
Nodes (13): autoload-dev, psr-4, description, keywords, license, minimum-stability, name, prefer-stable (+5 more)

### Community 3 - "AuthController.php"
Cohesion: 0.20
Nodes (9): name, private, scripts, build, dev, lint, preview, type (+1 more)

### Community 4 - "dependencies"
Cohesion: 0.09
Nodes (26): clsx, dependencies, clsx, @hookform/resolvers, lucide-react, react, react-dom, react-hook-form (+18 more)

### Community 5 - "Illuminate\Database\Eloquent\SoftDeletes"
Cohesion: 0.11
Nodes (10): Permission, Role, CustomerSeeder, DatabaseSeeder, PermissionSeeder, RoleSeeder, StoreSeeder, UserSeeder (+2 more)

### Community 6 - "devDependencies"
Cohesion: 0.12
Nodes (16): devDependencies, eslint, @eslint/js, eslint-plugin-react-hooks, eslint-plugin-react-refresh, globals, tailwindcss, @tailwindcss/vite (+8 more)

### Community 7 - "Customers.tsx"
Cohesion: 0.22
Nodes (11): PageHeader(), PageHeaderProps, createProduct(), getProduct(), ProductPayload, ProductsResponse, updateProduct(), ProductForm() (+3 more)

### Community 8 - "scripts"
Cohesion: 0.14
Nodes (14): scripts, dev, post-autoload-dump, post-update-cmd, pre-package-uninstall, test, Composer\\Config::disableProcessTimeout, Illuminate\\Foundation\\ComposerScripts::postAutoloadDump (+6 more)

### Community 9 - "router.tsx"
Cohesion: 0.07
Nodes (26): App(), ProtectedRoute(), PublicRoute(), Header(), menu, ToastProvider(), logout(), me() (+18 more)

### Community 10 - "Product"
Cohesion: 0.13
Nodes (3): Tenant, StoreOwnerIsolationTest, StoreScopingTest

### Community 11 - "compilerOptions"
Cohesion: 0.05
Nodes (41): compilerOptions, allowImportingTsExtensions, erasableSyntaxOnly, jsx, lib, module, moduleDetection, moduleResolution (+33 more)

### Community 12 - "User"
Cohesion: 0.05
Nodes (15): login(), logout(), register(), LoginResponseDTO, User, CustomerPolicy, StorePolicy, UserPolicy (+7 more)

### Community 13 - "compilerOptions"
Cohesion: 0.05
Nodes (36): compilerOptions, allowImportingTsExtensions, erasableSyntaxOnly, lib, module, moduleDetection, noEmit, noFallthroughCasesInSwitch (+28 more)

### Community 14 - "Illuminate\Database\Eloquent\Factories\Factory"
Cohesion: 0.06
Nodes (15): BrandFactory, CategoryFactory, CouponFactory, static, CustomerFactory, DiscountRuleFactory, static, ProductFactory (+7 more)

### Community 15 - "App\Models\Concerns\BelongsToStore"
Cohesion: 0.13
Nodes (8): App\Models\Concerns\BelongsToStore, CustomerAddress, DiscountRule, ProductImage, Warehouse, Illuminate\Database\Eloquent\Concerns\HasUuids, Illuminate\Database\Eloquent\Model, Illuminate\Database\Eloquent\SoftDeletes

### Community 16 - "BaseRequest"
Cohesion: 0.06
Nodes (9): CustomerController, StoreCustomerRequest, UpdateCustomerRequest, StoreProductRequest, UpdateProductRequest, StoreStoreRequest, UpdateStoreRequest, Customer (+1 more)

### Community 19 - "devDependencies"
Cohesion: 0.11
Nodes (17): devDependencies, concurrently, laravel-vite-plugin, tailwindcss, @tailwindcss/vite, vite, tailwindcss, @tailwindcss/vite (+9 more)

### Community 21 - "App\Models\Concerns\BelongsToStoreOrNull"
Cohesion: 0.12
Nodes (7): App\Models\Concerns\BelongsToStoreOrNull, AuditLog, Notification, Setting, StoreSetting, Transaction, Illuminate\Database\Eloquent\Factories\HasFactory

### Community 23 - "Illuminate\Foundation\Http\FormRequest"
Cohesion: 0.13
Nodes (23): CustomerSnapshot, getOrder(), Order, OrderItem, OrdersResponse, OrderStatus, PaymentStatus, ShippingAddress (+15 more)

### Community 24 - "Tenant"
Cohesion: 0.12
Nodes (5): register(), StoreOnboardingResponseDTO, Store, StoreOnboardingService, LoginRateLimitTest

### Community 25 - "BaseApiException"
Cohesion: 0.05
Nodes (15): ApiException, InactiveUserException, InvalidCredentialsException, BaseApiException, CartException, CheckoutController, Cart, CartItem (+7 more)

### Community 26 - "Illuminate\Database\Eloquent\Factories\HasFactory"
Cohesion: 0.11
Nodes (13): App\Contracts\Auth\AuthServiceInterface, App\Http\Requests\Auth\LoginRequest, App\Http\Requests\Auth\RegisterRequest, App\Http\Resources\Auth\LoginResource, App\Http\Resources\User\UserResource, AuthController, LoginResource, BaseResource (+5 more)

### Community 28 - "authApi.ts"
Cohesion: 0.05
Nodes (42): 1. Clonar el repositorio, 2. Configurar las variables de entorno, 3. Construir y levantar el proyecto, 4. Verificar los contenedores, 5. Ver los logs, 🏗️ Arquitectura del proyecto, 🏪 Arquitectura Multiempresa, 🔐 Autenticación (+34 more)

### Community 29 - "Brand"
Cohesion: 0.23
Nodes (10): Button(), ButtonProps, ButtonVariant, ConfirmDialog(), ConfirmDialogProps, useToast(), deleteProduct(), getProducts() (+2 more)

### Community 31 - "ProductForm.tsx"
Cohesion: 0.19
Nodes (4): App\Contracts\Onboarding\StoreOnboardingServiceInterface, StoreOnboardingController, Controller, StoreOnboardingRequest

### Community 32 - "CustomerForm.tsx"
Cohesion: 0.19
Nodes (11): TextField(), TextFieldProps, forgotPassword(), createCustomer(), CustomerPayload, getCustomer(), updateCustomer(), CustomerForm() (+3 more)

### Community 33 - "BaseResource"
Cohesion: 0.25
Nodes (7): BadgeProps, Panel(), PanelProps, getOrders(), formatDate(), formatMoney(), Orders()

### Community 34 - "BelongsToStoreOrNullScope.php"
Cohesion: 0.24
Nodes (4): BelongsToStoreOrNullScope, BelongsToStoreScope, Illuminate\Database\Eloquent\Builder, Illuminate\Database\Eloquent\Scope

### Community 35 - "App.tsx"
Cohesion: 0.29
Nodes (3): TestCase, Illuminate\Foundation\Testing\RefreshDatabase, Illuminate\Foundation\Testing\TestCase

### Community 37 - "Category"
Cohesion: 0.36
Nodes (3): Category, Illuminate\Database\Eloquent\Relations\BelongsTo, Illuminate\Database\Eloquent\Relations\HasMany

### Community 41 - "Cart"
Cohesion: 0.28
Nodes (7): App\Models\Product, App\Models\ProductVariant, App\Models\Store, seedStock(), Tests\Concerns\CreatesStoreUsers, Tests\Concerns\SeedsInventory, Tests\TestCase

### Community 43 - "Warehouse"
Cohesion: 0.10
Nodes (9): CustomerResource, ProductVariantResource, StoreResource, CartItemResource, CartResource, OrderResource, ProductDetailResource, ProductListResource (+1 more)

### Community 44 - "CleanupTokens"
Cohesion: 0.33
Nodes (4): CleanupTokens, SyncInventoryStock, Command, Illuminate\Console\Command

### Community 47 - "AuthLayout.tsx"
Cohesion: 0.50
Nodes (3): AuthState, useAuthStore, User

### Community 81 - "TestCase"
Cohesion: 0.36
Nodes (6): ToastContext, ToastContextValue, ToastInput, ToastTone, icons, Toast

### Community 123 - "OrderController.php"
Cohesion: 0.11
Nodes (5): CartController, BaseRequest, AddCartItemRequest, ApplyCouponRequest, UpdateCartItemRequest

### Community 126 - "frontend/package.json"
Cohesion: 0.20
Nodes (9): name, private, scripts, build, dev, lint, preview, type (+1 more)

### Community 128 - "ProductControllerTest"
Cohesion: 0.21
Nodes (7): EnsureFeatureAvailable, EnsureStoreIsActive, EnsureSubscriptionIsWritable, ResolveTenantBySubdomain, TenantResolver, Closure, Symfony\Component\HttpFoundation\Response

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
Cohesion: 0.15
Nodes (4): OrderController, UpdateOrderStatusRequest, Order, OrderService

### Community 135 - "CustomerControllerTest"
Cohesion: 0.50
Nodes (3): Expanding the ESLint configuration, React Compiler, React + TypeScript + Vite

### Community 136 - "SubscriptionTest"
Cohesion: 0.24
Nodes (7): api, createStore(), CreateStorePayload, Store, StoreResponse, StoreSetting, CreateStore()

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

### Community 145 - "eslint"
Cohesion: 0.12
Nodes (16): @types/react, typescript, @vitejs/plugin-react, devDependencies, tailwindcss, @tailwindcss/vite, @types/react, typescript (+8 more)

### Community 149 - "globals"
Cohesion: 0.67
Nodes (3): axios, axios, axios

### Community 153 - "App\Http\Requests\Auth\LoginRequest"
Cohesion: 0.67
Nodes (3): zustand, zustand, zustand

### Community 155 - "App\Http\Requests\BaseRequest"
Cohesion: 0.18
Nodes (5): App\Http\Requests\BaseRequest, WarehouseController, AdjustInventoryRequest, WarehouseRequest, Warehouse

### Community 156 - "App\Http\Requests\Product\StoreProductRequest"
Cohesion: 0.19
Nodes (4): App\Http\Requests\Product\StoreProductRequest, App\Http\Requests\Product\UpdateProductRequest, ProductController, ProductResource

### Community 157 - "App\Http\Requests\Product\UpdateProductRequest"
Cohesion: 0.67
Nodes (3): @types/node, @types/node, @types/node

### Community 158 - "ProductVariant"
Cohesion: 0.08
Nodes (40): api, App(), CartDrawer(), Header(), ProductCard(), Toast(), addCartItem(), applyCoupon() (+32 more)

### Community 177 - "HorizonServiceProvider"
Cohesion: 0.22
Nodes (3): CartTest, Store, Product

### Community 178 - "composer.json"
Cohesion: 0.40
Nodes (4): require, require-dev, laravel/telescope, predis/predis

### Community 179 - "2026_07_30_114428_create_telescope_entries_table.php"
Cohesion: 0.83
Nodes (3): down(), getConnection(), up()

### Community 182 - "Customers.tsx"
Cohesion: 0.35
Nodes (8): Customer, CustomersResponse, deleteCustomer(), getCustomers(), Customers(), formatDate(), fullName(), Dashboard()

### Community 185 - "Inventory"
Cohesion: 0.16
Nodes (5): App\Models\User, App\Models\Warehouse, InventoryController, Inventory, InventoryService

## Knowledge Gaps
- **256 isolated node(s):** `Warehouse`, `InventoryResponse`, `name`, `private`, `version` (+251 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **49 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `Product` connect `HorizonServiceProvider` to `Illuminate\Database\Eloquent\Model`, `Customer`, `Brand`, `Customers.tsx`?**
  _High betweenness centrality (0.117) - this node is a cross-community bridge._
- **Why does `Store` connect `Tenant` to `.parent`, `ProductControllerTest`, `App.tsx`, `Illuminate\Database\Eloquent\SoftDeletes`, `StoreProductRequest`, `UpdateProductRequest`, `Product`, `User`, `Dashboard.tsx`, `App\Models\Concerns\BelongsToStore`, `BelongsToStoreOrNull.php`, `BaseRequest`, `@eslint/js`, `CustomerControllerTest`, `App\Models\Concerns\BelongsToStoreOrNull`, `RegisterStaffLimitTest`?**
  _High betweenness centrality (0.060) - this node is a cross-community bridge._
- **Why does `CartTest` connect `HorizonServiceProvider` to `Cart`, `App.tsx`?**
  _High betweenness centrality (0.057) - this node is a cross-community bridge._
- **Are the 16 inferred relationships involving `User` (e.g. with `.register()` and `.run()`) actually correct?**
  _`User` has 16 INFERRED edges - model-reasoned connections that need verification._
- **Are the 13 inferred relationships involving `Store` (e.g. with `.store()` and `.handle()`) actually correct?**
  _`Store` has 13 INFERRED edges - model-reasoned connections that need verification._
- **What connects `Warehouse`, `InventoryResponse`, `name` to the rest of the system?**
  _256 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `StoreCreated` be split into smaller, more focused modules?**
  _Cohesion score 0.06352941176470588 - nodes in this community are weakly interconnected._