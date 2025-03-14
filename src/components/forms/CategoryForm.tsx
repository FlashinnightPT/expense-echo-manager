import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui-custom/Card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TransactionCategory } from "@/utils/mockData";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface CategoryFormProps {
  onSave: (category: Partial<TransactionCategory>) => void;
}

// Fix the type issues with categoryNames array and handling
const CategoryForm = ({ onSave }: CategoryFormProps) => {
  const [type, setType] = useState<"income" | "expense">("expense");
  const [level, setLevel] = useState(2);
  const [categoryName, setCategoryName] = useState("");
  
  // Change to string instead of string[] to fix the errors
  const [parentId, setParentId] = useState("");
  
  const [mainCategories, setMainCategories] = useState<TransactionCategory[]>([]);
  const [subcategories, setSubcategories] = useState<TransactionCategory[]>([]);
  const [items, setItems] = useState<TransactionCategory[]>([]);
  
  // Load categories from localStorage when the component mounts
  useEffect(() => {
    const storedCategories = localStorage.getItem('categories');
    if (storedCategories) {
      const allCategories = JSON.parse(storedCategories) as TransactionCategory[];
      
      // Get level 2 categories (main categories)
      const mainCats = allCategories.filter(cat => cat.level === 2 && cat.type === type);
      setMainCategories(mainCats);
      
      // If a main category is selected, get its subcategories (level 3)
      if (parentId) {
        const subCats = allCategories.filter(cat => cat.parentId === parentId);
        setSubcategories(subCats);
        
        // If a subcategory is selected, get its items (level 4)
        if (level === 4) {
          const selectedSubcategory = subcategories.find(subcat => subcat.id === parentId);
          if (selectedSubcategory) {
            const categoryItems = allCategories.filter(cat => cat.parentId === selectedSubcategory.id);
            setItems(categoryItems);
          }
        }
      }
    }
  }, [type, parentId, level]);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!categoryName.trim()) {
      toast.error("Por favor, insira um nome para a categoria");
      return;
    }
    
    // Create the new category based on the current level
    let newCategory: Partial<TransactionCategory> = {
      name: categoryName,
      type: type,
      level: level,
    };
    
    // Add parent ID if we're at level 3 or 4
    if (level > 2) {
      newCategory.parentId = parentId;
    }
    
    // Save the category
    onSave(newCategory);
    
    // Reset the form
    setCategoryName("");
    
    // Move to next level if we're not at level 4 yet
    if (level < 4) {
      setLevel(level + 1);
    }
  };
  
  // This function helps us go back to a specific level
  const goToLevel = (newLevel: number) => {
    setLevel(newLevel);
    // Clear the name field
    setCategoryName("");
    
    // If we're going back to level 2, clear the parent ID
    if (newLevel === 2) {
      setParentId("");
      setSubcategories([]);
      setItems([]);
    }
    // If we're going back to level 3, clear level 4 items
    else if (newLevel === 3) {
      setItems([]);
    }
  };
  
  const renderLevelSelector = () => {
    return (
      <div className="flex mb-4 pt-2 space-x-2">
        {Array.from({ length: 3 }).map((_, index) => {
          const levelNumber = index + 2;
          const isActive = level === levelNumber;
          const isPrevious = levelNumber < level;
          const canNavigate = isPrevious || levelNumber === level;
          
          return (
            <Button
              key={levelNumber}
              type="button"
              variant={isActive ? "default" : "outline"}
              size="sm"
              className={cn(
                "flex-1",
                !canNavigate && "opacity-50 cursor-not-allowed"
              )}
              onClick={() => canNavigate && goToLevel(levelNumber)}
              disabled={!canNavigate}
            >
              Nível {levelNumber}
            </Button>
          );
        })}
      </div>
    );
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Adicionar Nova Categoria</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {level === 2 && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="type">Tipo de Categoria (Nível 1)</Label>
                <RadioGroup
                  value={type}
                  onValueChange={(value: "income" | "expense") => {
                    setType(value);
                    setParentId("");
                  }}
                  className="flex"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="expense" id="expense" />
                    <Label htmlFor="expense">Despesa</Label>
                  </div>
                  <div className="flex items-center space-x-2 ml-4">
                    <RadioGroupItem value="income" id="income" />
                    <Label htmlFor="income">Receita</Label>
                  </div>
                </RadioGroup>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="categoryName">Nome da Categoria (Nível 2)</Label>
                <Input
                  id="categoryName"
                  value={categoryName}
                  onChange={(e) => setCategoryName(e.target.value)}
                  placeholder="Ex: Pessoal, Negócios, Lazer..."
                />
              </div>
            </div>
          )}
          
          {level === 3 && (
            <div className="space-y-4">
              {renderLevelSelector()}
              
              <div className="space-y-2">
                <Label htmlFor="parentCategory">Categoria Principal (Nível 2)</Label>
                <Select
                  value={parentId}
                  onValueChange={(value) => {
                    setParentId(value);
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione uma categoria" />
                  </SelectTrigger>
                  <SelectContent>
                    {mainCategories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="categoryName">Nome da Subcategoria (Nível 3)</Label>
                <Input
                  id="categoryName"
                  value={categoryName}
                  onChange={(e) => setCategoryName(e.target.value)}
                  placeholder="Ex: Salários, Rendas, Equipamentos..."
                />
              </div>
              
              {subcategories.length > 0 && (
                <div className="mt-4">
                  <p className="text-sm font-medium mb-2">Subcategorias Existentes:</p>
                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {subcategories.map((subcat) => (
                      <li key={subcat.id} className="text-sm p-2 bg-muted/50 rounded-md">
                        {subcat.name}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
          
          {level === 4 && (
            <div className="space-y-4">
              {renderLevelSelector()}
              
              <div className="space-y-2">
                <Label htmlFor="parentSubcategory">Subcategoria (Nível 3)</Label>
                <Select
                  value={parentId}
                  onValueChange={(value) => {
                    setParentId(value);
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione uma subcategoria" />
                  </SelectTrigger>
                  <SelectContent>
                    {subcategories.map((subcat) => (
                      <SelectItem key={subcat.id} value={subcat.id}>
                        {subcat.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="categoryName">Nome do Item (Nível 4)</Label>
                <Input
                  id="categoryName"
                  value={categoryName}
                  onChange={(e) => setCategoryName(e.target.value)}
                  placeholder="Ex: Carlos, Antonio, Leandro..."
                />
              </div>
              
              {items.length > 0 && (
                <div className="mt-4">
                  <p className="text-sm font-medium mb-2">Itens Existentes:</p>
                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {items.map((item) => (
                      <li key={item.id} className="text-sm p-2 bg-muted/70 rounded-md">
                        {item.name}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
          
          <Button 
            type="submit"
            className="w-full"
            disabled={level > 2 && !parentId}
          >
            {level < 4 ? "Adicionar e Continuar" : "Adicionar Item"}
          </Button>
          
          {level > 2 && (
            <Button
              type="button"
              variant="outline"
              className="w-full mt-2"
              onClick={() => goToLevel(level - 1)}
            >
              Voltar ao Nível Anterior
            </Button>
          )}
        </form>
      </CardContent>
    </Card>
  );
};

export default CategoryForm;
