import { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

const ProtectedRoute = ({ children }: { children: ReactNode }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  if (!user) return <Navigate to="/auth" replace />;

  return <>{children}</>;
};

export default ProtectedRoute;
