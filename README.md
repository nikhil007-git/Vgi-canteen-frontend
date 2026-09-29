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

## 📂 Project Structure

```
frontend/
├── public/                 # Static assets
├── src/
│   ├── components/         # Reusable UI components
│   │   ├── AdminLayout.jsx     # Admin sidebar and shell
│   │   ├── BottomNav.jsx       # Mobile bottom navigation bar
│   │   ├── CartDrawer.jsx      # Slide-over cart side panel
│   │   ├── FoodCard.jsx        # Menu item card with add button
│   │   ├── FoodDetailModal.jsx # Customization modal (options/instructions)
│   │   ├── LiveAlertToast.jsx  # Floating real-time alert toast
│   │   ├── Navbar.jsx          # Desktop header with cart badge
│   │   ├── OrderTimeline.jsx   # Visual status progression tracker
│   │   ├── QRDisplay.jsx       # Digital counter pickup QR pass
│   │   ├── QRScannerModal.jsx  # Staff camera QR code scanner
│   │   ├── RatingModal.jsx     # Order rating and feedback dialog
│   │   ├── SkeletonLoader.jsx  # Shimmer loading placeholders
│   │   └── StatusBanner.jsx    # Real-time connection status banner
│   ├── context/            # React Context providers
│   │   ├── AuthContext.jsx     # User authentication & permissions
│   │   ├── CartContext.jsx     # Cart state, drawer toggle & pricing
│   │   └── SocketContext.jsx   # WebSocket connection & real-time events
│   ├── pages/              # Route views
│   │   ├── Home.jsx            # Featured items & campus highlights
│   │   ├── Menu.jsx            # Category filter, search & food catalog
│   │   ├── Cart.jsx            # Auto-redirect to side-panel cart
│   │   ├── Checkout.jsx        # Pickup details & Razorpay payment
│   │   ├── OrderTracking.jsx   # Live order token & status timeline
│   │   ├── OrderHistory.jsx    # Previous orders & 1-click reorder
│   │   ├── Profile.jsx         # User account details & settings
│   │   ├── Landing.jsx         # Welcome landing page
│   │   ├── Login.jsx           # Student login
│   │   ├── Register.jsx        # Student registration
│   │   └── admin/              # Admin dashboard pages
│   │       ├── AdminDashboard.jsx  # KPI metrics & quick stats
│   │       ├── AdminOrders.jsx     # Live kitchen order management
│   │       ├── AdminMenu.jsx       # Item editor & availability toggle
│   │       ├── AdminCoupons.jsx    # Promo code generator
│   │       ├── AdminSettings.jsx   # Canteen operational controls
│   │       └── AdminReports.jsx    # Sales analytics & revenue reports
│   ├── services/
│   │   └── api.js          # Centralized API fetch wrapper with token injection
│   ├── utils/
│   │   └── audioAlert.js   # Web Audio synthesized ready chime
│   ├── App.jsx             # Main routing configuration
│   ├── main.jsx            # Application entry point with ClerkProvider
│   └── index.css           # Tailwind base styles and animations
├── index.html              # HTML shell
├── tailwind.config.js      # Tailwind configuration and theme colors
├── vercel.json             # Vercel SPA route rewrite rules
└── package.json            # Dependencies and scripts
```

---

## 💻 Local Development Setup

### Prerequisites
- **Node.js** (v18 or newer)
- **npm** or **pnpm** / **yarn**

### 1. Clone & Install Dependencies
```bash
git clone https://github.com/nikhil007-git/Vgi-canteen-frontend.git
cd Vgi-canteen-frontend
npm install
```

### 2. Configure Environment Variables
Create a `.env` file in the root of the frontend folder:
```env
# URL where your backend server is running
VITE_API_URL=http://localhost:5000/api

# Realtime WebSocket URL (optional, automatically derived from VITE_API_URL)
VITE_SOCKET_URL=http://localhost:5000

# Razorpay Key ID (Use rzp_test_placeholder_key for demo sandbox)
VITE_RAZORPAY_KEY_ID=rzp_test_placeholder_key

# Clerk Publishable Key (for Student Authentication)
VITE_CLERK_PUBLISHABLE_KEY=pk_test_placeholder
```

### 3. Start Development Server
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

### 4. Build for Production
```bash
npm run build
```
The compiled output will be generated in the `dist/` directory.

---

## 🚀 Deploying on Vercel

1. Push your code to your GitHub repository: [Vgi-canteen-frontend](https://github.com/nikhil007-git/Vgi-canteen-frontend).
2. Go to the [Vercel Dashboard](https://vercel.com/dashboard) and click **Add New... > Project**.
3. Import your **`Vgi-canteen-frontend`** repository.
4. Configure Project Settings:
   - **Framework Preset**: `Vite`
   - **Root Directory**: `./` (Default)
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
5. Add **Environment Variables**:
   - `VITE_API_URL`: Your deployed Render backend URL (e.g. `https://vgi-canteen-backend.onrender.com`)
   - `VITE_CLERK_PUBLISHABLE_KEY`: Your Clerk publishable key (`pk_test_...`)
   - `VITE_RAZORPAY_KEY_ID`: Your Razorpay key ID (`rzp_test_...` or live key)
6. Click **Deploy**. Vercel will automatically build and publish your frontend with global CDN acceleration and SSL.

---

## 🔗 Related Repositories

- **Backend API & Realtime Server**: [Vgi-canteen-backend](https://github.com/nikhil007-git/Vgi-canteen-backend)
