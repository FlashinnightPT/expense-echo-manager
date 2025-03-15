
import { ChevronRight } from "lucide-react";
import { TransactionCategory } from "@/utils/mockData";
import { cn } from "@/lib/utils";

interface CategoryBreadcrumbProps {
  type: "income" | "expense";
  parentPath: TransactionCategory[];
  clearSelection: () => void;
  onSelectPathItem: (category: TransactionCategory, index: number) => void;
}

const CategoryBreadcrumb = ({ 
  type, 
  parentPath, 
  clearSelection, 
  onSelectPathItem 
}: CategoryBreadcrumbProps) => {
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
            onClick={() => onSelectPathItem(category, index)}
          >
            {category.name}
          </span>
        </div>
      ))}
    </div>
  );
};

export default CategoryBreadcrumb;
