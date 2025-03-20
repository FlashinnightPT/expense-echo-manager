
import React from "react";
import { TransactionCategory } from "@/utils/mockData";
import { cn } from "@/lib/utils";
import { Pencil, Trash2, ChevronRight, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import FixedExpenseToggle from "@/components/categories/FixedExpenseCheckbox";

interface CategoryItemProps {
  category: TransactionCategory;
  expanded: boolean;
  hasChildren: boolean;
  onToggleExpand: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onToggleFixedExpense: () => void;
  children?: React.ReactNode;
  disabled?: boolean;
}

const CategoryItem = ({
  category,
  expanded,
  hasChildren,
  onToggleExpand,
  onEdit,
  onDelete,
  onToggleFixedExpense,
  children,
  disabled = false
}: CategoryItemProps) => {
  // Determinar explicitamente se a categoria está inativa verificando se isActive é false
  const isInactive = category.isActive === false;
  
  console.log("Renderizando categoria:", {
    nome: category.name,
    isActive: category.isActive,
    isInactive: isInactive,
    tipoIsActive: typeof category.isActive
  });
  
  return (
    <div className="category-item">
      <div
        className={cn(
          "flex items-center justify-between py-2 px-3 rounded-md border border-transparent",
          "hover:bg-accent/50 hover:border-accent/50",
          expanded && "bg-accent/30 border-accent/30",
          isInactive && "opacity-60"
        )}
      >
        <div className="flex items-center gap-2 flex-grow">
          {hasChildren ? (
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 p-0"
              onClick={onToggleExpand}
              disabled={disabled}
            >
              {expanded ? (
                <ChevronDown className="h-4 w-4" />
              ) : (
                <ChevronRight className="h-4 w-4" />
              )}
            </Button>
          ) : (
            <div className="w-6" />
          )}
          
          <span className={cn(
            "text-sm font-medium",
            isInactive && "line-through text-muted-foreground"
          )}>
            {category.name}
            {isInactive && <span className="ml-2 text-xs">(inativa)</span>}
          </span>
        </div>
        
        <div className="flex items-center gap-1">
          {category.type === "expense" && (
            <FixedExpenseToggle
              checked={category.isFixedExpense || false}
              onToggle={onToggleFixedExpense}
              disabled={disabled}
            />
          )}
          
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6"
            onClick={onEdit}
            disabled={disabled}
          >
            <Pencil className="h-3.5 w-3.5" />
          </Button>
          
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 text-destructive"
            onClick={onDelete}
            disabled={disabled}
          >
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>
      
      {children}
    </div>
  );
};

export default CategoryItem;
