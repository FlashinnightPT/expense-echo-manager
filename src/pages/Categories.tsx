import { useState, useEffect } from "react";
import Header from "@/components/layout/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui-custom/Card";
import CategoryForm from "@/components/forms/CategoryForm";
import { Button } from "@/components/ui/button";
import { categories as defaultCategories, TransactionCategory, transactions as mockTransactions } from "@/utils/mockData";
import { toast } from "sonner";
import { ChevronDown, ChevronRight, Trash2 } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

const Categories = () => {
  const initCategories = () => {
    const storedCategories = localStorage.getItem('categories');
    if (!storedCategories) {
      localStorage.setItem('categories', JSON.stringify(defaultCategories));
      return defaultCategories;
    }
    return JSON.parse(storedCategories);
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
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({});

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

  const toggleCategoryExpansion = (categoryId: string) => {
    setExpandedCategories(prev => ({
      ...prev,
      [categoryId]: !prev[categoryId]
    }));
  };

  const renderCategoriesByType = (type: string) => {
    const mainCategories = categoryList.filter(cat => cat.type === type && cat.level === 2);
    
    if (mainCategories.length === 0) {
      return <p className="text-sm text-muted-foreground">Nenhuma categoria deste tipo</p>;
    }
    
    return (
      <div className="space-y-2">
        {mainCategories.map(category => renderMainCategory(category))}
      </div>
    );
  };

  const renderMainCategory = (category: TransactionCategory) => {
    const subcategories = categoryList.filter(c => c.parentId === category.id);
    const isExpanded = expandedCategories[category.id] || false;

    return (
      <div key={category.id} className="mb-3">
        <Collapsible open={isExpanded} onOpenChange={() => toggleCategoryExpansion(category.id)}>
          <div className="flex items-center justify-between p-3 border rounded-md bg-background hover:bg-accent/20 transition-colors">
            <div className="flex items-center space-x-2">
              {subcategories.length > 0 ? (
                <CollapsibleTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-5 w-5 p-0">
                    {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                  </Button>
                </CollapsibleTrigger>
              ) : <div className="w-5" />}
              <div>
                <span className="font-medium">{category.name}</span>
                <p className="text-xs text-muted-foreground">Nível 2</p>
              </div>
            </div>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8 text-destructive hover:bg-destructive/10"
              onClick={(e) => {
                e.stopPropagation();
                handleDeleteCategory(category.id);
              }}
            >
              <Trash2 className="h-4 w-4" />
              <span className="sr-only">Apagar categoria</span>
            </Button>
          </div>
          
          {subcategories.length > 0 && (
            <CollapsibleContent>
              <div className="pl-6 mt-2 space-y-2">
                {subcategories.map(subcat => renderSubcategory(subcat))}
              </div>
            </CollapsibleContent>
          )}
        </Collapsible>
      </div>
    );
  };

  const renderSubcategory = (category: TransactionCategory) => {
    const items = categoryList.filter(c => c.parentId === category.id);
    const isExpanded = expandedCategories[category.id] || false;
    const isLevel3 = category.level === 3;
    const isLevel4 = category.level === 4;

    const bgClasses = isLevel3 
      ? "bg-muted/30" 
      : "bg-muted/50";

    return (
      <div key={category.id} className="mb-2">
        <Collapsible open={isExpanded} onOpenChange={() => toggleCategoryExpansion(category.id)}>
          <div className={`flex items-center justify-between p-2 border rounded-md ${bgClasses} hover:bg-accent/20 transition-colors`}>
            <div className="flex items-center space-x-2">
              {items.length > 0 ? (
                <CollapsibleTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-5 w-5 p-0">
                    {isExpanded ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
                  </Button>
                </CollapsibleTrigger>
              ) : <div className="w-5" />}
              <div>
                <span>{category.name}</span>
                <p className="text-xs text-muted-foreground">
                  {isLevel4 ? "Nível 4 (máximo)" : isLevel3 ? "Nível 3" : `Nível ${category.level}`}
                </p>
              </div>
            </div>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-7 w-7 text-destructive hover:bg-destructive/10"
              onClick={(e) => {
                e.stopPropagation();
                handleDeleteCategory(category.id);
              }}
            >
              <Trash2 className="h-3 w-3" />
              <span className="sr-only">Apagar subcategoria</span>
            </Button>
          </div>
          
          {items.length > 0 && (
            <CollapsibleContent>
              <div className="pl-5 mt-2 space-y-2">
                {items.map(item => renderSubcategory(item))}
              </div>
            </CollapsibleContent>
          )}
        </Collapsible>
      </div>
    );
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
            <Button variant="outline" onClick={handleResetCategories}>
              Reiniciar Categorias
            </Button>
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
                        <div className="grid grid-cols-1 gap-2">
                          {renderCategoriesByType(type)}
                        </div>
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
