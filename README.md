# 🛒 ProShop — Full-Stack eCommerce Platform

ProShop is a modern, full-featured eCommerce web application built with the **MERN stack** (MongoDB, Express, React, Node.js). It includes product management with multi-variant support, user authentication (email + OTP + social login), wishlist, smart shopping cart, coupon discount engine, multi-address management, real-time in-app notifications, live customer chat, interactive analytics dashboards, light/dark mode support, and payment integration with both PayPal and VNPay.

---

## ✨ Features

### 🛍️ Storefront (Customer)
- **Product Catalog** — Browse, search, and filter products with pagination, category, brand, and price range filters
- **Product Variants** — Each product supports multiple variants (color, size, SKU) with independent pricing, original pricing, and stock
- **Product Reviews & Ratings** — Authenticated users can leave reviews and ratings
- **Wishlist System** — Save favorite items, toggle wishlist directly on product cards, and manage saved items in Profile
- **Smart Cart** — Variant-aware cart (same product with different variants stored as separate cart items)
- **Coupon System** — Discover categorized coupons, copy coupon codes with 1-click, and apply percentage/fixed discounts at checkout with minimum spend validation
- **Multi-Address Management** — Manage multiple shipping addresses with default address selection
- **Order Management & Tracking** — Place orders, track delivery stages, and view detailed purchase history
- **Multiple Payment Gateways** — Seamless integration with PayPal and VNPay (Vietnam payment gateway)
- **Real-time Notifications** — Instant in-app notification alerts for order status changes with unread badges
- **Real-time Live Chat** — Socket.IO–powered real-time messaging between customers and admin support
- **🌙 Dark & Light Themes** — Full dark/light mode toggle with system preference detection and smooth transitions
- **SEO-friendly URLs** — Human-readable slugs for products and categories

### 🔐 Authentication & Security
- **Email + OTP Verification** — Registration with time-sensitive one-time password (OTP) email verification
- **Social Login** — One-click sign in with Google or Facebook (Passport.js OAuth 2.0)
- **JWT Authentication** — Secure HTTP-only cookie-based authentication tokens
- **Security Hardening** — Helmet headers, XSS sanitization, NoSQL injection prevention, HTTP parameter pollution (HPP) protection, and rate limiting

### 🛠️ Admin Dashboard & Analytics
- **Interactive Analytics Dashboard** — Overview summary cards (Revenue, Orders, Products, Users) with trend comparisons
- **Revenue Area Chart** — Dynamic SVG chart displaying revenue over time with date range filtering and interactive hover tooltips
- **Order Status Breakdown** — Donut chart showing order distribution (Delivered, Out for delivery, Unpaid, Cancelled)
- **Low Stock Inventory Alerts** — Instant warnings for products running low on stock
- **Product Management** — Full CRUD with multi-image upload to ImageKit CDN, variant table editor, and status controls (Draft / Active / Schedule)
- **Order Management** — Inspect all customer orders, mark as paid/delivered
- **User Management** — View all registered users, manage admin permissions, and remove accounts
- **Coupon Management** — Full CRUD for discount coupons with usage limit and validity tracking
- **Live Support Chat** — Admin chat center to handle customer inquiries in real time

---

## 🏗️ Tech Stack

### Backend
| Technology | Purpose |
|---|---|
| **Node.js** | Server runtime environment |
| **Express.js** | Web application framework |
| **MongoDB** + **Mongoose** | Database and ODM |
| **JWT** | Authentication with HTTP-only cookies |
| **Passport.js** | Google & Facebook OAuth 2.0 authentication |
| **Socket.IO** | Real-time WebSocket communication (Chat & Notifications) |
| **Joi** | Robust request payload validation |
| **ImageKit** | Cloud media storage and CDN optimization |
| **Multer** | Multipart form-data / file upload middleware |
| **Nodemailer** | Transactional & OTP email delivery |
| **VNPay SDK** | Vietnamese payment gateway integration |
| **Helmet / XSS-Clean / HPP** | Web security middleware |
| **Slugify** | SEO-friendly URL slug generation |

### Frontend
| Technology | Purpose |
|---|---|
| **React 19** | Modern UI component library |
| **Vite 8** | Ultra-fast build tool and dev server |
| **Tailwind CSS 4** | Modern utility-first styling with `@theme` |
| **next-themes** | Dark/Light mode theme provider & system detection |
| **Redux Toolkit** | Client-side state management (Auth, Cart, Chat, Socket middleware) |
| **TanStack React Query v5** | Server-state management, caching, and background sync |
| **React Router DOM v7** | Declarative client-side routing & protected routes |
| **React Hook Form** + **Zod** | Form state handling and schema validation |
| **Input OTP** | Accessible OTP verification input component |
| **Shadcn UI** + **ReUI** | High-quality accessible UI components |
| **Lucide React** | Consistent vector iconography |
| **Embla Carousel** | Responsive product gallery carousel |
| **Sonner** | Modern toast notification stack |
| **Socket.IO Client** | Real-time bidirectional client socket connection |
| **PayPal React SDK** | PayPal smart payment buttons |
| **React Compiler** (Babel plugin) | Automatic rendering optimization and memoization |

---

## 📁 Project Structure

```
proshop/
├── backend/
│   ├── app.js                  # Express app setup (middleware, routes, error handling)
│   ├── server.js               # HTTP server entry point + Socket.IO initialization
│   ├── seeder.js               # Database seed/destroy CLI script
│   ├── config/
│   │   ├── db.js               # MongoDB connection setup
│   │   ├── imageKit.js         # ImageKit cloud CDN credentials
│   │   ├── mailer.js           # Nodemailer SMTP transporter
│   │   ├── passport.js         # Google & Facebook OAuth strategies
│   │   └── security.js         # Security headers & sanitizer configurations
│   ├── controller/
│   │   ├── productController.js
│   │   ├── userController.js
│   │   ├── orderController.js
│   │   ├── paymentController.js
│   │   ├── addressController.js
│   │   ├── couponController.js
│   │   ├── messagesController.js
│   │   ├── notificationController.js
│   │   └── analyticsController.js
│   ├── middleware/
│   │   ├── authMiddleware.js    # protect, admin, optionalAuth
│   │   ├── errorMiddleware.js   # Global error handling & 404 handler
│   │   ├── asyncHandler.js      # Async wrapper for route controllers
│   │   ├── uploadMiddleware.js  # Multer file upload setup
│   │   └── validateMiddleware.js # Joi schema validator runner
│   ├── model/
│   │   ├── productsModel.js     # Product + Variant + Image + Review schemas
│   │   ├── userModel.js         # User schema with bcrypt & wishlist
│   │   ├── orderModel.js        # Order schema with variant snapshot tracking
│   │   ├── addressModel.js      # User shipping address schema
│   │   ├── couponModel.js       # Discount coupon schema
│   │   ├── messagesModel.js     # Live chat messages schema
│   │   └── notificationModel.js # In-app notification schema
│   ├── routes/
│   │   ├── index.js             # API route mounting hub
│   │   ├── productRoutes.js
│   │   ├── userRoutes.js
│   │   ├── orderRoutes.js
│   │   ├── uploadRoutes.js
│   │   ├── addressRoute.js
│   │   ├── couponRoute.js
│   │   ├── messageRoute.js
│   │   ├── notificationRoutes.js
│   │   └── analyticsRoute.js
│   ├── socket/                  # Socket.IO connection & event handlers
│   ├── utils/                   # Token generator, API query features, error classes
│   ├── validator/               # Joi request validation schemas
│   └── data/                    # Seed dataset (users, products, coupons)
│
├── frontend/
│   ├── index.html
│   ├── vite.config.js
│   └── src/
│       ├── main.jsx             # React root with Redux & ThemeProvider
│       ├── App.jsx              # Application routes & provider setup
│       ├── store.js             # Redux store (Cart, Auth, Chat + Socket Middleware)
│       ├── index.css            # Global CSS variables, Light/Dark tokens & utilities
│       ├── components/          # Shared components (Header, Footer, Layouts, UI primitives)
│       ├── screens/             # Route-level screens
│       ├── hooks/               # Custom hooks
│       ├── lib/                 # Utilities (currency formatter, queryClient, socket)
│       └── features/            # Feature-driven module architecture
│           ├── home/            # Homepage banners, catalogs, filters
│           ├── product/         # Product details, gallery, pricing, review lists
│           ├── cart/            # Shopping cart, item rows, order calculations
│           ├── authentication/  # Login, registration, OTP, profile, notifications
│           ├── checkout/        # Shipping addresses, VNPay & PayPal checkout
│           ├── order/           # Order detail receipts, customer order history
│           ├── address/         # Address manager dialogs & mutations
│           ├── coupon/          # Public coupon page & coupon selector
│           ├── chat/            # Floating customer chat widget
│           └── admin/           # Admin dashboard, analytics charts, product/order/user/coupon managers
│
├── package.json                 # Monorepo root script runner (Concurrently)
├── example.env                  # Environment variables template
└── .gitignore
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** >= 18.x
- **MongoDB** (local instance or [MongoDB Atlas](https://www.mongodb.com/atlas))
- **npm** >= 9.x

### 1. Clone the Repository

```bash
git clone https://github.com/Annv11022005/ProShop.git
cd ProShop
```

### 2. Install Dependencies

```bash
# Install root dependencies (Express, Mongoose, Socket.IO, etc.)
npm install

# Install frontend dependencies (React 19, Vite, Tailwind 4, etc.)
cd frontend
npm install
cd ..
```

### 3. Configure Environment Variables

Create `.env` file in the root directory from the template:

```bash
cp example.env .env
```

Fill in your configuration details in `.env`:

```env
NODE_ENV=development
PORT=5000
MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/proshop
JWT_SECRET=your_jwt_secret_key

# PayPal
PAYPAL_CLIENT_ID=your_paypal_client_id

# ImageKit (Cloud Image Upload CDN)
IMAGEKIT_PUBLIC_KEY=your_imagekit_public_key
IMAGEKIT_PRIVATE_KEY=your_imagekit_private_key
IMAGEKIT_URL_ENDPOINT=https://ik.imagekit.io/your_id

# Nodemailer (OTP Verification Emails)
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USER=your_email@gmail.com
MAIL_PASS=your_app_password

# OAuth 2.0 (Social Login)
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
FACEBOOK_APP_ID=your_facebook_app_id
FACEBOOK_APP_SECRET=your_facebook_app_secret

# VNPay Payment Gateway
VNPAY_TMN_CODE=your_vnpay_terminal_code
VNPAY_SECURE_SECRET=your_vnpay_secret
VNPAY_URL=https://sandbox.vnpayment.vn/paymentv2/vpcpay.html
VNPAY_RETURN_URL=http://localhost:5173/vnpay-return
```

### 4. Seed the Database (Optional)

```bash
# Import sample data (users, multi-variant products, coupons)
npm run data:import

# To wipe the database
npm run data:destroy
```

> **Default Admin Account** created by seeder:
> Check `backend/data/user.js` for credentials.

### 5. Run the Application

```bash
# Run backend (port 5000) and frontend (port 5173) simultaneously
npm run dev
```

Or run individual services:

```bash
# Backend only (with nodemon hot-reload)
npm run server

# Frontend only (Vite dev server)
npm run client
```

Open your browser at **http://localhost:5173**.

---

## 📡 API Reference

Base URL: `http://localhost:5000`

### 📦 Products — `/api/v1/products`

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/` | Public* | Get paginated products with keyword, category, brand, and price filters |
| `POST` | `/` | Admin | Create a new product with variants and media |
| `GET` | `/top` | Public | Get top-rated products |
| `GET` | `/:slugOrId` | Public* | Get product by slug or ObjectId (*Draft hidden from non-admin) |
| `PUT` | `/:id` | Admin | Update product details, images, variants |
| `DELETE` | `/:id` | Admin | Soft delete / remove product |
| `POST` | `/:id/reviews` | User | Create a rating review for a product |

---

### 👤 Users & Wishlist — `/api/v1/users`

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `POST` | `/` | Public | Register new user account (sends OTP email) |
| `POST` | `/register/verify` | Public | Verify OTP code and activate account |
| `POST` | `/login` | Public | Sign in with email & password |
| `POST` | `/logout` | Public | Clear authentication cookie |
| `GET` | `/profile` | User | Retrieve current user profile details |
| `PUT` | `/profile` | User | Update profile (name, email, password) |
| `GET` | `/wishlist` | User | Get current user's wishlist products |
| `POST` | `/wishlist` | User | Add product to user's wishlist |
| `DELETE` | `/wishlist/:productId` | User | Remove product from user's wishlist |
| `GET` | `/` | Admin | List all registered users |
| `GET` | `/:id` | Admin | Get user by ID |
| `PUT` | `/:id` | Admin | Update user details & admin role |
| `DELETE` | `/:id` | Admin | Delete a user account |
| `GET` | `/auth/google` | Public | Initiate Google OAuth 2.0 login |
| `GET` | `/auth/facebook` | Public | Initiate Facebook OAuth login |

---

### 📋 Orders & Payments — `/api/v1/orders`

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `POST` | `/` | User | Place a new order with items, shipping, and pricing |
| `GET` | `/mine` | User | Get order history of logged-in user |
| `GET` | `/:id` | User | Get detailed order receipt by ID |
| `PUT` | `/:id/pay` | User | Mark order as paid via PayPal capture |
| `POST` | `/:id/vnpay/create` | User | Generate VNPay payment checkout URL |
| `GET` | `/vnpay/callback` | User | Handle VNPay transaction result return |
| `GET` | `/` | Admin | Get all store orders |
| `PUT` | `/:id/deliver` | Admin | Mark order as delivered (triggers notification) |

---

### 📍 Addresses — `/api/v1/address`

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/` | User | Get all saved shipping addresses for current user |
| `POST` | `/` | User | Create a new shipping address |
| `GET` | `/default` | User | Get current user's default shipping address |
| `PUT` | `/:id` | User | Update an address or set as default |
| `DELETE` | `/:id` | User | Delete a saved address |

---

### 🎟️ Coupons — `/api/v1/coupons`

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/` | Public/Admin | Get all available coupons (Public receives only active coupons) |
| `POST` | `/validate` | User | Validate and apply coupon code to order items |
| `POST` | `/` | Admin | Create a new discount coupon |
| `GET` | `/:id` | Admin | Get coupon by ID |
| `PUT` | `/:id` | Admin | Update coupon code, discount value, limits |
| `DELETE` | `/:id` | Admin | Delete a coupon |

---

### 🔔 Notifications — `/api/v1/notifications`

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/` | User | Retrieve in-app notifications for logged-in user |
| `GET` | `/unread-count` | User | Get count of unread notifications |
| `PUT` | `/read-all` | User | Mark all user notifications as read |
| `PUT` | `/:id` | User | Mark a specific notification as read |

---

### 📊 Analytics & Dashboard — `/api/v1/analytics`

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/summary` | Admin | Key summary KPIs: total revenue, order count, user count, product count |
| `GET` | `/revenue` | Admin | Daily/weekly revenue time-series data for area chart |
| `GET` | `/orders-status` | Admin | Order breakdown by status (Delivered, Out for delivery, Unpaid, Cancelled) |
| `GET` | `/low-stock` | Admin | List of product variants with critically low stock |
| `GET` | `/top-products` | Admin | Best-selling products by quantity and revenue |

---

### 💬 Messages & Live Chat — `/api/v1/messages`

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/` | Admin | Get list of all conversation threads |
| `GET` | `/:userId` | User | Retrieve message history between user and admin |
| `POST` | `/` | User | Send a message |

---

### ☁️ Media Upload & Config

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `POST` | `/api/upload` | Admin | Upload image file to ImageKit cloud CDN |
| `GET` | `/api/config/paypal` | Public | Retrieve public PayPal Client ID |

---

## 🗄️ Database Models

### Product Model
```javascript
Product {
  name: String,
  subtitle: String,
  slug: String,
  description: String,
  image: [{ url: String, fileId: String }],
  brand: String,
  category: String,
  reviews: [{ user: ObjectId, name: String, rating: Number, comment: String }],
  rating: Number,
  numberViews: Number,
  variants: [{ size: String, color: String, sku: String, price: Number, originalPrice: Number, countInStock: Number }],
  status: 'Draft' | 'Active' | 'Schedule',
  isDeleted: Boolean
}
```

### User Model
```javascript
User {
  name: String,
  email: String,
  password: String, // bcrypt hashed
  wishlist: [ObjectId -> Product],
  otp: String,
  otpExpires: Date,
  isVerified: Boolean,
  isAdmin: Boolean,
  facebookId: String,
  googleId: String
}
```

### Order Model
```javascript
Order {
  user: ObjectId -> User,
  orderItems: [{ name: String, qty: Number, image: String, price: Number, product: ObjectId, variantId: ObjectId, sku: String, size: String, color: String }],
  shippingAddress: { addressRef: ObjectId, name: String, phone: String, address: String, city: String, postalCode: String, country: String },
  paymentMethod: String,
  paymentResult: { id: String, status: String, update_time: String, email_address: String },
  itemsPrice: Number,
  taxPrice: Number,
  shippingPrice: Number,
  discount: Number,
  totalPrice: Number,
  isPaid: Boolean,
  paidAt: Date,
  isDelivered: Boolean,
  deliveredAt: Date,
  isCancelled: Boolean
}
```

### Notification Model
```javascript
Notification {
  recipient: ObjectId -> User,
  sender: ObjectId -> User,
  type: 'DELIVERED',
  title: String,
  message: String,
  isRead: Boolean,
  relatedId: ObjectId,
  relatedModel: 'Order'
}
```

### Address Model
```javascript
Address {
  user: ObjectId -> User,
  name: String,
  phone: String,
  address: String,
  city: String,
  postalCode: String,
  country: String,
  isDefault: Boolean
}
```

### Coupon Model
```javascript
Coupon {
  category: String,
  title: String,
  subtitle: String,
  description: String,
  badge: String,
  minSpend: Number,
  expiry: Date,
  code: String,
  discountType: 'percentage' | 'fixed',
  discountValue: Number,
  useCount: Number,
  usageLimit: Number,
  isHidden: Boolean
}
```

---

## 🧪 Scripts Reference

| Script | Command | Description |
|---|---|---|
| **Dev** | `npm run dev` | Run backend + frontend concurrently in development mode |
| **Server** | `npm run server` | Run backend only with Nodemon auto-restart |
| **Client** | `npm run client` | Run frontend only with Vite dev server |
| **Start** | `npm start` | Run backend in production mode |
| **Seed** | `npm run data:import` | Seed initial database dataset (Users, Products, Coupons) |
| **Destroy** | `npm run data:destroy` | Clear all database collections |
| **Lint** | `cd frontend && npm run lint` | Run ESLint check on frontend codebase |
| **Build** | `cd frontend && npm run build` | Build optimized production bundle for frontend |

---

## 📄 License

This project is licensed under the **MIT License**.

---

## 👤 Author

**Anify** — [GitHub](https://github.com/Annv11022005)
