import { ReactNode, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { useAuth } from "../hooks/useAuth";

interface ProtectedRouteProps {
  children: ReactNode;
}

/**
 * Wrapper component that protects routes requiring authentication
 */
export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    console.log("ProtectedRoute State:", { isLoading, isAuthenticated, path: window.location.pathname });
    if (!isLoading && !isAuthenticated) {
      console.log("Redirecting to login from ProtectedRoute");
      // Redirect to home with login trigger and return URL
      const returnUrl = encodeURIComponent(window.location.pathname + window.location.search);
      navigate(`/?login=true&returnUrl=${returnUrl}`, { replace: true });
    }
  }, [isAuthenticated, isLoading, navigate]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
};
