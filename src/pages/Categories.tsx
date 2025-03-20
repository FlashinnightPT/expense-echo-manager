
import { useState } from "react";
import CategoryForm from "@/components/forms/CategoryForm";
import CategoryList from "@/components/categories/CategoryList";
import { DeleteCategoryDialog } from "@/components/categories/CategoryDialogs";
import { useCategoryData } from "@/hooks/useCategoryData";
import { useTransactionData } from "@/hooks/useTransactionData";
import { useDeleteDialogs } from "@/components/categories/hooks/useDeleteDialogs";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

const Categories = () => {
  const { 
    categoryList, 
    handleSaveCategory, 
    handleDeleteCategory,
    confirmDeleteCategory,
    updateCategoryName,
    moveCategory,
    updateFixedExpense,
    clearNonRootCategories
  } = useCategoryData();

  const { 
    isCategoryUsedInTransactions
  } = useTransactionData();

  const {
    categoryToDelete,
    openDeleteDialog,
    setOpenDeleteDialog,
    showDeleteDialog,
    closeDeleteDialog
  } = useDeleteDialogs();

  const attemptCategoryDeletion = (categoryId: string) => {
    if (isCategoryUsedInTransactions(categoryId)) {
      toast.error("Esta categoria está sendo usada em transações. Apague as transações primeiro ou altere a categoria delas.");
      return;
    }
    
    if (handleDeleteCategory(categoryId)) {
      showDeleteDialog(categoryId);
    }
  };

  const handleConfirmDeleteCategory = () => {
    if (categoryToDelete) {
      confirmDeleteCategory(categoryToDelete);
      closeDeleteDialog();
    }
  };
  
  const handleClearCategories = () => {
    if (window.confirm("Tem certeza que deseja apagar todas as categorias, exceto as de nível 1? Esta ação não pode ser desfeita.")) {
      clearNonRootCategories();
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Gestão de Categorias</h1>
          <p className="text-muted-foreground mt-1">
            Adicione, edite ou elimine categorias
          </p>
        </div>
        
        <Button 
          variant="destructive" 
          onClick={handleClearCategories}
          className="flex items-center"
        >
          <Trash2 className="h-4 w-4 mr-2" />
          Limpar Categorias
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <CategoryForm onSave={handleSaveCategory} categoryList={categoryList} />
        </div>
        
        <div className="lg:col-span-2">
          <CategoryList 
            categoryList={categoryList}
            handleDeleteCategory={attemptCategoryDeletion}
            updateCategoryName={updateCategoryName}
            moveCategory={moveCategory}
            updateFixedExpense={updateFixedExpense}
          />
        </div>
      </div>

      <DeleteCategoryDialog
        open={openDeleteDialog}
        onOpenChange={setOpenDeleteDialog}
        onConfirm={handleConfirmDeleteCategory}
      />
    </div>
  );
};

export default Categories;
