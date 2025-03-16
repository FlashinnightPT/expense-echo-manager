
import React, { useState, useEffect } from "react";
import { Eye, EyeOff, LogIn, User, Lock, Check, X } from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui-custom/Card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/auth";

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

  useEffect(() => {
    const savedUsers = localStorage.getItem("app_users");
    const users = savedUsers ? JSON.parse(savedUsers) : [];
    
    if (users.length === 0) {
      const defaultAdmin = {
        id: "1",
        name: "Administrador",
        username: "admin",
        role: "editor",
        status: "active",
        lastLogin: new Date().toISOString()
      };
      
      localStorage.setItem("app_users", JSON.stringify([defaultAdmin]));
      
      setForm({
        username: "admin",
        password: "admin123",
      });
      
      toast.info("Utilizador administrador criado automaticamente. Username: admin / Senha: admin123");
    }
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
    
    if (!form.username || !form.password) {
      toast.error("Por favor, preencha todos os campos");
      return;
    }

    const savedUsers = localStorage.getItem("app_users");
    const users = savedUsers ? JSON.parse(savedUsers) : [];
    
    // Se não houver usuários, criar o administrador padrão
    if (users.length === 0) {
      const defaultAdmin = {
        id: "1",
        name: "Administrador",
        username: "admin",
        role: "editor",
        status: "active",
        lastLogin: new Date().toISOString()
      };
      
      localStorage.setItem("app_users", JSON.stringify([defaultAdmin]));
      users.push(defaultAdmin);
      
      toast.info("Utilizador administrador criado automaticamente");
    }
    
    const user = users.find((u: any) => u.username === form.username);
    
    if (!user) {
      toast.error("Utilizador não encontrado");
      return;
    }
    
    // Verificar se é o administrador padrão com senha admin123
    if (user.username === "admin" && form.password === "admin123") {
      // Login como admin com senha padrão
      const userToSave = {
        id: user.id,
        name: user.name,
        username: user.username,
        role: user.role
      };
      
      // Atualizar o último login
      const updatedUsers = users.map((u: any) => {
        if (u.username === form.username) {
          return {
            ...u,
            status: "active",
            lastLogin: new Date().toISOString()
          };
        }
        return u;
      });
      
      localStorage.setItem("app_users", JSON.stringify(updatedUsers));
      sessionStorage.setItem("current_user", JSON.stringify(userToSave));
      
      toast.success("Login realizado com sucesso");
      
      if (onLoginSuccess) {
        onLoginSuccess();
      } else {
        navigate("/dashboard");
      }
      return;
    }
    
    // Verificar se é primeiro login com senha temporária
    if (form.password === "temp123") {
      setIsFirstLogin(true);
      toast.info("Por favor, altere a sua senha");
      return;
    }

    // Passar para o login normal
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
  };

  const validateNewPassword = (password: string) => {
    const validation = validatePassword(password);
    setPasswordErrors(validation.errors);
    setPasswordValid(validation.isValid);
    return validation.isValid;
  };

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (newPassword !== confirmPassword) {
      toast.error("As senhas não coincidem");
      return;
    }
    
    if (!validateNewPassword(newPassword)) {
      return;
    }

    toast.success("Senha alterada com sucesso");
    setIsFirstLogin(false);
    
    const savedUsers = localStorage.getItem("app_users");
    const users = savedUsers ? JSON.parse(savedUsers) : [];
    
    const user = users.find((u: any) => u.username === form.username);
    
    if (user) {
      const updatedUsers = users.map((u: any) => {
        if (u.username === form.username) {
          return {
            ...u,
            status: "active",
            lastLogin: new Date().toISOString()
          };
        }
        return u;
      });
      
      localStorage.setItem("app_users", JSON.stringify(updatedUsers));
      
      sessionStorage.setItem(
        "current_user", 
        JSON.stringify({
          id: user.id,
          name: user.name,
          username: user.username,
          role: user.role
        })
      );
      
      if (onLoginSuccess) {
        onLoginSuccess();
      } else {
        navigate("/dashboard");
      }
    }
  };

  const handleNewPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setNewPassword(value);
    validateNewPassword(value);
  };

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
              disabled={!passwordValid || newPassword !== confirmPassword}
            >
              Confirmar Alteração
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
          <Button type="submit" className="w-full">
            <LogIn className="h-4 w-4 mr-2" />
            Entrar
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default LoginForm;
