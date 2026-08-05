# Graph Report - Colmerzia  (2026-08-04)

## Corpus Check
- 301 files · ~58,390 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 1600 nodes · 2840 edges · 183 communities (147 shown, 36 thin omitted)
- Extraction: 94% EXTRACTED · 6% INFERRED · 0% AMBIGUOUS · INFERRED: 158 edges (avg confidence: 0.8)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `1a2f79e9`
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
- App\Http\Requests\BaseRequest
- App\Http\Requests\Product\StoreProductRequest
- App\Http\Requests\Product\UpdateProductRequest
- CustomerController
- App\Models\Order
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
- Customers.tsx
- Inventory
- HorizonServiceProvider
- ApplyCouponRequest

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

## Communities (183 total, 36 thin omitted)

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
Cohesion: 0.11
Nodes (19): axios, clsx, dependencies, axios, clsx, @hookform/resolvers, lucide-react, react-hook-form (+11 more)

### Community 5 - "Illuminate\Database\Eloquent\SoftDeletes"
Cohesion: 0.11
Nodes (10): Permission, Role, CustomerSeeder, DatabaseSeeder, PermissionSeeder, RoleSeeder, StoreSeeder, UserSeeder (+2 more)

### Community 6 - "devDependencies"
Cohesion: 0.15
Nodes (13): eslint-plugin-react-refresh, devDependencies, eslint-plugin-react-refresh, tailwindcss, @tailwindcss/vite, @types/node, vite, tailwindcss (+5 more)

### Community 7 - "Customers.tsx"
Cohesion: 0.16
Nodes (18): PageHeader(), PageHeaderProps, useToast(), getCustomers(), createProduct(), deleteProduct(), getProduct(), getProducts() (+10 more)

### Community 8 - "scripts"
Cohesion: 0.14
Nodes (14): scripts, dev, post-autoload-dump, post-update-cmd, pre-package-uninstall, test, Composer\\Config::disableProcessTimeout, Illuminate\\Foundation\\ComposerScripts::postAutoloadDump (+6 more)

### Community 9 - "router.tsx"
Cohesion: 0.06
Nodes (30): api, App(), ProtectedRoute(), PublicRoute(), Header(), menu, ToastProvider(), logout() (+22 more)

### Community 10 - "Product"
Cohesion: 0.13
Nodes (3): Tenant, StoreOwnerIsolationTest, StoreScopingTest

### Community 11 - "compilerOptions"
Cohesion: 0.05
Nodes (42): compilerOptions, allowImportingTsExtensions, erasableSyntaxOnly, jsx, lib, module, moduleDetection, moduleResolution (+34 more)

### Community 12 - "User"
Cohesion: 0.06
Nodes (14): login(), logout(), register(), LoginResponseDTO, User, CustomerPolicy, StorePolicy, UserPolicy (+6 more)

### Community 13 - "compilerOptions"
Cohesion: 0.05
Nodes (36): compilerOptions, allowImportingTsExtensions, erasableSyntaxOnly, lib, module, moduleDetection, noEmit, noFallthroughCasesInSwitch (+28 more)

### Community 14 - "Illuminate\Database\Eloquent\Factories\Factory"
Cohesion: 0.06
Nodes (15): BrandFactory, CategoryFactory, CouponFactory, static, CustomerFactory, DiscountRuleFactory, static, ProductFactory (+7 more)

### Community 15 - "App\Models\Concerns\BelongsToStore"
Cohesion: 0.09
Nodes (12): App\Models\Concerns\BelongsToStore, Brand, CustomerAddress, DiscountRule, InventoryMovement, ProductImage, StoreSetting, Transaction (+4 more)

### Community 16 - "BaseRequest"
Cohesion: 0.05
Nodes (10): CustomerController, StoreCustomerRequest, UpdateCustomerRequest, StoreProductRequest, UpdateProductRequest, StoreStoreRequest, UpdateStoreRequest, Customer (+2 more)

### Community 17 - "Illuminate\Database\Eloquent\Model"
Cohesion: 0.36
Nodes (6): ToastContext, ToastContextValue, ToastInput, ToastTone, icons, Toast

### Community 18 - "PlanRegistry"
Cohesion: 0.08
Nodes (7): App\Contracts\Onboarding\StoreOnboardingServiceInterface, StoreOnboardingController, StoreOnboardingRequest, AppServiceProvider, PlanRegistry, PlanRegistryTest, Illuminate\Support\ServiceProvider

### Community 19 - "devDependencies"
Cohesion: 0.11
Nodes (17): devDependencies, concurrently, laravel-vite-plugin, tailwindcss, @tailwindcss/vite, vite, tailwindcss, @tailwindcss/vite (+9 more)

### Community 20 - "Customer"
Cohesion: 0.32
Nodes (3): ApiException, CartException, Exception

### Community 21 - "App\Models\Concerns\BelongsToStoreOrNull"
Cohesion: 0.16
Nodes (4): App\Models\Concerns\BelongsToStoreOrNull, AuditLog, Notification, Setting

### Community 22 - "Illuminate\Http\Request"
Cohesion: 0.22
Nodes (3): CheckoutController, Controller, CheckoutRequest

### Community 23 - "Illuminate\Foundation\Http\FormRequest"
Cohesion: 0.13
Nodes (23): CustomerSnapshot, getOrder(), Order, OrderItem, OrdersResponse, OrderStatus, PaymentStatus, ShippingAddress (+15 more)

### Community 25 - "BaseApiException"
Cohesion: 0.13
Nodes (5): Cart, Coupon, ProductVariant, CartService, CheckoutService

### Community 26 - "Illuminate\Database\Eloquent\Factories\HasFactory"
Cohesion: 0.20
Nodes (6): App\Contracts\Auth\AuthServiceInterface, App\Http\Requests\Auth\LoginRequest, App\Http\Requests\Auth\RegisterRequest, App\Http\Resources\Auth\LoginResource, App\Http\Resources\User\UserResource, Illuminate\Foundation\Auth\EmailVerificationRequest

### Community 28 - "authApi.ts"
Cohesion: 0.05
Nodes (42): 1. Clonar el repositorio, 2. Configurar las variables de entorno, 3. Construir y levantar el proyecto, 4. Verificar los contenedores, 5. Ver los logs, 🏗️ Arquitectura del proyecto, 🏪 Arquitectura Multiempresa, 🔐 Autenticación (+34 more)

### Community 32 - "CustomerForm.tsx"
Cohesion: 0.31
Nodes (8): createCustomer(), CustomerPayload, CustomersResponse, getCustomer(), updateCustomer(), CustomerForm(), CustomerFormData, schema

### Community 33 - "BaseResource"
Cohesion: 0.39
Nodes (6): Panel(), PanelProps, getOrders(), formatDate(), formatMoney(), Orders()

### Community 34 - "BelongsToStoreOrNullScope.php"
Cohesion: 0.18
Nodes (5): bootBelongsToStore(), BelongsToStoreOrNullScope, BelongsToStoreScope, Illuminate\Database\Eloquent\Builder, Illuminate\Database\Eloquent\Scope

### Community 35 - "App.tsx"
Cohesion: 0.16
Nodes (4): Store, TestCase, Illuminate\Foundation\Testing\RefreshDatabase, Illuminate\Foundation\Testing\TestCase

### Community 37 - "Category"
Cohesion: 0.25
Nodes (4): Category, CatalogSeeder, Illuminate\Database\Eloquent\Relations\BelongsTo, Illuminate\Database\Eloquent\Relations\HasMany

### Community 38 - "UpdateCustomerRequest"
Cohesion: 0.26
Nodes (7): Button(), ButtonProps, ButtonVariant, TextField(), TextFieldProps, forgotPassword(), ForgotPassword()

### Community 39 - "StoreProductRequest"
Cohesion: 0.18
Nodes (5): register(), StoreOnboardingResponseDTO, Subscription, StoreOnboardingService, ProductPlanLimitTest

### Community 41 - "Cart"
Cohesion: 0.05
Nodes (19): App\Models\Product, App\Models\ProductVariant, App\Models\Store, seedStock(), InventoryControllerTest, Store, InventoryServiceTest, Store (+11 more)

### Community 43 - "Warehouse"
Cohesion: 0.10
Nodes (12): AuthController, CustomerResource, ProductResource, ProductVariantResource, StoreResource, CartItemResource, CartResource, OrderResource (+4 more)

### Community 44 - "CleanupTokens"
Cohesion: 0.33
Nodes (4): CleanupTokens, SyncInventoryStock, Command, Illuminate\Console\Command

### Community 46 - "Dashboard.tsx"
Cohesion: 0.12
Nodes (3): Product, ProductPolicy, ProductControllerTest

### Community 47 - "AuthLayout.tsx"
Cohesion: 0.50
Nodes (3): AuthState, useAuthStore, User

### Community 48 - "BelongsToStoreOrNull.php"
Cohesion: 0.28
Nodes (3): InactiveUserException, InvalidCredentialsException, BaseApiException

### Community 123 - "OrderController.php"
Cohesion: 0.15
Nodes (3): RegisterRequest, BaseRequest, UpdateCartItemRequest

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

### Community 138 - "OrderItem"
Cohesion: 0.67
Nodes (3): eslint-plugin-react-hooks, eslint-plugin-react-hooks, eslint-plugin-react-hooks

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
Cohesion: 0.17
Nodes (12): eslint, @eslint/js, eslint, @eslint/js, globals, globals, devDependencies, eslint (+4 more)

### Community 146 - "@eslint/js"
Cohesion: 0.67
Nodes (3): @types/react, @types/react, @types/react

### Community 147 - "eslint-plugin-react-refresh"
Cohesion: 0.67
Nodes (3): @types/react-dom, @types/react-dom, @types/react-dom

### Community 148 - "react"
Cohesion: 0.29
Nodes (7): react, react-dom, react, react-dom, dependencies, react, react-dom

### Community 149 - "globals"
Cohesion: 0.67
Nodes (3): typescript-eslint, typescript-eslint, typescript-eslint

### Community 150 - "typescript"
Cohesion: 0.67
Nodes (3): typescript, typescript, typescript

### Community 153 - "App\Http\Requests\Auth\LoginRequest"
Cohesion: 0.18
Nodes (5): LoginResource, BaseResource, StoreOnboardingResource, OrderResource, UserResource

### Community 155 - "App\Http\Requests\BaseRequest"
Cohesion: 0.18
Nodes (5): App\Http\Requests\BaseRequest, WarehouseController, AdjustInventoryRequest, WarehouseRequest, Warehouse

### Community 156 - "App\Http\Requests\Product\StoreProductRequest"
Cohesion: 0.28
Nodes (3): App\Http\Requests\Product\StoreProductRequest, App\Http\Requests\Product\UpdateProductRequest, ProductController

### Community 157 - "App\Http\Requests\Product\UpdateProductRequest"
Cohesion: 0.67
Nodes (3): @vitejs/plugin-react, @vitejs/plugin-react, @vitejs/plugin-react

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
Cohesion: 0.23
Nodes (8): BadgeProps, ConfirmDialog(), ConfirmDialogProps, Customer, deleteCustomer(), Customers(), formatDate(), fullName()

### Community 185 - "Inventory"
Cohesion: 0.16
Nodes (5): App\Models\User, App\Models\Warehouse, InventoryController, Inventory, InventoryService

## Knowledge Gaps
- **240 isolated node(s):** `CustomersResponse`, `ProductsResponse`, `ProductPayload`, `React Compiler`, `Expanding the ESLint configuration` (+235 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **36 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `Product` connect `HorizonServiceProvider` to `Cart`, `Customers.tsx`?**
  _High betweenness centrality (0.127) - this node is a cross-community bridge._
- **Why does `CartTest` connect `HorizonServiceProvider` to `Cart`, `App.tsx`?**
  _High betweenness centrality (0.055) - this node is a cross-community bridge._
- **Why does `User` connect `User` to `App.tsx`, `Illuminate\Database\Eloquent\SoftDeletes`, `StoreProductRequest`, `UpdateProductRequest`, `EnsureFeatureAvailableTest`, `Dashboard.tsx`, `App\Models\Concerns\BelongsToStore`, `TestCase`, `RegisterStaffLimitTest`?**
  _High betweenness centrality (0.040) - this node is a cross-community bridge._
- **Are the 16 inferred relationships involving `User` (e.g. with `.register()` and `.run()`) actually correct?**
  _`User` has 16 INFERRED edges - model-reasoned connections that need verification._
- **Are the 13 inferred relationships involving `Store` (e.g. with `.store()` and `.handle()`) actually correct?**
  _`Store` has 13 INFERRED edges - model-reasoned connections that need verification._
- **What connects `CustomersResponse`, `ProductsResponse`, `ProductPayload` to the rest of the system?**
  _240 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `StoreCreated` be split into smaller, more focused modules?**
  _Cohesion score 0.06352941176470588 - nodes in this community are weakly interconnected._