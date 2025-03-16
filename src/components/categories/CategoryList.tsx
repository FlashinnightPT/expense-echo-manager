
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui-custom/Card";
import { TransactionCategory } from "@/utils/mockData";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { EditCategoryDialog } from "./EditCategoryDialog";
import { useCategoryListState } from "./hooks/useCategoryListState";
import CategoryTypeSection from "./components/CategoryTypeSection";
import CategoryItem from "./components/CategoryItem";
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
  const {
    expandedCategories,
    editingCategory,
    editDialogOpen,
    setEditDialogOpen,
    toggleCategoryExpansion,
    openEditDialog
  } = useCategoryListState();

  const handleRename = (categoryId: string, newName: string) => {
    updateCategoryName(categoryId, newName);
  };

  const handleMove = (categoryId: string, newParentId: string | null) => {
    moveCategory(categoryId, newParentId);
  };

  const getChildrenForCategory = (categoryId: string): TransactionCategory[] => {
    return categoryList.filter(cat => cat.parentId === categoryId);
  };

  const renderCategory = (category: TransactionCategory): JSX.Element => {
    const children = getChildrenForCategory(category.id);
    const isExpanded = expandedCategories[category.id] || false;

    return (
      <CategoryItem
        key={category.id}
        category={category}
        isExpanded={isExpanded}
        children={children}
        onToggleExpansion={toggleCategoryExpansion}
        onEditCategory={openEditDialog}
        onDeleteCategory={handleDeleteCategory}
        updateFixedExpense={updateFixedExpense}
      >
        {children.length > 0 && (
          <div className="mt-1 space-y-1">
            {children.map(child => renderCategory(child))}
          </div>
        )}
      </CategoryItem>
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
              <CategoryTypeSection
                key={type}
                type={type}
                categoryList={categoryList}
                expandedCategories={expandedCategories}
                onToggleExpansion={toggleCategoryExpansion}
                onEditCategory={openEditDialog}
                onDeleteCategory={handleDeleteCategory}
                getChildrenForCategory={getChildrenForCategory}
                renderCategory={renderCategory}
                updateFixedExpense={updateFixedExpense}
              />
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
