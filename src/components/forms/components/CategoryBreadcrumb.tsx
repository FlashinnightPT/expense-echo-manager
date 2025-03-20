
import { ChevronRight, Home } from "lucide-react";
import { TransactionCategory } from "@/utils/mockData";

interface CategoryBreadcrumbProps {
  type: "expense" | "income";
  parentPath: TransactionCategory[];
  clearSelection: () => void;
  onSelectPathItem: (category: TransactionCategory, index: number) => void;
  disabled?: boolean;
}

const CategoryBreadcrumb = ({ type, parentPath, clearSelection, onSelectPathItem, disabled = false }: CategoryBreadcrumbProps) => {
  const typeName = type === "expense" ? "Despesas" : "Receitas";
  
  return (
    <div className="text-sm">
      <div className="text-muted-foreground mb-1">Localização:</div>
      
      <nav className="flex items-center flex-wrap gap-1">
        <button
          type="button"
          onClick={clearSelection}
          className="flex items-center hover:text-primary transition-colors"
          disabled={disabled}
        >
          <Home className="h-4 w-4 mr-1" />
          <span>{typeName}</span>
        </button>
        
        {parentPath.map((category, index) => (
          <span key={category.id} className="flex items-center">
            <ChevronRight className="h-4 w-4 mx-1 text-muted-foreground" />
            <button
              type="button"
              onClick={() => onSelectPathItem(category, index)}
              className={`hover:text-primary transition-colors ${
                index === parentPath.length - 1 ? "font-medium" : ""
              }`}
              disabled={disabled}
            >
              {category.name}
            </button>
          </span>
        ))}
      </nav>
    </div>
  );
};

export default CategoryBreadcrumb;
