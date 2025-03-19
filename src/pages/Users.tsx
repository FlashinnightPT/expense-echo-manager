
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, UserPlus, Mail, Lock, User, Eye, EyeOff, Pencil, Trash2, Shield } from "lucide-react";
import { toast } from "sonner";
import useAuth from "@/hooks/useAuth";

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
import { UserService, UserData } from "@/services/api/UserService";
import { LoadingPage } from "@/components/ui/loading-spinner";

// Tipo para o UserRole já existe em UserData

const Users = () => {
  const navigate = useNavigate();
  const { validatePassword } = useAuth();
  const [users, setUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [newUser, setNewUser] = useState({
    name: "",
    username: "",
    role: "viewer" as UserData['role']
  });
  
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<string | null>(null);
  
  // Carregar utilizadores
  useEffect(() => {
    const loadUsers = async () => {
      try {
        setLoading(true);
        const loadedUsers = await UserService.getUsers();
        setUsers(loadedUsers);
      } catch (error) {
        console.error("Erro ao carregar utilizadores:", error);
        toast.error("Não foi possível carregar a lista de utilizadores");
      } finally {
        setLoading(false);
      }
    };
    
    loadUsers();
  }, []);
  
  // Gerar senha temporária aleatória
  const generateTemporaryPassword = () => {
    return "temp123"; // Senha temporária fixa para simplicidade
  };
  
  // Adicionar novo utilizador
  const handleAddUser = async () => {
    if (!newUser.name || !newUser.username) {
      toast.error("Por favor, preencha todos os campos");
      return;
    }
    
    // Verificar se o username já existe
    if (users.some(user => user.username === newUser.username)) {
      toast.error("Este nome de utilizador já está registado");
      return;
    }
    
    const tempPassword = generateTemporaryPassword();
    const newUserData: UserData = {
      id: Date.now().toString(),
      name: newUser.name,
      username: newUser.username,
      password: tempPassword, // Senha temporária
      role: newUser.role,
      status: "pending"
    };
    
    try {
      setLoading(true);
      await UserService.createUser(newUserData);
      
      // Recarregar a lista de utilizadores
      const updatedUsers = await UserService.getUsers();
      setUsers(updatedUsers);
      
      // Simular envio de credenciais
      console.log(`Credenciais para ${newUser.name}: Username: ${newUser.username}, Senha temporária: ${tempPassword}`);
      
      toast.success(`Utilizador ${newUser.name} adicionado com sucesso`);
      toast.info(`Username: ${newUser.username} / Senha temporária: ${tempPassword}`);
      
      // Limpar o formulário
      setNewUser({
        name: "",
        username: "",
        role: "viewer"
      });
      
      setIsAddUserOpen(false);
    } catch (error) {
      console.error("Erro ao adicionar utilizador:", error);
      toast.error("Não foi possível adicionar o utilizador");
    } finally {
      setLoading(false);
    }
  };
  
  // Eliminar utilizador
  const handleDeleteUser = async () => {
    if (!userToDelete) return;
    
    try {
      setLoading(true);
      await UserService.deleteUser(userToDelete);
      
      // Recarregar a lista de utilizadores
      const updatedUsers = await UserService.getUsers();
      setUsers(updatedUsers);
      
      toast.success("Utilizador removido com sucesso");
    } catch (error) {
      console.error("Erro ao eliminar utilizador:", error);
      toast.error("Não foi possível eliminar o utilizador");
    } finally {
      setLoading(false);
      setUserToDelete(null);
    }
  };
  
  // Função de simulação de envio de email com nova senha
  const sendPasswordResetEmail = async (userId: string, username: string) => {
    const tempPassword = generateTemporaryPassword();
    
    try {
      await UserService.updateUser({
        id: userId,
        password: tempPassword
      });
      
      console.log(`Nova senha temporária para ${username}: ${tempPassword}`);
      toast.success(`Nova senha temporária para ${username}: ${tempPassword}`);
    } catch (error) {
      console.error("Erro ao redefinir senha:", error);
      toast.error("Não foi possível redefinir a senha do utilizador");
    }
  };
  
  const getRoleBadge = (role: UserData['role']) => {
    if (role === "editor") {
      return <Badge className="bg-blue-500">Leitura e edição</Badge>;
    }
    return <Badge variant="outline">Leitura</Badge>;
  };
  
  const getStatusBadge = (status: UserData['status']) => {
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

  if (loading && users.length === 0) {
    return <LoadingPage text="A carregar utilizadores..." />;
  }

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
                    O utilizador receberá uma senha temporária que deverá ser alterada no primeiro acesso.
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
                    <Label htmlFor="username">Nome de Utilizador</Label>
                    <div className="relative">
                      <Input 
                        id="username" 
                        type="text" 
                        placeholder="username" 
                        value={newUser.username}
                        onChange={(e) => setNewUser({...newUser, username: e.target.value})}
                        className="pl-10"
                      />
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="role">Nível de Acesso</Label>
                    <Select 
                      value={newUser.role} 
                      onValueChange={(value: UserData['role']) => setNewUser({...newUser, role: value})}
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
                  <TableHead>Nome de Utilizador</TableHead>
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
                    <TableCell>{user.username}</TableCell>
                    <TableCell>{getRoleBadge(user.role)}</TableCell>
                    <TableCell>{getStatusBadge(user.status)}</TableCell>
                    <TableCell>{user.lastLogin ? new Date(user.lastLogin).toLocaleDateString() : "Nunca"}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => sendPasswordResetEmail(user.id, user.username)}
                          title="Redefinir senha"
                        >
                          <Lock className="h-4 w-4" />
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
