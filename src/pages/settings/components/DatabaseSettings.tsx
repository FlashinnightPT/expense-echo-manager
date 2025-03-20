
import { useRef } from "react";
import { FileJson, Import, Upload, Trash2 } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui-custom/Card";
import { Button } from "@/components/ui/button";
import { exportDatabase, importDatabase, clearAllData } from "@/utils/databaseUtils";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useState } from "react";

interface DatabaseSettingsProps {
  className?: string;
}

const DatabaseSettings = ({ className }: DatabaseSettingsProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [openClearDialog, setOpenClearDialog] = useState(false);
  
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

  const handleClearAllData = async () => {
    if (await clearAllData()) {
      setOpenClearDialog(false);
      window.location.reload();
    }
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Base de Dados</CardTitle>
        <CardDescription>
          Exporte, importe ou limpe todos os dados da aplicação
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
              <Import className="h-4 w-4 mr-2" />
              Exportar Base de Dados
            </Button>
          </div>
          
          <div className="bg-muted/50 p-4 rounded-lg border">
            <h3 className="text-lg font-medium mb-2 flex items-center gap-2">
              <Upload className="h-5 w-5" />
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

        <div className="bg-red-50 dark:bg-red-950/20 p-4 rounded-lg border border-red-200 dark:border-red-800">
          <h3 className="text-lg font-medium mb-2 flex items-center gap-2 text-red-700 dark:text-red-400">
            <Trash2 className="h-5 w-5" />
            Limpar Todos os Dados
          </h3>
          <p className="text-sm text-red-600 dark:text-red-400 mb-4">
            Remova permanentemente todas as categorias e transações do sistema. Esta ação não pode ser desfeita.
          </p>
          <Button 
            variant="destructive"
            className="w-full"
            onClick={() => setOpenClearDialog(true)}
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Limpar Todos os Dados
          </Button>
        </div>

        <Dialog open={openClearDialog} onOpenChange={setOpenClearDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Limpar Todos os Dados</DialogTitle>
              <DialogDescription>
                Esta ação irá apagar permanentemente todas as categorias e transações do sistema. 
                Os dados não poderão ser recuperados após esta operação.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setOpenClearDialog(false)}>Cancelar</Button>
              <Button variant="destructive" onClick={handleClearAllData}>
                Confirmar Exclusão
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};

export default DatabaseSettings;
