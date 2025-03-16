
import { TransactionCategory } from "@/utils/mockData";
import CategoryItem from "./CategoryItem";

interface CategoryTypeSectionProps {
  type: string;
  categoryList: TransactionCategory[];
  expandedCategories: Record<string, boolean>;
  onToggleExpansion: (categoryId: string) => void;
  onEditCategory: (category: TransactionCategory) => void;
  onDeleteCategory: (categoryId: string) => void;
  getChildrenForCategory: (categoryId: string) => TransactionCategory[];
  renderCategory: (category: TransactionCategory) => JSX.Element;
  updateFixedExpense?: (categoryId: string, isFixedExpense: boolean) => void;
}

const CategoryTypeSection = ({
  type,
  categoryList,
  expandedCategories,
  onToggleExpansion,
  onEditCategory,
  onDeleteCategory,
  getChildrenForCategory,
  renderCategory,
  updateFixedExpense
}: CategoryTypeSectionProps) => {
  const typeName = type === "income" ? "Receitas" : "Despesas";
  const mainCategories = categoryList.filter(cat => cat.type === type && cat.level === 2);
  
  return (
    <div className="space-y-3">
      <h3 className="font-medium text-lg capitalize border-b pb-1">
        {typeName}
      </h3>
      <div>
        {mainCategories.length === 0 ? (
          <p className="text-sm text-muted-foreground">Nenhuma categoria deste tipo</p>
        ) : (
          <div className="space-y-2">
            {mainCategories.map(category => renderCategory(category))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoryTypeSection;
