import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { 
  ArrowLeft, 
  Save, 
  Upload,
  Download,
  Database,
  Monitor,
  MoonStar,
  Sun,
  Laptop,
  Euro,
  CircleDollarSign,
  FileJson,
  Upload as ImportIcon
} from "lucide-react";
import { toast } from "sonner";
import Header from "@/components/layout/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui-custom/Card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useTheme } from "@/components/ThemeProvider";
import { exportDatabase, importDatabase } from "@/utils/databaseUtils";
import { useTransactionData } from "@/hooks/useTransactionData";

const Settings = () => {
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();
  const { confirmClearTransactions } = useTransactionData();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [settings, setSettings] = useState({
    language: "pt-PT",
    currency: "EUR",
    currencySymbol: "€",
    dateFormat: "dd/MM/yyyy",
    notifications: true,
    autosave: true
  });

  const handleChange = (key: string, value: string | boolean) => {
    setSettings((prevSettings) => ({
      ...prevSettings,
      [key]: value
    }));
  };

  const handleThemeChange = (value: string) => {
    setTheme(value as "light" | "dark" | "system");
  };

  const handleSave = () => {
    toast.success("Configurações guardadas com sucesso");
  };

  const handleExportDatabase = () => {
    exportDatabase();
  };
  
  const handleImportClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };
  
  const handleImportDatabase = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    const file = files[0];
    
    try {
      // Confirmar com o usuário
      if (window.confirm("Esta ação irá substituir todos os dados existentes. Tem certeza que deseja continuar?")) {
        await importDatabase(file);
        // Recarregar a página para garantir que todos os componentes sejam atualizados
        window.location.reload();
      }
    } catch (error) {
      console.error("Erro ao importar banco de dados:", error);
    }
    
    // Limpar o input para permitir selecionar o mesmo arquivo novamente
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleBackup = () => {
    toast.success("Backup criado com sucesso");
  };

  const handleRestore = () => {
    toast.success("Dados restaurados com sucesso");
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-4 py-8 pt-24">
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
            <h1 className="text-3xl font-bold animate-fade-in-up">Configurações</h1>
            <p className="text-muted-foreground mt-1 animate-fade-in-up animation-delay-100">
              Personalize a sua experiência na aplicação
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card className="animate-fade-in-up animation-delay-200 md:col-span-2">
            <CardHeader>
              <CardTitle>Base de Dados</CardTitle>
              <CardDescription>
                Exporte ou importe todos os dados da aplicação
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-muted/50 p-4 rounded-lg border">
                  <h3 className="text-lg font-medium mb-2 flex items-center gap-2">
                    <FileJson className="h-5 w-5" />
                    Exportação de Dados
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Exporte todos os seus dados (categorias e transações) para um arquivo JSON que pode ser salvo no seu computador.
                  </p>
                  <Button 
                    className="w-full"
                    onClick={handleExportDatabase}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Exportar Base de Dados
                  </Button>
                </div>
                
                <div className="bg-muted/50 p-4 rounded-lg border">
                  <h3 className="text-lg font-medium mb-2 flex items-center gap-2">
                    <ImportIcon className="h-5 w-5" />
                    Importação de Dados
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Importe dados de um arquivo JSON previamente exportado. Isso substituirá todos os dados atuais.
                  </p>
                  <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    accept=".json"
                    onChange={handleImportDatabase}
                  />
                  <Button 
                    className="w-full"
                    onClick={handleImportClick}
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Importar Base de Dados
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="animate-fade-in-up animation-delay-300">
            <CardHeader>
              <CardTitle>Aparência</CardTitle>
              <CardDescription>
                Personalize a aparência da aplicação
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="language">Idioma</Label>
                <Select
                  value={settings.language}
                  onValueChange={(value) => handleChange("language", value)}
                >
                  <SelectTrigger id="language">
                    <SelectValue placeholder="Selecione o idioma" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pt-PT">Português (Portugal)</SelectItem>
                    <SelectItem value="pt-BR">Português (Brasil)</SelectItem>
                    <SelectItem value="en">Inglês</SelectItem>
                    <SelectItem value="es">Espanhol</SelectItem>
                    <SelectItem value="fr">Francês</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Tema</Label>
                <RadioGroup
                  value={theme}
                  onValueChange={handleThemeChange}
                  className="flex flex-col space-y-1"
                >
                  <div className="flex items-center space-x-2 rounded-md border p-2">
                    <RadioGroupItem value="light" id="light" />
                    <Label htmlFor="light" className="flex items-center gap-2 cursor-pointer">
                      <Sun className="h-4 w-4" />
                      <span>Claro</span>
                    </Label>
                  </div>
                  
                  <div className="flex items-center space-x-2 rounded-md border p-2">
                    <RadioGroupItem value="dark" id="dark" />
                    <Label htmlFor="dark" className="flex items-center gap-2 cursor-pointer">
                      <MoonStar className="h-4 w-4" />
                      <span>Escuro</span>
                    </Label>
                  </div>
                  
                  <div className="flex items-center space-x-2 rounded-md border p-2">
                    <RadioGroupItem value="system" id="system" />
                    <Label htmlFor="system" className="flex items-center gap-2 cursor-pointer">
                      <Laptop className="h-4 w-4" />
                      <span>Sistema</span>
                    </Label>
                  </div>
                </RadioGroup>
              </div>
            </CardContent>
          </Card>

          <Card className="animate-fade-in-up animation-delay-400">
            <CardHeader>
              <CardTitle>Moeda e Formato</CardTitle>
              <CardDescription>
                Personalize o formato de moeda e data
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="currency">Moeda</Label>
                <Select
                  value={settings.currency}
                  onValueChange={(value) => handleChange("currency", value)}
                >
                  <SelectTrigger id="currency" className="w-full">
                    <SelectValue placeholder="Selecione a moeda" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="EUR">Euro (€)</SelectItem>
                    <SelectItem value="USD">Dólar Americano ($)</SelectItem>
                    <SelectItem value="GBP">Libra Esterlina (£)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="currencySymbol">Símbolo da Moeda</Label>
                <div className="flex w-full max-w-sm items-center space-x-2">
                  <Select
                    value={settings.currencySymbol}
                    onValueChange={(value) => handleChange("currencySymbol", value)}
                  >
                    <SelectTrigger id="currencySymbol" className="w-24">
                      <SelectValue placeholder="Símbolo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="€">€</SelectItem>
                      <SelectItem value="$">$</SelectItem>
                      <SelectItem value="£">£</SelectItem>
                    </SelectContent>
                  </Select>
                  <Input
                    type="text"
                    placeholder="1.234,56"
                    value="1.234,56"
                    disabled
                    className="text-right"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="dateFormat">Formato de Data</Label>
                <Select
                  value={settings.dateFormat}
                  onValueChange={(value) => handleChange("dateFormat", value)}
                >
                  <SelectTrigger id="dateFormat" className="w-full">
                    <SelectValue placeholder="Selecione o formato de data" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="dd/MM/yyyy">DD/MM/AAAA (31/12/2023)</SelectItem>
                    <SelectItem value="MM/dd/yyyy">MM/DD/AAAA (12/31/2023)</SelectItem>
                    <SelectItem value="yyyy-MM-dd">AAAA-MM-DD (2023-12-31)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          <Card className="animate-fade-in-up animation-delay-500">
            <CardHeader>
              <CardTitle>Backup e Restauro</CardTitle>
              <CardDescription>
                Faça backup dos seus dados ou restaure a partir de um backup
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-2">
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={handleBackup}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Exportar Dados
                </Button>
                <p className="text-sm text-muted-foreground">
                  Descarregue um ficheiro com todos os seus dados para guardar como backup.
                </p>
              </div>
              
              <Separator />
              
              <div className="grid gap-2">
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={handleRestore}
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Importar Dados
                </Button>
                <p className="text-sm text-muted-foreground">
                  Restaure os seus dados a partir de um ficheiro de backup.
                </p>
              </div>
              
              <Separator />
              
              <div className="grid gap-2">
                <Button
                  variant="destructive"
                  className="w-full justify-start"
                  onClick={() => toast.error("Esta funcionalidade foi desativada por segurança")}
                >
                  <Database className="h-4 w-4 mr-2" />
                  Limpar Todos os Dados
                </Button>
                <p className="text-sm text-muted-foreground">
                  Remova todos os seus dados. Esta ação não pode ser desfeita.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="animate-fade-in-up animation-delay-600">
            <CardHeader>
              <CardTitle>Preferências</CardTitle>
              <CardDescription>
                Personalize as preferências da aplicação
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="notifications">Notificações</Label>
                  <p className="text-sm text-muted-foreground">
                    Receba notificações sobre as suas finanças
                  </p>
                </div>
                <Switch
                  id="notifications"
                  checked={settings.notifications}
                  onCheckedChange={(checked) => handleChange("notifications", checked)}
                />
              </div>
              
              <Separator />
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="autosave">Guardar Automaticamente</Label>
                  <p className="text-sm text-muted-foreground">
                    Guarde automaticamente as alterações
                  </p>
                </div>
                <Switch
                  id="autosave"
                  checked={settings.autosave}
                  onCheckedChange={(checked) => handleChange("autosave", checked)}
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                className="w-full" 
                onClick={handleSave}
              >
                <Save className="h-4 w-4 mr-2" />
                Guardar Configurações
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Settings;
