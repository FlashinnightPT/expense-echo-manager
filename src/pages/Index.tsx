
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/auth";
import { LoadingPage } from "@/components/ui/loading-spinner";

const Index = () => {
  const navigate = useNavigate();
  const { isAuthenticated, isInitialized } = useAuth();

  // Redirect based on authentication status
  useEffect(() => {
    if (isInitialized) {
      if (isAuthenticated) {
        navigate("/dashboard");
      } else {
        navigate("/login");
      }
    }
  }, [isAuthenticated, navigate, isInitialized]);

  // Show loading while redirecting
  return <LoadingPage text="Carregando aplicação..." />;
};

export default Index;
