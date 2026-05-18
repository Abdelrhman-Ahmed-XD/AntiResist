import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./routes/ProtectedRoute";
import AdminRoute from "./routes/AdminRoute";

import Home from "./pages/Home";
import SupportWall from "./pages/SupportWall";
import JoinMovement from "./pages/JoinMovement";
import SignIn from "./pages/SignIn";
import Profile from "./pages/Profile";
import EditProfile from "./pages/EditProfile";
import AboutUs from "./pages/AboutUs";
import Dashboard from "./pages/admin/Dashboard";

import "./index.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthProvider>
      <BrowserRouter>
        <Toaster position="top-right" />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/support-wall" element={<SupportWall />} />
          <Route path="/join" element={<JoinMovement />} />
          <Route path="/sign-in" element={<SignIn />} />
          <Route path="/profile/:uid" element={<Profile />} />
          <Route path="/about" element={<AboutUs />} />

          <Route element={<ProtectedRoute />}>
            <Route path="/profile/edit" element={<EditProfile />} />
          </Route>

          <Route element={<AdminRoute />}>
            <Route path="/admin" element={<Dashboard />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  </StrictMode>
);
