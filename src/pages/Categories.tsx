import { useState, useEffect } from "react";
import Header from "@/components/layout/Header";
import CategoryForm from "@/components/forms/CategoryForm";
import { categories as defaultCategories, TransactionCategory, transactions as mockTransactions } from "@/utils/mockData";
import { toast } from "sonner";
import CategoryList from "@/components/categories/CategoryList";
import CategoryActions from "@/components/categories/CategoryActions";
import { DeleteCategoryDialog } from "@/components/categories/CategoryDialogs";

const Categories = () => {
  const initCategories = () => {
    const storedCategories = localStorage.getItem('categories');
    if (!storedCategories) {
      localStorage.setItem('categories', JSON.stringify(defaultCategories));
      return defaultCategories;
    }
    
    // Parse the categories and log them for debugging
    const parsedCategories = JSON.parse(storedCategories);
    console.log("Loaded categories from localStorage:", parsedCategories);
    return parsedCategories;
  };
  
  const initTransactions = () => {
    const storedTransactions = localStorage.getItem('transactions');
    return storedTransactions ? JSON.parse(storedTransactions) : mockTransactions;
  };

  const [categoryList, setCategoryList] = useState<TransactionCategory[]>(initCategories());
  const [transactionList, setTransactionList] = useState(initTransactions());
  const [categoryToDelete, setCategoryToDelete] = useState<string | null>(null);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openClearTransactionsDialog, setOpenClearTransactionsDialog] = useState(false);

  useEffect(() => {
    localStorage.setItem('categories', JSON.stringify(categoryList));
    console.log("Categories saved to localStorage:", categoryList);
  }, [categoryList]);
  
  useEffect(() => {
    localStorage.setItem('transactions', JSON.stringify(transactionList));
  }, [transactionList]);

  const handleSaveCategory = (category: Partial<TransactionCategory>) => {
    // Ensure that we have all required fields
    if (!category.name || !category.type || !category.level) {
      toast.error("Dados de categoria incompletos");
      return;
    }

    // Create the new category with proper handling of parentId
    const newCategory: TransactionCategory = {
      id: `${category.type}-${category.level}-${Date.now()}`,
      name: category.name,
      type: category.type,
      level: category.level,
      ...(category.parentId && { parentId: category.parentId })
    };

    console.log("Adding new category:", newCategory);
    
    const updatedList = [...categoryList, newCategory];
    setCategoryList(updatedList);
    
    // Debug logging
    console.log("Categoria adicionada:", newCategory);
    console.log("Nova lista de categorias:", updatedList);
    
    toast.success(`Categoria "${newCategory.name}" adicionada com sucesso`);
  };

  const handleDeleteCategory = (categoryId: string) => {
    const hasChildren = categoryList.some(cat => cat.parentId === categoryId);
    
    if (hasChildren) {
      toast.error("Não é possível apagar uma categoria que tem subcategorias. Apague as subcategorias primeiro.");
      return;
    }
    
    const isUsedInTransactions = transactionList.some(transaction => transaction.categoryId === categoryId);
    
    if (isUsedInTransactions) {
      toast.error("Esta categoria está sendo usada em transações. Apague as transações primeiro ou altere a categoria delas.");
      return;
    }
    
    setCategoryToDelete(categoryId);
    setOpenDeleteDialog(true);
  };

  const confirmDeleteCategory = () => {
    if (categoryToDelete) {
      const updatedList = categoryList.filter(cat => cat.id !== categoryToDelete);
      setCategoryList(updatedList);
      toast.success("Categoria apagada com sucesso");
      setOpenDeleteDialog(false);
      setCategoryToDelete(null);
    }
  };

  const handleClearTransactions = () => {
    setOpenClearTransactionsDialog(true);
  };

  const confirmClearTransactions = () => {
    setTransactionList([]);
    localStorage.setItem('transactions', JSON.stringify([]));
    setOpenClearTransactionsDialog(false);
    toast.success("Todas as transações foram apagadas com sucesso");
  };

  const handleResetCategories = () => {
    localStorage.removeItem('categories');
    setCategoryList(defaultCategories);
    toast.success("Categorias reiniciadas para o padrão");
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
            confirmClearTransactions={confirmClearTransactions}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <CategoryForm onSave={handleSaveCategory} categoryList={categoryList} />
          </div>
          
          <div className="lg:col-span-2">
            <CategoryList 
              categoryList={categoryList}
              handleDeleteCategory={handleDeleteCategory}
            />
          </div>
        </div>
      </div>

      <DeleteCategoryDialog
        open={openDeleteDialog}
        onOpenChange={setOpenDeleteDialog}
        onConfirm={confirmDeleteCategory}
      />
    </div>
  );
};

export default Categories;
