
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui-custom/Card";
import { Button } from "@/components/ui/button";
import { TransactionCategory } from "@/utils/mockData";
import { ChevronDown, ChevronRight, Edit, Folder, FolderOpen, Trash2 } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { EditCategoryDialog } from "./EditCategoryDialog";
import FixedExpenseCheckbox from "./FixedExpenseCheckbox";
import { ExtendedTransactionCategory } from "../dashboard/types/categoryTypes";

interface CategoryListProps {
  categoryList: TransactionCategory[];
  handleDeleteCategory: (categoryId: string) => void;
  updateCategoryName: (categoryId: string, newName: string) => boolean;
  moveCategory: (categoryId: string, newParentId: string | null) => boolean;
  updateFixedExpense?: (categoryId: string, isFixedExpense: boolean) => void;
}

const CategoryList = ({ 
  categoryList, 
  handleDeleteCategory,
  updateCategoryName,
  moveCategory,
  updateFixedExpense
}: CategoryListProps) => {
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({});
  const [editingCategory, setEditingCategory] = useState<TransactionCategory | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);

  const toggleCategoryExpansion = (categoryId: string) => {
    setExpandedCategories(prev => ({
      ...prev,
      [categoryId]: !prev[categoryId]
    }));
  };

  const openEditDialog = (category: TransactionCategory) => {
    setEditingCategory(category);
    setEditDialogOpen(true);
  };

  const handleRename = (categoryId: string, newName: string) => {
    updateCategoryName(categoryId, newName);
  };

  const handleMove = (categoryId: string, newParentId: string | null) => {
    moveCategory(categoryId, newParentId);
  };

  const handleFixedExpenseChange = (categoryId: string, isChecked: boolean) => {
    if (updateFixedExpense) {
      updateFixedExpense(categoryId, isChecked);
    }
  };

  const renderCategoriesByType = (type: string) => {
    const mainCategories = categoryList.filter(cat => cat.type === type && cat.level === 2);
    
    if (mainCategories.length === 0) {
      return <p className="text-sm text-muted-foreground">Nenhuma categoria deste tipo</p>;
    }
    
    return (
      <div className="space-y-2">
        {mainCategories.map(category => renderCategory(category))}
      </div>
    );
  };

  const getChildrenForCategory = (categoryId: string): TransactionCategory[] => {
    return categoryList.filter(cat => cat.parentId === categoryId);
  };

  const renderCategory = (category: TransactionCategory) => {
    const children = getChildrenForCategory(category.id);
    const isExpanded = expandedCategories[category.id] || false;
    const indentLevel = category.level - 2; // Level 2 has no indent
    const extendedCategory = category as ExtendedTransactionCategory;
    const isExpense = category.type === 'expense';

    return (
      <div key={category.id} className="mb-1" style={{ marginLeft: `${indentLevel * 16}px` }}>
        <Collapsible open={isExpanded} onOpenChange={() => toggleCategoryExpansion(category.id)}>
          <div className={`flex flex-col p-2 border rounded-md bg-background hover:bg-accent/20 transition-colors`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                {children.length > 0 ? (
                  <CollapsibleTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-7 w-7 p-0">
                      {isExpanded ? (
                        <FolderOpen className="h-4 w-4 text-amber-500" />
                      ) : (
                        <Folder className="h-4 w-4 text-amber-500" />
                      )}
                    </Button>
                  </CollapsibleTrigger>
                ) : (
                  <div className="w-7 flex justify-center">
                    <div className="h-2 w-2 rounded-full bg-primary/60 mt-1" />
                  </div>
                )}
                <div>
                  <span className="font-medium">{category.name}</span>
                  <p className="text-xs text-muted-foreground">Nível {category.level}</p>
                </div>
              </div>
              <div className="flex">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-8 w-8 text-primary hover:bg-primary/10"
                  onClick={(e) => {
                    e.stopPropagation();
                    openEditDialog(category);
                  }}
                >
                  <Edit className="h-4 w-4" />
                  <span className="sr-only">Editar categoria</span>
                </Button>
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
            </div>
            
            {/* Fixed Expense Checkbox - Only shown for expense categories */}
            {isExpense && updateFixedExpense && (
              <div className="mt-2 pt-2 border-t border-muted">
                <FixedExpenseCheckbox 
                  isChecked={!!extendedCategory.isFixedExpense}
                  onChange={(checked) => handleFixedExpenseChange(category.id, checked)}
                />
              </div>
            )}
          </div>
          
          {children.length > 0 && (
            <CollapsibleContent>
              <div className="mt-1 space-y-1">
                {children.map(child => renderCategory(child))}
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
          <div className="space-y-6">
            {["income", "expense"].map((type) => (
              <div key={type} className="space-y-3">
                <h3 className="font-medium text-lg capitalize border-b pb-1">
                  {type === "income" ? "Receitas" : "Despesas"}
                </h3>
                <div>
                  {renderCategoriesByType(type)}
                </div>
              </div>
            ))}
          </div>
        )}

        <EditCategoryDialog
          open={editDialogOpen}
          onOpenChange={setEditDialogOpen}
          category={editingCategory}
          categories={categoryList}
          onRename={handleRename}
          onMove={handleMove}
        />
      </CardContent>
    </Card>
  );
};

export default CategoryList;
