
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import LoginForm from "@/components/auth/LoginForm";
import { useAuth } from "@/hooks/auth";

const Login = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [isRedirecting, setIsRedirecting] = useState(false);

  useEffect(() => {
    // Verificar se o utilizador já está autenticado
    if (isAuthenticated) {
      setIsRedirecting(true);
      // Pequeno timeout para evitar navegação imediata e potenciais loops
      setTimeout(() => {
        navigate("/dashboard");
      }, 100);
    }
  }, [navigate, isAuthenticated]);

  useEffect(() => {
    // Verificar cache do navegador
    const currentUser = sessionStorage.getItem("current_user");
    if (currentUser) {
      setIsRedirecting(true);
      // Pequeno timeout para evitar navegação imediata
      setTimeout(() => {
        navigate("/dashboard");
      }, 100);
    }
  }, [navigate]);

  const handleLoginSuccess = () => {
    navigate("/dashboard");
  };

  if (isRedirecting) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-slate-100 dark:to-slate-900">
        <div className="text-center">
          <p className="text-xl">Redirecionando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-slate-100 dark:to-slate-900 p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Gestão Financeira</h1>
          <p className="text-muted-foreground mb-2">
            Aceda à sua conta para gerir as suas finanças
          </p>
          <p className="text-sm text-blue-500">
            Utilizador padrão: <strong>admin</strong> / Senha: <strong>admin123</strong>
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
