import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/auth";
import { LoadingPage } from "@/components/ui/loading-spinner";
import { toast } from "sonner";

const Index = () => {
  const navigate = useNavigate();
  const { isAuthenticated, isInitialized } = useAuth();
  const [redirected, setRedirected] = useState(false);
  const [apiAvailable, setApiAvailable] = useState<boolean | null>(null);
  
  // Check API availability
  useEffect(() => {
    const checkApi = async () => {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout
        
        const response = await fetch(import.meta.env.VITE_API_URL + '/ping', {
          signal: controller.signal
        });
        
        clearTimeout(timeoutId);
        setApiAvailable(response.ok);
        
        if (!response.ok) {
          toast.warning("API server is unavailable. Some features may be limited.");
        }
      } catch (error) {
        console.error("API connection error:", error);
        setApiAvailable(false);
        toast.warning("Could not connect to server. Running in offline mode.");
      }
    };
    
    checkApi();
  }, []);
  
  // Redirect based on authentication status
  useEffect(() => {
    console.log("Index: Auth state", { isAuthenticated, isInitialized, redirected, apiAvailable });
    
    // Only redirect once the auth is initialized and we haven't redirected yet
    if (isInitialized && !redirected && apiAvailable !== null) {
      setRedirected(true); // Prevent multiple redirects
      
      if (isAuthenticated) {
        console.log("Index: Redirecting to dashboard");
        // Use replace to avoid building up history stack
        navigate("/dashboard", { replace: true });
      } else {
        console.log("Index: Redirecting to login");
        // Use replace to avoid building up history stack
        navigate("/login", { replace: true });
      }
    }
  }, [isAuthenticated, isInitialized, navigate, redirected, apiAvailable]);

  if (!isInitialized || apiAvailable === null) {
    return <LoadingPage text="Inicializando aplicação..." />;
  }

  // This ensures we show loading until redirection completes
  return <LoadingPage text="Carregando aplicação..." />;
};

export default Index;
