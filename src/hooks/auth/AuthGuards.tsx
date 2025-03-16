
import { useEffect, ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "./useAuthContext";

// Component to verify authentication
export const RequireAuth = ({ children }: { children: ReactNode }) => {
  const { isAuthenticated } = useAuthContext();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);

  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
};

// Component to verify edit permissions
export const RequireEditor = ({ children }: { children: ReactNode }) => {
  const { canEdit, isAuthenticated } = useAuthContext();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    } else if (!canEdit) {
      navigate("/dashboard");
    }
  }, [canEdit, isAuthenticated, navigate]);

  if (!isAuthenticated || !canEdit) {
    return null;
  }

  return <>{children}</>;
};
