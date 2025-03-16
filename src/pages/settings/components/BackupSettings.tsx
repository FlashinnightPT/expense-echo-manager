
import { Database, Download, HelpCircle, Upload } from "lucide-react";
import { toast } from "sonner";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui-custom/Card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useSettingsState } from "../hooks/useSettingsState";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface BackupSettingsProps {
  className?: string;
}

const BackupSettings = ({ className }: BackupSettingsProps) => {
  const { handleBackup, handleRestore } = useSettingsState();

  return (
    <Card className={className}>
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
          <div className="flex items-start gap-1">
            <p className="text-sm text-muted-foreground">
              Descarregue um ficheiro com todos os seus dados para guardar como backup.
            </p>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="ghost" size="icon" className="h-5 w-5 p-0">
                  <HelpCircle className="h-4 w-4 text-muted-foreground" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80">
                <Alert>
                  <AlertTitle>Sobre os backups</AlertTitle>
                  <AlertDescription className="space-y-2">
                    <p>
                      O arquivo de backup será salvo na sua pasta de downloads padrão com o nome <code className="text-xs">gestor-financeiro-backup-AAAA-MM-DD.json</code> (onde AAAA-MM-DD é a data atual).
                    </p>
                    <p>
                      Se não encontrar o arquivo, verifique:
                    </p>
                    <ul className="list-disc pl-5 text-sm">
                      <li>A pasta Downloads do seu computador</li>
                      <li>O seu Ambiente de Trabalho</li>
                      <li>A barra de downloads do seu navegador</li>
                    </ul>
                  </AlertDescription>
                </Alert>
              </PopoverContent>
            </Popover>
          </div>
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
  );
};

export default BackupSettings;
