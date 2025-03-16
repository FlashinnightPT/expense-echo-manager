import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { TransactionCategory } from "@/utils/mockData";
import { Upload } from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { importCategoriesFromExcel } from "@/utils/exports";

interface CategoryImportProps {
  onImportCategories: (categories: Partial<TransactionCategory>[]) => void;
}

const CategoryImport = ({ onImportCategories }: CategoryImportProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <>
      <div className="flex gap-2">
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
              Funcionalidade de importação ainda não disponível.
            </DialogDescription>
          </DialogHeader>
          
          <div className="flex justify-end gap-2">
            <Button
              variant="ghost"
              onClick={() => setIsDialogOpen(false)}
            >
              Fechar
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default CategoryImport;
