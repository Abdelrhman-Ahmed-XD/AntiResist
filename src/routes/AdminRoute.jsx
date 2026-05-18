import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function AdminRoute() {
  const { isAdmin, loading } = useAuth();
  if (loading) return null;
  return isAdmin ? <Outlet /> : <Navigate to="/" replace />;
}
