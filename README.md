# 🛒 ProShop — Full-Stack eCommerce Platform

ProShop is a modern, full-featured eCommerce web application built with the **MERN stack** (MongoDB, Express, React, Node.js). It includes product management with multi-variant support, user authentication (email + social login), shopping cart, coupon system, order management, real-time chat, and payment integration with both PayPal and VNPay.

---

## ✨ Features

### 🛍️ Storefront (Customer)
- **Product Catalog** — Browse, search, and filter products with pagination
- **Product Variants** — Each product supports multiple variants (color, size, SKU) with independent pricing and stock
- **Product Reviews & Ratings** — Authenticated users can leave reviews
- **Smart Cart** — Variant-aware cart (same product, different variants = separate cart items)
- **Coupon System** — Apply percentage-based or fixed-amount discount coupons at checkout
- **Order Management** — Place orders, track order status, view order history
- **Multiple Payment Methods** — PayPal and VNPay integration
- **Real-time Chat** — Socket.IO–powered live chat between customers and admin
- **SEO-friendly URLs** — Products use human-readable slugs

### 🔐 Authentication & Security
- **Email + OTP Registration** — Register with email verification via one-time password
- **Social Login** — Sign in with Google or Facebook (Passport.js OAuth 2.0)
- **JWT Authentication** — Secure HTTP-only cookie-based tokens
- **Security Hardening** — Helmet, XSS protection, NoSQL injection sanitization, HPP, rate limiting

### 🛠️ Admin Dashboard
- **Product Management** — Full CRUD with multi-image upload (ImageKit), variant table editor, and product status control (Draft / Active / Schedule)
- **Order Management** — View all orders, mark as paid/delivered
- **User Management** — View, edit, and delete user accounts
- **Coupon Management** — Create and manage discount coupons
- **Real-time Chat** — Respond to customer messages in real-time

---

## 🏗️ Tech Stack

### Backend
| Technology | Purpose |
|---|---|
| **Node.js** | Runtime environment |
| **Express.js** | Web framework |
| **MongoDB** + **Mongoose** | Database and ODM |
| **JWT** | Authentication (HTTP-only cookies) |
| **Passport.js** | Google & Facebook OAuth 2.0 |
| **Socket.IO** | Real-time WebSocket communication |
| **Joi** | Request validation |
| **ImageKit** | Cloud image upload and CDN |
| **Multer** | File upload handling |
| **Nodemailer** | OTP email delivery |
| **VNPay SDK** | Vietnamese payment gateway |
| **Helmet / XSS-Clean / HPP** | Security middleware |
| **Slugify** | SEO-friendly URL generation |

### Frontend
| Technology | Purpose |
|---|---|
| **React 19** | UI library |
| **Vite 8** | Build tool and dev server |
| **Tailwind CSS 4** | Utility-first styling |
| **Redux Toolkit** | Global state (cart, auth, chat) |
| **TanStack React Query** | Server state, caching, and data fetching |
| **React Router DOM v7** | Client-side routing |
| **Axios** | HTTP client |
| **Shadcn UI** + **Base UI** | Component library |
| **Lucide React** | Icon library |
| **Embla Carousel** | Image carousel/gallery |
| **Sonner** | Toast notifications |
| **Socket.IO Client** | Real-time chat |
| **PayPal React SDK** | PayPal payment integration |
| **React Compiler** (Babel plugin) | Automatic memoization |

---

## 📁 Project Structure

```
proshop/
├── backend/
│   ├── app.js                  # Express app setup (middleware, routes, error handling)
│   ├── server.js               # HTTP server entry point + WebSocket init
│   ├── seeder.js               # Database seed/destroy script
│   ├── config/
│   │   ├── db.js               # MongoDB connection
│   │   ├── imageKit.js         # ImageKit cloud config
│   │   ├── mailer.js           # Nodemailer transporter
│   │   ├── passport.js         # Google & Facebook OAuth strategies
│   │   └── security.js         # Security middleware (Helmet, XSS, HPP, etc.)
│   ├── controller/
│   │   ├── productController.js
│   │   ├── userController.js
│   │   ├── orderController.js
│   │   ├── paymentController.js
│   │   ├── addressController.js
│   │   ├── couponController.js
│   │   └── messagesController.js
│   ├── middleware/
│   │   ├── authMiddleware.js    # protect, admin, optionalAuth
│   │   ├── errorMiddleware.js   # Global error handler
│   │   ├── asyncHandler.js      # Async/await error wrapper
│   │   ├── uploadMiddleware.js  # Multer config
│   │   └── validateMiddleware.js # Joi validation runner
│   ├── model/
│   │   ├── productsModel.js     # Product + Variant + Image + Review schemas
│   │   ├── userModel.js         # User schema with bcrypt hashing
│   │   ├── orderModel.js        # Order schema with variant tracking
│   │   ├── addressModel.js      # User shipping addresses
│   │   ├── couponModel.js       # Discount coupons
│   │   └── messagesModel.js     # Chat messages
│   ├── routes/
│   │   ├── index.js             # Route mounting hub
│   │   ├── productRoutes.js
│   │   ├── userRoutes.js
│   │   ├── orderRoutes.js
│   │   ├── uploadRoutes.js
│   │   ├── addressRoute.js
│   │   ├── couponRoute.js
│   │   └── messageRoute.js
│   ├── socket/                  # Socket.IO server setup
│   ├── utils/                   # Helpers (token generation, API features, etc.)
│   ├── validator/               # Joi validation schemas
│   └── data/                    # Seed data (users, products, coupons)
│
├── frontend/
│   ├── index.html
│   ├── vite.config.js
│   └── src/
│       ├── main.jsx             # React entry point
│       ├── App.jsx              # Router & providers setup
│       ├── store.js             # Redux store (cart, auth, chat + socket middleware)
│       ├── index.css            # Global styles & Tailwind config
│       ├── components/          # Shared UI components (layouts, cards, buttons, etc.)
│       ├── screens/             # Route-level page wrappers
│       ├── hooks/               # Custom React hooks
│       ├── lib/                 # Utilities (formatCurrency, socket middleware, etc.)
│       └── features/            # Feature-based modules
│           ├── home/            # Homepage, product listing, filters
│           ├── product/         # Product detail, gallery, price, reviews
│           ├── cart/            # Cart page, cart items, cart slice, cart utils
│           ├── authentication/  # Login, register, OTP, auth slice
│           ├── checkout/        # Shipping, payment, place order, VNPay
│           ├── order/           # Order detail, order history
│           ├── address/         # Address management
│           ├── coupon/          # Coupon listing & application
│           ├── chat/            # Real-time messaging
│           └── admin/           # Admin dashboard pages & components
│
├── package.json                 # Root package (concurrently runs both servers)
├── example.env                  # Environment variable template
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
# Install root dependencies (Express, Mongoose, etc.)
npm install

# Install frontend dependencies (React, Vite, etc.)
cd frontend
npm install
cd ..
```

### 3. Configure Environment Variables

Copy the example file and fill in your values:

```bash
cp example.env .env
```

Edit `.env` with your configuration:

```env
NODE_ENV=development
PORT=5000
MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/proshop
JWT_SECRET=your_jwt_secret_key

# PayPal
PAYPAL_CLIENT_ID=your_paypal_client_id

# ImageKit (image upload CDN)
IMAGEKIT_PUBLIC_KEY=your_imagekit_public_key
IMAGEKIT_PRIVATE_KEY=your_imagekit_private_key
IMAGEKIT_URL_ENDPOINT=https://ik.imagekit.io/your_id

# Nodemailer (OTP email)
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USER=your_email@gmail.com
MAIL_PASS=your_app_password

# OAuth (Social Login)
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
FACEBOOK_APP_ID=your_facebook_app_id
FACEBOOK_APP_SECRET=your_facebook_app_secret

# VNPay
VNPAY_TMN_CODE=your_vnpay_terminal_code
VNPAY_SECURE_SECRET=your_vnpay_secret
VNPAY_URL=https://sandbox.vnpayment.vn/paymentv2/vpcpay.html
VNPAY_RETURN_URL=http://localhost:5173/vnpay-return
```

### 4. Seed the Database (Optional)

```bash
# Import sample data (users, products, coupons)
npm run data:import

# To destroy all data
npm run data:destroy
```

> **Default admin account** after seeding:
> Check `backend/data/user.js` for credentials.

### 5. Run the Application

```bash
# Run both backend (port 5000) and frontend (port 5173) concurrently
npm run dev
```

Or run them separately:

```bash
# Backend only (with nodemon hot-reload)
npm run server

# Frontend only (Vite dev server)
npm run client
```

Visit **http://localhost:5173** in your browser.

---

## 📡 API Reference

Base URL: `http://localhost:5000`

### Products — `/api/v1/products`

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/` | Public* | Get all products (paginated, filterable). *Draft products hidden from non-admins |
| `POST` | `/` | Admin | Create a new product |
| `GET` | `/top` | Public | Get top-rated products |
| `GET` | `/:slugOrId` | Public* | Get product by slug or ObjectId. *Draft blocked for non-admins |
| `PUT` | `/:id` | Admin | Update a product |
| `DELETE` | `/:id` | Admin | Delete a product |
| `POST` | `/:id/reviews` | User | Create a product review |

**Query Parameters** (GET `/`):
- `keyword` — Search by product name
- `pageNumber` — Pagination
- `sort` — Sort field (e.g., `price`, `-price`)
- `stock` — `countInStock` (in stock) or `countOfStock` (out of stock)
- `category`, `brand` — Filter by fields
- `variants.price[gte]`, `variants.price[lte]` — Price range filter

### Users — `/api/v1/users`

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `POST` | `/` | Public | Register new user (sends OTP email) |
| `POST` | `/register/verify` | Public | Verify OTP to complete registration |
| `POST` | `/login` | Public | Login with email & password |
| `POST` | `/logout` | Public | Logout (clear cookie) |
| `GET` | `/profile` | User | Get current user profile |
| `PUT` | `/profile` | User | Update current user profile |
| `GET` | `/` | Admin | Get all users |
| `GET` | `/:id` | Admin | Get user by ID |
| `PUT` | `/:id` | Admin | Update user (admin) |
| `DELETE` | `/:id` | Admin | Delete user |
| `GET` | `/auth/google` | Public | Google OAuth login |
| `GET` | `/auth/facebook` | Public | Facebook OAuth login |

### Orders — `/api/v1/orders`

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `POST` | `/` | User | Create new order |
| `GET` | `/` | Admin | Get all orders |
| `GET` | `/mine` | User | Get logged-in user's orders |
| `GET` | `/:id` | User | Get order by ID |
| `PUT` | `/:id/pay` | User | Mark order as paid (PayPal) |
| `PUT` | `/:id/deliver` | Admin | Mark order as delivered |
| `POST` | `/:id/vnpay/create` | User | Create VNPay payment URL |
| `GET` | `/vnpay/callback` | User | VNPay payment callback |

### Addresses — `/api/v1/address`

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/` | User | Get user's addresses |
| `POST` | `/` | User | Create new address |
| `GET` | `/default` | User | Get default address |
| `PUT` | `/:id` | User | Update address |
| `DELETE` | `/:id` | User | Delete address |

### Coupons — `/api/v1/coupons`

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/` | Public/Admin | Get coupons (public gets active only) |
| `POST` | `/` | Admin | Create coupon |
| `GET` | `/:id` | Admin | Get coupon by ID |
| `PUT` | `/:id` | Admin | Update coupon |
| `DELETE` | `/:id` | Admin | Delete coupon |
| `POST` | `/validate` | User | Validate & apply a coupon code |

### Messages — `/api/v1/messages`

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/` | Admin | Get all conversations |
| `GET` | `/:userId` | User | Get messages for a user |
| `POST` | `/` | User | Send a message |

### Upload — `/api/upload`

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `POST` | `/` | Admin | Upload image to ImageKit CDN |

### Config

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/api/config/paypal` | Public | Get PayPal client ID |

---

## 🗄️ Database Models

### Product
```
Product {
  name, subtitle, slug, description,
  image: [{ url, fileId }],
  brand, category,
  reviews: [{ user, name, rating, comment }],
  rating, numberViews,
  variants: [{ size, color, sku, price, originalPrice, countInStock }],
  status: 'Draft' | 'Active' | 'Schedule',
  isDeleted
}
```

### User
```
User {
  name, email, password,
  otp, otpExpires, isVerified,
  isAdmin,
  facebookId, googleId
}
```

### Order
```
Order {
  user,
  orderItems: [{ name, qty, image, price, product, variantId, sku, size, color }],
  shippingAddress: { addressRef, name, phone, address, city, postalCode, country },
  paymentMethod, paymentResult,
  itemsPrice, taxPrice, shippingPrice, discount, totalPrice,
  isPaid, paidAt, isDelivered, deliveredAt
}
```

---

## 🧪 Scripts Reference

| Script | Command | Description |
|---|---|---|
| **Dev** | `npm run dev` | Run backend + frontend concurrently |
| **Server** | `npm run server` | Run backend only (nodemon) |
| **Client** | `npm run client` | Run frontend only (Vite) |
| **Start** | `npm start` | Run backend (production) |
| **Seed** | `npm run data:import` | Import sample data |
| **Destroy** | `npm run data:destroy` | Destroy all data |
| **Lint** | `cd frontend && npm run lint` | Lint frontend code |
| **Build** | `cd frontend && npm run build` | Build frontend for production |

---

## 📄 License

This project is licensed under the **MIT License**.

---

## 👤 Author

**Anify** — [GitHub](https://github.com/Annv11022005)
