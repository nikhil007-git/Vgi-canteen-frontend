import React, { createContext, useContext, useState, useEffect } from 'react';
import { useUser, useAuth as useClerkAuth, useClerk } from '@clerk/clerk-react';
import { vgiApi } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  // Clerk State (for Customers / Students)
  const { isLoaded: clerkLoaded, isSignedIn, user: clerkUser } = useUser();
  const { getToken: getClerkToken } = useClerkAuth();
  const { signOut: clerkSignOut } = useClerk();

  // Admin State (Custom JWT for /admin/login — untouched)
  const [adminUser, setAdminUser] = useState(null);
  const [adminToken, setAdminToken] = useState(localStorage.getItem('vgi_admin_token'));
  const [adminLoading, setAdminLoading] = useState(true);

  // Synced User record from Neon DB
  const [dbUser, setDbUser] = useState(null);
  const [syncing, setSyncing] = useState(false);
  const [syncedId, setSyncedId] = useState(null);

  // 1. Load Admin session if exists
  useEffect(() => {
    const loadAdmin = async () => {
      if (adminToken) {
        try {
          const res = await vgiApi.getMe();
          if (res.success && (res.user?.role === 'ADMIN' || res.user?.role === 'STAFF')) {
            setAdminUser(res.user);
          } else {
            adminLogout();
          }
        } catch {
          adminLogout();
        }
      }
      setAdminLoading(false);
    };
    loadAdmin();
  }, [adminToken]);

  // 2. Synchronize Clerk customer with Backend & Neon DB
  useEffect(() => {
    const syncClerkUser = async () => {
      if (!clerkLoaded || !isSignedIn || !clerkUser || syncedId === clerkUser.id || syncing) {
        return;
      }

      setSyncing(true);
      try {
        let token = null;
        try {
          token = await getClerkToken();
        } catch (e) {
          // Token error fallback
        }

        const primaryEmail = clerkUser.primaryEmailAddress?.emailAddress || '';
        const name = clerkUser.fullName || clerkUser.firstName || primaryEmail.split('@')[0] || 'Student';
        const phone = clerkUser.primaryPhoneNumber?.phoneNumber || null;

        const backendUrl = import.meta.env.VITE_API_URL 
          ? import.meta.env.VITE_API_URL.replace('/api', '') 
          : 'http://localhost:5001';

        const res = await fetch(`${backendUrl}/api/auth/sync-clerk`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(token ? { 'Authorization': `Bearer ${token}` } : {})
          },
          body: JSON.stringify({
            clerkId: clerkUser.id,
            email: primaryEmail,
            name,
            phone,
            imageUrl: clerkUser.imageUrl
          })
        });

        const data = await res.json();
        if (data.success && data.user) {
          setDbUser(data.user);
                  if (data.token) {
          localStorage.setItem("vgi_token", data.token);
        }
        } else {
          // Fallback user object
          setDbUser({
            id: clerkUser.id,
            name,
            email: primaryEmail,
            role: 'STUDENT',
            phone,
            imageUrl: clerkUser.imageUrl
          });
        }
        setSyncedId(clerkUser.id);
      } catch (err) {
        console.error('Failed to sync Clerk user with DB:', err);
        setDbUser({
          id: clerkUser.id,
          name: clerkUser.fullName || 'Student',
          email: clerkUser.primaryEmailAddress?.emailAddress || '',
          role: 'STUDENT'
        });
      } finally {
        setSyncing(false);
      }
    };

    syncClerkUser();
  }, [clerkLoaded, isSignedIn, clerkUser, syncedId, syncing, getClerkToken]);

  // Handle Clerk sign out
  useEffect(() => {
    if (clerkLoaded && !isSignedIn) {
      setDbUser(null);
      setSyncedId(null);
      localStorage.removeItem('vgi_token');
    }
  }, [clerkLoaded, isSignedIn]);

  // Admin credentials login
  const login = async (identifierOrEmail, password) => {
    const res = await vgiApi.login({
      email: identifierOrEmail,
      username: identifierOrEmail,
      identifier: identifierOrEmail,
      password
    });
    if (res.success && res.token) {
      localStorage.setItem('vgi_admin_token', res.token);
      localStorage.setItem('vgi_token', res.token);
      setAdminToken(res.token);
      setAdminUser(res.user);
      return res;
    }
    throw new Error(res.message || 'Login failed');
  };

  const adminLogout = () => {
    localStorage.removeItem('vgi_admin_token');
    localStorage.removeItem('vgi_token');
    setAdminToken(null);
    setAdminUser(null);
  };

  // Sign out handler
  // Sign out handler
  // Sign out handler
  const logout = async () => {
    localStorage.removeItem("vgi_admin_token");
    localStorage.removeItem("vgi_token");
    setAdminToken(null);
    setAdminUser(null);
    setDbUser(null);
    setSyncedId(null);
    if (isSignedIn) {
      try {
        await clerkSignOut();
      } catch (e) {}
    }
    window.location.href = "/login";
  };

  const updateUser = (updatedUserData) => {
    if (adminUser) {
      setAdminUser((prev) => ({ ...prev, ...updatedUserData }));
    } else {
      setDbUser((prev) => ({ ...prev, ...updatedUserData }));
    }
  };

  // Resolve current active user: Clerk student takes precedence if signed in, else adminUser
  const user = (isSignedIn && clerkUser)
    ? {
        id: clerkUser.id,
        name: clerkUser.fullName || clerkUser.firstName || dbUser?.name || "Student",
        email: clerkUser.primaryEmailAddress?.emailAddress || dbUser?.email || "",
        imageUrl: clerkUser.imageUrl || dbUser?.imageUrl || null,
        phone: clerkUser.primaryPhoneNumber?.phoneNumber || dbUser?.phone || "",
        role: (dbUser && (dbUser.role === "ADMIN" || dbUser.role === "STAFF")) ? dbUser.role : "STUDENT"
      }
    : adminUser;

  const isAdmin = Boolean(
    (adminUser && (adminUser.role === "ADMIN" || adminUser.role === "STAFF")) ||
    (user && (user.role === "ADMIN" || user.role === "STAFF"))
  );
  const loading = adminLoading || (!clerkLoaded && !adminUser);
  const token = adminToken || localStorage.getItem('vgi_token');

  return (
    <AuthContext.Provider
      value={{
        user,
        adminUser,
        token,
        adminToken,
        loading,
        login,
        logout,
        adminLogout,
        updateUser,
        isAdmin,
        isClerkUser: Boolean(isSignedIn && clerkUser)
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
