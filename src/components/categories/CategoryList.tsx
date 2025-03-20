
import { useEffect } from "react";
import { TransactionCategory } from "@/utils/mockData";
import { useCategoryListState } from "./hooks/useCategoryListState";
import { EditCategoryDialog } from "./EditCategoryDialog";
import CategoryTypeSection from "./components/CategoryTypeSection";
import CategoryItem from "./components/CategoryItem";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui-custom/Card";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

interface CategoryListProps {
  categoryList: TransactionCategory[];
  handleDeleteCategory: (categoryId: string) => void;
  updateCategoryName: (categoryId: string, newName: string) => boolean;
  moveCategory: (categoryId: string, newParentId: string | null) => boolean;
  updateFixedExpense: (categoryId: string, isFixedExpense: boolean) => boolean;
  isLoading?: boolean;
}

const CategoryList = ({
  categoryList,
  handleDeleteCategory,
  updateCategoryName,
  moveCategory,
  updateFixedExpense,
  isLoading = false
}: CategoryListProps) => {
  const {
    expandedCategories,
    editingCategory,
    editDialogOpen,
    setEditDialogOpen,
    toggleCategoryExpansion,
    openEditDialog
  } = useCategoryListState();

  const getChildrenForCategory = (parentId: string) => {
    return categoryList.filter(cat => cat.parentId === parentId);
  };

  const renderCategory = (category: TransactionCategory): JSX.Element => {
    const children = getChildrenForCategory(category.id);
    const isExpanded = expandedCategories[category.id];

    return (
      <CategoryItem
        key={category.id}
        category={category}
        expanded={isExpanded}
        hasChildren={children.length > 0}
        onToggleExpand={() => toggleCategoryExpansion(category.id)}
        onEdit={() => openEditDialog(category)}
        onDelete={() => handleDeleteCategory(category.id)}
        onToggleFixedExpense={() => {
          updateFixedExpense(
            category.id,
            !category.isFixedExpense
          );
        }}
        disabled={isLoading}
      >
        {isExpanded && children.length > 0 && (
          <div className="pl-6 border-l border-dashed border-border/50 ml-2 mt-2 space-y-2">
            {children.map(childCategory => renderCategory(childCategory))}
          </div>
        )}
      </CategoryItem>
    );
  };

  const handleSaveEdit = (newName: string) => {
    if (editingCategory) {
      updateCategoryName(editingCategory.id, newName);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Categorias Existentes</CardTitle>
      </CardHeader>
      <CardContent className="space-y-8">
        {isLoading ? (
          <div className="flex justify-center py-8">
            <LoadingSpinner size="lg" />
          </div>
        ) : (
          <>
            <CategoryTypeSection
              type="income"
              categoryList={categoryList}
              expandedCategories={expandedCategories}
              onToggleExpansion={toggleCategoryExpansion}
              onEditCategory={openEditDialog}
              onDeleteCategory={handleDeleteCategory}
              getChildrenForCategory={getChildrenForCategory}
              renderCategory={renderCategory}
              updateFixedExpense={updateFixedExpense}
            />

            <CategoryTypeSection
              type="expense"
              categoryList={categoryList}
              expandedCategories={expandedCategories}
              onToggleExpansion={toggleCategoryExpansion}
              onEditCategory={openEditDialog}
              onDeleteCategory={handleDeleteCategory}
              getChildrenForCategory={getChildrenForCategory}
              renderCategory={renderCategory}
              updateFixedExpense={updateFixedExpense}
            />
          </>
        )}

        {editingCategory && (
          <EditCategoryDialog
            category={editingCategory}
            open={editDialogOpen}
            onOpenChange={setEditDialogOpen}
            onSave={handleSaveEdit}
          />
        )}
      </CardContent>
    </Card>
  );
};

export default CategoryList;
