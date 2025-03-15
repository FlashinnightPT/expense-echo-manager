
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import LoginForm from "@/components/auth/LoginForm";

const Login = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Verificar se o utilizador já está autenticado
    const currentUser = sessionStorage.getItem("current_user");
    if (currentUser) {
      setIsLoggedIn(true);
      navigate("/dashboard");
    }
  }, [navigate]);

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-slate-100 dark:to-slate-900 p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Gestão Financeira</h1>
          <p className="text-muted-foreground">
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
