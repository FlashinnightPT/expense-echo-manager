
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, UserPlus, Mail, Lock, Eye, EyeOff, Pencil, Trash2, Shield } from "lucide-react";
import { toast } from "sonner";

import Header from "@/components/layout/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui-custom/Card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";

// Tipos
type UserRole = "editor" | "viewer";

interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: "active" | "pending" | "inactive";
  lastLogin?: string;
}

const Users = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState<User[]>(() => {
    const savedUsers = localStorage.getItem("app_users");
    return savedUsers ? JSON.parse(savedUsers) : [
      {
        id: "1",
        name: "Administrador",
        email: "admin@exemplo.com",
        role: "editor" as UserRole,
        status: "active",
        lastLogin: "2023-06-15T10:30:00"
      }
    ];
  });
  
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    role: "viewer" as UserRole
  });
  
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<string | null>(null);
  
  // Gerar senha temporária aleatória
  const generateTemporaryPassword = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let password = "";
    for (let i = 0; i < 8; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return password;
  };
  
  // Adicionar novo utilizador
  const handleAddUser = () => {
    if (!newUser.name || !newUser.email) {
      toast.error("Por favor, preencha todos os campos");
      return;
    }
    
    // Verificar se o email já existe
    if (users.some(user => user.email === newUser.email)) {
      toast.error("Este email já está registado");
      return;
    }
    
    const tempPassword = generateTemporaryPassword();
    const newUserData: User = {
      id: Date.now().toString(),
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
      status: "pending"
    };
    
    const updatedUsers = [...users, newUserData];
    setUsers(updatedUsers);
    localStorage.setItem("app_users", JSON.stringify(updatedUsers));
    
    // Simular envio de email
    console.log(`Email enviado para ${newUser.email} com a senha temporária: ${tempPassword}`);
    
    toast.success(`Utilizador ${newUser.name} adicionado com sucesso`);
    toast.success(`Email enviado para ${newUser.email} com instruções de acesso`);
    
    // Limpar o formulário
    setNewUser({
      name: "",
      email: "",
      role: "viewer"
    });
    
    setIsAddUserOpen(false);
  };
  
  // Eliminar utilizador
  const handleDeleteUser = () => {
    if (!userToDelete) return;
    
    const updatedUsers = users.filter(user => user.id !== userToDelete);
    setUsers(updatedUsers);
    localStorage.setItem("app_users", JSON.stringify(updatedUsers));
    
    toast.success("Utilizador removido com sucesso");
    setUserToDelete(null);
  };
  
  // Função de simulação de envio de email
  const sendPasswordResetEmail = (email: string) => {
    const tempPassword = generateTemporaryPassword();
    console.log(`Nova senha temporária enviada para ${email}: ${tempPassword}`);
    toast.success(`Email de redefinição de senha enviado para ${email}`);
  };
  
  const getRoleBadge = (role: UserRole) => {
    if (role === "editor") {
      return <Badge className="bg-blue-500">Leitura e edição</Badge>;
    }
    return <Badge variant="outline">Leitura</Badge>;
  };
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-500">Ativo</Badge>;
      case "pending":
        return <Badge className="bg-yellow-500">Pendente</Badge>;
      case "inactive":
        return <Badge className="bg-red-500">Inativo</Badge>;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center mb-8">
          <Button 
            variant="ghost" 
            className="mr-4"
            onClick={() => navigate("/")}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar
          </Button>
          <div>
            <h1 className="text-3xl font-bold animate-fade-in-up">Gestão de Utilizadores</h1>
            <p className="text-muted-foreground mt-1 animate-fade-in-up animation-delay-100">
              Gerencie o acesso à aplicação
            </p>
          </div>
        </div>

        <Card className="animate-fade-in-up animation-delay-200">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Utilizadores</CardTitle>
              <CardDescription>
                Gerencie os utilizadores e as suas permissões
              </CardDescription>
            </div>
            <Dialog open={isAddUserOpen} onOpenChange={setIsAddUserOpen}>
              <DialogTrigger asChild>
                <Button>
                  <UserPlus className="h-4 w-4 mr-2" />
                  Adicionar Utilizador
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Adicionar Novo Utilizador</DialogTitle>
                  <DialogDescription>
                    Iremos enviar um email com as instruções de acesso para o novo utilizador.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nome</Label>
                    <Input 
                      id="name" 
                      placeholder="Nome do utilizador" 
                      value={newUser.name}
                      onChange={(e) => setNewUser({...newUser, name: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input 
                      id="email" 
                      type="email" 
                      placeholder="email@exemplo.com" 
                      value={newUser.email}
                      onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="role">Nível de Acesso</Label>
                    <Select 
                      value={newUser.role} 
                      onValueChange={(value: UserRole) => setNewUser({...newUser, role: value})}
                    >
                      <SelectTrigger id="role">
                        <SelectValue placeholder="Selecione o nível de acesso" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="editor">Leitura e edição</SelectItem>
                        <SelectItem value="viewer">Leitura apenas</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <DialogFooter>
                  <DialogClose asChild>
                    <Button variant="outline">Cancelar</Button>
                  </DialogClose>
                  <Button onClick={handleAddUser}>Adicionar</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Acesso</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Último Acesso</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{getRoleBadge(user.role)}</TableCell>
                    <TableCell>{getStatusBadge(user.status)}</TableCell>
                    <TableCell>{user.lastLogin ? new Date(user.lastLogin).toLocaleDateString() : "Nunca"}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => sendPasswordResetEmail(user.email)}
                          title="Enviar email de redefinição de senha"
                        >
                          <Mail className="h-4 w-4" />
                        </Button>
                        
                        <AlertDialog open={userToDelete === user.id} onOpenChange={(open) => !open && setUserToDelete(null)}>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="outline"
                              size="icon"
                              className="text-red-500 hover:text-red-600"
                              onClick={() => setUserToDelete(user.id)}
                              title="Eliminar utilizador"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Tem a certeza?</AlertDialogTitle>
                              <AlertDialogDescription>
                                Esta ação não pode ser desfeita. O utilizador será permanentemente removido.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancelar</AlertDialogCancel>
                              <AlertDialogAction 
                                className="bg-red-500 hover:bg-red-600"
                                onClick={handleDeleteUser}
                              >
                                Eliminar
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
          <CardFooter className="flex justify-between border-t pt-5">
            <p className="text-sm text-muted-foreground">
              Total de utilizadores: {users.length}
            </p>
          </CardFooter>
        </Card>
        
        <Card className="mt-8 animate-fade-in-up animation-delay-300">
          <CardHeader>
            <CardTitle>Níveis de Acesso</CardTitle>
            <CardDescription>
              Explicação dos diferentes níveis de acesso disponíveis
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start gap-4 rounded-lg border p-4">
              <div className="mt-1 bg-blue-100 p-2 rounded-full">
                <Shield className="h-6 w-6 text-blue-500" />
              </div>
              <div>
                <h3 className="font-semibold flex items-center gap-2">
                  Leitura e edição
                  <Badge className="bg-blue-500">Editor</Badge>
                </h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Utilizadores com este nível têm acesso completo à aplicação. Podem visualizar dados, adicionar transações, 
                  gerir categorias, alterar configurações e gerir outros utilizadores.
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-4 rounded-lg border p-4">
              <div className="mt-1 bg-gray-100 p-2 rounded-full">
                <Eye className="h-6 w-6 text-gray-500" />
              </div>
              <div>
                <h3 className="font-semibold flex items-center gap-2">
                  Leitura apenas
                  <Badge variant="outline">Viewer</Badge>
                </h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Utilizadores com este nível têm acesso apenas para visualização. Podem consultar informações, 
                  gerar relatórios e utilizar a análise por categoria, mas não podem adicionar ou editar dados.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Users;
