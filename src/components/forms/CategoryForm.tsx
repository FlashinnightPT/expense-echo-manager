
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui-custom/Card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { TransactionCategory } from "@/utils/mockData";
import { useCategoryForm } from "./hooks/useCategoryForm";
import CategoryBreadcrumb from "./components/CategoryBreadcrumb";
import CategorySelectionList from "./components/CategorySelectionList";
import NewCategoryInput from "./components/NewCategoryInput";

interface CategoryFormProps {
  onSave: (category: Partial<TransactionCategory>) => void;
  categoryList: TransactionCategory[];
}

const CategoryForm = ({ onSave, categoryList }: CategoryFormProps) => {
  const {
    type,
    setType,
    level,
    categoryName,
    setCategoryName,
    parentId,
    parentPath,
    handleSubmit,
    selectCategory,
    clearSelection,
    getAvailableCategories,
    getCategoryLevelName
  } = useCategoryForm({ onSave, categoryList });

  const onSelectPathItem = (category: TransactionCategory, index: number) => {
    // If clicking not the last item, truncate the path
    if (index < parentPath.length - 1) {
      const newPath = parentPath.slice(0, index + 1);
      const newLevel = category.level + 1;
      
      // Update form state through the hook
      selectCategory({
        ...category,
        level: category.level // we need to preserve the original level
      });
    }
  };

  // Wrapper for form submit to handle the event
  const onFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSubmit();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Adicionar Nova Categoria</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={onFormSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="type">Tipo de Categoria</Label>
            <RadioGroup
              value={type}
              onValueChange={(value: "income" | "expense") => {
                setType(value);
              }}
              className="flex"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="expense" id="expense" />
                <Label htmlFor="expense">Despesa</Label>
              </div>
              <div className="flex items-center space-x-2 ml-4">
                <RadioGroupItem value="income" id="income" />
                <Label htmlFor="income">Receita</Label>
              </div>
            </RadioGroup>
          </div>
          
          {/* Path/Breadcrumb Navigation */}
          <CategoryBreadcrumb 
            type={type}
            parentPath={parentPath}
            clearSelection={clearSelection}
            onSelectPathItem={onSelectPathItem}
          />
          
          {/* Category Selection */}
          <div className="space-y-3">
            <CategorySelectionList 
              categories={getAvailableCategories()}
              selectedCategoryId={parentId}
              onSelectCategory={selectCategory}
            />
          </div>
          
          {/* New Category Form */}
          <div className="pt-4 border-t">
            <NewCategoryInput 
              categoryName={categoryName}
              onCategoryNameChange={setCategoryName}
              levelName={getCategoryLevelName(level)}
              parentName={parentPath.length > 0 ? parentPath[parentPath.length-1]?.name : undefined}
              onSubmit={handleSubmit}
            />
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default CategoryForm;
