
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { TransactionCategory } from "@/utils/mockData";
import { Edit, Folder, FolderOpen, Trash2 } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import FixedExpenseCheckbox from "../FixedExpenseCheckbox";
import { ExtendedTransactionCategory } from "@/components/dashboard/types/categoryTypes";

interface CategoryItemProps {
  category: TransactionCategory;
  isExpanded: boolean;
  subcategories: TransactionCategory[];
  onToggleExpansion: (categoryId: string) => void;
  onEditCategory: (category: TransactionCategory) => void;
  onDeleteCategory: (categoryId: string) => void;
  updateFixedExpense?: (categoryId: string, isFixedExpense: boolean) => void;
}

const CategoryItem = ({
  category,
  isExpanded,
  subcategories,
  onToggleExpansion,
  onEditCategory,
  onDeleteCategory,
  updateFixedExpense
}: CategoryItemProps) => {
  const indentLevel = category.level - 2; // Level 2 has no indent
  const extendedCategory = category as ExtendedTransactionCategory;
  const isExpense = category.type === 'expense';

  const handleFixedExpenseChange = (checked: boolean) => {
    if (updateFixedExpense) {
      updateFixedExpense(category.id, checked);
    }
  };

  return (
    <div className="mb-1" style={{ marginLeft: `${indentLevel * 16}px` }}>
      <Collapsible open={isExpanded} onOpenChange={() => onToggleExpansion(category.id)}>
        <div className={`flex flex-col p-2 border rounded-md bg-background hover:bg-accent/20 transition-colors`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              {subcategories.length > 0 ? (
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
                  onEditCategory(category);
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
                  onDeleteCategory(category.id);
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
                onChange={handleFixedExpenseChange}
              />
            </div>
          )}
        </div>
        
        <CollapsibleContent>
          {/* Child categories will be rendered by the parent component */}
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
};

export default CategoryItem;
