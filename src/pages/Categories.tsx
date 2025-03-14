
import { useState, useEffect } from "react";
import Header from "@/components/layout/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui-custom/Card";
import CategoryForm from "@/components/forms/CategoryForm";
import { Button } from "@/components/ui/button";
import { categories, TransactionCategory, transactions as mockTransactions } from "@/utils/mockData";
import { toast } from "sonner";
import { Trash2 } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

const Categories = () => {
  const initCategories = () => {
    const storedCategories = localStorage.getItem('categories');
    return storedCategories ? JSON.parse(storedCategories) : categories;
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
  }, [categoryList]);
  
  useEffect(() => {
    localStorage.setItem('transactions', JSON.stringify(transactionList));
  }, [transactionList]);

  const handleSaveCategory = (category: Partial<TransactionCategory>) => {
    const newCategory: TransactionCategory = {
      id: `${category.type}-${Date.now()}`,
      name: category.name || "",
      type: category.type || "expense",
      level: category.level || 1,
      parentId: category.parentId,
    };

    setCategoryList([...categoryList, newCategory]);
    toast.success("Categoria adicionada com sucesso");
  };

  const handleDeleteCategory = (categoryId: string) => {
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
          <div className="flex gap-2">
            <Dialog open={openClearTransactionsDialog} onOpenChange={setOpenClearTransactionsDialog}>
              <DialogTrigger asChild>
                <Button variant="outline" className="mr-2">
                  <Trash2 className="mr-2 h-4 w-4" />
                  Apagar Todas as Transações
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Apagar Todas as Transações</DialogTitle>
                  <DialogDescription>
                    Esta ação irá apagar todas as transações registradas. Esta ação não pode ser revertida.
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setOpenClearTransactionsDialog(false)}>Cancelar</Button>
                  <Button variant="destructive" onClick={confirmClearTransactions}>Apagar Transações</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <CategoryForm onSave={handleSaveCategory} />
          </div>
          
          <div className="lg:col-span-2">
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
                  <div className="space-y-4">
                    {["income", "expense"].map((type) => (
                      <div key={type} className="space-y-2">
                        <h3 className="font-medium text-lg capitalize">
                          {type === "income" ? "Receitas" : "Despesas"}
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                          {categoryList
                            .filter(cat => cat.type === type)
                            .map(category => (
                              <div 
                                key={category.id} 
                                className="p-3 border rounded-md flex justify-between items-center"
                              >
                                <div>
                                  <span className="font-medium">{category.name}</span>
                                  {category.parentId && (
                                    <p className="text-xs text-muted-foreground">
                                      Subcategoria (Nível {category.level})
                                    </p>
                                  )}
                                </div>
                                <Button 
                                  variant="ghost" 
                                  size="icon" 
                                  className="h-8 w-8 text-destructive hover:bg-destructive/10"
                                  onClick={() => handleDeleteCategory(category.id)}
                                >
                                  <Trash2 className="h-4 w-4" />
                                  <span className="sr-only">Apagar categoria</span>
                                </Button>
                              </div>
                            ))}
                        </div>
                        {categoryList.filter(cat => cat.type === type).length === 0 && (
                          <p className="text-sm text-muted-foreground">Nenhuma categoria deste tipo</p>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <Dialog open={openDeleteDialog} onOpenChange={setOpenDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Apagar Categoria</DialogTitle>
            <DialogDescription>
              Tem certeza que deseja apagar esta categoria? Esta ação não pode ser revertida.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpenDeleteDialog(false)}>Cancelar</Button>
            <Button variant="destructive" onClick={confirmDeleteCategory}>Apagar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Categories;
