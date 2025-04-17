
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
  const [formChanged, setFormChanged] = useState(false);

  // Reset form state when dialog opens with a new category
  useEffect(() => {
    if (category) {
      setNewName(category.name);
      
      // Ensure explicit boolean values
      setIsFixed(category.isFixedExpense === true);
      setIsActive(category.isActive !== false);
      setFormChanged(false);
      
      console.log("Dialog initialized with values:", {
        name: category.name,
        isFixedExpense: category.isFixedExpense === true,
        isActive: category.isActive !== false
      });
    }
  }, [category]);

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewName(e.target.value);
    setFormChanged(true);
  };

  const handleToggleFixed = () => {
    const newValue = !isFixed;
    setIsFixed(newValue);
    setFormChanged(true);
    console.log("Fixed expense toggled to:", newValue);
  };

  const handleToggleActive = () => {
    const newValue = !isActive;
    setIsActive(newValue);
    setFormChanged(true);
    console.log("Active status toggled to:", newValue);
  };

  const handleSave = () => {
    if (newName.trim()) {
      console.log("Saving category with values:", {
        name: newName,
        isFixedExpense: isFixed,
        isActive: isActive
      });
      
      // Only pass all values together in a single call
      onSave(newName, isFixed, isActive);
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
                onChange={handleNameChange}
                className="col-span-3"
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <div className="col-start-2 col-span-3">
                <FixedExpenseCheckbox 
                  checked={isFixed} 
                  onToggle={handleToggleFixed} 
                />
              </div>
            </div>
            
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
          <Button 
            type="submit" 
            onClick={handleSave}
            disabled={!category || !newName.trim()}
          >
            Guardar Alterações
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
