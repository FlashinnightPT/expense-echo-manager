
import React, { useState } from "react";
import { Eye, EyeOff, LogIn } from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui-custom/Card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

interface LoginFormProps {
  onLoginSuccess?: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onLoginSuccess }) => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isFirstLogin, setIsFirstLogin] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

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

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!form.email || !form.password) {
      toast.error("Por favor, preencha todos os campos");
      return;
    }

    // Buscar utilizadores do localStorage
    const savedUsers = localStorage.getItem("app_users");
    const users = savedUsers ? JSON.parse(savedUsers) : [];
    
    const user = users.find((u: any) => u.email === form.email);
    
    if (!user) {
      toast.error("Utilizador não encontrado");
      return;
    }
    
    // Nota: Numa aplicação real, faria verificação de senha com hash
    // Esta é apenas uma simulação para fins de demonstração
    
    // Simulando primeiro login (senha temporária)
    if (form.password === "temp123") {
      setIsFirstLogin(true);
      toast.info("Por favor, altere a sua senha");
      return;
    }

    // Atualizar status para ativo e último login
    const updatedUsers = users.map((u: any) => {
      if (u.email === form.email) {
        return {
          ...u,
          status: "active",
          lastLogin: new Date().toISOString()
        };
      }
      return u;
    });
    
    localStorage.setItem("app_users", JSON.stringify(updatedUsers));
    
    // Salvar usuário logado no sessionStorage
    sessionStorage.setItem(
      "current_user", 
      JSON.stringify({
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      })
    );
    
    toast.success("Login realizado com sucesso");
    
    if (onLoginSuccess) {
      onLoginSuccess();
    } else {
      navigate("/dashboard");
    }
  };

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (newPassword !== confirmPassword) {
      toast.error("As senhas não coincidem");
      return;
    }
    
    if (newPassword.length < 6) {
      toast.error("A senha deve ter pelo menos 6 caracteres");
      return;
    }

    // Na vida real, você atualizaria a senha no banco de dados
    // Aqui apenas simulamos o fluxo
    
    toast.success("Senha alterada com sucesso");
    setIsFirstLogin(false);
    
    // Simular login bem-sucedido após alteração de senha
    const savedUsers = localStorage.getItem("app_users");
    const users = savedUsers ? JSON.parse(savedUsers) : [];
    
    const user = users.find((u: any) => u.email === form.email);
    
    if (user) {
      const updatedUsers = users.map((u: any) => {
        if (u.email === form.email) {
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
          email: user.email,
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
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Nova senha"
                  className="pr-10"
                />
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
                  className="pr-10"
                />
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full">
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
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              placeholder="seu@email.com"
            />
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
                className="pr-10"
              />
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
