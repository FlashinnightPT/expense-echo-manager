
import { useState, useEffect } from "react";
import { PlusCircle, X } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui-custom/Card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { TransactionCategory } from "@/utils/mockData";
import { toast } from "sonner";

interface CategoryFormProps {
  onSave?: (category: Partial<TransactionCategory>) => void;
  category?: TransactionCategory;
  className?: string;
}

const CategoryForm = ({ onSave, category, className }: CategoryFormProps) => {
  const [formData, setFormData] = useState<Partial<TransactionCategory>>({
    name: category?.name || "",
    type: category?.type || "expense",
    parentId: category?.parentId || undefined,
    level: category?.level || 2 // Default level is now 2 (since type is level 1)
  });
  
  const [availableCategories, setAvailableCategories] = useState<TransactionCategory[]>([]);
  const [level2Categories, setLevel2Categories] = useState<TransactionCategory[]>([]);
  const [level3Categories, setLevel3Categories] = useState<TransactionCategory[]>([]);
  
  useEffect(() => {
    // Load categories from localStorage
    const storedCategories = localStorage.getItem('categories');
    if (storedCategories) {
      const parsedCategories = JSON.parse(storedCategories);
      setAvailableCategories(parsedCategories);
      
      // Set level 2 and 3 categories based on selected type
      updateLevelCategories(parsedCategories, formData.type || 'expense');
    }
  }, [formData.type]);
  
  // Update available categories when type changes
  const updateLevelCategories = (categories: TransactionCategory[], selectedType: string) => {
    // Level 2 are categories with type matching the selected type and level = 2
    const level2 = categories.filter(cat => cat.type === selectedType && cat.level === 2);
    setLevel2Categories(level2);
    
    // Level 3 are categories that have parents in level 2 and have level = 3
    const level3 = categories.filter(cat => cat.type === selectedType && cat.level === 3);
    setLevel3Categories(level3);
  };

  const handleTypeChange = (value: string) => {
    // Reset parent selections when type changes
    setFormData({
      ...formData,
      type: value as 'income' | 'expense',
      parentId: undefined,
      level: 2 // Reset to level 2 when type changes
    });
    
    // Update available categories for the selected type
    updateLevelCategories(availableCategories, value);
  };
  
  const handleParentChange = (value: string) => {
    if (value === "none") {
      // No parent selected, so it's a level 2 category
      setFormData({
        ...formData,
        parentId: undefined,
        level: 2
      });
      return;
    }
    
    // Find the selected parent category
    const parentCategory = availableCategories.find(c => c.id === value);
    
    if (parentCategory) {
      // Calculate new level based on parent's level
      const newLevel = parentCategory.level + 1;
      
      setFormData({
        ...formData,
        parentId: value,
        level: newLevel
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name) {
      toast.error("Por favor, insira um nome para a categoria");
      return;
    }
    
    if (formData.level && formData.level > 4) {
      toast.error("Não é possível criar categorias com mais de 4 níveis de profundidade");
      return;
    }
    
    if (onSave) {
      onSave(formData);
      
      // Reset form after save
      setFormData({
        name: "",
        type: formData.type, // Keep the same type for convenience
        parentId: undefined,
        level: 2 // Reset to level 2
      });
      
      toast.success("Categoria guardada com sucesso");
    }
  };

  // Get potential parent categories based on the current level
  const getPotentialParents = () => {
    // Different filtering based on the level we're trying to create
    if (formData.level === 2 || !formData.level) {
      // For level 2, no parents (only type as level 1)
      return [];
    } else if (formData.level === 3) {
      // For level 3, only level 2 categories of the same type
      return availableCategories.filter(c => 
        c.type === formData.type && 
        c.level === 2 &&
        (!category || c.id !== category.id)
      );
    } else {
      // For level 4, only level 3 categories of the same type
      return availableCategories.filter(c => 
        c.type === formData.type && 
        c.level === 3 &&
        (!category || c.id !== category.id)
      );
    }
  };

  const potentialParents = getPotentialParents();
  const hasParentOptions = potentialParents.length > 0;

  // Get level description
  const getLevelDescription = () => {
    switch (formData.level) {
      case 2:
        return "Categoria Principal (após Tipo)";
      case 3:
        return "Subcategoria";
      case 4:
        return "Item Individual (nível máximo)";
      default:
        return "Categoria";
    }
  };

  return (
    <Card className={cn("animate-fade-in-up", className)}>
      <CardHeader>
        <CardTitle className="text-lg">
          {category ? "Editar Categoria" : "Adicionar Nova Categoria"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nome da Categoria</Label>
              <Input
                id="name"
                placeholder="Introduza o nome da categoria"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
              />
            </div>
            
            <div className="space-y-2">
              <Label>Tipo de Categoria (Nível 1)</Label>
              <RadioGroup
                value={formData.type}
                onValueChange={handleTypeChange}
                className="grid grid-cols-2 gap-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="income" id="income" />
                  <Label htmlFor="income" className="cursor-pointer">Receita</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="expense" id="expense" />
                  <Label htmlFor="expense" className="cursor-pointer">Despesa</Label>
                </div>
              </RadioGroup>
            </div>
            
            {(formData.level === 2 || !formData.level) && (
              <div className="p-3 bg-muted/30 rounded-md">
                <p className="text-sm font-medium">Criando uma Categoria Principal (Nível 2)</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Esta será uma categoria principal após o tipo {formData.type === 'income' ? 'Receita' : 'Despesa'}.
                </p>
              </div>
            )}
            
            {formData.level && formData.level > 2 && (
              <div className="space-y-2">
                <Label htmlFor="parent">Categoria Principal</Label>
                <Select
                  value={formData.parentId || "none"}
                  onValueChange={handleParentChange}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione uma categoria principal" />
                  </SelectTrigger>
                  <SelectContent>
                    {formData.level === 3 ? (
                      // For level 3, show level 2 categories
                      level2Categories.length > 0 ? (
                        level2Categories.map((parent) => (
                          <SelectItem key={parent.id} value={parent.id}>
                            {parent.name} (Nível 2)
                          </SelectItem>
                        ))
                      ) : (
                        <SelectItem value="none" disabled>
                          Não há categorias de Nível 2 disponíveis
                        </SelectItem>
                      )
                    ) : (
                      // For level 4, show level 3 categories
                      level3Categories.length > 0 ? (
                        level3Categories.map((parent) => (
                          <SelectItem key={parent.id} value={parent.id}>
                            {parent.name} (Nível 3)
                          </SelectItem>
                        ))
                      ) : (
                        <SelectItem value="none" disabled>
                          Não há categorias de Nível 3 disponíveis
                        </SelectItem>
                      )
                    )}
                  </SelectContent>
                </Select>
              </div>
            )}
            
            <div className="p-3 bg-muted/10 rounded-md">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">{getLevelDescription()}</span>
                <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                  Nível {formData.level} de 4
                </span>
              </div>
              
              {!hasParentOptions && formData.level && formData.level > 2 && (
                <p className="text-xs text-amber-500 mt-2">
                  Precisa criar uma categoria de nível {formData.level - 1} primeiro.
                </p>
              )}
              
              {formData.level === 4 && (
                <p className="text-xs text-muted-foreground mt-2">
                  Este é o nível máximo de profundidade.
                </p>
              )}
            </div>
          </div>
          
          <div className="flex justify-end space-x-2">
            <Button 
              type="button" 
              variant="outline"
              onClick={() => {
                setFormData({
                  name: "",
                  type: formData.type, // Keep the type
                  parentId: undefined,
                  level: 2
                });
              }}
            >
              <X className="h-4 w-4 mr-2" />
              Limpar
            </Button>
            <Button 
              type="submit"
              disabled={formData.level > 2 && !formData.parentId}
            >
              <PlusCircle className="h-4 w-4 mr-2" />
              {category ? "Atualizar" : "Adicionar"} Categoria
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default CategoryForm;
