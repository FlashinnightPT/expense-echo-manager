
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui-custom/Card";
import { Button } from "@/components/ui/button";
import { TransactionCategory } from "@/utils/mockData";
import { ChevronDown, ChevronRight, Trash2 } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

interface CategoryListProps {
  categoryList: TransactionCategory[];
  handleDeleteCategory: (categoryId: string) => void;
}

const CategoryList = ({ categoryList, handleDeleteCategory }: CategoryListProps) => {
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({});

  const toggleCategoryExpansion = (categoryId: string) => {
    setExpandedCategories(prev => ({
      ...prev,
      [categoryId]: !prev[categoryId]
    }));
  };

  const renderCategoriesByType = (type: string) => {
    const mainCategories = categoryList.filter(cat => cat.type === type && cat.level === 2);
    
    if (mainCategories.length === 0) {
      return <p className="text-sm text-muted-foreground">Nenhuma categoria deste tipo</p>;
    }
    
    return (
      <div className="space-y-2">
        {mainCategories.map(category => renderMainCategory(category))}
      </div>
    );
  };

  const renderMainCategory = (category: TransactionCategory) => {
    const subcategories = categoryList.filter(c => c.parentId === category.id);
    const isExpanded = expandedCategories[category.id] || false;

    return (
      <div key={category.id} className="mb-3">
        <Collapsible open={isExpanded} onOpenChange={() => toggleCategoryExpansion(category.id)}>
          <div className="flex items-center justify-between p-3 border rounded-md bg-background hover:bg-accent/20 transition-colors">
            <div className="flex items-center space-x-2">
              {subcategories.length > 0 ? (
                <CollapsibleTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-5 w-5 p-0">
                    {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                  </Button>
                </CollapsibleTrigger>
              ) : <div className="w-5" />}
              <div>
                <span className="font-medium">{category.name}</span>
                <p className="text-xs text-muted-foreground">Nível 2</p>
              </div>
            </div>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8 text-destructive hover:bg-destructive/10"
              onClick={(e) => {
                e.stopPropagation();
                handleDeleteCategory(category.id);
              }}
            >
              <Trash2 className="h-4 w-4" />
              <span className="sr-only">Apagar categoria</span>
            </Button>
          </div>
          
          {subcategories.length > 0 && (
            <CollapsibleContent>
              <div className="pl-6 mt-2 space-y-2">
                {subcategories.map(subcat => renderSubcategory(subcat))}
              </div>
            </CollapsibleContent>
          )}
        </Collapsible>
      </div>
    );
  };

  const renderSubcategory = (category: TransactionCategory) => {
    const items = categoryList.filter(c => c.parentId === category.id);
    const isExpanded = expandedCategories[category.id] || false;
    const isLevel3 = category.level === 3;
    const isLevel4 = category.level === 4;

    const bgClasses = isLevel3 
      ? "bg-muted/30" 
      : "bg-muted/50";

    return (
      <div key={category.id} className="mb-2">
        <Collapsible open={isExpanded} onOpenChange={() => toggleCategoryExpansion(category.id)}>
          <div className={`flex items-center justify-between p-2 border rounded-md ${bgClasses} hover:bg-accent/20 transition-colors`}>
            <div className="flex items-center space-x-2">
              {items.length > 0 ? (
                <CollapsibleTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-5 w-5 p-0">
                    {isExpanded ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
                  </Button>
                </CollapsibleTrigger>
              ) : <div className="w-5" />}
              <div>
                <span>{category.name}</span>
                <p className="text-xs text-muted-foreground">
                  {isLevel4 ? "Nível 4 (máximo)" : isLevel3 ? "Nível 3" : `Nível ${category.level}`}
                </p>
              </div>
            </div>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-7 w-7 text-destructive hover:bg-destructive/10"
              onClick={(e) => {
                e.stopPropagation();
                handleDeleteCategory(category.id);
              }}
            >
              <Trash2 className="h-3 w-3" />
              <span className="sr-only">Apagar subcategoria</span>
            </Button>
          </div>
          
          {items.length > 0 && (
            <CollapsibleContent>
              <div className="pl-5 mt-2 space-y-2">
                {items.map(item => renderSubcategory(item))}
              </div>
            </CollapsibleContent>
          )}
        </Collapsible>
      </div>
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Categorias Existentes</CardTitle>
      </CardHeader>
      <CardContent>
        {categoryList.length === 0 ? (
          <Alert>
            <AlertTitle>Sem Categorias</AlertTitle>
            <AlertDescription>
              Não existem categorias definidas. Adicione uma categoria utilizando o formulário.
            </AlertDescription>
          </Alert>
        ) : (
          <div className="space-y-4">
            {["income", "expense"].map((type) => (
              <div key={type} className="space-y-2">
                <h3 className="font-medium text-lg capitalize">
                  {type === "income" ? "Receitas" : "Despesas"}
                </h3>
                <div className="grid grid-cols-1 gap-2">
                  {renderCategoriesByType(type)}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CategoryList;
