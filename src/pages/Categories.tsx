
import { useState } from "react";
import Header from "@/components/layout/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui-custom/Card";
import CategoryForm from "@/components/forms/CategoryForm";
import { Button } from "@/components/ui/button";
import { categories, TransactionCategory } from "@/utils/mockData";
import { toast } from "sonner";
import { Trash2 } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

const Categories = () => {
  const [categoryList, setCategoryList] = useState<TransactionCategory[]>(categories);
  const [openResetDialog, setOpenResetDialog] = useState(false);

  const handleSaveCategory = (category: Partial<TransactionCategory>) => {
    // Create a new category with a unique ID
    const newCategory: TransactionCategory = {
      id: `${category.type}-${Date.now()}`,
      name: category.name || "",
      type: category.type || "expense",
      level: category.level || 1,
      parentId: category.parentId,
    };

    // Update the state with the new category
    setCategoryList([...categoryList, newCategory]);
    toast.success("Categoria adicionada com sucesso");
  };

  const handleResetAllData = () => {
    // Reset the categories list
    setCategoryList([]);
    
    // In a real app, we would also clear transactions and other data
    // But for this mock demo, we're just clearing the categories
    
    setOpenResetDialog(false);
    toast.success("Todos os dados foram apagados com sucesso");
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
          <Dialog open={openResetDialog} onOpenChange={setOpenResetDialog}>
            <DialogTrigger asChild>
              <Button variant="destructive">
                <Trash2 className="mr-2 h-4 w-4" />
                Apagar Todos os Dados
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Apagar Todos os Dados</DialogTitle>
                <DialogDescription>
                  Esta ação irá apagar todas as categorias, transações e outros dados. Esta ação não pode ser revertida.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button variant="outline" onClick={() => setOpenResetDialog(false)}>Cancelar</Button>
                <Button variant="destructive" onClick={handleResetAllData}>Apagar Dados</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
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
                    {["income", "expense", "savings", "investment"].map((type) => (
                      <div key={type} className="space-y-2">
                        <h3 className="font-medium text-lg capitalize">
                          {type === "income" ? "Receitas" : 
                           type === "expense" ? "Despesas" : 
                           type === "savings" ? "Poupanças" : "Investimentos"}
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
                                {/* Em uma versão futura, poderiamos adicionar botões para editar/eliminar */}
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
    </div>
  );
};

export default Categories;
