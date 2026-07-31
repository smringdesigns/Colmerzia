# Graph Report - Colmerzia  (2026-07-25)

## Corpus Check
- 213 files · ~35,809 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 944 nodes · 1452 edges · 114 communities (100 shown, 14 thin omitted)
- Extraction: 97% EXTRACTED · 3% INFERRED · 0% AMBIGUOUS · INFERRED: 50 edges (avg confidence: 0.8)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `d0176242`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- Customers.tsx
- Illuminate\Http\Request
- StoreCreated
- composer.json
- router.tsx
- dependencies
- devDependencies
- scripts
- Illuminate\Database\Eloquent\Factories\Factory
- compilerOptions
- Illuminate\Database\Seeder
- Illuminate\Database\Eloquent\Model
- Inventory
- compilerOptions
- Customer
- Illuminate\Database\Eloquent\Factories\HasFactory
- User
- devDependencies
- LoginResponseDTO
- Product
- Store
- BaseRequest
- Category
- Illuminate\Foundation\Http\FormRequest
- ProductForm.tsx
- Order
- StoreCustomerRequest
- UpdateCustomerRequest
- StoreProductRequest
- UpdateProductRequest
- RegisterRequest
- Cart
- TestCase
- CartItem
- BaseApiException
- ToastProvider.tsx
- CleanupTokens
- ExampleTest
- AuthLayout.tsx
- BaseService
- InfoCard.tsx
- tsconfig.json
- Button.tsx
- CustomerForm.tsx
- Header.tsx
- Dashboard.tsx
- copilot-instructions.md

## God Nodes (most connected - your core abstractions)
1. `User` - 49 edges
2. `Product` - 34 edges
3. `Customer` - 29 edges
4. `Store` - 23 edges
5. `compilerOptions` - 17 edges
6. `ProductControllerTest` - 15 edges
7. `compilerOptions` - 15 edges
8. `Role` - 13 edges
9. `LoginTenantIsolationTest` - 13 edges
10. `CustomerControllerTest` - 13 edges

## Surprising Connections (you probably didn't know these)
- `createUserWithPermissions()` --calls--> `Role`  [INFERRED]
  backend/tests/Concerns/CreatesStoreUsers.php → backend/app/Models/Role.php
- `login()` --references--> `LoginResponseDTO`  [EXTRACTED]
  backend/app/Contracts/Auth/AuthServiceInterface.php → backend/app/DTOs/Auth/LoginResponseDTO.php
- `logout()` --references--> `User`  [EXTRACTED]
  backend/app/Contracts/Auth/AuthServiceInterface.php → backend/app/Models/User.php
- `AuthController` --inherits--> `Controller`  [EXTRACTED]
  backend/app/Http/Controllers/Api/V1/Auth/AuthController.php → backend/app/Http/Controllers/Controller.php
- `ProductController` --inherits--> `Controller`  [EXTRACTED]
  backend/app/Http/Controllers/Api/V1/ProductController.php → backend/app/Http/Controllers/Controller.php

## Import Cycles
- None detected.

## Communities (114 total, 14 thin omitted)

### Community 0 - "Customers.tsx"
Cohesion: 0.13
Nodes (19): BadgeProps, Button(), ButtonProps, ButtonVariant, ConfirmDialog(), ConfirmDialogProps, PageHeader(), PageHeaderProps (+11 more)

### Community 1 - "Illuminate\Http\Request"
Cohesion: 0.19
Nodes (7): BaseResource, CustomerResource, ProductResource, StoreResource, UserResource, Illuminate\Http\Request, Illuminate\Http\Resources\Json\JsonResource

### Community 2 - "StoreCreated"
Cohesion: 0.06
Nodes (20): ProductCreated, StoreCreated, UserLoggedIn, GenerateProductImagesJob, SendWelcomeEmailJob, LogUserLogin, SendWelcomeEmail, WelcomeMail (+12 more)

### Community 3 - "composer.json"
Cohesion: 0.05
Nodes (41): pestphp/pest-plugin, php-http/discovery, autoload, autoload-dev, psr-4, psr-4, config, allow-plugins (+33 more)

### Community 4 - "router.tsx"
Cohesion: 0.13
Nodes (13): ProtectedRoute(), PublicRoute(), TextField(), TextFieldProps, CreateAccount(), Login(), LoginForm, schema (+5 more)

### Community 5 - "dependencies"
Cohesion: 0.06
Nodes (32): axios, clsx, dependencies, axios, clsx, @hookform/resolvers, lucide-react, react (+24 more)

### Community 6 - "devDependencies"
Cohesion: 0.07
Nodes (29): eslint, @eslint/js, eslint-plugin-react-hooks, eslint-plugin-react-refresh, devDependencies, eslint, @eslint/js, eslint-plugin-react-hooks (+21 more)

### Community 7 - "scripts"
Cohesion: 0.08
Nodes (26): scripts, dev, post-autoload-dump, post-create-project-cmd, post-root-package-install, post-update-cmd, pre-package-uninstall, setup (+18 more)

### Community 8 - "Illuminate\Database\Eloquent\Factories\Factory"
Cohesion: 0.11
Nodes (9): BrandFactory, CategoryFactory, CustomerFactory, ProductFactory, ProductVariantFactory, StoreFactory, UserFactory, Illuminate\Database\Eloquent\Factories\Factory (+1 more)

### Community 9 - "compilerOptions"
Cohesion: 0.09
Nodes (22): compilerOptions, allowImportingTsExtensions, erasableSyntaxOnly, jsx, lib, module, moduleDetection, moduleResolution (+14 more)

### Community 10 - "Illuminate\Database\Seeder"
Cohesion: 0.13
Nodes (9): CustomerAddress, Permission, CustomerSeeder, DatabaseSeeder, PermissionSeeder, RoleSeeder, StoreSeeder, Illuminate\Database\Eloquent\SoftDeletes (+1 more)

### Community 11 - "Illuminate\Database\Eloquent\Model"
Cohesion: 0.13
Nodes (7): App\Models\Concerns\BelongsToStore, Cart, Coupon, DiscountRule, ProductImage, Warehouse, Illuminate\Database\Eloquent\Model

### Community 12 - "Inventory"
Cohesion: 0.09
Nodes (6): Inventory, InventoryMovement, OrderItem, Payment, Transaction, Illuminate\Database\Eloquent\Factories\HasFactory

### Community 13 - "compilerOptions"
Cohesion: 0.10
Nodes (19): compilerOptions, allowImportingTsExtensions, erasableSyntaxOnly, lib, module, moduleDetection, noEmit, noFallthroughCasesInSwitch (+11 more)

### Community 14 - "Customer"
Cohesion: 0.18
Nodes (4): BelongsToStoreOrNullScope, BelongsToStoreScope, Illuminate\Database\Eloquent\Builder, Illuminate\Database\Eloquent\Scope

### Community 15 - "Illuminate\Database\Eloquent\Factories\HasFactory"
Cohesion: 0.16
Nodes (4): App\Models\Concerns\BelongsToStoreOrNull, AuditLog, Notification, Setting

### Community 16 - "User"
Cohesion: 0.05
Nodes (13): login(), logout(), LoginResponseDTO, Customer, Store, User, CustomerPolicy, ProductPolicy (+5 more)

### Community 17 - "devDependencies"
Cohesion: 0.11
Nodes (17): devDependencies, concurrently, laravel-vite-plugin, tailwindcss, @tailwindcss/vite, vite, tailwindcss, @tailwindcss/vite (+9 more)

### Community 18 - "LoginResponseDTO"
Cohesion: 0.16
Nodes (8): App\DTOs\Auth\LoginResponseDTO, App\Models\User, AppServiceProvider, AuthService, User, createUserWithPermissions(), User, Illuminate\Support\ServiceProvider

### Community 19 - "Product"
Cohesion: 0.20
Nodes (5): EnsureStoreIsActive, ResolveTenantBySubdomain, Tenant, Closure, Symfony\Component\HttpFoundation\Response

### Community 21 - "BaseRequest"
Cohesion: 0.12
Nodes (3): LoginRequest, RegisterRequest, BaseRequest

### Community 22 - "Category"
Cohesion: 0.20
Nodes (3): Brand, ProductVariant, CatalogSeeder

### Community 23 - "Illuminate\Foundation\Http\FormRequest"
Cohesion: 0.16
Nodes (4): UpdateProductRequest, StoreStoreRequest, UpdateStoreRequest, Illuminate\Foundation\Http\FormRequest

### Community 24 - "ProductForm.tsx"
Cohesion: 0.26
Nodes (10): createProduct(), getProduct(), Product, ProductPayload, ProductsResponse, updateProduct(), ProductForm(), ProductFormData (+2 more)

### Community 29 - "UpdateProductRequest"
Cohesion: 0.33
Nodes (6): App(), ToastProvider(), me(), useAuthBootstrap(), queryClient, router

### Community 30 - "RegisterRequest"
Cohesion: 0.36
Nodes (3): App\Contracts\Auth\AuthServiceInterface, AuthController, LoginResource

### Community 31 - "Cart"
Cohesion: 0.36
Nodes (3): Category, Illuminate\Database\Eloquent\Relations\BelongsTo, Illuminate\Database\Eloquent\Relations\HasMany

### Community 34 - "BaseApiException"
Cohesion: 0.05
Nodes (18): App\Models\Store, ApiException, InactiveUserException, InvalidCredentialsException, BaseApiException, Product, LoginTenantIsolationTest, Store (+10 more)

### Community 35 - "ToastProvider.tsx"
Cohesion: 0.36
Nodes (6): ToastContext, ToastContextValue, ToastInput, ToastTone, icons, Toast

### Community 38 - "AuthLayout.tsx"
Cohesion: 0.50
Nodes (3): AuthState, useAuthStore, User

### Community 110 - "CustomerForm.tsx"
Cohesion: 0.31
Nodes (8): createCustomer(), CustomerPayload, CustomersResponse, getCustomer(), updateCustomer(), CustomerForm(), CustomerFormData, schema

### Community 111 - "Header.tsx"
Cohesion: 0.20
Nodes (6): api, Header(), menu, login(), logout(), AdminLayout()

### Community 113 - "Dashboard.tsx"
Cohesion: 0.83
Nodes (3): getCustomers(), getProducts(), Dashboard()

## Knowledge Gaps
- **154 isolated node(s):** `graphify`, `$schema`, `name`, `type`, `description` (+149 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **14 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `Product` connect `BaseApiException` to `Illuminate\Database\Seeder`, `Illuminate\Database\Eloquent\Model`, `Inventory`, `User`, `Store`, `Category`, `Illuminate\Foundation\Http\FormRequest`, `StoreProductRequest`?**
  _High betweenness centrality (0.039) - this node is a cross-community bridge._
- **Why does `Customer` connect `User` to `BaseApiException`, `Illuminate\Database\Seeder`, `Illuminate\Database\Eloquent\Model`, `Inventory`, `Store`, `StoreCustomerRequest`, `UpdateCustomerRequest`?**
  _High betweenness centrality (0.034) - this node is a cross-community bridge._
- **Why does `User` connect `User` to `Illuminate\Database\Seeder`, `Inventory`, `Button.tsx`?**
  _High betweenness centrality (0.033) - this node is a cross-community bridge._
- **Are the 9 inferred relationships involving `Product` (e.g. with `.test_index_solo_devuelve_productos_de_la_tienda_del_subdominio()` and `.test_no_puede_actualizar_un_producto_de_otra_tienda()`) actually correct?**
  _`Product` has 9 INFERRED edges - model-reasoned connections that need verification._
- **Are the 4 inferred relationships involving `Customer` (e.g. with `.test_index_solo_devuelve_clientes_de_la_tienda_del_subdominio()` and `.test_no_puede_eliminar_un_cliente_de_otra_tienda()`) actually correct?**
  _`Customer` has 4 INFERRED edges - model-reasoned connections that need verification._
- **What connects `graphify`, `$schema`, `name` to the rest of the system?**
  _154 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Customers.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.12962962962962962 - nodes in this community are weakly interconnected._