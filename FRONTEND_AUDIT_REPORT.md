# Comprehensive Frontend Audit Report - ProShop

> **Project:** ProShop E-Commerce Platform  
> **Stack:** React 19, Vite 8, Tailwind CSS v4, Redux Toolkit, TanStack Query v5, Socket.IO, Base UI / Radix UI  
> **Audit Date:** 2026-08-28  
> **Standard:** Front-End Checklist Global (385 Rules) & WCAG 2.1 / 2.2 AA Standards  

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Project & Architecture Analysis](#2-project--architecture-analysis)
3. [Audit Findings by Category](#3-audit-findings-by-category)
   - [HTML & Semantic Structure](#31-html--semantic-structure)
   - [CSS & Responsive Design](#32-css--responsive-design)
   - [JavaScript & React Code Quality](#33-javascript--react-code-quality)
   - [Accessibility (a11y)](#34-accessibility-a11y)
   - [Performance & Caching](#35-performance--caching)
   - [SEO & Meta Tags](#36-seo--meta-tags)
   - [Security & Authentication](#37-security--authentication)
   - [Image Optimization & Assets](#38-image-optimization--assets)
   - [Error Handling & Resilience](#39-error-handling--resilience)
   - [Loading States & User Feedback](#310-loading-states--user-feedback)
   - [Automated Testing & QA](#311-automated-testing--qa)
4. [Issues by Priority](#4-issues-by-priority)
   - [Critical Issues](#critical-issues)
   - [High Priority Issues](#high-priority-issues)
   - [Medium Priority Issues](#medium-priority-issues)
   - [Low Priority Issues](#low-priority-issues)
5. [Verified Good Practices](#5-verified-good-practices)
6. [Prioritized Implementation Plan & TODO List](#6-prioritized-implementation-plan--todo-list)

---

## 1. Executive Summary

A comprehensive frontend audit of the **ProShop** codebase was conducted against the official **Front-End Checklist Global** rule corpus. Every issue in this report has been verified directly against the active source code.

### Summary of Audit Results:
- **Critical Issues (5)**: Potential application crashes from unhandled `localStorage` parsing, runtime `TypeError` on null user state, authentication bypass logic bugs in reviews, misleading calculation in product metric formatting, and broken button disabled props.
- **High Priority Issues (5)**: Zero code-splitting across 24 routes causing initial bundle bloat, completely inaccessible interactive rating component for keyboard/screen reader users, heading hierarchy violations (`<h1>` inside product cards), invalid nested interactive HTML (`<a>` wrapping `<button>`), and missing 404 error routing.
- **Medium Priority Issues (9)**: Missing accessible names on icon buttons and search fields, non-responsive fixed-pixel widths breaking mobile views, commented-out mobile admin navigation trigger, aggressive cache invalidation (`staleTime: 0`), missing password autocomplete attributes, and uncompressed 1MB+ PNG screenshots.
- **Low Priority Issues (7)**: Empty favicon link, missing Open Graph tags, non-semantic `<div>` footer, mismatched table columns, and non-standard Tailwind CSS tokens.

---

## 2. Project & Architecture Analysis

| Layer | Implementation & Technologies |
| :--- | :--- |
| **Framework & Compiler** | React 19 (`react` 19.2.7, `react-dom` 19.2.7), Vite 8 (`vite` 8.1.1), `@vitejs/plugin-react` with `babel-plugin-react-compiler`. |
| **Design System & Styling** | Tailwind CSS v4 (`@tailwindcss/vite` 4.3.2), `tw-animate-css`, `next-themes` (Dark/Light mode using `oklch` color spaces), Base UI / Radix primitives (`@base-ui/react`, `@shadcn/react`). |
| **Client State** | Redux Toolkit (`@reduxjs/toolkit` 2.12.0) managing `cartSlice`, `authSlice`, `chatSlice`. |
| **Server State & Caching** | TanStack React Query v5 (`@tanstack/react-query` 5.101.2) for API query caching and mutations. |
| **Routing & Protection** | `react-router-dom` v7 with `AppLayout`, `AppLayoutAdmin`, and route guards (`PrivateRoutes`, `AdminRoutes`). |
| **Real-Time Communication** | `socket.io-client` (v4.8.3) wired through Redux middleware (`socketMiddleware.js`) for chat, typing indicators, and push notifications. |
| **Forms & Validation** | `react-hook-form` (v7.85.0) paired with `zod` (v4.4.3) schema validation. |
| **Payment Gateways** | PayPal JS SDK (`@paypal/react-paypal-js` 10.1.2) and VNPay redirect workflow. |

---

## 3. Audit Findings by Category

### 3.1 HTML & Semantic Structure
- **Invalid Nested Interactive Elements**: `<Link to="..."><Button>...</Button></Link>` creates an `<a href="..."><button>...</button></a>` structure.
  - *Files*: `Header.jsx`, `HomeBanner.jsx`, `OrderListPage.jsx`.
  - *Impact*: Violates HTML5 nesting rules; screen readers malfunction and clicks can trigger duplicate events.
- **Multiple `<h1>` Headings per Page**: Product cards render `<h1 className='product-title'>`.
  - *File*: `Product.jsx` (Line 78).
  - *Impact*: Breaks document outline and hurts SEO ranking signals.
- **Interactive Button inside Heading `<CardTitle>`**:
  - *File*: `Product.jsx` (Lines 59–74).
  - *Impact*: Violates ARIA standards (heading containing interactive media box with wishlist button).
- **Non-Semantic Footer**:
  - *File*: `Footer.jsx` (Line 4).
  - *Impact*: Uses `<div>` instead of `<footer>` landmark.
- **Empty Favicon Link**:
  - *File*: `index.html` (Line 5).
  - *Impact*: `<link rel="icon" type="image/svg+xml" href="" />` triggers redundant HTTP GET on root.

### 3.2 CSS & Responsive Design
- **Non-Fluid Viewport Height (`h-screen`)**:
  - *File*: `AppLayout.jsx` (Line 8).
  - *Impact*: Forces 100vh layout; content exceeding screen height clips or causes nested scrolling bugs.
- **Fixed Width Columns Breaking Mobile Viewports**:
  - *Files*: `ProfilePage.jsx` (`grid-cols-[380px_380px]` and 3x `w-60` stat cards), `DashboardPage.jsx` (`w-[50%]`).
  - *Impact*: Triggers major horizontal layout overflow on screens < 768px.
- **Missing Mobile Sidebar Navigation Trigger**:
  - *File*: `AppLayoutAdmin.jsx` (Lines 14–16).
  - *Impact*: `<SidebarTrigger />` is commented out; mobile admins cannot open the sidebar.
- **Non-Standard Tailwind Utility Classes**:
  - *Files*: `Search.jsx` (`w-100`), `AppLayout.jsx` (`max-w-300`, `bg-grey-50`), `HomeBanner.jsx` (`h-95`), `ProductDetail.jsx` (`h-15`, `mb-15`).
  - *Impact*: Unrecognized classes are ignored by Vite/Tailwind, causing unstyled dimensions.
- **Missing Reduced Motion Support**:
  - *File*: `index.css`.
  - *Impact*: Animations run continuously without checking `@media (prefers-reduced-motion: reduce)`.

### 3.3 JavaScript & React Code Quality
- **Unhandled `JSON.parse` Crash on Local Storage Read**:
  - *Files*: `authSlice.js` (Line 4), `cartSlice.js` (Line 4).
  - *Impact*: Any corrupted string in localStorage crashes React immediately during application mount.
- **Runtime `TypeError` in `ProfilePage`**:
  - *File*: `ProfilePage.jsx` (Lines 76–77).
  - *Impact*: `userInfo.createdAt` runs before the `!userInfo` guard, throwing fatal TypeError on null user state.
- **Broken State Selector in `ProductDetail`**:
  - *File*: `ProductDetail.jsx` (Line 41).
  - *Impact*: `const userInfo = useSelector((state) => state.auth)` assigns `{ userInfo: null }` (truthy), displaying review form to unauthenticated users.
- **React Hook Rule Violation**:
  - *File*: `ResetPasswordPage.jsx` (Line 114).
  - *Impact*: `watch('email')` is called inside an event callback instead of top-level or using `getValues()`.
- **Calculation Bug in `formatCompact`**:
  - *File*: `Product.jsx` (Line 20).
  - *Impact*: `num / 10` renders 1,200 sales as `120.0k` instead of `1.2k`.
- **Typo in React Prop (`disable` vs `disabled`)**:
  - *File*: `CartSummary.jsx` (Line 33).
  - *Impact*: Checkout button is never disabled when cart is empty.

### 3.4 Accessibility (WCAG 2.1 / 2.2 AA)
- **Inaccessible Star Rating Component**:
  - *File*: `rating.jsx` (Lines 89–111).
  - *Impact*: Plain `<div>` with `onClick`; cannot be tabbed to or operated via keyboard/screen reader.
- **Unlabelled Icon-Only Buttons**:
  - *Files*: `ThemeToggle.jsx`, `WishlistIcon.jsx`, `CartItem.jsx` (trash button), `ProductListPage.jsx` (edit/delete), `UserListPage.jsx` (delete), `ChatWidget.jsx` (open/send), `AdminSidebar.jsx` (return to store).
  - *Impact*: Announced as generic "button" with no functional label.
- **Missing Form Input Labels**:
  - *Files*: `Search.jsx`, `SelectSort.jsx`, `ChatWidget.jsx`.
  - *Impact*: Inputs lack visual `<label>` with `htmlFor` or `aria-label`.
- **Inaccessible Password Visibility Toggles**:
  - *Files*: `LoginForm.jsx`, `RegisterForm.jsx`, `FormInformation.jsx`.
  - *Impact*: Eye icons are wrapped in unlabelled clickable `<div>`s instead of `<button type="button">`.
- **Table Structure & Scope Defects**:
  - *Files*: `OrderListPage.jsx`, `UserListPage.jsx`.
  - *Impact*: Missing `scope="col"` and mismatched header/cell counts due to missing action headers.

### 3.5 Performance & Caching
- **Missing Code Splitting / Lazy Loading**:
  - *File*: `App.jsx` (Lines 14–40).
  - *Impact*: All 24 pages loaded in single bundle; admin code and charts load for normal storefront visitors.
- **Aggressive Cache Invalidation (`staleTime: 0`)**:
  - *File*: `queryClient.js` (Line 6).
  - *Impact*: Every window focus/tab switch refetches all active queries.
- **N+1 Hook Calls on Product Grids**:
  - *File*: `Product.jsx` (Line 29).
  - *Impact*: Every card calls `useGetWishlist()`, creating multiple component subscriptions.
- **Missing Image Dimensions & Lazy Loading**:
  - *Files*: `Product.jsx`, `HomeBanner.jsx`, `ProductGallery.jsx`.
  - *Impact*: Triggers Cumulative Layout Shift (CLS) on dynamic image loads.

### 3.6 SEO & Meta Tags
- **Missing Meta Description & Open Graph Tags**:
  - *File*: `index.html`.
  - *Impact*: No search snippets or social sharing cards (Facebook, Twitter/X, Zalo, Telegram).
- **Missing 404 Catch-All Route**:
  - *File*: `App.jsx`.
  - *Impact*: Unmatched URLs result in blank screens without navigation recovery.

### 3.7 Security & Authentication
- **Missing Autocomplete Attributes on Credentials**:
  - *Files*: `LoginForm.jsx`, `RegisterForm.jsx`, `FormInformation.jsx`.
  - *Impact*: Password managers cannot reliably detect `current-password`, `new-password`, or `email`.
- **External Image Dependencies**:
  - *Files*: `LoginForm.jsx`, `RegisterForm.jsx`.
  - *Impact*: Unsplash HTTP URLs leak referrers and fail in offline/restricted networks.

### 3.8 Image Optimization & Assets
- **Massive Uncompressed PNG Assets in `public/`**:
  - *Files*: `screen.png` (1.0 MB), `screenDark.png` (1.14 MB).
  - *Impact*: 2+ MB downloaded for simple auth background previews.
- **Missing Image Error Fallbacks**:
  - *Files*: `Product.jsx`, `CartItem.jsx`, `ProductListPage.jsx`.
  - *Impact*: Broken image URLs display browser broken-image icons without placeholder replacement.

### 3.9 Error Handling & Resilience
- **Fragile Error Parsing**:
  - *Files*: `HomePage.jsx` (Line 53), `ProductDetail.jsx` (Line 128).
  - *Impact*: `error?.data?.message || error.error` fails on Axios standard error objects.
- **Direct Navigation Dead-End on `/shipping`**:
  - *File*: `ShippingPage.jsx` (Line 99).
  - *Impact*: Navigating directly to `/shipping` renders a blank page when `action` is empty.
- **Missing Global React Error Boundary**:
  - *File*: `main.jsx`.
  - *Impact*: Single component throw unmounts the whole application.

### 3.10 Loading States & User Feedback
- **Destructive Loading State in `ChatWidget`**:
  - *File*: `ChatWidget.jsx` (Line 80).
  - *Impact*: Unmounts entire widget container and renders a bare spinner in bottom corner while fetching messages.
- **Non-Disabled Inputs During Form Submission**:
  - *Files*: `CreateCouponPage.jsx`, `FormAddress.jsx`.

### 3.11 Automated Testing & QA
- **Zero Automated Tests**:
  - *File*: `package.json`.
  - *Impact*: No test runner (Vitest) or test files exist. Core cart pricing, tax calculations, discounts, and auth guards are unverified automatically.

---

## 4. Issues by Priority

```
===================================================================================
                               CRITICAL ISSUES (5)
===================================================================================
```

### [CRIT-01] Unhandled `JSON.parse` Crash on Corrupted `localStorage`
- **File Path**: [authSlice.js](file:///d:/Code/proshop/frontend/src/features/authentication/authSlice.js#L3-L7), [cartSlice.js](file:///d:/Code/proshop/frontend/src/features/cart/cartSlice.js#L4-L7)
- **Component**: `authSlice`, `cartSlice`
- **Checklist Rule**: `js-error-handling` / `js-defensive-storage`
- **Why it matters**: `localStorage.getItem('userInfo')` containing invalid/corrupted JSON throws an unhandled `SyntaxError`, causing a fatal app crash on initial load.
- **Recommended Fix**:
  ```javascript
  const getStoredJSON = (key, fallback = null) => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : fallback;
    } catch {
      return fallback;
    }
  };
  ```

### [CRIT-02] Runtime `TypeError` in `ProfilePage` Before Null Guard
- **File Path**: [ProfilePage.jsx](file:///d:/Code/proshop/frontend/src/features/authentication/ProfilePage.jsx#L76-L78)
- **Component**: `ProfilePage`
- **Checklist Rule**: `js-null-safety` / `react-render-safety`
- **Why it matters**: `userInfo.createdAt` is evaluated on lines 76–77 before the null check on line 119, crashing with `TypeError: Cannot read properties of null` if user state is uninitialized.
- **Recommended Fix**:
  ```javascript
  const avatar = userInfo?.name?.charAt(0) || '';
  const memberSince = userInfo?.createdAt
    ? new Date(userInfo.createdAt).getFullYear()
    : '—';
  ```

### [CRIT-03] Broken Authentication Check in `ProductDetail` Review Section
- **File Path**: [ProductDetail.jsx](file:///d:/Code/proshop/frontend/src/features/product/ProductDetail.jsx#L41)
- **Component**: `ProductDetail` (Lines 41 & 262)
- **Checklist Rule**: `react-state-selector` / `security-auth-check`
- **Why it matters**: `const userInfo = useSelector((state) => state.auth)` sets `userInfo` to `{ userInfo: null }` (truthy), always displaying the review submission form to guest users.
- **Recommended Fix**:
  ```javascript
  const { userInfo } = useSelector((state) => state.auth);
  ```

### [CRIT-04] Calculation Bug in `formatCompact`
- **File Path**: [Product.jsx](file:///d:/Code/proshop/frontend/src/components/ui/Product.jsx#L20-L26)
- **Component**: `formatCompact`
- **Checklist Rule**: `js-logic-accuracy`
- **Why it matters**: Divides by 10 instead of 1000, displaying 1,200 sales as `120.0k` instead of `1.2k`.
- **Recommended Fix**:
  ```javascript
  function formatCompact(num) {
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'k';
    }
    return num.toString();
  }
  ```

### [CRIT-05] HTML Prop Typo: `disable` instead of `disabled`
- **File Path**: [CartSummary.jsx](file:///d:/Code/proshop/frontend/src/features/cart/CartSummary.jsx#L33)
- **Component**: `CartSummary`
- **Checklist Rule**: `html-valid-attributes`
- **Why it matters**: `<Button disable={...}>` is ignored by DOM; users can click checkout even with an empty cart.
- **Recommended Fix**: Replace `disable={...}` with `disabled={...}`.

---

```
===================================================================================
                             HIGH PRIORITY ISSUES (5)
===================================================================================
```

### [HIGH-01] Missing Code Splitting / Lazy Loading across 24 Routes
- **File Path**: [App.jsx](file:///d:/Code/proshop/frontend/src/App.jsx#L14-L40)
- **Component**: `App`
- **Checklist Rule**: `perf-code-splitting` / `perf-route-lazy-loading`
- **Why it matters**: Statically imports all admin, dashboard, chart, and order screens into one huge bundle.
- **Recommended Fix**: Wrap routes in `React.lazy()` and `<Suspense fallback={<Spinner />}>`.

### [HIGH-02] Inaccessible Custom Star Rating Component
- **File Path**: [rating.jsx](file:///d:/Code/proshop/frontend/src/components/reui/rating.jsx#L89-L111)
- **Component**: `Rating`
- **Checklist Rule**: `a11y-keyboard-navigation` (WCAG 2.1.1, 4.1.2)
- **Why it matters**: Uses non-focusable `<div>` elements without ARIA roles or keyboard event listeners.
- **Recommended Fix**: Convert stars to `<button type="button" role="radio" aria-label="...">`.

### [HIGH-03] Heading Outline Hierarchy Violation (Multiple `<h1>` Headings)
- **File Path**: [Product.jsx](file:///d:/Code/proshop/frontend/src/components/ui/Product.jsx#L78)
- **Component**: `Product`
- **Checklist Rule**: `html-heading-h1-single` / `seo-single-h1` (WCAG 1.3.1)
- **Why it matters**: Every product card in grids renders an `<h1>`, breaking document outline and SEO.
- **Recommended Fix**: Change `<h1 className='product-title'>` to `<h2>` or `<h3>`.

### [HIGH-04] Invalid Nested Interactive HTML Elements
- **File Path**: [Header.jsx](file:///d:/Code/proshop/frontend/src/components/Header.jsx#L67-L74), [HomeBanner.jsx](file:///d:/Code/proshop/frontend/src/features/home/HomeBanner.jsx#L98-L107), [OrderListPage.jsx](file:///d:/Code/proshop/frontend/src/features/admin/page/order/OrderListPage.jsx#L70-L72)
- **Component**: `Header`, `HomeBanner`, `OrderListPage`
- **Checklist Rule**: `html-valid-nesting` / `html-no-nested-interactive`
- **Why it matters**: `<Link><Button>...</Button></Link>` creates illegal `<a><button>...</button></a>` DOM nodes.
- **Recommended Fix**: Use shadcn's `asChild` prop on `Button`: `<Button asChild><Link to="...">...</Link></Button>`.

### [HIGH-05] Missing 404 / Catch-All Route
- **File Path**: [App.jsx](file:///d:/Code/proshop/frontend/src/App.jsx#L71-L137)
- **Component**: `App`
- **Checklist Rule**: `seo-404-page` / `ux-error-handling`
- **Why it matters**: Navigating to non-existent URLs renders a blank screen with no feedback.
- **Recommended Fix**: Add `<Route path="*" element={<NotFoundScreen />} />`.

---

```
===================================================================================
                            MEDIUM PRIORITY ISSUES (9)
===================================================================================
```

### [MED-01] Missing `aria-label` on Icon-Only Buttons
- **File Path**: [ThemeToggle.jsx](file:///d:/Code/proshop/frontend/src/components/ThemeToggle.jsx#L9-L17), [WishlistIcon.jsx](file:///d:/Code/proshop/frontend/src/components/WishlistIcon.jsx#L5-L16), [CartItem.jsx](file:///d:/Code/proshop/frontend/src/features/cart/CartItem.jsx#L48-L55), [ProductListPage.jsx](file:///d:/Code/proshop/frontend/src/features/admin/page/product/ProductListPage.jsx#L111-L128), [UserListPage.jsx](file:///d:/Code/proshop/frontend/src/features/admin/page/user/UserListPage.jsx#L76-L82), [ChatWidget.jsx](file:///d:/Code/proshop/frontend/src/features/chat/ChatWidget.jsx#L370-L376), [AdminSidebar.jsx](file:///d:/Code/proshop/frontend/src/components/AdminSidebar.jsx#L76-L84)
- **Checklist Rule**: `a11y-button-name` (WCAG 4.1.2)
- **Fix**: Add descriptive `aria-label` attributes to all icon-only buttons.

### [MED-02] Missing Accessible Labels on Form Controls
- **File Path**: [Search.jsx](file:///d:/Code/proshop/frontend/src/components/Search.jsx#L22-L29), [SelectSort.jsx](file:///d:/Code/proshop/frontend/src/components/ui/SelectSort.jsx#L3-L17), [ChatWidget.jsx](file:///d:/Code/proshop/frontend/src/features/chat/ChatWidget.jsx#L344-L350)
- **Checklist Rule**: `a11y-form-label` (WCAG 3.3.2)
- **Fix**: Add `aria-label="Search products"`, `aria-label="Sort products"`, `aria-label="Type message"`.

### [MED-03] Mobile Viewport Overflow from Hardcoded Pixel Widths
- **File Path**: [ProfilePage.jsx](file:///d:/Code/proshop/frontend/src/features/authentication/ProfilePage.jsx#L272) (`grid-cols-[380px_380px]`), [ProfilePage.jsx](file:///d:/Code/proshop/frontend/src/features/authentication/ProfilePage.jsx#L285) (3x `w-60` cards), [DashboardPage.jsx](file:///d:/Code/proshop/frontend/src/features/admin/page/dashboard/DashboardPage.jsx#L52) (`w-[50%]`)
- **Checklist Rule**: `css-responsive-media-queries` / `css-mobile-overflow`
- **Fix**: Replace with fluid responsive Tailwind grids (`grid-cols-1 sm:grid-cols-2`, `flex-col lg:flex-row`).

### [MED-04] Commented-Out Mobile Admin Sidebar Trigger
- **File Path**: [AppLayoutAdmin.jsx](file:///d:/Code/proshop/frontend/src/components/AppLayoutAdmin.jsx#L14-L16)
- **Checklist Rule**: `css-responsive-navigation`
- **Fix**: Uncomment and render `<SidebarTrigger />` inside the admin header.

### [MED-05] Inefficient Global Cache Invalidation (`staleTime: 0`)
- **File Path**: [queryClient.js](file:///d:/Code/proshop/frontend/src/lib/queryClient.js#L6)
- **Checklist Rule**: `perf-caching`
- **Fix**: Set default `staleTime: 60 * 1000` (1 minute) and `refetchOnWindowFocus: false`.

### [MED-06] Missing `autoComplete` Attributes on Sensitive Auth Forms
- **File Path**: [LoginForm.jsx](file:///d:/Code/proshop/frontend/src/features/authentication/LoginForm.jsx#L110-L132), [RegisterForm.jsx](file:///d:/Code/proshop/frontend/src/features/authentication/RegisterForm.jsx#L126-L191), [FormInformation.jsx](file:///d:/Code/proshop/frontend/src/features/authentication/components/FormInformation.jsx#L48-L125)
- **Checklist Rule**: `security-form-autocomplete` / `security-password-field`
- **Fix**: Add `autoComplete="email"`, `autoComplete="current-password"`, `autoComplete="new-password"`, `autoComplete="name"`.

### [MED-07] Missing Top-Level React Error Boundary
- **File Path**: [main.jsx](file:///d:/Code/proshop/frontend/src/main.jsx#L9-L16)
- **Checklist Rule**: `react-error-boundary`
- **Fix**: Implement an `ErrorBoundary` component wrapping `<App />` with a friendly error recovery screen.

### [MED-08] Massive Uncompressed PNG Screenshots in `public/`
- **File Path**: [screen.png](file:///d:/Code/proshop/frontend/public/screen.png) (1.0 MB), [screenDark.png](file:///d:/Code/proshop/frontend/public/screenDark.png) (1.14 MB)
- **Checklist Rule**: `images-optimization-webp-avif`
- **Fix**: Convert to compressed WebP or AVIF format (< 100 KB).

### [MED-09] Fragile Axios Error Parsing
- **File Path**: [HomePage.jsx](file:///d:/Code/proshop/frontend/src/features/home/HomePage.jsx#L53), [ProductDetail.jsx](file:///d:/Code/proshop/frontend/src/features/product/ProductDetail.jsx#L128)
- **Checklist Rule**: `js-error-handling`
- **Fix**: Create a unified `getErrorMessage(error)` helper accessing `error.response?.data?.message || error.message`.

---

```
===================================================================================
                             LOW PRIORITY ISSUES (7)
===================================================================================
```

### [LOW-01] Empty Favicon Link `href=""`
- **File Path**: [index.html](file:///d:/Code/proshop/frontend/index.html#L5)
- **Fix**: Add a valid SVG or ICO path to `<link rel="icon">`.

### [LOW-02] Missing Meta Description & Open Graph Tags
- **File Path**: [index.html](file:///d:/Code/proshop/frontend/index.html#L3-L8)
- **Fix**: Add `<meta name="description">`, `og:title`, `og:description`, `og:image`, `twitter:card`.

### [LOW-03] Non-Semantic Container in `Footer`
- **File Path**: [Footer.jsx](file:///d:/Code/proshop/frontend/src/components/Footer.jsx#L4)
- **Fix**: Change `<div>` to `<footer className='text-center'>`.

### [LOW-04] Non-Fluid Viewport Height (`h-screen`) in `AppLayout`
- **File Path**: [AppLayout.jsx](file:///d:/Code/proshop/frontend/src/components/AppLayout.jsx#L8)
- **Fix**: Change `h-screen` to `min-h-screen`.

### [LOW-05] Missing Table Header `scope="col"` and Column Count Mismatch
- **File Path**: [OrderListPage.jsx](file:///d:/Code/proshop/frontend/src/features/admin/page/order/OrderListPage.jsx#L29-L36), [UserListPage.jsx](file:///d:/Code/proshop/frontend/src/features/admin/page/user/UserListPage.jsx#L45-L50)
- **Fix**: Add `scope="col"` to `TableHead` and add a matching `<TableHead>` for the Actions column.

### [LOW-06] Non-Standard Tailwind CSS Utility Classes
- **File Path**: [Search.jsx](file:///d:/Code/proshop/frontend/src/components/Search.jsx#L21) (`w-100`), [HomeBanner.jsx](file:///d:/Code/proshop/frontend/src/features/home/HomeBanner.jsx#L40) (`h-95`), [ProductDetail.jsx](file:///d:/Code/proshop/frontend/src/features/product/ProductDetail.jsx#L209-L227) (`h-15`, `mb-15`)
- **Fix**: Replace with standard Tailwind classes (`w-full`, `h-96`, `h-14`, `mb-14`).

### [LOW-07] Inconsistent Multilingual Strings in Error Messages
- **File Path**: [ChatWidget.jsx](file:///d:/Code/proshop/frontend/src/features/chat/ChatWidget.jsx#L156) (`'Gửi tin nhắn thất bại'`), [DashboardPage.jsx](file:///d:/Code/proshop/frontend/src/features/admin/page/dashboard/DashboardPage.jsx#L32) (`'Lỗi tải dữ liệu'`)
- **Fix**: Standardize all fallback error strings to English.

---

## 5. Verified Good Practices

1. **Modern CSS Variable Token System**: Excellent color palette setup with `oklch` color spaces, supporting seamless dark/light theme switching via `next-themes`.
2. **Schema-Driven Form Validation**: Clear separation of validation schemas using `zod` and `react-hook-form` across authentication workflows.
3. **Structured Redux Architecture**: Clean slice design for cart, auth, and real-time chat with immutable state reducers.
4. **WebSocket Synchronization**: Middleware effectively invalidates TanStack Query cache on real-time chat messages and notifications.
5. **Non-Blocking Toast System**: Consistent toast feedback with `sonner` for asynchronous actions.
6. **Headless UI Primitives**: Extensive use of Radix / Base UI primitives ensuring proper focus trapping and accessible dialog/dropdown behavior.

---

## 6. Prioritized Implementation Plan & TODO List

### Phase 1: Critical Stability & Crash Prevention (Day 1)
- [x] **1.1** Implement safe `getStoredJSON` helper in `authSlice.js` and `cartSlice.js` to protect against corrupted `localStorage`.
- [x] **1.2** Add null-safe optional chaining in `ProfilePage.jsx` for `userInfo.createdAt` and `userInfo.name`.
- [x] **1.3** Fix Redux auth destructuring in `ProductDetail.jsx` (`const { userInfo } = useSelector(...)`).
- [x] **1.4** Fix `formatCompact` division math in `Product.jsx` (`num / 1000`).
- [x] **1.5** Fix HTML prop typo `disable` → `disabled` in `CartSummary.jsx`.

### Phase 2: Accessibility & HTML Structure Remediation (Day 2)
- [x] **2.1** Refactor nested `<button>` inside `<Link>` using `buttonVariants` in `Header.jsx`, `HomeBanner.jsx`, and `OrderListPage.jsx`.
- [x] **2.2** Change card titles in `Product.jsx` from `<h1>` to `<h2>` or `<h3>`.
- [x] **2.3** Refactor `rating.jsx` with accessible `<button type="button" role="radio">` and keyboard event handlers.
- [x] **2.4** Add `aria-label` to all icon-only buttons (`ThemeToggle`, `WishlistIcon`, cart delete, admin edit/delete, chat toggle).
- [x] **2.5** Add `aria-label` / `<label>` to `Search.jsx`, `SelectSort.jsx`, and chat input.
- [x] **2.6** Add `scope="col"` and align header/column counts in `OrderListPage` and `UserListPage`.
- [x] **2.7** Add `autoComplete` attributes on all login, registration, and profile password/email fields.

### Phase 3: Performance & SEO Optimization (Day 3)
- [ ] **3.1** Implement `React.lazy()` and `<Suspense>` route splitting in `App.jsx`.
- [ ] **3.2** Set default `staleTime: 60000` in `queryClient.js` to prevent excessive background refetching.
- [ ] **3.3** Add missing `404 Not Found` catch-all route in `App.jsx`.
- [ ] **3.4** Populate meta description, Open Graph tags, and valid favicon in `index.html`.
- [ ] **3.5** Compress large PNG images (`screen.png`, `screenDark.png`) to WebP/AVIF format.
- [ ] **3.6** Add `loading="lazy"` and aspect-ratio reservation on product gallery and catalog images.

### Phase 4: Responsive UI & CSS Cleanup (Day 4)
- [ ] **4.1** Convert fixed grid columns in `ProfilePage.jsx` (wishlist & quick facts) to fluid responsive grids.
- [ ] **4.2** Convert `DashboardPage.jsx` bottom columns to `flex-col lg:flex-row`.
- [ ] **4.3** Enable `<SidebarTrigger />` in `AppLayoutAdmin.jsx` for mobile admin navigation.
- [ ] **4.4** Replace `h-screen` with `min-h-screen` in `AppLayout.jsx`.
- [ ] **4.5** Replace non-standard Tailwind classes (`w-100`, `h-95`, `h-15`, `mb-15`, `bg-grey-50`) with standard utilities.

### Phase 5: Error Handling, Resilience & Testing Setup (Day 5)
- [ ] **5.1** Create a top-level React `ErrorBoundary` component in `main.jsx`.
- [ ] **5.2** Create a centralized `getErrorMessage(err)` utility to safely parse Axios error responses.
- [ ] **5.3** Setup Vitest and React Testing Library; write unit tests for `cartUtils.js` (totals, discounts, taxes) and auth guard routing.

---
*Report generated automatically from code analysis according to Front-End Checklist Global.*
