# CLAUDE.md — Fit Station Kitchen

Comprehensive guide for AI assistants working on this codebase.

---

## Project Overview

**Fit Station Kitchen** is a fullstack healthy meal-ordering & subscription platform selling fresh, calorie-counted, high-protein meals and meal plans. It operates in Egypt (EGP pricing) with scheduled delivery time slots and COD payment options.

- **Monorepo** with two top-level directories: `client/` and `server/`
- **Client**: Next.js 16 (App Router) + React 19 + Zustand + vanilla CSS Modules
- **Server**: Express.js + MongoDB (Mongoose) + JWT auth — deployed to Vercel as a serverless function

---

## Repository Structure

```
bamteek-store/
├── client/                  # Next.js frontend
│   ├── src/
│   │   ├── app/             # Next.js App Router pages
│   │   │   ├── layout.js    # Root layout (Header, Footer, CartDrawer, AuthProvider)
│   │   │   ├── page.js      # Home page (Hero, Products, Comparison, Newsletter)
│   │   │   ├── globals.css  # Global design system (tokens, utilities, components)
│   │   │   ├── about/       # About page
│   │   │   ├── account/     # User account & order history
│   │   │   ├── admin/       # Admin dashboard
│   │   │   │   ├── page.js          # Dashboard overview (stats, charts)
│   │   │   │   ├── layout.js        # Admin sidebar layout
│   │   │   │   ├── products/page.js # Product CRUD management
│   │   │   │   ├── orders/page.js   # Order management
│   │   │   │   ├── coupons/         # Coupon management
│   │   │   │   ├── expenses/        # Expense tracker
│   │   │   │   └── users/           # User management
│   │   │   ├── checkout/page.js     # Multi-step checkout (guest + auth)
│   │   │   ├── order-confirmation/  # Post-checkout confirmation
│   │   │   ├── products/            # Product detail pages
│   │   │   └── shop/                # Product listing/filter page
│   │   ├── components/
│   │   │   ├── layout/      # Header, Footer, AnnouncementBar, AuthProvider
│   │   │   ├── cart/        # CartDrawer, CartItem, CartSummary
│   │   │   ├── product/     # ProductCard, ProductDetail, ProductGallery
│   │   │   ├── checkout/    # CheckoutForm, AddressForm, OrderSummary
│   │   │   ├── home/        # Hero, FeaturedProducts, etc.
│   │   │   ├── common/      # Shared UI elements
│   │   │   └── ui/          # Low-level UI components
│   │   ├── lib/
│   │   │   ├── api.js       # ApiClient class (fetch wrapper with auth + session)
│   │   │   └── constants.js # Shared constants (prices, currencies, statuses)
│   │   └── store/
│   │       ├── authStore.js # Zustand auth store (login, register, logout, checkAuth)
│   │       └── cartStore.js # Zustand cart store (items, coupon, computed totals)
│   ├── public/              # Static assets
│   ├── .env.local           # NEXT_PUBLIC_API_URL
│   ├── next.config.mjs
│   ├── jsconfig.json        # Path alias: @/ → src/
│   └── package.json
└── server/                  # Express.js backend
    ├── server.js            # Entry point (local dev listener + Vercel export)
    ├── vercel.json          # Vercel serverless config
    ├── migrateDB.js         # One-time local→Atlas migration script
    ├── src/
    │   ├── app.js           # Express app (middleware, routes, error handling)
    │   ├── config/
    │   │   └── db.js        # Mongoose connection (lazy for Vercel)
    │   ├── models/
    │   │   ├── User.js      # User schema (bcrypt password, JWT methods, savedAddresses)
    │   │   ├── Product.js   # Product schema (slug, multi-currency prices, bundle support)
    │   │   ├── Category.js  # Category schema
    │   │   ├── Cart.js      # Cart schema (user or sessionId, TTL index 7 days)
    │   │   ├── Order.js     # Order schema (HS-XXXXXX number, COD only)
    │   │   ├── Coupon.js    # Coupon schema (percentage/fixed, usage limits)
    │   │   └── Expense.js   # Expense schema (admin bookkeeping)
    │   ├── controllers/
    │   │   ├── authController.js     # register, login, logout, getMe, updateProfile
    │   │   ├── productController.js  # CRUD + search + pagination
    │   │   ├── categoryController.js # CRUD
    │   │   ├── cartController.js     # add, update, remove, clear, apply coupon
    │   │   ├── orderController.js    # checkout, my-orders, admin all, stats, status update
    │   │   ├── couponController.js   # CRUD + validate
    │   │   ├── expenseController.js  # CRUD
    │   │   └── userController.js     # Admin user management
    │   ├── routes/
    │   │   ├── index.js       # Mounts all routes under /api
    │   │   ├── authRoutes.js  # /api/auth/*
    │   │   ├── productRoutes.js  # /api/products/* (multer image upload)
    │   │   ├── categoryRoutes.js # /api/categories/*
    │   │   ├── cartRoutes.js     # /api/cart/*
    │   │   ├── orderRoutes.js    # /api/orders/*
    │   │   ├── couponRoutes.js   # /api/coupons/*
    │   │   ├── expenseRoutes.js  # /api/expenses/*
    │   │   └── userRoutes.js     # /api/users/*
    │   ├── middleware/
    │   │   ├── auth.js        # protect (JWT required), optionalAuth, admin (role check)
    │   │   ├── validate.js    # Joi schema validation middleware
    │   │   └── errorHandler.js # Global error handler + 404 handler
    │   ├── utils/
    │   │   ├── ApiError.js    # Custom error class with static factory methods
    │   │   └── ApiResponse.js # Standardized JSON response wrapper
    │   ├── validators/        # Joi schemas for request validation
    │   └── seeds/             # Database seed scripts (npm run seed)
    ├── uploads/               # Local file storage for product images
    └── package.json
```

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend Framework | Next.js 16 (App Router) |
| UI Library | React 19 |
| State Management | Zustand 5 |
| Styling | Vanilla CSS Modules + global design tokens |
| Backend Framework | Express.js 4 |
| Database | MongoDB via Mongoose 8 |
| Auth | JWT (cookie + Authorization header dual strategy) |
| File Uploads | Multer (local disk storage in `uploads/`) |
| Validation | Joi |
| Security | Helmet, CORS, express-rate-limit |
| Deployment | Vercel (both client and server) |

---

## Development Commands

### Client (Next.js)
```bash
cd client
npm run dev        # Start dev server on http://localhost:3000
npm run build      # Production build
npm run lint       # ESLint
```

### Server (Express)
```bash
cd server
npm run dev        # nodemon server.js — hot reload on http://localhost:5000
npm start          # node server.js — production start
npm run seed       # Run database seed scripts
node migrateDB.js  # Migrate local MongoDB → Atlas (one-time)
```

---

## Environment Variables

### `client/.env.local`
```
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

### `server/.env`
```
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/bamteek
JWT_SECRET=<secret>
JWT_EXPIRE=7d
CLIENT_URL=http://localhost:3000
FREE_SHIPPING_THRESHOLD=30
SHIPPING_COST=2
TAX_RATE=16
```

> **Production**: Set `MONGODB_URI` to the MongoDB Atlas connection string and all URLs to production domains.

---

## API Reference

All endpoints are prefixed with `/api`. Auth uses JWT via HTTP-only cookie **and** `Authorization: Bearer <token>` header (dual strategy for web + serverless).

### Auth — `/api/auth`
| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/register` | Public | Register new user |
| POST | `/login` | Public | Login, sets cookie + returns token |
| POST | `/logout` | Public | Clears token cookie |
| GET | `/me` | `protect` | Get current user |
| PUT | `/profile` | `protect` | Update name/phone |

### Products — `/api/products`
| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/` | Public | List products (pagination, category, sort, search, price range) |
| GET | `/:slug` | Public | Get single product by slug |
| GET | `/related/:slug` | Public | Get related products by category |
| GET | `/admin/all` | Admin | All products including inactive |
| POST | `/` | Admin | Create product (multipart, up to 5 images) |
| PUT | `/:id` | Admin | Update product (appends new images) |
| DELETE | `/:id` | Admin | Delete product |

### Categories — `/api/categories`
Standard CRUD; public read, admin write.

### Cart — `/api/cart`
Cart is identified by `user._id` (authenticated) or `x-session-id` header (guest). TTL auto-expires carts after 7 days.

| Method | Path | Description |
|--------|------|-------------|
| GET | `/` | Get current cart |
| POST | `/add` | Add item `{ productId, quantity }` |
| PUT | `/update/:itemId` | Update quantity |
| DELETE | `/remove/:itemId` | Remove item |
| DELETE | `/clear` | Clear cart |
| POST | `/apply-coupon` | Apply coupon `{ code }` |
| DELETE | `/remove-coupon` | Remove applied coupon |

### Orders — `/api/orders`
| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/` | Optional | Checkout (validates stock, applies coupon, decrements stock) |
| GET | `/my-orders` | User | Get authenticated user's orders |
| GET | `/:id` | User/Admin | Get single order (owner or admin only) |
| GET | `/admin/all` | Admin | Paginated order list with search/status filter |
| GET | `/admin/stats` | Admin | Dashboard stats + monthly revenue aggregation |
| PUT | `/:id/status` | Admin | Update order status (restores stock on cancel) |
| DELETE | `/:id` | Admin | Delete order |

### Coupons — `/api/coupons`
Admin CRUD + public validate endpoint.

### Expenses — `/api/expenses`
Admin-only CRUD for expense tracking.

### Users — `/api/users`
Admin-only user management.

---

## Data Models

### User
- `firstName`, `lastName`, `email` (unique), `password` (bcrypt, select: false)
- `phone`, `role` (`user` | `admin`), `isActive`
- `savedAddresses[]` — embedded address subdocuments with `isDefault`
- Methods: `comparePassword()`, `generateToken()` (JWT)
- Virtual: `fullName`

### Product
- `name`, `slug` (auto-generated from name), `description`
- `highlights[]`, `uses[]` — feature bullet arrays
- `price` (primary, JOD), `compareAtPrice`, `discount` (%)
- `prices: { JOD, EGP }` — multi-currency; EGP auto-calculated at ~13.5x JOD if not set
- `currency` (`JOD` | `EGP`)
- `images[]` — `{ url, alt }` objects; local uploads stored under `/uploads/`
- `category` → Category ref, `isBundle`, `bundleItems[]` → Product refs
- `stock`, `isActive`, `rating`, `numReviews`
- `seo: { metaTitle, metaDescription }`
- Indexes: slug, category+isActive, price, text (name+description)

### Cart
- `user` (ObjectId) **or** `sessionId` (string) — mutually exclusive
- `items[]`: `{ product, quantity, price }`
- `coupon: { code, discount, type }`
- `currency` (`JOD` | `EGP`)
- `expiresAt` — TTL index, auto-deleted 7 days after last update
- Virtuals: `subtotal`, `itemCount`

### Order
- `orderNumber` — auto-generated as `HS-XXXXXX` (padded count + 1001)
- `user` (optional, supports guest checkout)
- `contact: { email, phone }`
- `shippingAddress` + `billingAddress` (with `sameAsShipping` flag)
- `items[]`: snapshot of `{ product, name, image, price, quantity }` at checkout time
- `subtotal`, `shippingCost`, `tax` (inclusive), `discount`, `total`, `currency`
- `paymentMethod: { type: 'cod', status: 'pending'|'paid'|'failed'|'refunded' }`
- `status`: `pending` → `confirmed` → `processing` → `shipped` → `delivered` | `cancelled`
  - COD payment marked `paid` when status set to `delivered`
  - Stock restored when status set to `cancelled`
- `coupon: { code, discount }`

### Coupon
- `code` (uppercase, unique), `type` (`percentage` | `fixed`), `value`
- `minPurchase`, `maxDiscount`, `usageLimit`, `usedCount`, `expiresAt`, `isActive`
- Methods: `isValid(cartTotal)`, `calculateDiscount(cartTotal)`

### Expense
- `title`, `amount`, `currency`, `category` (shipping/marketing/inventory/operations/salaries/utilities/other)
- `description`, `date`, `createdBy` → User ref

---

## Frontend Architecture

### State Management (Zustand)

**`authStore`** (`src/store/authStore.js`)
- State: `user`, `isAuthenticated`, `isLoading`
- Actions: `checkAuth()`, `login()`, `register()`, `logout()`
- Computed: `isAdmin()` — checks `user.role === 'admin'`
- Token stored in `localStorage` under key `token`

**`cartStore`** (`src/store/cartStore.js`)
- State: `items[]`, `coupon`, `isOpen`, `isLoading`, `currency`
- Actions: `fetchCart()`, `addItem()`, `updateQuantity()`, `removeItem()`, `clearCart()`, `applyCoupon()`, `removeCoupon()`
- Computed: `getSubtotal()` (currency-aware), `getItemCount()`, `getShippingCost()` (free ≥ 30 JOD), `getDiscount()`, `getTotal()`

### API Client (`src/lib/api.js`)
- Class-based `ApiClient` wrapping `fetch`
- Always sends `credentials: 'include'` (for cookies)
- Attaches `Authorization: Bearer <token>` from localStorage
- Generates and persists `x-session-id` in localStorage for guest cart tracking
- Methods: `get()`, `post()`, `put()`, `delete()`, `upload()` (multipart POST), `uploadPut()` (multipart PUT)

### Constants (`src/lib/constants.js`)
```js
FREE_SHIPPING_THRESHOLD = 30  // JOD
SHIPPING_COST = 2              // JOD
TAX_RATE = 16                  // % (tax-inclusive calculation)
CURRENCIES = { JOD, EGP }
ORDER_STATUSES = { pending, confirmed, processing, shipped, delivered, cancelled }
EXPENSE_CATEGORIES = [shipping, marketing, inventory, operations, salaries, utilities, other]
formatPrice(price, currency)   // "X.XXX JOD"
getDiscountedPrice(price, discount)
```

### Routing (App Router)
| Route | File | Description |
|-------|------|-------------|
| `/` | `app/page.js` | Home: hero, bestsellers, comparison table, bundles, newsletter |
| `/shop` | `app/shop/` | Product listing with filters |
| `/products/[slug]` | `app/products/` | Product detail |
| `/checkout` | `app/checkout/page.js` | Multi-step checkout (supports guest) |
| `/order-confirmation` | `app/order-confirmation/` | Success page |
| `/account` | `app/account/` | User profile + order history |
| `/about` | `app/about/` | About page |
| `/admin` | `app/admin/page.js` | Dashboard (stats, charts) |
| `/admin/products` | `app/admin/products/page.js` | Product CRUD |
| `/admin/orders` | `app/admin/orders/page.js` | Order management |
| `/admin/coupons` | `app/admin/coupons/` | Coupon management |
| `/admin/expenses` | `app/admin/expenses/` | Expense tracker |
| `/admin/users` | `app/admin/users/` | User management |

### Styling Conventions
- **Global design tokens** in `globals.css` (CSS custom properties on `:root`)
- **CSS Modules** per page/component (`*.module.css`)
- **No Tailwind** — all styles are vanilla CSS
- Utility classes in `globals.css`: `.container`, `.btn`, `.btn-primary`, `.btn-outline`, `.section`, `.section-title`, `.spinner`, `.loading-center`, `.page-enter`
- Custom fonts loaded via Google Fonts in globals

---

## Business Logic

### Checkout Flow
1. Cart retrieved by `user._id` or `x-session-id` header
2. Each item's stock validated before order creation
3. Price resolved per currency (`prices.JOD` or `prices.EGP`)
4. Shipping: free if subtotal ≥ `FREE_SHIPPING_THRESHOLD` (30), else `SHIPPING_COST` (2)
5. Tax: inclusive (extracted from subtotal, not added on top): `tax = (subtotal × TAX_RATE) / (100 + TAX_RATE)`
6. Coupon validated via `Coupon.isValid()` and `Coupon.calculateDiscount()`, then `usedCount` incremented
7. `total = subtotal + shippingCost - discount` (tax already included in subtotal)
8. Stock decremented via `$inc: { stock: -quantity }`
9. Cart cleared after successful order
10. Order starts in `confirmed` status (not `pending`)

### Payment
- **Cash on Delivery (COD) only** — `paymentMethod.type` is always `'cod'`
- Payment status set to `'paid'` when admin updates order status to `'delivered'`

### Multi-Currency
- Products store `price` (base JOD) and `prices: { JOD, EGP }`
- EGP auto-calculated at ~13.5× JOD conversion if not explicitly set
- Cart and orders record the `currency` at time of checkout
- `cartStore.currency` tracks selected currency on the frontend

### Guest Cart
- Guest session tracked via `x-session-id` header
- Session ID generated client-side: `'sess_' + random + timestamp`
- Stored in `localStorage` under `sessionId`
- Guest carts expire after 7 days via MongoDB TTL index

### Admin Dashboard Stats
- Total/pending/delivered/cancelled order counts
- Total revenue and average order value (excluding cancelled)
- Monthly revenue aggregation (last 12 months)
- Recent 5 orders

---

## Security

| Concern | Implementation |
|---------|---------------|
| Password hashing | bcryptjs with salt rounds = 12 |
| JWT | `jsonwebtoken`, 7-day expiry, stored in HttpOnly cookie + localStorage |
| CORS | Whitelist `CLIENT_URL`, localhost:3000, and `*.vercel.app` previews |
| Rate limiting | 200 req / 15 min on `/api/*` |
| Helmet | Security headers on all responses |
| Input validation | Joi schemas via `validate` middleware |
| Admin protection | `protect` + `admin` middleware chain on all admin routes |
| Password field | `select: false` — never returned in queries by default |

---

## Deployment

Both client and server are deployed to **Vercel**.

### Server (Express → Vercel Serverless)
- `vercel.json` routes all traffic to `server.js`
- DB connection is **lazy** (per-request) to support cold starts:
  ```js
  // app.js: connects only on first request, caches `dbConnected` flag
  ```
- Static `uploads/` folder does NOT persist on Vercel — use external image hosting (e.g., Cloudinary) in production.

### Client (Next.js → Vercel)
- Standard Next.js deployment
- Set `NEXT_PUBLIC_API_URL` to the deployed server URL in Vercel environment variables

---

## Common Patterns & Conventions

### Backend
- All controllers follow `async (req, res, next) => { try { ... } catch(e) { next(e); } }` pattern
- Errors thrown via `ApiError.badRequest()`, `ApiError.notFound()`, etc. static factories
- All responses wrapped in `new ApiResponse(statusCode, data, message)`
- Pagination parameters: `?page=1&limit=20`
- Search uses MongoDB `$text` index (products) or `$regex` (orders)

### Frontend
- `'use client'` directive on all stores and interactive components
- API calls always through the singleton `api` instance from `src/lib/api.js`
- Stores initialize via `checkAuth()` and `fetchCart()` called in `AuthProvider`
- Path alias `@/` maps to `src/` (configured in `jsconfig.json`)

---

## Known Limitations / TODOs

- **Image uploads**: Local `uploads/` folder used — images won't persist on Vercel. Needs Cloudinary or S3 integration.
- **Payment**: COD only. No payment gateway integrated.
- **Email**: No transactional email (order confirmation, password reset) implemented.
- **Password reset**: `resetPasswordToken/Expire` fields exist on User model but no reset flow is implemented.
- **Newsletter**: Subscribe form on home page has `e.preventDefault()` — no backend integration.
- **Reviews**: `rating` and `numReviews` fields exist on Product but no review submission flow exists.
- **Tax display**: Tax is inclusive (extracted, not added) but the UI may not clearly communicate this.
- **EGP conversion**: Hardcoded at 13.5x — not using live exchange rates.
