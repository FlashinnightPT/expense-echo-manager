
import React, { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { exportCategoryTemplate, importCategoriesFromExcel } from "@/utils/exportUtils";
import { TransactionCategory } from "@/utils/mockData";
import { FileUp, Download, Upload } from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface CategoryImportProps {
  onImportCategories: (categories: Partial<TransactionCategory>[]) => void;
}

const CategoryImport = ({ onImportCategories }: CategoryImportProps) => {
  const [isImporting, setIsImporting] = useState(false);
  const [importErrors, setImportErrors] = useState<string[]>([]);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDownloadTemplate = () => {
    exportCategoryTemplate();
    toast.success("Template de categorias baixado");
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      setSelectedFile(files[0]);
      setImportErrors([]);
    }
  };

  const handleOpenFileSelector = () => {
    fileInputRef.current?.click();
  };

  const handleImport = async () => {
    if (!selectedFile) {
      toast.error("Selecione um arquivo para importar");
      return;
    }

    try {
      setIsImporting(true);
      setImportErrors([]);
      
      const importedCategories = await importCategoriesFromExcel(selectedFile);
      
      if (importedCategories.length === 0) {
        toast.warning("Nenhuma categoria encontrada no arquivo");
        return;
      }
      
      onImportCategories(importedCategories);
      toast.success(`${importedCategories.length} categorias importadas com sucesso`);
      setSelectedFile(null);
      setIsDialogOpen(false);
      
      // Reset the file input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (errors) {
      console.error("Import errors:", errors);
      setImportErrors(Array.isArray(errors) ? errors : ["Erro desconhecido ao importar categorias"]);
      toast.error("Erro ao importar categorias. Verifique os detalhes no diálogo.");
    } finally {
      setIsImporting(false);
    }
  };

  return (
    <>
      <div className="flex gap-2">
        <Button 
          variant="outline" 
          size="sm"
          onClick={handleDownloadTemplate}
          className="flex items-center gap-1"
        >
          <Download className="h-4 w-4" />
          Template Excel
        </Button>
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => setIsDialogOpen(true)}
          className="flex items-center gap-1"
        >
          <Upload className="h-4 w-4" />
          Importar
        </Button>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Importar Categorias</DialogTitle>
            <DialogDescription>
              Faça upload do arquivo Excel com as categorias a importar.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="flex flex-col space-y-2">
              <Label htmlFor="file">Arquivo Excel</Label>
              <div className="flex items-center gap-2">
                <Input
                  ref={fileInputRef}
                  id="file"
                  type="file"
                  accept=".xlsx,.xls"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <Button 
                  onClick={handleOpenFileSelector}
                  variant="outline"
                  className="w-full flex justify-center items-center gap-2"
                >
                  <FileUp className="h-4 w-4" />
                  {selectedFile ? selectedFile.name : "Selecionar arquivo"}
                </Button>
              </div>
              {selectedFile && (
                <p className="text-sm text-muted-foreground">
                  Arquivo selecionado: {selectedFile.name}
                </p>
              )}
            </div>

            {importErrors.length > 0 && (
              <div className="bg-destructive/10 p-3 rounded-md border border-destructive/20">
                <h4 className="font-medium text-destructive mb-2">Erros encontrados:</h4>
                <ul className="list-disc pl-5 space-y-1 text-sm">
                  {importErrors.map((error, index) => (
                    <li key={index} className="text-destructive">{error}</li>
                  ))}
                </ul>
              </div>
            )}

            <div className="flex justify-end gap-2">
              <Button
                variant="ghost"
                onClick={() => setIsDialogOpen(false)}
              >
                Cancelar
              </Button>
              <Button
                onClick={handleImport}
                disabled={!selectedFile || isImporting}
              >
                {isImporting ? "Importando..." : "Importar Categorias"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default CategoryImport;
