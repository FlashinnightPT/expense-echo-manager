
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/auth";
import { LoadingPage } from "@/components/ui/loading-spinner";

const Index = () => {
  const navigate = useNavigate();
  const { isAuthenticated, isInitialized } = useAuth();
  const [attempted, setAttempted] = useState(false);

  // Redirect based on authentication status
  useEffect(() => {
    console.log("Index: Auth state", { isAuthenticated, isInitialized, attempted });
    
    if (isInitialized && !attempted) {
      setAttempted(true);
      
      if (isAuthenticated) {
        console.log("Index: Redirecting to dashboard");
        navigate("/dashboard", { replace: true });
      } else {
        console.log("Index: Redirecting to login");
        navigate("/login", { replace: true });
      }
    }
  }, [isAuthenticated, navigate, isInitialized, attempted]);

  // Show loading while redirecting
  return <LoadingPage text="Carregando aplicação..." />;
};

export default Index;
