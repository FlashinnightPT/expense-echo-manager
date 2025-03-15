
import { FolderPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TransactionCategory } from "@/utils/mockData";
import { cn } from "@/lib/utils";

interface CategorySelectionListProps {
  categories: TransactionCategory[];
  selectedCategoryId: string;
  onSelectCategory: (category: TransactionCategory) => void;
}

const CategorySelectionList = ({ 
  categories, 
  selectedCategoryId, 
  onSelectCategory 
}: CategorySelectionListProps) => {
  if (categories.length === 0) {
    return (
      <div className="text-sm text-muted-foreground italic">
        Não existem categorias neste nível. Adicione uma nova.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
      {categories.map(category => (
        <div 
          key={category.id} 
          className={cn(
            "p-2 border rounded-md cursor-pointer transition-colors",
            "hover:bg-accent hover:border-accent-foreground/20",
            selectedCategoryId === category.id ? "bg-accent border-accent-foreground/20" : "bg-card"
          )}
          onClick={() => onSelectCategory(category)}
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
                onSelectCategory(category);
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
  );
};

export default CategorySelectionList;
