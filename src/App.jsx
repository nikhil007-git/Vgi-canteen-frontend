import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { SocketProvider } from './context/SocketContext';
import { Navbar } from './components/Navbar';
import { BottomNav } from './components/BottomNav';
import { StatusBanner } from './components/StatusBanner';
import { LiveAlertToast } from './components/LiveAlertToast';
import { PageSkeleton } from './components/SkeletonLoader';

// Lazy loaded page components
const Landing = lazy(() => import('./pages/Landing').then((m) => ({ default: m.Landing })));
const Home = lazy(() => import('./pages/Home').then((m) => ({ default: m.Home })));
const Menu = lazy(() => import('./pages/Menu').then((m) => ({ default: m.Menu })));
const Cart = lazy(() => import('./pages/Cart').then((m) => ({ default: m.Cart })));
const Checkout = lazy(() => import('./pages/Checkout').then((m) => ({ default: m.Checkout })));
const OrderTracking = lazy(() => import('./pages/OrderTracking').then((m) => ({ default: m.OrderTracking })));
const OrderHistory = lazy(() => import('./pages/OrderHistory').then((m) => ({ default: m.OrderHistory })));
const Profile = lazy(() => import('./pages/Profile').then((m) => ({ default: m.Profile })));
const Login = lazy(() => import('./pages/Login').then((m) => ({ default: m.Login })));
const Register = lazy(() => import('./pages/Register').then((m) => ({ default: m.Register })));

// Admin Pages
const AdminLogin = lazy(() => import('./pages/admin/AdminLogin').then((m) => ({ default: m.AdminLogin })));
const AdminLayout = lazy(() => import('./components/AdminLayout').then((m) => ({ default: m.AdminLayout })));
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard').then((m) => ({ default: m.AdminDashboard })));
const AdminOrders = lazy(() => import('./pages/admin/AdminOrders').then((m) => ({ default: m.AdminOrders })));
const AdminMenu = lazy(() => import('./pages/admin/AdminMenu').then((m) => ({ default: m.AdminMenu })));
const AdminCoupons = lazy(() => import('./pages/admin/AdminCoupons').then((m) => ({ default: m.AdminCoupons })));
const AdminSettings = lazy(() => import('./pages/admin/AdminSettings').then((m) => ({ default: m.AdminSettings })));
const AdminReports = lazy(() => import('./pages/admin/AdminReports').then((m) => ({ default: m.AdminReports })));

// Protected Route Guard for logged in users
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();
  if (loading) return <PageSkeleton />;
  if (!user) return <Navigate to={`/login?redirect=${encodeURIComponent(location.pathname)}`} replace />;
  return children;
};

// Admin Route Guard: Redirects to /admin/login instead of kicking user to /home!
const AdminRoute = ({ children }) => {
  const { adminUser, isAdmin, loading } = useAuth();
  const location = useLocation();
  if (loading) return <PageSkeleton />;
  const hasAdminAccess = isAdmin || (adminUser && (adminUser.role === "ADMIN" || adminUser.role === "STAFF"));
  if (!hasAdminAccess) {
    const loginTarget = location.pathname.startsWith("/admin-secure-panel") ? "/admin-secure-panel/login" : "/admin/login";
    return <Navigate to={`${loginTarget}?redirect=${encodeURIComponent(location.pathname)}`} replace />;
  }
  return children;
};

const LayoutContainer = ({ children }) => {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin') || location.pathname.startsWith('/admin-secure-panel');
  const isLanding = location.pathname === '/';
  const isAuthPage = location.pathname === '/login' || location.pathname === '/register';

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      {!isAdminRoute && <Navbar />}
      {!isAdminRoute && !isLanding && !isAuthPage && <StatusBanner />}
      <LiveAlertToast />

      <main className="flex-1 flex flex-col">
        {children}
      </main>

      {!isAdminRoute && !isAuthPage && <BottomNav />}
    </div>
  );
};

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <SocketProvider>
            <LayoutContainer>
              <Suspense fallback={<PageSkeleton />}>
                <Routes>
                  {/* Public routes */}
                  <Route path="/" element={<Landing />} />
                  <Route path="/home" element={<Home />} />
                  <Route path="/menu" element={<Menu />} />
                  <Route path="/cart" element={<Cart />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />

                  {/* Direct Admin Access URLs */}
                  <Route path="/admin/login" element={<AdminLogin />} />
                  <Route path="/admin/access" element={<AdminLogin />} />
                  <Route path="/admin-secure-panel/login" element={<AdminLogin />} />
                  <Route path="/admin-secure-panel/access" element={<AdminLogin />} />

                  {/* Customer protected routes */}
                  <Route
                    path="/checkout"
                    element={
                      <ProtectedRoute>
                        <Checkout />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/orders/:id"
                    element={
                      <ProtectedRoute>
                        <OrderTracking />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/orders"
                    element={
                      <ProtectedRoute>
                        <OrderHistory />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/profile"
                    element={
                      <ProtectedRoute>
                        <Profile />
                      </ProtectedRoute>
                    }
                  />

                  {/* Admin Protected Operations */}
                  <Route
                    path="/admin-secure-panel"
                    element={
                      <AdminRoute>
                        <AdminLayout />
                      </AdminRoute>
                    }
                  >
                    <Route index element={<AdminDashboard />} />
                    <Route path="orders" element={<AdminOrders />} />
                    <Route path="menu" element={<AdminMenu />} />
                    <Route path="coupons" element={<AdminCoupons />} />
                    <Route path="settings" element={<AdminSettings />} />
                    <Route path="reports" element={<AdminReports />} />
                  </Route>

                  <Route
                    path="/admin"
                    element={
                      <AdminRoute>
                        <AdminLayout />
                      </AdminRoute>
                    }
                  >
                    <Route index element={<AdminDashboard />} />
                    <Route path="orders" element={<AdminOrders />} />
                    <Route path="menu" element={<AdminMenu />} />
                    <Route path="coupons" element={<AdminCoupons />} />
                    <Route path="settings" element={<AdminSettings />} />
                    <Route path="reports" element={<AdminReports />} />
                  </Route>

                  {/* Catch-all fallback */}
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </Suspense>
            </LayoutContainer>
          </SocketProvider>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
