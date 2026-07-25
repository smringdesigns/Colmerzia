# Graph Report - .  (2026-07-24)

## Corpus Check
- cluster-only mode — file stats not available

## Summary
- 869 nodes · 1266 edges · 109 communities (91 shown, 18 thin omitted)
- Extraction: 98% EXTRACTED · 2% INFERRED · 0% AMBIGUOUS · INFERRED: 27 edges (avg confidence: 0.8)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `669ef375`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- Community 0
- Community 1
- Community 2
- Community 3
- Community 4
- Community 5
- Community 6
- Community 7
- Community 8
- Community 9
- Community 10
- Community 11
- Community 12
- Community 13
- Community 14
- Community 15
- Community 16
- Community 17
- Community 18
- Community 19
- Community 20
- Community 21
- Community 22
- Community 23
- Community 24
- Community 25
- Community 26
- Community 27
- Community 28
- Community 29
- Community 30
- Community 31
- Community 32
- Community 33
- Community 34
- Community 35
- Community 36
- Community 37
- Community 38
- Community 39
- Community 70
- Community 71

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

## Communities (109 total, 18 thin omitted)

### Community 0 - "Community 0"
Cohesion: 0.06
Nodes (51): api, BadgeProps, Button(), ButtonProps, ButtonVariant, ConfirmDialog(), ConfirmDialogProps, PageHeader() (+43 more)

### Community 1 - "Community 1"
Cohesion: 0.05
Nodes (23): App\Contracts\Auth\AuthServiceInterface, ApiException, InactiveUserException, InvalidCredentialsException, BaseApiException, AuthController, CustomerController, ProductController (+15 more)

### Community 2 - "Community 2"
Cohesion: 0.06
Nodes (20): ProductCreated, StoreCreated, UserLoggedIn, GenerateProductImagesJob, SendWelcomeEmailJob, LogUserLogin, SendWelcomeEmail, WelcomeMail (+12 more)

### Community 3 - "Community 3"
Cohesion: 0.05
Nodes (41): pestphp/pest-plugin, php-http/discovery, autoload, autoload-dev, psr-4, psr-4, config, allow-plugins (+33 more)

### Community 4 - "Community 4"
Cohesion: 0.09
Nodes (20): App(), ProtectedRoute(), PublicRoute(), Header(), menu, ToastProvider(), login(), logout() (+12 more)

### Community 5 - "Community 5"
Cohesion: 0.06
Nodes (32): axios, clsx, dependencies, axios, clsx, @hookform/resolvers, lucide-react, react (+24 more)

### Community 6 - "Community 6"
Cohesion: 0.07
Nodes (29): eslint, @eslint/js, eslint-plugin-react-hooks, eslint-plugin-react-refresh, devDependencies, eslint, @eslint/js, eslint-plugin-react-hooks (+21 more)

### Community 7 - "Community 7"
Cohesion: 0.08
Nodes (26): scripts, dev, post-autoload-dump, post-create-project-cmd, post-root-package-install, post-update-cmd, pre-package-uninstall, setup (+18 more)

### Community 8 - "Community 8"
Cohesion: 0.11
Nodes (9): BrandFactory, CategoryFactory, CustomerFactory, ProductFactory, ProductVariantFactory, StoreFactory, UserFactory, Illuminate\Database\Eloquent\Factories\Factory (+1 more)

### Community 9 - "Community 9"
Cohesion: 0.09
Nodes (22): compilerOptions, allowImportingTsExtensions, erasableSyntaxOnly, jsx, lib, module, moduleDetection, moduleResolution (+14 more)

### Community 10 - "Community 10"
Cohesion: 0.16
Nodes (7): Permission, DatabaseSeeder, PermissionSeeder, RoleSeeder, StoreSeeder, UserSeeder, Illuminate\Database\Seeder

### Community 11 - "Community 11"
Cohesion: 0.12
Nodes (5): Coupon, CustomerAddress, DiscountRule, Warehouse, Illuminate\Database\Eloquent\SoftDeletes

### Community 12 - "Community 12"
Cohesion: 0.12
Nodes (5): Inventory, OrderItem, Setting, Transaction, Illuminate\Database\Eloquent\Factories\HasFactory

### Community 13 - "Community 13"
Cohesion: 0.10
Nodes (19): compilerOptions, allowImportingTsExtensions, erasableSyntaxOnly, lib, module, moduleDetection, noEmit, noFallthroughCasesInSwitch (+11 more)

### Community 14 - "Community 14"
Cohesion: 0.14
Nodes (3): Customer, CustomerPolicy, CustomerSeeder

### Community 15 - "Community 15"
Cohesion: 0.14
Nodes (5): AuditLog, InventoryMovement, Notification, ProductImage, Illuminate\Database\Eloquent\Model

### Community 16 - "Community 16"
Cohesion: 0.17
Nodes (5): User, UserPolicy, Illuminate\Foundation\Auth\User, Illuminate\Notifications\Notifiable, Laravel\Sanctum\HasApiTokens

### Community 17 - "Community 17"
Cohesion: 0.11
Nodes (17): devDependencies, concurrently, laravel-vite-plugin, tailwindcss, @tailwindcss/vite, vite, tailwindcss, @tailwindcss/vite (+9 more)

### Community 18 - "Community 18"
Cohesion: 0.15
Nodes (6): login(), logout(), LoginResponseDTO, AppServiceProvider, AuthService, Illuminate\Support\ServiceProvider

### Community 22 - "Community 22"
Cohesion: 0.20
Nodes (3): Brand, ProductVariant, CatalogSeeder

### Community 23 - "Community 23"
Cohesion: 0.28
Nodes (3): StoreStoreRequest, UpdateStoreRequest, Illuminate\Foundation\Http\FormRequest

### Community 24 - "Community 24"
Cohesion: 0.36
Nodes (3): Category, Illuminate\Database\Eloquent\Relations\BelongsTo, Illuminate\Database\Eloquent\Relations\HasMany

### Community 32 - "Community 32"
Cohesion: 0.40
Nodes (3): ExampleTest, TestCase, Illuminate\Foundation\Testing\TestCase

### Community 38 - "Community 38"
Cohesion: 0.50
Nodes (3): AuthState, useAuthStore, User

## Knowledge Gaps
- **153 isolated node(s):** `$schema`, `name`, `type`, `description`, `laravel` (+148 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **18 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `User` connect `Community 16` to `Community 10`, `Community 11`, `Community 12`, `Community 14`, `Community 18`, `Community 19`, `Community 20`?**
  _High betweenness centrality (0.035) - this node is a cross-community bridge._
- **Why does `Customer` connect `Community 14` to `Community 1`, `Community 11`, `Community 12`, `Community 15`, `Community 26`, `Community 27`?**
  _High betweenness centrality (0.028) - this node is a cross-community bridge._
- **Why does `Product` connect `Community 19` to `Community 1`, `Community 11`, `Community 12`, `Community 15`, `Community 22`, `Community 28`, `Community 29`?**
  _High betweenness centrality (0.028) - this node is a cross-community bridge._
- **What connects `$schema`, `name`, `type` to the rest of the system?**
  _153 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Community 0` be split into smaller, more focused modules?**
  _Cohesion score 0.05837837837837838 - nodes in this community are weakly interconnected._
- **Should `Community 1` be split into smaller, more focused modules?**
  _Cohesion score 0.0517503805175038 - nodes in this community are weakly interconnected._
- **Should `Community 2` be split into smaller, more focused modules?**
  _Cohesion score 0.06352941176470588 - nodes in this community are weakly interconnected._