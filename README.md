# 🍕 VGI Canteen — Frontend

[![React](https://img.shields.io/badge/React-18.3-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-6.2-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Vercel](https://img.shields.io/badge/Deploy-Vercel-black?logo=vercel&logoColor=white)](https://vercel.com/)
[![Socket.io](https://img.shields.io/badge/Socket.io-4.8-010101?logo=socketdotio&logoColor=white)](https://socket.io/)

> Modern, responsive client web application for **Vishveshwarya Group of Institutions (VGI)** Campus Canteen. Built with **React 18**, **Vite**, **Tailwind CSS**, and **Socket.io Client** for real-time food ordering, counter pickup tokens, and kitchen order tracking.

---

## 🌟 Key Features

- **📱 Mobile-First & Responsive Experience**: Seamless adaptive layout with a top navigation bar on desktop and bottom navigation bar on mobile.
- **🛒 Interactive Slide-over Cart Panel**:
  - Opens as a smooth side-panel drawer without navigating away from the current page.
  - Increment/decrement item quantities or remove items instantly.
  - Supports custom food options (size, extra toppings) and special cooking instructions.
  - Live coupon application and dynamic total price calculation.
- **⚡ Live Order Tracking & Audio Chimes**:
  - Real-time order progress timeline (`PLACED` ➔ `PREPARING` ➔ `READY` ➔ `COMPLETED`).
  - Web Audio API notification sounds when an order is ready for counter pickup.
  - Digital counter token & animated QR code verification pass.
- **💳 Seamless Checkout**:
  - Integrated Razorpay online payment (UPI, Cards, NetBanking) with automated sandbox testing mode.
  - Phone number verification for pickup notifications.
- **🔐 Authentication**:
  - Clerk-powered student sign-in / sign-up with email and Google OAuth.
  - Secure Admin & Staff authentication with role-based routing.
- **👨‍🍳 Full Admin Portal**:
  - **Live Kitchen Queue**: Real-time order acceptance, status transitions, and counter readiness.
  - **Camera QR Scanner**: Verify and complete orders by scanning customer pickup QR codes.
  - **Menu Management**: Add, edit, toggle availability, mark items sold out, and upload food photos.
  - **Discount Coupons**: Create, manage, and toggle campus promo codes.
  - **Sales Analytics**: Revenue, order volume, and popular item charts.

---

## 🛠️ Tech Stack

| Technology | Purpose |
| --- | --- |
| **React 18** | UI component architecture with hooks and Context API |
| **Vite 6** | Ultra-fast build tool and local development server |
| **Tailwind CSS** | Modern utility-first styling with custom campus theme |
| **React Router v6** | Client-side routing with lazy loading and code splitting |
| **Lucide React** | Clean, consistent icons across the application |
| **Socket.io Client** | Real-time WebSocket connection to backend |
| **Clerk React** | Customer authentication & session management |
| **HTML5-QRCode** | In-browser camera QR code scanner for counter staff |
| **Canvas Confetti** | Celebration visual effects on order placement |

---

## 💻 Local Development Setup

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment Variables
Create a `.env` file in the root of the frontend folder:
```env
VITE_API_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000
VITE_RAZORPAY_KEY_ID=rzp_test_placeholder_key
VITE_CLERK_PUBLISHABLE_KEY=pk_test_bW9kZXJuLXBob2VuaXgtMjgyNi5jbGVyay5hY2NvdW50cy5kZXYk
```

### 3. Start Development Server
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 🚀 Deploying on Vercel

1. Push your code to your GitHub repository: [Vgi-canteen-frontend](https://github.com/nikhil007-git/Vgi-canteen-frontend).
2. Go to the [Vercel Dashboard](https://vercel.com/dashboard) and click **Add New... > Project**.
3. Import your **`Vgi-canteen-frontend`** repository.
4. Add **Environment Variables**:
   - `VITE_API_URL`: Your deployed Render backend URL (e.g. `https://vgi-canteen-backend.onrender.com/api`)
   - `VITE_CLERK_PUBLISHABLE_KEY`: `pk_test_bW9kZXJuLXBob2VuaXgtMjgyNi5jbGVyay5hY2NvdW50cy5kZXYk`
   - `VITE_RAZORPAY_KEY_ID`: `rzp_test_placeholder_key`
5. Click **Deploy**.

---

## 🔗 Related Repositories

- **Backend API & Realtime Server**: [Vgi-canteen-backend](https://github.com/nikhil007-git/Vgi-canteen-backend)
