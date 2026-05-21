import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "./context/AuthContext";
import AnimatedRoutes from "./components/layout/AnimatedRoutes";

import "./index.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthProvider>
      <BrowserRouter>
        <Toaster position="top-right" />
        <AnimatedRoutes />
      </BrowserRouter>
    </AuthProvider>
  </StrictMode>
);
