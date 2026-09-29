import React from "react";
import ReactDOM from "react-dom/client";
import { ClerkProvider } from "@clerk/clerk-react";
import App from "./App.jsx";
import { ErrorBoundary } from "./components/ErrorBoundary";
import "./index.css";

// Auto-reload on Vite chunk fetch error (deployment updates)
window.addEventListener('vite:preloadError', (event) => {
  console.warn('Vite preload error detected, reloading to fetch latest assets...', event);
  const reloaded = sessionStorage.getItem('vite_preload_reloaded');
  if (!reloaded) {
    sessionStorage.setItem('vite_preload_reloaded', Date.now().toString());
    window.location.reload();
  }
});

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY || "pk_test_bW9kZXJuLXBob2VuaXgtMjgyNi5jbGVyay5hY2NvdW50cy5kZXYk";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ErrorBoundary>
      <ClerkProvider
        publishableKey={PUBLISHABLE_KEY}
        afterSignOutUrl="/home"
        appearance={{
          layout: {
            unsafe_disableDevelopmentModeWarnings: true
          },
          elements: {
            captcha: "hidden",
            captchaElement: "hidden"
          }
        }}
      >
        <App />
      </ClerkProvider>
    </ErrorBoundary>
  </React.StrictMode>
);
