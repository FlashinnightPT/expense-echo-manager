
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { TransactionCategory } from "@/utils/mockData";
import FixedExpenseCheckbox from "@/components/categories/FixedExpenseCheckbox";
import { Switch } from "@/components/ui/switch";

interface EditCategoryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  category: TransactionCategory | null;
  onSave: (newName: string, isFixedExpense?: boolean, isActive?: boolean) => void;
}

export function EditCategoryDialog({ 
  open, 
  onOpenChange,
  category,
  onSave
}: EditCategoryDialogProps) {
  const [newName, setNewName] = useState("");
  const [isFixed, setIsFixed] = useState(false);
  const [isActive, setIsActive] = useState(true);

  useEffect(() => {
    if (category) {
      setNewName(category.name);
      
      // Garantir valores booleanos explícitos
      setIsFixed(category.isFixedExpense === true);
      
      // Garantir valor booleano explícito para isActive, com valor padrão true
      // se for undefined ou null
      setIsActive(category.isActive !== false);
      
      console.log("Estado inicial do diálogo de edição:", {
        categoria: category,
        nome: category.name,
        isFixed: category.isFixedExpense,
        isActive: category.isActive,
        "isFixed após conversão": category.isFixedExpense === true,
        "isActive após conversão": category.isActive !== false
      });
    }
  }, [category]);

  const handleSave = () => {
    if (newName.trim()) {
      console.log("Enviando dados da edição:", {
        nome: newName,
        isFixed: isFixed,
        isActive: isActive
      });
      
      // Passar explicitamente valores booleanos
      onSave(newName, isFixed, isActive);
      onOpenChange(false);
    }
  };

  const handleToggleFixed = () => {
    setIsFixed(!isFixed);
  };

  const handleToggleActive = () => {
    setIsActive(!isActive);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Editar Categoria</DialogTitle>
          <DialogDescription>
            Altere o nome da categoria.
          </DialogDescription>
        </DialogHeader>
        
        {category && (
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="categoryName" className="text-right">
                Nome
              </Label>
              <Input
                id="categoryName"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                className="col-span-3"
              />
            </div>
            
            {category.type === "expense" && (
              <div className="grid grid-cols-4 items-center gap-4">
                <div className="col-start-2 col-span-3">
                  <FixedExpenseCheckbox 
                    checked={isFixed} 
                    onToggle={handleToggleFixed} 
                  />
                </div>
              </div>
            )}
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="isActive" className="text-right">
                Ativa
              </Label>
              <div className="flex items-center gap-2">
                <Switch
                  id="isActive"
                  checked={isActive}
                  onCheckedChange={handleToggleActive}
                />
                <span className="text-sm">{isActive ? "Ativa" : "Inativa"}</span>
              </div>
            </div>
          </div>
        )}
        
        <DialogFooter>
          <Button type="submit" onClick={handleSave}>
            Salvar Alterações
          </Button>
          <DialogClose asChild>
            <Button type="button" variant="outline">
              Cancelar
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
