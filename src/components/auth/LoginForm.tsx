import React, { useState, useEffect } from "react";
import { Eye, EyeOff, LogIn, User, Lock, Check, X } from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui-custom/Card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/auth";
import { UserService } from "@/services/api/UserService";

interface LoginFormProps {
  onLoginSuccess?: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onLoginSuccess }) => {
  const navigate = useNavigate();
  const { login, validatePassword } = useAuth();
  const [form, setForm] = useState({
    username: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isFirstLogin, setIsFirstLogin] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordErrors, setPasswordErrors] = useState<string[]>([]);
  const [passwordValid, setPasswordValid] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const initializeUsers = async () => {
      try {
        await UserService.initializeDefaultAdmin();
        
        const users = await UserService.getUsers();
        if (users.length === 1 && users[0].username === "admin") {
          setForm({
            username: "admin",
            password: "admin123",
          });
          
          toast.info("Utilizador administrador criado automaticamente. Username: admin / Senha: admin123");
        }
        
        setIsInitialized(true);
      } catch (error) {
        console.error("Erro ao inicializar utilizadores:", error);
        setIsInitialized(true);
      }
    };
    
    initializeUsers();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      if (!form.username || !form.password) {
        toast.error("Por favor, preencha todos os campos");
        return;
      }

      const user = await UserService.getUserByUsername(form.username);
      
      if (!user) {
        toast.error("Utilizador não encontrado");
        return;
      }
      
      if (user.username === "admin" && form.password === "admin123") {
        const success = await login(form.username, form.password);
        
        if (success) {
          toast.success("Login realizado com sucesso");
          
          if (onLoginSuccess) {
            onLoginSuccess();
          } else {
            navigate("/dashboard");
          }
        }
        return;
      }
      
      if (form.password === "temp123") {
        setIsFirstLogin(true);
        toast.info("Por favor, altere a sua senha");
        return;
      }

      const success = await login(form.username, form.password);
      if (success) {
        toast.success("Login realizado com sucesso");
        
        if (onLoginSuccess) {
          onLoginSuccess();
        } else {
          navigate("/dashboard");
        }
      } else {
        toast.error("Credenciais inválidas");
      }
    } catch (error) {
      console.error("Erro ao fazer login:", error);
      toast.error("Ocorreu um erro ao tentar fazer login");
    } finally {
      setIsLoading(false);
    }
  };

  const validateNewPassword = (password: string) => {
    const validation = validatePassword(password);
    setPasswordErrors(validation.errors);
    setPasswordValid(validation.isValid);
    return validation.isValid;
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      if (newPassword !== confirmPassword) {
        toast.error("As senhas não coincidem");
        return;
      }
      
      if (!validateNewPassword(newPassword)) {
        return;
      }

      const user = await UserService.getUserByUsername(form.username);
      
      if (!user) {
        toast.error("Utilizador não encontrado");
        return;
      }
      
      await UserService.updateUser({
        id: user.id,
        password: newPassword,
        status: "active"
      });
      
      toast.success("Senha alterada com sucesso");
      setIsFirstLogin(false);
      
      const success = await login(form.username, newPassword);
      
      if (success) {
        if (onLoginSuccess) {
          onLoginSuccess();
        } else {
          navigate("/dashboard");
        }
      }
    } catch (error) {
      console.error("Erro ao alterar senha:", error);
      toast.error("Ocorreu um erro ao tentar alterar a senha");
    } finally {
      setIsLoading(false);
    }
  };

  const handleNewPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setNewPassword(value);
    validateNewPassword(value);
  };

  if (!isInitialized) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardContent className="flex items-center justify-center py-10">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">A inicializar o sistema de autenticação...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (isFirstLogin) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle>Alteração de Senha</CardTitle>
          <CardDescription>
            Esta é a sua primeira vez a aceder à aplicação, por favor altere a sua senha.
          </CardDescription>
        </CardHeader>
        <form onSubmit={handlePasswordChange}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="newPassword">Nova Senha</Label>
              <div className="relative">
                <Input
                  id="newPassword"
                  name="newPassword"
                  type={showPassword ? "text" : "password"}
                  value={newPassword}
                  onChange={handleNewPasswordChange}
                  placeholder="Nova senha"
                  className="pr-10 pl-10"
                />
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                  onClick={togglePasswordVisibility}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-gray-400" />
                  ) : (
                    <Eye className="h-4 w-4 text-gray-400" />
                  )}
                </button>
              </div>
              
              <div className="space-y-1 mt-2 text-sm">
                <p className="font-medium text-gray-700 dark:text-gray-300">A senha deve conter:</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-1">
                  <div className="flex items-center">
                    {newPassword.length >= 8 ? (
                      <Check className="h-4 w-4 text-green-500 mr-1" />
                    ) : (
                      <X className="h-4 w-4 text-red-500 mr-1" />
                    )}
                    <span className={newPassword.length >= 8 ? "text-green-500" : "text-red-500"}>
                      Mínimo 8 caracteres
                    </span>
                  </div>
                  <div className="flex items-center">
                    {(newPassword.match(/[a-zA-Z]/g) || []).length >= 2 ? (
                      <Check className="h-4 w-4 text-green-500 mr-1" />
                    ) : (
                      <X className="h-4 w-4 text-red-500 mr-1" />
                    )}
                    <span className={(newPassword.match(/[a-zA-Z]/g) || []).length >= 2 ? "text-green-500" : "text-red-500"}>
                      Mínimo 2 letras
                    </span>
                  </div>
                  <div className="flex items-center">
                    {newPassword.match(/[A-Z]/) ? (
                      <Check className="h-4 w-4 text-green-500 mr-1" />
                    ) : (
                      <X className="h-4 w-4 text-red-500 mr-1" />
                    )}
                    <span className={newPassword.match(/[A-Z]/) ? "text-green-500" : "text-red-500"}>
                      1 letra maiúscula
                    </span>
                  </div>
                  <div className="flex items-center">
                    {newPassword.match(/[a-z]/) ? (
                      <Check className="h-4 w-4 text-green-500 mr-1" />
                    ) : (
                      <X className="h-4 w-4 text-red-500 mr-1" />
                    )}
                    <span className={newPassword.match(/[a-z]/) ? "text-green-500" : "text-red-500"}>
                      1 letra minúscula
                    </span>
                  </div>
                  <div className="flex items-center">
                    {(newPassword.match(/[0-9]/g) || []).length >= 2 ? (
                      <Check className="h-4 w-4 text-green-500 mr-1" />
                    ) : (
                      <X className="h-4 w-4 text-red-500 mr-1" />
                    )}
                    <span className={(newPassword.match(/[0-9]/g) || []).length >= 2 ? "text-green-500" : "text-red-500"}>
                      Mínimo 2 números
                    </span>
                  </div>
                  <div className="flex items-center">
                    {newPassword.match(/[!€@.*]/) ? (
                      <Check className="h-4 w-4 text-green-500 mr-1" />
                    ) : (
                      <X className="h-4 w-4 text-red-500 mr-1" />
                    )}
                    <span className={newPassword.match(/[!€@.*]/) ? "text-green-500" : "text-red-500"}>
                      1 caracter especial (!,€,@,.,*)
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirmar Senha</Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirme a nova senha"
                  className="pr-10 pl-10"
                />
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              </div>
              {newPassword && confirmPassword && newPassword !== confirmPassword && (
                <p className="text-sm text-red-500">As senhas não coincidem</p>
              )}
            </div>
          </CardContent>
          <CardFooter>
            <Button 
              type="submit" 
              className="w-full"
              disabled={!passwordValid || newPassword !== confirmPassword || isLoading}
            >
              {isLoading ? "A processar..." : "Confirmar Alteração"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Aceder à Aplicação</CardTitle>
        <CardDescription>
          Insira as suas credenciais para aceder à aplicação
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleLogin}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="username">Nome de Utilizador</Label>
            <div className="relative">
              <Input
                id="username"
                name="username"
                type="text"
                value={form.username}
                onChange={handleChange}
                placeholder="username"
                className="pl-10"
              />
              <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Senha</Label>
            <div className="relative">
              <Input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                value={form.password}
                onChange={handleChange}
                placeholder="Sua senha"
                className="pr-10 pl-10"
              />
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2"
                onClick={togglePasswordVisibility}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4 text-gray-400" />
                ) : (
                  <Eye className="h-4 w-4 text-gray-400" />
                )}
              </button>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button 
            type="submit" 
            className="w-full"
            disabled={isLoading}
          >
            {isLoading ? "A processar..." : (
              <>
                <LogIn className="h-4 w-4 mr-2" />
                Entrar
              </>
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default LoginForm;
