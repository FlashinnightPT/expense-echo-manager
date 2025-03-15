import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui-custom/Card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { TransactionCategory } from "@/utils/mockData";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { ChevronRight, FolderPlus, Plus, PlusCircle } from "lucide-react";

interface CategoryFormProps {
  onSave: (category: Partial<TransactionCategory>) => void;
  categoryList: TransactionCategory[];
}

const CategoryForm = ({ onSave, categoryList }: CategoryFormProps) => {
  const [type, setType] = useState<"income" | "expense">("expense");
  const [level, setLevel] = useState(2);
  const [categoryName, setCategoryName] = useState("");
  const [parentId, setParentId] = useState("");
  const [parentPath, setParentPath] = useState<TransactionCategory[]>([]);
  
  // Reset form fields when changing type
  useEffect(() => {
    console.log("Resetting form for type:", type);
    setParentId("");
    setParentPath([]);
    setLevel(2);
    setCategoryName("");
  }, [type]);
  
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
        toast.error(`Selecione uma categoria pai`);
        return;
      }
      newCategory.parentId = parentId;
    }
    
    console.log("Submitting new category:", newCategory);
    onSave(newCategory);
    
    // Keep the same parent but reset the name to allow quick adding of multiple items
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
  
  const selectCategory = (category: TransactionCategory) => {
    setParentId(category.id);
    
    // Update level based on the selected category
    setLevel(category.level + 1);
    
    // Create the path to this category
    const path: TransactionCategory[] = [];
    
    // Add the current category to path
    path.push(category);
    
    // Find parents recursively and add to path
    let currentParentId = category.parentId;
    while (currentParentId) {
      const parent = categoryList.find(c => c.id === currentParentId);
      if (parent) {
        path.unshift(parent); // Add to beginning of array
        currentParentId = parent.parentId;
      } else {
        break;
      }
    }
    
    setParentPath(path);
  };
  
  const clearSelection = () => {
    setParentId("");
    setParentPath([]);
    setLevel(2);
  };

  // Function to get all direct children of a category
  const getCategoryChildren = (parentCatId: string | null) => {
    return categoryList.filter(cat => {
      // For top level (null parent), show only level 2 categories of the selected type
      if (parentCatId === null) {
        return cat.level === 2 && cat.type === type;
      }
      // For other levels, show direct children
      return cat.parentId === parentCatId;
    });
  };
  
  // Get available categories at current selection level
  const getAvailableCategories = () => {
    if (parentPath.length === 0) {
      // Top level - show level 2 categories
      return getCategoryChildren(null);
    } else {
      // Show children of the last item in the path
      const lastPathItem = parentPath[parentPath.length - 1];
      return getCategoryChildren(lastPathItem.id);
    }
  };
  
  // Render the breadcrumb/path
  const renderPath = () => {
    if (parentPath.length === 0) {
      return (
        <div className="text-sm mb-4 flex items-center">
          <span className="font-medium">{type === 'income' ? 'Receitas' : 'Despesas'}</span>
        </div>
      );
    }
    
    return (
      <div className="text-sm mb-4 flex items-center flex-wrap">
        <span 
          className="cursor-pointer text-primary hover:underline"
          onClick={clearSelection}
        >
          {type === 'income' ? 'Receitas' : 'Despesas'}
        </span>
        
        {parentPath.map((category, index) => (
          <div key={category.id} className="flex items-center">
            <ChevronRight className="h-4 w-4 mx-1 text-muted-foreground" />
            <span 
              className={cn(
                "cursor-pointer hover:underline",
                index === parentPath.length - 1 ? "font-medium" : "text-primary"
              )}
              onClick={() => {
                // If clicking not the last item, truncate the path
                if (index < parentPath.length - 1) {
                  setParentPath(parentPath.slice(0, index + 1));
                  setParentId(category.id);
                  setLevel(category.level + 1);
                }
              }}
            >
              {category.name}
            </span>
          </div>
        ))}
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
          <div className="space-y-2">
            <Label htmlFor="type">Tipo de Categoria</Label>
            <RadioGroup
              value={type}
              onValueChange={(value: "income" | "expense") => {
                setType(value);
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
          
          {/* Path/Breadcrumb Navigation */}
          {renderPath()}
          
          {/* Category Selection */}
          <div className="space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {getAvailableCategories().map(category => (
                <div 
                  key={category.id} 
                  className={cn(
                    "p-2 border rounded-md cursor-pointer transition-colors",
                    "hover:bg-accent hover:border-accent-foreground/20",
                    parentId === category.id ? "bg-accent border-accent-foreground/20" : "bg-card"
                  )}
                  onClick={() => selectCategory(category)}
                >
                  <div className="flex justify-between items-center">
                    <span className="font-medium">{category.name}</span>
                    <Button 
                      type="button" 
                      variant="ghost" 
                      size="icon"
                      className="h-6 w-6"
                      onClick={(e) => {
                        e.stopPropagation();
                        selectCategory(category);
                      }}
                    >
                      <FolderPlus className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Nível {category.level}
                  </div>
                </div>
              ))}
            </div>
            
            {getAvailableCategories().length === 0 && (
              <div className="text-sm text-muted-foreground italic">
                Não existem categorias neste nível. Adicione uma nova.
              </div>
            )}
          </div>
          
          {/* New Category Form */}
          <div className="pt-4 border-t">
            <div className="space-y-2">
              <Label htmlFor="categoryName">
                Adicionar {getCategoryLevelName(level)}
                {parentId && ` em ${parentPath[parentPath.length-1]?.name || ""}`}
              </Label>
              <div className="flex space-x-2">
                <Input
                  id="categoryName"
                  value={categoryName}
                  onChange={(e) => setCategoryName(e.target.value)}
                  placeholder={`Nome do ${getCategoryLevelName(level).toLowerCase()}`}
                  className="flex-1"
                />
                <Button 
                  type="submit"
                  disabled={!categoryName.trim()}
                  className="whitespace-nowrap"
                >
                  <Plus className="mr-2 h-4 w-4" /> Adicionar
                </Button>
              </div>
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default CategoryForm;
