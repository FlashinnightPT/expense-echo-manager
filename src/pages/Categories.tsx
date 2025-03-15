
import { useState } from "react";
import Header from "@/components/layout/Header";
import CategoryForm from "@/components/forms/CategoryForm";
import CategoryList from "@/components/categories/CategoryList";
import CategoryActions from "@/components/categories/CategoryActions";
import { DeleteCategoryDialog } from "@/components/categories/CategoryDialogs";
import { useCategoryData } from "@/hooks/useCategoryData";
import { useTransactionData } from "@/hooks/useTransactionData";
import { useDeleteDialogs } from "@/components/categories/hooks/useDeleteDialogs";
import { toast } from "sonner";

const Categories = () => {
  const { 
    categoryList, 
    handleSaveCategory, 
    handleDeleteCategory,
    confirmDeleteCategory,
    handleResetCategories 
  } = useCategoryData();

  const { 
    isCategoryUsedInTransactions,
    confirmClearTransactions 
  } = useTransactionData();

  const {
    categoryToDelete,
    openDeleteDialog,
    setOpenDeleteDialog,
    openClearTransactionsDialog,
    setOpenClearTransactionsDialog,
    showDeleteDialog,
    closeDeleteDialog,
    showClearTransactionsDialog
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

  const handleConfirmClearTransactions = () => {
    confirmClearTransactions();
    setOpenClearTransactionsDialog(false);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-4 py-8 pt-24">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">Gestão de Categorias</h1>
            <p className="text-muted-foreground mt-1">
              Adicione, edite ou elimine categorias
            </p>
          </div>
          <CategoryActions 
            handleResetCategories={handleResetCategories}
            openClearTransactionsDialog={openClearTransactionsDialog}
            setOpenClearTransactionsDialog={setOpenClearTransactionsDialog}
            confirmClearTransactions={handleConfirmClearTransactions}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <CategoryForm onSave={handleSaveCategory} categoryList={categoryList} />
          </div>
          
          <div className="lg:col-span-2">
            <CategoryList 
              categoryList={categoryList}
              handleDeleteCategory={attemptCategoryDeletion}
            />
          </div>
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
