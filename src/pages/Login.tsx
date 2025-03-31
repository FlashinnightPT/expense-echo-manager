import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import LoginForm from "@/components/auth/LoginForm";
import { useAuth } from "@/hooks/auth";
import { LoadingPage } from "@/components/ui/loading-spinner";

const Login = () => {
  const navigate = useNavigate();
  const { isAuthenticated, isInitialized } = useAuth();
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [connectionError, setConnectionError] = useState(false);

  useEffect(() => {
    // Check API connection on component mount
    const checkConnection = async () => {
      try {
        const response = await fetch(import.meta.env.VITE_API_URL + '/ping', {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' }
        });
        
        setConnectionError(!response.ok);
      } catch (error) {
        console.error("API connection check failed:", error);
        setConnectionError(true);
      }
    };
    
    checkConnection();
    
    // Check if user is already authenticated and auth is initialized
    if (isInitialized && isAuthenticated && !isRedirecting) {
      console.log("Login: User is already authenticated, redirecting to dashboard");
      setIsRedirecting(true);
      // Use replace to avoid adding to history
      navigate("/dashboard", { replace: true });
    }
  }, [navigate, isAuthenticated, isInitialized, isRedirecting]);

  const handleLoginSuccess = () => {
    console.log("Login: Login success, redirecting to dashboard");
    setIsRedirecting(true);
    navigate("/dashboard", { replace: true });
  };

  // If auth is not initialized yet, show loading
  if (!isInitialized) {
    return <LoadingPage text="A carregar..." />;
  }

  if (isRedirecting) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-slate-100 dark:to-slate-900">
        <div className="text-center">
          <p className="text-xl">A redirecionar...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-slate-100 dark:to-slate-900 p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Gestão Financeira</h1>
          <p className="text-muted-foreground mb-4">
            Aceda à sua conta para gerir as suas finanças
          </p>
          
          {connectionError && (
            <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-4 dark:bg-yellow-900 dark:text-yellow-200">
              <p className="font-medium">Aviso: Sem conexão ao servidor</p>
              <p className="text-sm">A aplicação funcionará em modo offline com funcionalidades limitadas.</p>
            </div>
          )}
        </div>
        
        <LoginForm onLoginSuccess={handleLoginSuccess} />
        
        <div className="text-center mt-6">
          <p className="text-sm text-muted-foreground">
            Não tem acesso? Contacte o administrador do sistema.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
