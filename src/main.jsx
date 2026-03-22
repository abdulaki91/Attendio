import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "./context/AuthContext.jsx";

// 👇 Import the PWA service worker register helper
import { registerSW } from "virtual:pwa-register";

const queryClient = new QueryClient();

// 👇 Register the service worker
registerSW({
  onNeedRefresh() {},
  onOfflineReady() {
    console.log("App ready to work offline ✅");
  },
});

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <App />
      </AuthProvider>
    </QueryClientProvider>
  </StrictMode>
);
