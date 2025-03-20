
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

interface EditCategoryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  category: TransactionCategory | null;
  onSave: (newName: string) => void;
}

export function EditCategoryDialog({ 
  open, 
  onOpenChange,
  category,
  onSave
}: EditCategoryDialogProps) {
  const [newName, setNewName] = useState("");

  useEffect(() => {
    if (category) {
      setNewName(category.name);
    }
  }, [category]);

  const handleSave = () => {
    if (newName.trim()) {
      onSave(newName);
      onOpenChange(false);
    }
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
