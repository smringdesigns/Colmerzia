# Graph Report - Colmerzia  (2026-07-24)

## Corpus Check
- 205 files · ~32,005 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 871 nodes · 1267 edges · 115 communities (95 shown, 20 thin omitted)
- Extraction: 98% EXTRACTED · 2% INFERRED · 0% AMBIGUOUS · INFERRED: 27 edges (avg confidence: 0.8)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `b3530f7e`
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
- OrderItem
- Dashboard.tsx
- copilot-instructions.md

## God Nodes (most connected - your core abstractions)
1. `User` - 52 edges
2. `Customer` - 24 edges
3. `Product` - 24 edges
4. `Store` - 23 edges
5. `compilerOptions` - 17 edges
6. `compilerOptions` - 15 edges
7. `useAuthStore` - 11 edges
8. `BaseRequest` - 10 edges
9. `Category` - 10 edges
10. `Role` - 10 edges

## Surprising Connections (you probably didn't know these)
- `logout()` --references--> `User`  [EXTRACTED]
  backend/app/Contracts/Auth/AuthServiceInterface.php → backend/app/Models/User.php
- `login()` --references--> `LoginResponseDTO`  [EXTRACTED]
  backend/app/Contracts/Auth/AuthServiceInterface.php → backend/app/DTOs/Auth/LoginResponseDTO.php
- `LoginResponseDTO` --references--> `User`  [EXTRACTED]
  backend/app/DTOs/Auth/LoginResponseDTO.php → backend/app/Models/User.php
- `RegisterRequest` --inherits--> `BaseRequest`  [EXTRACTED]
  backend/app/Http/Requests/Auth/RegisterRequest.php → backend/app/Http/Requests/BaseRequest.php
- `Tenant` --references--> `Store`  [EXTRACTED]
  backend/app/Support/Tenancy/Tenant.php → backend/app/Models/Store.php

## Import Cycles
- None detected.

## Communities (115 total, 20 thin omitted)

### Community 0 - "Customers.tsx"
Cohesion: 0.14
Nodes (16): BadgeProps, ConfirmDialog(), ConfirmDialogProps, PageHeader(), PageHeaderProps, Panel(), PanelProps, useToast() (+8 more)

### Community 1 - "Illuminate\Http\Request"
Cohesion: 0.07
Nodes (18): App\Contracts\Auth\AuthServiceInterface, AuthController, CustomerController, ProductController, Controller, EnsureStoreIsActive, ResolveTenantBySubdomain, LoginResource (+10 more)

### Community 2 - "StoreCreated"
Cohesion: 0.06
Nodes (20): ProductCreated, StoreCreated, UserLoggedIn, GenerateProductImagesJob, SendWelcomeEmailJob, LogUserLogin, SendWelcomeEmail, WelcomeMail (+12 more)

### Community 3 - "composer.json"
Cohesion: 0.05
Nodes (41): pestphp/pest-plugin, php-http/discovery, autoload, autoload-dev, psr-4, psr-4, config, allow-plugins (+33 more)

### Community 4 - "router.tsx"
Cohesion: 0.13
Nodes (16): App(), ProtectedRoute(), PublicRoute(), login(), logout(), me(), useAuthBootstrap(), Login() (+8 more)

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
Cohesion: 0.12
Nodes (9): Permission, Role, CustomerSeeder, DatabaseSeeder, PermissionSeeder, RoleSeeder, StoreSeeder, UserSeeder (+1 more)

### Community 11 - "Illuminate\Database\Eloquent\Model"
Cohesion: 0.12
Nodes (8): Coupon, CustomerAddress, DiscountRule, ProductImage, ProductVariant, Warehouse, Illuminate\Database\Eloquent\Model, Illuminate\Database\Eloquent\SoftDeletes

### Community 13 - "compilerOptions"
Cohesion: 0.10
Nodes (19): compilerOptions, allowImportingTsExtensions, erasableSyntaxOnly, lib, module, moduleDetection, noEmit, noFallthroughCasesInSwitch (+11 more)

### Community 15 - "Illuminate\Database\Eloquent\Factories\HasFactory"
Cohesion: 0.10
Nodes (6): AuditLog, Notification, Payment, Setting, Transaction, Illuminate\Database\Eloquent\Factories\HasFactory

### Community 16 - "User"
Cohesion: 0.17
Nodes (5): User, UserPolicy, Illuminate\Foundation\Auth\User, Illuminate\Notifications\Notifiable, Laravel\Sanctum\HasApiTokens

### Community 17 - "devDependencies"
Cohesion: 0.11
Nodes (17): devDependencies, concurrently, laravel-vite-plugin, tailwindcss, @tailwindcss/vite, vite, tailwindcss, @tailwindcss/vite (+9 more)

### Community 18 - "LoginResponseDTO"
Cohesion: 0.15
Nodes (6): login(), logout(), LoginResponseDTO, AppServiceProvider, AuthService, Illuminate\Support\ServiceProvider

### Community 22 - "Category"
Cohesion: 0.17
Nodes (5): Brand, Category, CatalogSeeder, Illuminate\Database\Eloquent\Relations\BelongsTo, Illuminate\Database\Eloquent\Relations\HasMany

### Community 23 - "Illuminate\Foundation\Http\FormRequest"
Cohesion: 0.28
Nodes (3): StoreStoreRequest, UpdateStoreRequest, Illuminate\Foundation\Http\FormRequest

### Community 24 - "ProductForm.tsx"
Cohesion: 0.22
Nodes (11): api, createProduct(), getProduct(), Product, ProductPayload, ProductsResponse, updateProduct(), ProductForm() (+3 more)

### Community 32 - "TestCase"
Cohesion: 0.40
Nodes (3): ExampleTest, TestCase, Illuminate\Foundation\Testing\TestCase

### Community 34 - "BaseApiException"
Cohesion: 0.21
Nodes (5): ApiException, InactiveUserException, InvalidCredentialsException, BaseApiException, Exception

### Community 35 - "ToastProvider.tsx"
Cohesion: 0.26
Nodes (8): ToastContext, ToastContextValue, ToastInput, ToastTone, icons, Toast, ToastProvider(), queryClient

### Community 38 - "AuthLayout.tsx"
Cohesion: 0.50
Nodes (3): AuthState, useAuthStore, User

### Community 109 - "Button.tsx"
Cohesion: 0.27
Nodes (6): Button(), ButtonProps, ButtonVariant, TextField(), TextFieldProps, CreateAccount()

### Community 110 - "CustomerForm.tsx"
Cohesion: 0.31
Nodes (8): createCustomer(), CustomerPayload, CustomersResponse, getCustomer(), updateCustomer(), CustomerForm(), CustomerFormData, schema

### Community 111 - "Header.tsx"
Cohesion: 0.31
Nodes (3): Header(), menu, AdminLayout()

### Community 113 - "Dashboard.tsx"
Cohesion: 0.83
Nodes (3): getCustomers(), getProducts(), Dashboard()

## Knowledge Gaps
- **154 isolated node(s):** `graphify`, `$schema`, `name`, `type`, `description` (+149 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **20 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `User` connect `User` to `Illuminate\Database\Seeder`, `Illuminate\Database\Eloquent\Model`, `Customer`, `Illuminate\Database\Eloquent\Factories\HasFactory`, `LoginResponseDTO`, `Product`, `Store`?**
  _High betweenness centrality (0.035) - this node is a cross-community bridge._
- **Why does `Customer` connect `Customer` to `Illuminate\Http\Request`, `Illuminate\Database\Seeder`, `Illuminate\Database\Eloquent\Model`, `Illuminate\Database\Eloquent\Factories\HasFactory`, `Store`, `StoreCustomerRequest`, `UpdateCustomerRequest`?**
  _High betweenness centrality (0.028) - this node is a cross-community bridge._
- **Why does `Product` connect `Product` to `Illuminate\Http\Request`, `Illuminate\Database\Eloquent\Model`, `Illuminate\Database\Eloquent\Factories\HasFactory`, `Category`, `StoreProductRequest`, `UpdateProductRequest`?**
  _High betweenness centrality (0.028) - this node is a cross-community bridge._
- **What connects `graphify`, `$schema`, `name` to the rest of the system?**
  _154 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Customers.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.14492753623188406 - nodes in this community are weakly interconnected._
- **Should `Illuminate\Http\Request` be split into smaller, more focused modules?**
  _Cohesion score 0.06610169491525424 - nodes in this community are weakly interconnected._
- **Should `StoreCreated` be split into smaller, more focused modules?**
  _Cohesion score 0.06352941176470588 - nodes in this community are weakly interconnected._