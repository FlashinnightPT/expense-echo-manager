
import { ReactNode } from "react";
import { TransactionCategory } from "@/utils/mockData";
import { Edit, Trash2, ChevronRight, ChevronDown, FolderIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import FixedExpenseCheckbox from "../FixedExpenseCheckbox";

interface CategoryItemProps {
  category: TransactionCategory;
  expanded: boolean;
  hasChildren: boolean;
  onToggleExpand: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onToggleFixedExpense: () => void;
  children?: ReactNode;
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
  const handleExpand = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (hasChildren) {
      onToggleExpand();
    }
  };

  const getIconForLevel = () => {
    if (category.level === 1) {
      return null;
    }
    
    return (
      <FolderIcon className={cn("h-4 w-4 mr-2", 
        category.level === 2 ? "text-blue-500" : 
        category.level === 3 ? "text-green-500" : "text-amber-500"
      )} />
    );
  };

  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between group p-2 rounded-md border border-border hover:bg-accent transition-colors">
        <div className="flex-1">
          <div 
            className="flex items-center cursor-pointer"
            onClick={handleExpand}
          >
            <button
              type="button"
              onClick={handleExpand}
              className="mr-2 flex-shrink-0 h-5 w-5 flex items-center justify-center"
              disabled={!hasChildren || disabled}
            >
              {hasChildren && (
                expanded ? (
                  <ChevronDown className="h-4 w-4" />
                ) : (
                  <ChevronRight className="h-4 w-4" />
                )
              )}
            </button>
            
            <div className="flex items-center">
              {getIconForLevel()}
              <span>{category.name}</span>
              
              <div className="ml-2 text-xs text-muted-foreground bg-background/50 border px-1 rounded">
                Nível {category.level}
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          {category.type === "expense" && (
            <FixedExpenseCheckbox
              checked={!!category.isFixedExpense}
              onToggle={onToggleFixedExpense}
              disabled={disabled}
            />
          )}
          
          <div className="flex">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={onEdit}
              disabled={disabled}
            >
              <Edit className="h-4 w-4" />
            </Button>
            
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-destructive"
              onClick={onDelete}
              disabled={disabled}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
      
      {children}
    </div>
  );
};

export default CategoryItem;
