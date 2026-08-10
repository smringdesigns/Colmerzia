# Graph Report - Colmerzia  (2026-08-10)

## Corpus Check
- 348 files · ~85,176 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 1949 nodes · 3480 edges · 206 communities (165 shown, 41 thin omitted)
- Extraction: 95% EXTRACTED · 5% INFERRED · 0% AMBIGUOUS · INFERRED: 171 edges (avg confidence: 0.77)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `418991bc`
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
- Products.tsx
- LoginTenantIsolationTest
- frontend/src/App.tsx
- StoreOnboardingRequest
- RegisterTest
- layout/Header.tsx
- authApi.ts
- Coupon
- ProductVariantResource
- inventoryApi.ts
- Product
- LoginRateLimitTest
- CartItem
- ForgotPassword.tsx
- validate_data.py

## God Nodes (most connected - your core abstractions)
1. `User` - 73 edges
2. `Store` - 63 edges
3. `Tenant` - 44 edges
4. `Product` - 39 edges
5. `Customer` - 31 edges
6. `DesignSystemGenerator` - 29 edges
7. `Subscription` - 28 edges
8. `TestCase` - 28 edges
9. `InventoryService` - 27 edges
10. `CartTest` - 24 edges

## Surprising Connections (you probably didn't know these)
- `bootBelongsToStore()` --calls--> `Tenant`  [INFERRED]
  backend/app/Models/Concerns/BelongsToStore.php → backend/app/Support/Tenancy/Tenant.php
- `TestDomainDetection` --uses--> `BM25`  [INFERRED]
  .claude/skills/ui-ux-pro-max/scripts/tests/test_core.py → .claude/skills/ui-ux-pro-max/scripts/core.py
- `TestPersistence` --uses--> `BM25`  [INFERRED]
  .claude/skills/ui-ux-pro-max/scripts/tests/test_core.py → .claude/skills/ui-ux-pro-max/scripts/core.py
- `TestReasoningMatch` --uses--> `BM25`  [INFERRED]
  .claude/skills/ui-ux-pro-max/scripts/tests/test_core.py → .claude/skills/ui-ux-pro-max/scripts/core.py
- `TestSearchDomains` --uses--> `BM25`  [INFERRED]
  .claude/skills/ui-ux-pro-max/scripts/tests/test_core.py → .claude/skills/ui-ux-pro-max/scripts/core.py

## Import Cycles
- None detected.

## Communities (206 total, 41 thin omitted)

### Community 0 - ".parent"
Cohesion: 0.06
Nodes (8): App\Http\Requests\BaseRequest, AdjustInventoryRequest, StoreRoleRequest, UpdateRoleRequest, CreateWorkspaceRequest, UpdateStoreRequest, StoreUserRequest, UpdateUserRequest

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
Cohesion: 0.08
Nodes (12): App\DTOs\Onboarding\StoreOnboardingResponseDTO, Permission, ProductImage, Role, StoreOnboardingService, DatabaseSeeder, PermissionSeeder, RoleSeeder (+4 more)

### Community 6 - "devDependencies"
Cohesion: 0.12
Nodes (16): devDependencies, eslint, @eslint/js, eslint-plugin-react-hooks, eslint-plugin-react-refresh, globals, tailwindcss, @tailwindcss/vite (+8 more)

### Community 7 - "Customers.tsx"
Cohesion: 0.29
Nodes (9): createProduct(), getProduct(), ProductPayload, ProductsResponse, updateProduct(), ProductForm(), ProductFormData, ProductFormInput (+1 more)

### Community 8 - "scripts"
Cohesion: 0.14
Nodes (14): scripts, dev, post-autoload-dump, post-update-cmd, pre-package-uninstall, test, Composer\\Config::disableProcessTimeout, Illuminate\\Foundation\\ComposerScripts::postAutoloadDump (+6 more)

### Community 9 - "router.tsx"
Cohesion: 0.17
Nodes (12): ProtectedRoute(), PublicRoute(), CreateStore(), Login(), LoginForm, schema, AuthState, Permission (+4 more)

### Community 10 - "Product"
Cohesion: 0.09
Nodes (4): App\Models\Subscription, Store, Tenant, StoreSeeder

### Community 11 - "compilerOptions"
Cohesion: 0.05
Nodes (41): compilerOptions, allowImportingTsExtensions, erasableSyntaxOnly, jsx, lib, module, moduleDetection, moduleResolution (+33 more)

### Community 12 - "User"
Cohesion: 0.06
Nodes (10): User, CustomerPolicy, ProductPolicy, StorePolicy, UserPolicy, LoginTenantIsolationTest, Illuminate\Contracts\Auth\MustVerifyEmail, Illuminate\Foundation\Auth\User (+2 more)

### Community 13 - "compilerOptions"
Cohesion: 0.05
Nodes (36): compilerOptions, allowImportingTsExtensions, erasableSyntaxOnly, lib, module, moduleDetection, noEmit, noFallthroughCasesInSwitch (+28 more)

### Community 14 - "Illuminate\Database\Eloquent\Factories\Factory"
Cohesion: 0.06
Nodes (15): BrandFactory, CategoryFactory, CouponFactory, static, CustomerFactory, DiscountRuleFactory, static, ProductFactory (+7 more)

### Community 15 - "App\Models\Concerns\BelongsToStore"
Cohesion: 0.20
Nodes (3): App\Models\Concerns\BelongsToStore, DiscountRule, Warehouse

### Community 16 - "BaseRequest"
Cohesion: 0.06
Nodes (10): CustomerController, StoreCustomerRequest, UpdateCustomerRequest, StoreProductRequest, UpdateProductRequest, StoreStoreRequest, Customer, CustomerSeeder (+2 more)

### Community 19 - "devDependencies"
Cohesion: 0.11
Nodes (17): devDependencies, concurrently, laravel-vite-plugin, tailwindcss, @tailwindcss/vite, vite, tailwindcss, @tailwindcss/vite (+9 more)

### Community 21 - "App\Models\Concerns\BelongsToStoreOrNull"
Cohesion: 0.08
Nodes (12): App\Models\Concerns\BelongsToStoreOrNull, AuditLog, CustomerAddress, InventoryMovement, Notification, OrderItem, Payment, Setting (+4 more)

### Community 22 - "Illuminate\Http\Request"
Cohesion: 0.13
Nodes (25): FormModal(), FormModalProps, createRole(), deleteRole(), getPermissions(), getRoles(), GroupedPermissions, PermissionSummary (+17 more)

### Community 23 - "Illuminate\Foundation\Http\FormRequest"
Cohesion: 0.12
Nodes (24): api, CustomerSnapshot, getOrder(), Order, OrderItem, OrdersResponse, OrderStatus, PaymentStatus (+16 more)

### Community 24 - "Tenant"
Cohesion: 0.11
Nodes (25): ansi_ljust(), _detect_page_type(), format_ascii_box(), format_markdown(), format_master_md(), format_page_override_md(), generate_design_system(), _generate_intelligent_overrides() (+17 more)

### Community 25 - "BaseApiException"
Cohesion: 0.10
Nodes (6): Cart, CartItem, Coupon, ProductVariant, CartService, Illuminate\Database\Eloquent\Concerns\HasUuids

### Community 26 - "Illuminate\Database\Eloquent\Factories\HasFactory"
Cohesion: 0.10
Nodes (12): App\Http\Requests\Auth\LoginRequest, App\Http\Requests\Auth\RegisterRequest, App\Http\Resources\Auth\LoginResource, App\Http\Resources\BaseResource, App\Http\Resources\User\UserResource, AuthController, RoleController, UserController (+4 more)

### Community 27 - "Store"
Cohesion: 0.23
Nodes (4): App\Http\Controllers\Controller, CategoryController, ProductController, CategoryResource

### Community 28 - "authApi.ts"
Cohesion: 0.05
Nodes (42): 1. Clonar el repositorio, 2. Configurar las variables de entorno, 3. Construir y levantar el proyecto, 4. Verificar los contenedores, 5. Ver los logs, 🏗️ Arquitectura del proyecto, 🏪 Arquitectura Multiempresa, 🔐 Autenticación (+34 more)

### Community 29 - "Brand"
Cohesion: 0.24
Nodes (10): Button(), ButtonProps, ButtonVariant, ConfirmDialog(), ConfirmDialogProps, Customer, deleteCustomer(), Customers() (+2 more)

### Community 31 - "ProductForm.tsx"
Cohesion: 0.25
Nodes (4): App\Contracts\Onboarding\StoreOnboardingServiceInterface, StoreOnboardingController, PermissionController, Controller

### Community 32 - "CustomerForm.tsx"
Cohesion: 0.27
Nodes (9): useToast(), createCustomer(), CustomerPayload, CustomersResponse, getCustomer(), updateCustomer(), CustomerForm(), CustomerFormData (+1 more)

### Community 33 - "BaseResource"
Cohesion: 0.39
Nodes (6): Panel(), PanelProps, getOrders(), formatDate(), formatMoney(), Orders()

### Community 34 - "BelongsToStoreOrNullScope.php"
Cohesion: 0.24
Nodes (5): bootBelongsToStore(), BelongsToStoreOrNullScope, BelongsToStoreScope, Illuminate\Database\Eloquent\Builder, Illuminate\Database\Eloquent\Scope

### Community 35 - "App.tsx"
Cohesion: 0.21
Nodes (5): StoreOwnerIsolationTest, TestCase, Illuminate\Foundation\Testing\RefreshDatabase, Illuminate\Foundation\Testing\TestCase, Tests\Concerns\CreatesStoreUsers

### Community 36 - "ToastProvider.tsx"
Cohesion: 0.12
Nodes (13): DesignSystemGenerator, _palette_is_dark(), WCAG relative luminance of a #RRGGBB string, or None if unparseable., True when a colors.csv row's Background is a dark surface., Generates design system recommendations from aggregated searches., Load reasoning rules from CSV., Find matching reasoning rule for a category., Apply reasoning rules to search results. (+5 more)

### Community 37 - "Category"
Cohesion: 0.17
Nodes (5): Brand, Category, CatalogSeeder, Illuminate\Database\Eloquent\Relations\BelongsTo, Illuminate\Database\Eloquent\Relations\HasMany

### Community 38 - "UpdateCustomerRequest"
Cohesion: 0.13
Nodes (18): _domain_keywords(), _get_bm25(), _load_csv(), _load_product_keywords(), Load CSV and return list of dicts, with mtime-based caching., Fitted BM25 index for this file+columns, with mtime-based caching., Core search function using BM25. Returns (results, bm25_or_none)., Nearest known vocabulary terms for a query that returned 0 hits,     so the cal (+10 more)

### Community 41 - "Cart"
Cohesion: 0.37
Nodes (6): App\Models\Product, App\Models\ProductVariant, App\Models\Store, seedStock(), Tests\Concerns\SeedsInventory, Tests\TestCase

### Community 43 - "Warehouse"
Cohesion: 0.10
Nodes (9): CustomerResource, ProductVariantResource, StoreResource, CartItemResource, CartResource, OrderResource, ProductDetailResource, ProductListResource (+1 more)

### Community 44 - "CleanupTokens"
Cohesion: 0.32
Nodes (4): CleanupTokens, SyncInventoryStock, Command, Illuminate\Console\Command

### Community 46 - "Dashboard.tsx"
Cohesion: 0.17
Nodes (5): register(), StoreOnboardingResponseDTO, Subscription, ProductPlanLimitTest, EnsureFeatureAvailableTest

### Community 47 - "AuthLayout.tsx"
Cohesion: 0.50
Nodes (3): AuthState, useAuthStore, User

### Community 48 - "BelongsToStoreOrNull.php"
Cohesion: 0.28
Nodes (3): InactiveUserException, InvalidCredentialsException, BaseApiException

### Community 81 - "TestCase"
Cohesion: 0.39
Nodes (6): ToastContext, ToastContextValue, ToastInput, ToastTone, icons, Toast

### Community 126 - "frontend/package.json"
Cohesion: 0.20
Nodes (9): name, private, scripts, build, dev, lint, preview, type (+1 more)

### Community 128 - "ProductControllerTest"
Cohesion: 0.26
Nodes (6): EnsureFeatureAvailable, EnsureStoreIsActive, EnsureSubscriptionIsWritable, bindTenant(), Closure, Symfony\Component\HttpFoundation\Response

### Community 129 - "require-dev"
Cohesion: 0.22
Nodes (9): require-dev, fakerphp/faker, laravel/pail, laravel/pao, laravel/pint, laravel/telescope, mockery/mockery, nunomaduro/collision (+1 more)

### Community 130 - "setup"
Cohesion: 0.25
Nodes (8): post-root-package-install, setup, composer install, npm install --ignore-scripts, npm run build, @php artisan key:generate, @php artisan migrate --force, @php -r \"file_exists('.env') || copy('.env.example', '.env');\

### Community 131 - "CouponFactory"
Cohesion: 0.25
Nodes (7): About Laravel, Agentic Development, Code of Conduct, Contributing, Learning Laravel, License, Security Vulnerabilities

### Community 132 - "StoreOnboardingResource.php"
Cohesion: 0.21
Nodes (4): LoginResource, BaseResource, StoreOnboardingResource, OrderResource

### Community 133 - "config"
Cohesion: 0.29
Nodes (7): pestphp/pest-plugin, php-http/discovery, config, allow-plugins, optimize-autoloader, preferred-install, sort-packages

### Community 134 - "DiscountRuleFactory"
Cohesion: 0.14
Nodes (4): OrderController, UpdateOrderStatusRequest, Order, OrderService

### Community 135 - "CustomerControllerTest"
Cohesion: 0.50
Nodes (3): Expanding the ESLint configuration, React Compiler, React + TypeScript + Vite

### Community 136 - "SubscriptionTest"
Cohesion: 0.21
Nodes (11): CURRENCIES, GeneralSettingsTab(), TIMEZONES, createStore(), CreateStorePayload, getMyStore(), StoreResponse, StoreSetting (+3 more)

### Community 138 - "OrderItem"
Cohesion: 0.13
Nodes (3): LoginRequest, RegisterRequest, BaseRequest

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

### Community 146 - "@eslint/js"
Cohesion: 0.15
Nodes (9): BM25, _normalize(), Apply synonym substitution before tokenizing., BM25 ranking algorithm for text search, Lowercase, normalize synonyms, split, remove punctuation, filter stopwords, Build BM25 index from documents, Score all documents against query, All indexed terms, for suggestion/typo-recovery purposes. (+1 more)

### Community 147 - "eslint-plugin-react-refresh"
Cohesion: 0.14
Nodes (9): Pick the highest-ranked palette matching the resolved mode.      Only the dark, Execute searches across multiple domains., Select best matching result based on priority keywords., Extract results list from search result dict., Generate complete design system recommendation.          variance/motion/densi, Bucket a 1-10 dial value into its tier config. Returns None if value is None., _resolve_dial(), _select_palette_for_mode() (+1 more)

### Community 148 - "react"
Cohesion: 0.12
Nodes (16): Before Delivering App UI, Example Workflow, If a search returns 0 results, Output Formats, Rule Categories by Priority, Running the search tool, Step 1: Analyze User Requirements, Step 2: Generate Design System (REQUIRED for new pages/projects) (+8 more)

### Community 149 - "globals"
Cohesion: 0.67
Nodes (3): axios, axios, axios

### Community 150 - "typescript"
Cohesion: 0.14
Nodes (8): App\Contracts\Auth\AuthServiceInterface, login(), logout(), register(), LoginResponseDTO, AppServiceProvider, AuthService, Illuminate\Support\ServiceProvider

### Community 152 - "NotFound.tsx"
Cohesion: 0.15
Nodes (12): Accessibility, Common Rules for Professional UI + Pre-Delivery Checklist, Icons & Visual Elements, Interaction, Interaction (App), Layout, Layout & Spacing, Light/Dark Mode (+4 more)

### Community 153 - "App\Http\Requests\Auth\LoginRequest"
Cohesion: 0.67
Nodes (3): zustand, zustand, zustand

### Community 155 - "App\Http\Requests\BaseRequest"
Cohesion: 0.27
Nodes (3): WarehouseController, WarehouseRequest, Warehouse

### Community 156 - "App\Http\Requests\Product\StoreProductRequest"
Cohesion: 0.19
Nodes (4): App\Http\Requests\Product\StoreProductRequest, App\Http\Requests\Product\UpdateProductRequest, ProductController, ProductResource

### Community 157 - "App\Http\Requests\Product\UpdateProductRequest"
Cohesion: 0.67
Nodes (3): @types/node, @types/node, @types/node

### Community 158 - "ProductVariant"
Cohesion: 0.08
Nodes (40): api, App(), CartDrawer(), Header(), ProductCard(), Toast(), addCartItem(), applyCoupon() (+32 more)

### Community 176 - "ProductVariant"
Cohesion: 0.11
Nodes (5): CheckoutController, CheckoutRequest, Product, CheckoutService, StoreScopingTest

### Community 177 - "HorizonServiceProvider"
Cohesion: 0.22
Nodes (3): CartTest, Store, Product

### Community 178 - "composer.json"
Cohesion: 0.40
Nodes (4): require, require-dev, laravel/telescope, predis/predis

### Community 179 - "2026_07_30_114428_create_telescope_entries_table.php"
Cohesion: 0.83
Nodes (3): down(), getConnection(), up()

### Community 180 - "CustomerControllerTest"
Cohesion: 0.15
Nodes (12): 10. Charts & Data (LOW), 1. Accessibility (CRITICAL), 2. Touch & Interaction (CRITICAL), 3. Performance (HIGH), 4. Style Selection (HIGH), 5. Layout & Responsive (HIGH), 6. Typography & Color (MEDIUM), 7. Animation (MEDIUM) (+4 more)

### Community 182 - "Customers.tsx"
Cohesion: 0.83
Nodes (3): getCustomers(), getProducts(), Dashboard()

### Community 185 - "Inventory"
Cohesion: 0.16
Nodes (5): App\Models\User, App\Models\Warehouse, InventoryController, Inventory, InventoryService

### Community 188 - "AppServiceProvider.php"
Cohesion: 0.26
Nodes (6): App\Http\Requests\Store\CreateWorkspaceRequest, App\Http\Requests\Store\UpdateStoreRequest, StoreController, Store, Settings(), SettingsTabKey

### Community 189 - "Login.tsx"
Cohesion: 0.24
Nodes (7): _query_wants_dark(), True when a styles.csv row describes itself as dark-first., True when the query explicitly asks for a dark theme., Resolve the mode the rest of the output has to agree with., _resolve_color_mode(), _style_is_dark_primary(), TestModeResolution

### Community 190 - "Products.tsx"
Cohesion: 0.24
Nodes (6): BadgeProps, PageHeader(), PageHeaderProps, deleteProduct(), formatPrice(), Products()

### Community 191 - "LoginTenantIsolationTest"
Cohesion: 0.43
Nodes (3): detect_domain(), Auto-detect the most relevant domain from query.      Matches are weighted by, TestDomainDetection

### Community 192 - "frontend/src/App.tsx"
Cohesion: 0.20
Nodes (6): App(), ToastProvider(), me(), useAuthBootstrap(), queryClient, router

### Community 196 - "authApi.ts"
Cohesion: 0.33
Nodes (5): logout(), resetPassword(), sendVerificationEmail(), VerifyEmail(), ResetPassword()

### Community 197 - "Coupon"
Cohesion: 0.32
Nodes (3): ApiException, CartException, Exception

### Community 198 - "ProductVariantResource"
Cohesion: 0.43
Nodes (3): _filter_anti_patterns_for_mode(), Drop "avoid dark mode" advice once dark mode is the resolved answer., TestAntiPatternGating

### Community 199 - "inventoryApi.ts"
Cohesion: 0.43
Nodes (6): getInventory(), getWarehouses(), InventoryItem, InventoryResponse, Warehouse, Inventory()

### Community 203 - "ForgotPassword.tsx"
Cohesion: 0.47
Nodes (4): TextField(), TextFieldProps, forgotPassword(), ForgotPassword()

### Community 204 - "validate_data.py"
Cohesion: 0.83
Nodes (3): _check_file(), main(), _read_rows()

## Knowledge Gaps
- **298 isolated node(s):** `When to Apply`, `Rule Categories by Priority`, `Running the search tool`, `Step 1: Analyze User Requirements`, `Step 2: Generate Design System (REQUIRED for new pages/projects)` (+293 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **41 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `Product` connect `HorizonServiceProvider` to `Illuminate\Database\Eloquent\Model`, `Customer`, `Products.tsx`, `Customers.tsx`?**
  _High betweenness centrality (0.048) - this node is a cross-community bridge._
- **Why does `Store` connect `AppServiceProvider.php` to `SubscriptionTest`?**
  _High betweenness centrality (0.030) - this node is a cross-community bridge._
- **Why does `User` connect `User` to `RegisterTest`, `Illuminate\Database\Eloquent\SoftDeletes`, `UpdateProductRequest`, `LoginRateLimitTest`, `Dashboard.tsx`, `App\Models\Concerns\BelongsToStoreOrNull`, `typescript`, `RegisterStaffLimitTest`?**
  _High betweenness centrality (0.022) - this node is a cross-community bridge._
- **Are the 14 inferred relationships involving `User` (e.g. with `.test_el_bloqueo_es_por_email_no_global_para_la_misma_ip()` and `.test_el_sexto_intento_de_login_en_un_minuto_para_el_mismo_email_se_bloquea()`) actually correct?**
  _`User` has 14 INFERRED edges - model-reasoned connections that need verification._
- **Are the 9 inferred relationships involving `Store` (e.g. with `.handle()` and `.run()`) actually correct?**
  _`Store` has 9 INFERRED edges - model-reasoned connections that need verification._
- **What connects `When to Apply`, `Rule Categories by Priority`, `Running the search tool` to the rest of the system?**
  _298 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `.parent` be split into smaller, more focused modules?**
  _Cohesion score 0.06456456456456457 - nodes in this community are weakly interconnected._