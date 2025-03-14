
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
import { PlusCircle } from "lucide-react";

interface CategoryFormProps {
  onSave: (category: Partial<TransactionCategory>) => void;
  categoryList: TransactionCategory[];
}

const CategoryForm = ({ onSave, categoryList }: CategoryFormProps) => {
  const [type, setType] = useState<"income" | "expense">("expense");
  const [level, setLevel] = useState(2);
  const [categoryName, setCategoryName] = useState("");
  const [parentId, setParentId] = useState("");
  
  const [mainCategories, setMainCategories] = useState<TransactionCategory[]>([]);
  const [subcategories, setSubcategories] = useState<TransactionCategory[]>([]);
  const [items, setItems] = useState<TransactionCategory[]>([]);
  
  // Effect to filter and set main categories when type changes
  useEffect(() => {
    console.log("Filtering main categories for type:", type);
    console.log("Full category list:", categoryList);
    
    // Reset parentId when changing type
    setParentId("");
    
    // Filter level 2 categories (main categories)
    const filteredMainCats = categoryList.filter(cat => 
      cat.level === 2 && cat.type === type
    );
    console.log("Filtered main categories:", filteredMainCats);
    setMainCategories(filteredMainCats);
  }, [categoryList, type]);
  
  // Effect to reset subcategories when level changes
  useEffect(() => {
    if (level === 3) {
      // When going to level 3, we need available level 2 categories
      const availableL2Categories = categoryList.filter(cat => 
        cat.level === 2 && cat.type === type
      );
      setMainCategories(availableL2Categories);
    } else if (level === 4) {
      // When going to level 4, we need available level 3 categories
      const availableL3Categories = categoryList.filter(cat => 
        cat.level === 3 && cat.type === type
      );
      setSubcategories(availableL3Categories);
    }
  }, [categoryList, level, type]);
  
  // Effect to filter subcategories when parentId changes
  useEffect(() => {
    if (!parentId) return;
    
    console.log("Parent ID selected:", parentId);
    
    if (level === 3) {
      // Don't need to do anything here as we already set the main categories
    } else if (level === 4) {
      // For level 4, we filter items based on the selected level 3 parent
      const filteredItems = categoryList.filter(cat => 
        cat.parentId === parentId && cat.level === 4
      );
      console.log("Filtered items for level 4:", filteredItems);
      setItems(filteredItems);
    }
  }, [categoryList, parentId, level]);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!categoryName.trim()) {
      toast.error("Por favor, insira um nome para a categoria");
      return;
    }
    
    let newCategory: Partial<TransactionCategory> = {
      name: categoryName,
      type: type,
      level: level,
    };
    
    if (level > 2) {
      if (!parentId) {
        toast.error(`Selecione uma ${level === 3 ? "categoria principal" : "subcategoria"}`);
        return;
      }
      newCategory.parentId = parentId;
    }
    
    console.log("Submitting new category:", newCategory);
    onSave(newCategory);
    
    // Reset form after save
    setCategoryName("");
    
    toast.success(`${getCategoryLevelName(level)} "${categoryName}" adicionado com sucesso`);
  };
  
  const getCategoryLevelName = (level: number): string => {
    switch (level) {
      case 2: return "Categoria";
      case 3: return "Subcategoria";
      case 4: return "Item";
      default: return "Categoria";
    }
  };
  
  const goToLevel = (newLevel: number) => {
    setLevel(newLevel);
    setCategoryName("");
    setParentId("");
    
    if (newLevel === 2) {
      setSubcategories([]);
      setItems([]);
    } else if (newLevel === 3) {
      setItems([]);
    }
  };
  
  const goToNextLevel = () => {
    if (level < 4) {
      setLevel(level + 1);
      setCategoryName("");
      setParentId("");
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
  
  const renderLevel2Form = () => (
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
  );
  
  const renderLevel3Form = () => (
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
            {mainCategories.length > 0 ? (
              mainCategories.map((category) => (
                <SelectItem key={category.id} value={category.id}>
                  {category.name}
                </SelectItem>
              ))
            ) : (
              <SelectItem value="empty" disabled>
                Nenhuma categoria disponível
              </SelectItem>
            )}
          </SelectContent>
        </Select>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="categoryName">Nome da Subcategoria (Nível 3)</Label>
        <Input
          id="categoryName"
          value={categoryName}
          onChange={(e) => setCategoryName(e.target.value)}
          placeholder="Ex: Salarios, Impostos, Seguros..."
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
  );
  
  const renderLevel4Form = () => (
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
            {subcategories.length > 0 ? (
              subcategories.map((subcat) => (
                <SelectItem key={subcat.id} value={subcat.id}>
                  {subcat.name}
                </SelectItem>
              ))
            ) : (
              <SelectItem value="empty" disabled>
                Nenhuma subcategoria disponível
              </SelectItem>
            )}
          </SelectContent>
        </Select>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="categoryName">Nome do Item (Nível 4)</Label>
        <Input
          id="categoryName"
          value={categoryName}
          onChange={(e) => setCategoryName(e.target.value)}
          placeholder="Ex: Carlos, Leandro, Ana Paula..."
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
  );
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Adicionar Nova Categoria</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {level === 2 && renderLevel2Form()}
          {level === 3 && renderLevel3Form()}
          {level === 4 && renderLevel4Form()}
          
          <div className="space-y-2">
            <Button 
              type="submit"
              className="w-full"
              disabled={level > 2 && !parentId}
            >
              <PlusCircle className="mr-2 h-4 w-4" />
              Adicionar {getCategoryLevelName(level)}
            </Button>
            
            {level < 4 && (
              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={goToNextLevel}
                disabled={(level === 3 && !parentId) || !categoryName}
              >
                Continuar para Nível {level + 1}
              </Button>
            )}
            
            {level > 2 && (
              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={() => goToLevel(level - 1)}
              >
                Voltar ao Nível Anterior
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default CategoryForm;
