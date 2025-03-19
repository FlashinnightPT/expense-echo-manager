
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/auth";
import { LoadingPage } from "@/components/ui/loading-spinner";

const Index = () => {
  const navigate = useNavigate();
  const { isAuthenticated, isInitialized } = useAuth();

  // Redirect based on authentication status
  useEffect(() => {
    console.log("Index: Auth state", { isAuthenticated, isInitialized });
    
    if (isInitialized) {
      if (isAuthenticated) {
        console.log("Index: Redirecting to dashboard");
        navigate("/dashboard");
      } else {
        console.log("Index: Redirecting to login");
        navigate("/login");
      }
    }
  }, [isAuthenticated, navigate, isInitialized]);

  // Show loading while redirecting
  return <LoadingPage text="Carregando aplicação..." />;
};

export default Index;
