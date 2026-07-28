# Graph Report - .  (2026-07-28)

## Corpus Check
- cluster-only mode — file stats not available

## Summary
- 1001 nodes · 1554 edges · 123 communities (106 shown, 17 thin omitted)
- Extraction: 96% EXTRACTED · 4% INFERRED · 0% AMBIGUOUS · INFERRED: 58 edges (avg confidence: 0.8)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `5cf1c4a7`
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

## God Nodes (most connected - your core abstractions)
1. `User` - 47 edges
2. `Product` - 34 edges
3. `Customer` - 29 edges
4. `Store` - 23 edges
5. `compilerOptions` - 17 edges
6. `compilerOptions` - 15 edges
7. `ProductControllerTest` - 15 edges
8. `RegisterTest` - 14 edges
9. `Role` - 13 edges
10. `LoginTenantIsolationTest` - 13 edges

## Surprising Connections (you probably didn't know these)
- `createUserWithPermissions()` --calls--> `Role`  [INFERRED]
  backend/tests/Concerns/CreatesStoreUsers.php → backend/app/Models/Role.php
- `Tenant` --references--> `Store`  [EXTRACTED]
  backend/app/Support/Tenancy/Tenant.php → backend/app/Models/Store.php
- `Header()` --calls--> `useAuthStore`  [EXTRACTED]
  frontend/src/components/layout/Header.tsx → frontend/src/store/authStore.ts
- `CustomerForm()` --calls--> `useToast()`  [EXTRACTED]
  frontend/src/pages/CustomerForm.tsx → frontend/src/components/ui/useToast.ts
- `ProductForm()` --calls--> `useToast()`  [EXTRACTED]
  frontend/src/pages/ProductForm.tsx → frontend/src/components/ui/useToast.ts

## Import Cycles
- None detected.

## Communities (123 total, 17 thin omitted)

### Community 0 - ".parent"
Cohesion: 0.05
Nodes (19): App\Models\Store, CustomerResource, ProductResource, StoreResource, LoginRateLimitTest, Store, LoginTenantIsolationTest, Store (+11 more)

### Community 1 - "StoreCreated"
Cohesion: 0.06
Nodes (20): ProductCreated, StoreCreated, UserLoggedIn, GenerateProductImagesJob, SendWelcomeEmailJob, LogUserLogin, SendWelcomeEmail, WelcomeMail (+12 more)

### Community 2 - "composer.json"
Cohesion: 0.05
Nodes (41): pestphp/pest-plugin, php-http/discovery, autoload, autoload-dev, psr-4, psr-4, config, allow-plugins (+33 more)

### Community 3 - "AuthController.php"
Cohesion: 0.09
Nodes (18): App\Contracts\Auth\AuthServiceInterface, App\DTOs\Auth\LoginResponseDTO, App\Http\Controllers\Controller, App\Http\Requests\Auth\LoginRequest, App\Http\Requests\Auth\RegisterRequest, App\Http\Resources\Auth\LoginResource, App\Http\Resources\User\UserResource, App\Models\User (+10 more)

### Community 4 - "dependencies"
Cohesion: 0.06
Nodes (32): axios, clsx, dependencies, axios, clsx, @hookform/resolvers, lucide-react, react (+24 more)

### Community 5 - "Illuminate\Database\Eloquent\SoftDeletes"
Cohesion: 0.12
Nodes (10): Permission, Role, CustomerSeeder, DatabaseSeeder, PermissionSeeder, RoleSeeder, StoreSeeder, UserSeeder (+2 more)

### Community 6 - "devDependencies"
Cohesion: 0.07
Nodes (29): eslint, @eslint/js, eslint-plugin-react-hooks, eslint-plugin-react-refresh, devDependencies, eslint, @eslint/js, eslint-plugin-react-hooks (+21 more)

### Community 7 - "Customers.tsx"
Cohesion: 0.13
Nodes (19): BadgeProps, Button(), ButtonProps, ButtonVariant, ConfirmDialog(), ConfirmDialogProps, PageHeader(), PageHeaderProps (+11 more)

### Community 8 - "scripts"
Cohesion: 0.08
Nodes (26): scripts, dev, post-autoload-dump, post-create-project-cmd, post-root-package-install, post-update-cmd, pre-package-uninstall, setup (+18 more)

### Community 9 - "router.tsx"
Cohesion: 0.13
Nodes (13): ProtectedRoute(), PublicRoute(), TextField(), TextFieldProps, CreateAccount(), Login(), LoginForm, schema (+5 more)

### Community 10 - "Product"
Cohesion: 0.12
Nodes (3): Product, ProductPolicy, StoreScopingTest

### Community 11 - "compilerOptions"
Cohesion: 0.09
Nodes (22): compilerOptions, allowImportingTsExtensions, erasableSyntaxOnly, jsx, lib, module, moduleDetection, moduleResolution (+14 more)

### Community 12 - "User"
Cohesion: 0.15
Nodes (6): LoginResponseDTO, User, UserPolicy, Illuminate\Foundation\Auth\User, Illuminate\Notifications\Notifiable, Laravel\Sanctum\HasApiTokens

### Community 13 - "compilerOptions"
Cohesion: 0.10
Nodes (19): compilerOptions, allowImportingTsExtensions, erasableSyntaxOnly, lib, module, moduleDetection, noEmit, noFallthroughCasesInSwitch (+11 more)

### Community 14 - "Illuminate\Database\Eloquent\Factories\Factory"
Cohesion: 0.14
Nodes (7): BrandFactory, CategoryFactory, CustomerFactory, ProductFactory, ProductVariantFactory, StoreFactory, Illuminate\Database\Eloquent\Factories\Factory

### Community 15 - "App\Models\Concerns\BelongsToStore"
Cohesion: 0.13
Nodes (4): App\Models\Concerns\BelongsToStore, Coupon, DiscountRule, Order

### Community 16 - "BaseRequest"
Cohesion: 0.12
Nodes (3): LoginRequest, RegisterRequest, BaseRequest

### Community 17 - "Illuminate\Database\Eloquent\Model"
Cohesion: 0.14
Nodes (5): CartItem, InventoryMovement, OrderItem, ProductImage, Illuminate\Database\Eloquent\Model

### Community 19 - "devDependencies"
Cohesion: 0.11
Nodes (17): devDependencies, concurrently, laravel-vite-plugin, tailwindcss, @tailwindcss/vite, vite, tailwindcss, @tailwindcss/vite (+9 more)

### Community 21 - "App\Models\Concerns\BelongsToStoreOrNull"
Cohesion: 0.16
Nodes (4): App\Models\Concerns\BelongsToStoreOrNull, AuditLog, Notification, Setting

### Community 22 - "Illuminate\Http\Request"
Cohesion: 0.25
Nodes (4): CustomerController, ProductController, Controller, Illuminate\Http\Request

### Community 23 - "Illuminate\Foundation\Http\FormRequest"
Cohesion: 0.16
Nodes (4): StoreCustomerRequest, StoreStoreRequest, UpdateStoreRequest, Illuminate\Foundation\Http\FormRequest

### Community 24 - "Tenant"
Cohesion: 0.20
Nodes (5): EnsureStoreIsActive, ResolveTenantBySubdomain, Tenant, Closure, Symfony\Component\HttpFoundation\Response

### Community 25 - "BaseApiException"
Cohesion: 0.19
Nodes (5): ApiException, InactiveUserException, InvalidCredentialsException, BaseApiException, Exception

### Community 26 - "Illuminate\Database\Eloquent\Factories\HasFactory"
Cohesion: 0.18
Nodes (4): CustomerAddress, Payment, Transaction, Illuminate\Database\Eloquent\Factories\HasFactory

### Community 28 - "authApi.ts"
Cohesion: 0.20
Nodes (6): api, Header(), menu, login(), logout(), AdminLayout()

### Community 29 - "Brand"
Cohesion: 0.20
Nodes (3): Brand, ProductVariant, CatalogSeeder

### Community 30 - "static"
Cohesion: 0.20
Nodes (4): bootBelongsToStore(), SubscriptionFactory, UserFactory, static

### Community 31 - "ProductForm.tsx"
Cohesion: 0.26
Nodes (10): createProduct(), getProduct(), Product, ProductPayload, ProductsResponse, updateProduct(), ProductForm(), ProductFormData (+2 more)

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
Cohesion: 0.33
Nodes (6): App(), ToastProvider(), me(), useAuthBootstrap(), queryClient, router

### Community 36 - "ToastProvider.tsx"
Cohesion: 0.36
Nodes (6): ToastContext, ToastContextValue, ToastInput, ToastTone, icons, Toast

### Community 37 - "Category"
Cohesion: 0.36
Nodes (3): Category, Illuminate\Database\Eloquent\Relations\BelongsTo, Illuminate\Database\Eloquent\Relations\HasMany

### Community 46 - "Dashboard.tsx"
Cohesion: 0.83
Nodes (3): getCustomers(), getProducts(), Dashboard()

### Community 47 - "AuthLayout.tsx"
Cohesion: 0.50
Nodes (3): AuthState, useAuthStore, User

## Knowledge Gaps
- **154 isolated node(s):** `graphify`, `$schema`, `name`, `type`, `description` (+149 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **17 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `Product` connect `Product` to `.parent`, `Illuminate\Database\Eloquent\SoftDeletes`, `StoreProductRequest`, `UpdateProductRequest`, `App\Models\Concerns\BelongsToStore`, `Illuminate\Database\Eloquent\Model`, `Illuminate\Http\Request`, `Illuminate\Database\Eloquent\Factories\HasFactory`, `Brand`?**
  _High betweenness centrality (0.045) - this node is a cross-community bridge._
- **Why does `Customer` connect `Customer` to `.parent`, `Illuminate\Database\Eloquent\SoftDeletes`, `UpdateCustomerRequest`, `Product`, `App\Models\Concerns\BelongsToStore`, `Illuminate\Database\Eloquent\Model`, `Illuminate\Http\Request`, `Illuminate\Foundation\Http\FormRequest`, `Illuminate\Database\Eloquent\Factories\HasFactory`?**
  _High betweenness centrality (0.034) - this node is a cross-community bridge._
- **Why does `Store` connect `Store` to `.parent`, `Illuminate\Database\Eloquent\SoftDeletes`, `Illuminate\Database\Eloquent\Model`, `Customer`, `Tenant`, `Illuminate\Database\Eloquent\Factories\HasFactory`, `Brand`?**
  _High betweenness centrality (0.027) - this node is a cross-community bridge._
- **Are the 9 inferred relationships involving `Product` (e.g. with `.test_index_solo_devuelve_productos_de_la_tienda_del_subdominio()` and `.test_no_puede_actualizar_un_producto_de_otra_tienda()`) actually correct?**
  _`Product` has 9 INFERRED edges - model-reasoned connections that need verification._
- **What connects `graphify`, `$schema`, `name` to the rest of the system?**
  _154 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `.parent` be split into smaller, more focused modules?**
  _Cohesion score 0.05331510594668489 - nodes in this community are weakly interconnected._
- **Should `StoreCreated` be split into smaller, more focused modules?**
  _Cohesion score 0.06352941176470588 - nodes in this community are weakly interconnected._