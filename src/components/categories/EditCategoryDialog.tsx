
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface EditCategoryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  category: TransactionCategory | null;
  categories: TransactionCategory[];
  onRename: (categoryId: string, newName: string) => void;
  onMove: (categoryId: string, newParentId: string | null) => void;
}

export function EditCategoryDialog({ 
  open, 
  onOpenChange,
  category,
  categories,
  onRename,
  onMove
}: EditCategoryDialogProps) {
  const [newName, setNewName] = useState("");
  const [newParentId, setNewParentId] = useState<string | null>(null);

  useEffect(() => {
    if (category) {
      setNewName(category.name);
      setNewParentId(category.parentId || null);
    }
  }, [category]);

  const handleRename = () => {
    if (category && newName.trim()) {
      onRename(category.id, newName);
    }
  };

  const handleMove = () => {
    if (category) {
      onMove(category.id, newParentId);
    }
  };

  // Get potential parent categories (can't move to own child)
  const getValidParentCategories = (): TransactionCategory[] => {
    if (!category) return [];

    // Find all descendants of this category (can't move to these)
    const findAllDescendants = (catId: string): string[] => {
      const children = categories.filter(c => c.parentId === catId).map(c => c.id);
      return [
        ...children,
        ...children.flatMap(childId => findAllDescendants(childId))
      ];
    };
    
    const descendants = category ? findAllDescendants(category.id) : [];
    
    // Can only move to categories of the same type and with level < or = this category's level - 1
    return categories.filter(cat => 
      cat.id !== category?.id && 
      !descendants.includes(cat.id) &&
      cat.type === category?.type &&
      cat.level < category?.level
    );
  };

  const validParents = getValidParentCategories();
  
  // Determine if we can go up a level
  const canMoveUp = category?.parentId !== undefined;
  const parentCategory = category?.parentId ? categories.find(c => c.id === category.parentId) : null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Editar Categoria</DialogTitle>
          <DialogDescription>
            Altere o nome ou mova esta categoria para outro local.
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
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">Mover para</Label>
              <div className="col-span-3 space-y-2">
                {canMoveUp && (
                  <Button 
                    variant="outline" 
                    className="w-full justify-start" 
                    onClick={() => {
                      // Find parent's parent
                      const grandParentId = parentCategory?.parentId || null;
                      setNewParentId(grandParentId);
                    }}
                  >
                    ↑ Subir um nível {parentCategory ? `(para ${parentCategory.level === 2 ? "Raiz" : parentCategory.name})` : ""}
                  </Button>
                )}
                
                {validParents.length > 0 && (
                  <Select 
                    value={newParentId || ""} 
                    onValueChange={(value) => setNewParentId(value || null)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione uma categoria..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Nível Raiz</SelectItem>
                      {validParents.map(parent => (
                        <SelectItem key={parent.id} value={parent.id}>
                          {parent.name} (Nível {parent.level})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              </div>
            </div>
          </div>
        )}
        
        <DialogFooter>
          <Button 
            type="submit" 
            onClick={() => {
              handleRename();
              handleMove();
              onOpenChange(false);
            }}
          >
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
