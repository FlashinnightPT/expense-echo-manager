
import { TransactionCategory } from "@/utils/mockData";
import { ChevronRight } from "lucide-react";

interface CategorySelectionListProps {
  categories: TransactionCategory[];
  selectedCategoryId: string;
  onSelectCategory: (category: TransactionCategory) => void;
  disabled?: boolean;
}

const CategorySelectionList = ({ 
  categories, 
  selectedCategoryId, 
  onSelectCategory,
  disabled = false
}: CategorySelectionListProps) => {
  return (
    <div>
      <div className="text-sm text-muted-foreground mb-2">
        {categories.length === 0 
          ? "Nenhuma categoria disponível neste nível" 
          : "Selecione uma categoria:"}
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {categories.map(category => (
          <button
            key={category.id}
            type="button"
            className={`flex items-center justify-between p-2 text-left border rounded-md transition-colors ${
              selectedCategoryId === category.id
                ? 'bg-primary/10 border-primary/30'
                : 'hover:bg-accent'
            }`}
            onClick={() => onSelectCategory(category)}
            disabled={disabled}
          >
            <span className="truncate">{category.name}</span>
            <ChevronRight className="h-4 w-4 flex-shrink-0 text-muted-foreground" />
          </button>
        ))}
      </div>
    </div>
  );
};

export default CategorySelectionList;
