import { Navigate, Outlet, useLocation } from "react-router-dom";
import * as storage from "../auth/storage.js";
import { useAuth } from "../context/AuthContext.jsx";

/**
 * Allows rendering when refresh failed and re-login modal is open (tokens cleared, user still on page).
 */
export function ProtectedRoute() {
  const location = useLocation();
  const { reloginOpen } = useAuth();
  const token = storage.getAccessToken();

  if (!token && !reloginOpen) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return <Outlet />;
}
