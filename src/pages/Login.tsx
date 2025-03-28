
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import LoginForm from "@/components/auth/LoginForm";
import { useAuth } from "@/hooks/auth";
import { LoadingPage } from "@/components/ui/loading-spinner";

const Login = () => {
  const navigate = useNavigate();
  const { isAuthenticated, isInitialized } = useAuth();
  const [isRedirecting, setIsRedirecting] = useState(false);

  useEffect(() => {
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
