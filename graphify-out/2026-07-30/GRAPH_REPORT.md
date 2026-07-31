# Graph Report - Colmerzia  (2026-07-30)

## Corpus Check
- 261 files · ~46,700 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 1283 nodes · 2223 edges · 153 communities (120 shown, 33 thin omitted)
- Extraction: 97% EXTRACTED · 3% INFERRED · 0% AMBIGUOUS · INFERRED: 75 edges (avg confidence: 0.8)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `5f0d0e05`
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

## God Nodes (most connected - your core abstractions)
1. `Store` - 56 edges
2. `User` - 47 edges
3. `Subscription` - 38 edges
4. `Customer` - 29 edges
5. `Product` - 28 edges
6. `CartTest` - 23 edges
7. `Cart` - 22 edges
8. `Coupon` - 22 edges
9. `CartService` - 21 edges
10. `OrderControllerTest` - 17 edges

## Surprising Connections (you probably didn't know these)
- `Login()` --calls--> `useAuthStore`  [EXTRACTED]
  frontend/src/pages/Login.tsx → frontend/src/store/authStore.ts
- `register()` --references--> `StoreOnboardingResponseDTO`  [EXTRACTED]
  backend/app/Contracts/Onboarding/StoreOnboardingServiceInterface.php → backend/app/DTOs/Onboarding/StoreOnboardingResponseDTO.php
- `StoreOnboardingResponseDTO` --references--> `Store`  [EXTRACTED]
  backend/app/DTOs/Onboarding/StoreOnboardingResponseDTO.php → backend/app/Models/Store.php
- `StoreOnboardingResponseDTO` --references--> `Subscription`  [EXTRACTED]
  backend/app/DTOs/Onboarding/StoreOnboardingResponseDTO.php → backend/app/Models/Subscription.php
- `StoreOnboardingController` --inherits--> `Controller`  [EXTRACTED]
  backend/app/Http/Controllers/Api/V1/Onboarding/StoreOnboardingController.php → backend/app/Http/Controllers/Controller.php

## Import Cycles
- None detected.

## Communities (153 total, 33 thin omitted)

### Community 0 - ".parent"
Cohesion: 0.07
Nodes (12): InactiveUserException, InvalidCredentialsException, BaseApiException, LoginRateLimitTest, Store, LoginTenantIsolationTest, Store, Store (+4 more)

### Community 1 - "StoreCreated"
Cohesion: 0.06
Nodes (20): ProductCreated, StoreCreated, UserLoggedIn, GenerateProductImagesJob, SendWelcomeEmailJob, LogUserLogin, SendWelcomeEmail, WelcomeMail (+12 more)

### Community 2 - "composer.json"
Cohesion: 0.14
Nodes (13): autoload-dev, psr-4, description, keywords, license, minimum-stability, name, prefer-stable (+5 more)

### Community 3 - "AuthController.php"
Cohesion: 0.09
Nodes (17): App\Contracts\Auth\AuthServiceInterface, App\DTOs\Auth\LoginResponseDTO, App\Http\Controllers\Controller, App\Http\Requests\Auth\LoginRequest, App\Http\Requests\Auth\RegisterRequest, App\Http\Resources\Auth\LoginResource, App\Http\Resources\User\UserResource, App\Models\User (+9 more)

### Community 4 - "dependencies"
Cohesion: 0.10
Nodes (21): axios, clsx, dependencies, axios, clsx, @hookform/resolvers, lucide-react, react-dom (+13 more)

### Community 5 - "Illuminate\Database\Eloquent\SoftDeletes"
Cohesion: 0.14
Nodes (9): CustomerAddress, Permission, CustomerSeeder, DatabaseSeeder, PermissionSeeder, RoleSeeder, StoreSeeder, Illuminate\Database\Eloquent\SoftDeletes (+1 more)

### Community 6 - "devDependencies"
Cohesion: 0.11
Nodes (19): eslint-plugin-react-hooks, devDependencies, eslint-plugin-react-hooks, tailwindcss, @tailwindcss/vite, @types/node, @types/react, @types/react-dom (+11 more)

### Community 7 - "Customers.tsx"
Cohesion: 0.15
Nodes (18): PageHeader(), PageHeaderProps, Panel(), PanelProps, useToast(), createProduct(), deleteProduct(), getProduct() (+10 more)

### Community 8 - "scripts"
Cohesion: 0.14
Nodes (14): scripts, dev, post-autoload-dump, post-update-cmd, pre-package-uninstall, test, Composer\\Config::disableProcessTimeout, Illuminate\\Foundation\\ComposerScripts::postAutoloadDump (+6 more)

### Community 9 - "router.tsx"
Cohesion: 0.16
Nodes (13): App(), ProtectedRoute(), PublicRoute(), ToastProvider(), me(), useAuthBootstrap(), queryClient, router (+5 more)

### Community 10 - "Product"
Cohesion: 0.10
Nodes (4): Product, ProductPolicy, Store, StoreScopingTest

### Community 11 - "compilerOptions"
Cohesion: 0.09
Nodes (22): compilerOptions, allowImportingTsExtensions, erasableSyntaxOnly, jsx, lib, module, moduleDetection, moduleResolution (+14 more)

### Community 12 - "User"
Cohesion: 0.13
Nodes (6): LoginResponseDTO, User, UserPolicy, Illuminate\Foundation\Auth\User, Illuminate\Notifications\Notifiable, Laravel\Sanctum\HasApiTokens

### Community 13 - "compilerOptions"
Cohesion: 0.10
Nodes (19): compilerOptions, allowImportingTsExtensions, erasableSyntaxOnly, lib, module, moduleDetection, noEmit, noFallthroughCasesInSwitch (+11 more)

### Community 14 - "Illuminate\Database\Eloquent\Factories\Factory"
Cohesion: 0.14
Nodes (7): BrandFactory, CategoryFactory, CustomerFactory, ProductFactory, ProductVariantFactory, StoreFactory, Illuminate\Database\Eloquent\Factories\Factory

### Community 15 - "App\Models\Concerns\BelongsToStore"
Cohesion: 0.12
Nodes (6): App\Models\Concerns\BelongsToStore, DiscountRule, Order, Transaction, Warehouse, Illuminate\Database\Eloquent\Factories\HasFactory

### Community 16 - "BaseRequest"
Cohesion: 0.05
Nodes (10): LoginRequest, RegisterRequest, BaseRequest, StoreCustomerRequest, UpdateCustomerRequest, StoreProductRequest, UpdateProductRequest, StoreStoreRequest (+2 more)

### Community 17 - "Illuminate\Database\Eloquent\Model"
Cohesion: 0.12
Nodes (5): Inventory, InventoryMovement, Payment, ProductImage, Illuminate\Database\Eloquent\Model

### Community 19 - "devDependencies"
Cohesion: 0.11
Nodes (17): devDependencies, concurrently, laravel-vite-plugin, tailwindcss, @tailwindcss/vite, vite, tailwindcss, @tailwindcss/vite (+9 more)

### Community 21 - "App\Models\Concerns\BelongsToStoreOrNull"
Cohesion: 0.16
Nodes (4): App\Models\Concerns\BelongsToStoreOrNull, AuditLog, Notification, Setting

### Community 22 - "Illuminate\Http\Request"
Cohesion: 0.19
Nodes (4): App\Http\Requests\Product\StoreProductRequest, App\Http\Requests\Product\UpdateProductRequest, ProductController, Controller

### Community 23 - "Illuminate\Foundation\Http\FormRequest"
Cohesion: 0.13
Nodes (26): CustomerSnapshot, getOrder(), getOrders(), OrderItem, OrdersResponse, OrderStatus, PaymentStatus, ShippingAddress (+18 more)

### Community 24 - "Tenant"
Cohesion: 0.16
Nodes (7): EnsureFeatureAvailable, EnsureStoreIsActive, EnsureSubscriptionIsWritable, ResolveTenantBySubdomain, Tenant, Closure, Symfony\Component\HttpFoundation\Response

### Community 25 - "BaseApiException"
Cohesion: 0.05
Nodes (19): App\Models\Order, App\Models\Product, App\Models\ProductVariant, ApiException, CartException, CheckoutController, Cart, CartItem (+11 more)

### Community 26 - "Illuminate\Database\Eloquent\Factories\HasFactory"
Cohesion: 0.14
Nodes (9): CustomerController, CustomerResource, ProductResource, StoreResource, CartItemResource, CartResource, OrderResource, Illuminate\Http\Request (+1 more)

### Community 28 - "authApi.ts"
Cohesion: 0.22
Nodes (4): api, Header(), menu, logout()

### Community 29 - "Brand"
Cohesion: 0.20
Nodes (3): Brand, ProductVariant, CatalogSeeder

### Community 30 - "static"
Cohesion: 0.18
Nodes (4): bootBelongsToStore(), SubscriptionFactory, UserFactory, static

### Community 31 - "ProductForm.tsx"
Cohesion: 0.11
Nodes (6): App\Http\Requests\BaseRequest, CartController, AddCartItemRequest, ApplyCouponRequest, CheckoutRequest, UpdateCartItemRequest

### Community 32 - "CustomerForm.tsx"
Cohesion: 0.31
Nodes (8): createCustomer(), CustomerPayload, CustomersResponse, getCustomer(), updateCustomer(), CustomerForm(), CustomerFormData, schema

### Community 33 - "BaseResource"
Cohesion: 0.29
Nodes (3): LoginResource, BaseResource, UserResource

### Community 34 - "BelongsToStoreOrNullScope.php"
Cohesion: 0.36
Nodes (4): BelongsToStoreOrNullScope, BelongsToStoreScope, Illuminate\Database\Eloquent\Builder, Illuminate\Database\Eloquent\Scope

### Community 35 - "App.tsx"
Cohesion: 0.27
Nodes (4): App\Models\Store, Illuminate\Foundation\Testing\RefreshDatabase, Tests\Concerns\CreatesStoreUsers, Tests\TestCase

### Community 36 - "ToastProvider.tsx"
Cohesion: 0.36
Nodes (6): ToastContext, ToastContextValue, ToastInput, ToastTone, icons, Toast

### Community 38 - "UpdateCustomerRequest"
Cohesion: 0.19
Nodes (9): Button(), ButtonProps, ButtonVariant, TextField(), TextFieldProps, login(), Login(), LoginForm (+1 more)

### Community 43 - "Warehouse"
Cohesion: 0.27
Nodes (3): App\Contracts\Onboarding\StoreOnboardingServiceInterface, StoreOnboardingController, StoreOnboardingRequest

### Community 46 - "Dashboard.tsx"
Cohesion: 0.18
Nodes (11): BadgeProps, ConfirmDialog(), ConfirmDialogProps, Customer, deleteCustomer(), getCustomers(), getProducts(), Customers() (+3 more)

### Community 47 - "AuthLayout.tsx"
Cohesion: 0.50
Nodes (3): AuthState, useAuthStore, User

### Community 124 - "Role"
Cohesion: 0.20
Nodes (4): Role, UserSeeder, createUserWithPermissions(), User

### Community 126 - "frontend/package.json"
Cohesion: 0.20
Nodes (9): name, private, scripts, build, dev, lint, preview, type (+1 more)

### Community 129 - "require-dev"
Cohesion: 0.25
Nodes (8): require-dev, fakerphp/faker, laravel/pail, laravel/pao, laravel/pint, mockery/mockery, nunomaduro/collision, phpunit/phpunit

### Community 130 - "setup"
Cohesion: 0.25
Nodes (8): post-root-package-install, setup, composer install, npm install --ignore-scripts, npm run build, @php artisan key:generate, @php artisan migrate --force, @php -r \"file_exists('.env') || copy('.env.example', '.env');\

### Community 132 - "StoreOnboardingResource.php"
Cohesion: 0.38
Nodes (3): App\Http\Resources\BaseResource, StoreOnboardingResource, OrderResource

### Community 133 - "config"
Cohesion: 0.29
Nodes (7): pestphp/pest-plugin, php-http/discovery, config, allow-plugins, optimize-autoloader, preferred-install, sort-packages

### Community 139 - "psr-4"
Cohesion: 0.40
Nodes (5): autoload, psr-4, App\\, Database\\Factories\\, Database\\Seeders\\

### Community 140 - "require"
Cohesion: 0.40
Nodes (5): require, laravel/framework, laravel/sanctum, laravel/tinker, php

### Community 142 - "post-create-project-cmd"
Cohesion: 0.50
Nodes (4): post-create-project-cmd, @php artisan key:generate --ansi, @php artisan migrate --graceful --ansi, @php -r \"file_exists('database/database.sqlite') || touch('database/database.sqlite');\

### Community 143 - "extra"
Cohesion: 0.67
Nodes (3): extra, laravel, dont-discover

## Knowledge Gaps
- **163 isolated node(s):** `OrderItem`, `CustomerSnapshot`, `ShippingAddress`, `OrdersResponse`, `UpdateOrderStatusPayload` (+158 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **33 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `Order` connect `BaseApiException` to `Illuminate\Foundation\Http\FormRequest`?**
  _High betweenness centrality (0.119) - this node is a cross-community bridge._
- **Why does `Coupon` connect `BaseApiException` to `CouponFactory`, `App.tsx`, `Illuminate\Database\Eloquent\SoftDeletes`, `Inventory`, `App\Models\Concerns\BelongsToStore`, `Illuminate\Database\Eloquent\Model`?**
  _High betweenness centrality (0.096) - this node is a cross-community bridge._
- **Why does `Customer` connect `Customer` to `Illuminate\Database\Eloquent\SoftDeletes`, `CustomerControllerTest`, `Product`, `App\Models\Concerns\BelongsToStore`, `BaseRequest`, `Illuminate\Database\Eloquent\Model`, `Illuminate\Database\Eloquent\Factories\HasFactory`?**
  _High betweenness centrality (0.090) - this node is a cross-community bridge._
- **Are the 13 inferred relationships involving `Store` (e.g. with `.handle()` and `.handle()`) actually correct?**
  _`Store` has 13 INFERRED edges - model-reasoned connections that need verification._
- **What connects `OrderItem`, `CustomerSnapshot`, `ShippingAddress` to the rest of the system?**
  _163 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `.parent` be split into smaller, more focused modules?**
  _Cohesion score 0.06560283687943262 - nodes in this community are weakly interconnected._
- **Should `StoreCreated` be split into smaller, more focused modules?**
  _Cohesion score 0.06352941176470588 - nodes in this community are weakly interconnected._