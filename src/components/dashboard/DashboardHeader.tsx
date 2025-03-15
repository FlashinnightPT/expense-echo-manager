
import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import TransactionForm from "@/components/forms/TransactionForm";
import CategoryForm from "@/components/forms/CategoryForm";
import { Transaction, TransactionCategory } from "@/utils/mockData";
import { toast } from "sonner";

interface DashboardHeaderProps {
  onSaveTransaction: (transaction: Partial<Transaction>) => void;
  onSaveCategory: (category: Partial<TransactionCategory>) => void;
  onClearData: () => void;
  categories: any[];
}

const DashboardHeader = ({ 
  onSaveTransaction, 
  onSaveCategory, 
  onClearData,
  categories 
}: DashboardHeaderProps) => {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
      <div>
        <h1 className="text-3xl font-bold animate-fade-in-up">Painel</h1>
        <p className="text-muted-foreground mt-1 animate-fade-in-up animation-delay-100">
          Visão geral dos seus dados financeiros
        </p>
      </div>
      
      <div className="flex space-x-2 mt-4 md:mt-0">
        <Dialog>
          <DialogTrigger asChild>
            <Button className="animate-fade-in-up animation-delay-200">
              <Plus className="h-4 w-4 mr-2" />
              Adicionar Transação
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[550px]">
            <DialogHeader>
              <DialogTitle>Adicionar Nova Transação</DialogTitle>
              <DialogDescription>
                Preencha os campos abaixo para adicionar uma nova transação.
              </DialogDescription>
            </DialogHeader>
            <TransactionForm onSave={onSaveTransaction} />
          </DialogContent>
        </Dialog>
        
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline" className="animate-fade-in-up animation-delay-300">
              <Plus className="h-4 w-4 mr-2" />
              Adicionar Categoria
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[550px]">
            <DialogHeader>
              <DialogTitle>Adicionar Nova Categoria</DialogTitle>
              <DialogDescription>
                Adicione uma nova categoria para organizar suas transações.
              </DialogDescription>
            </DialogHeader>
            <CategoryForm onSave={onSaveCategory} categoryList={categories} />
          </DialogContent>
        </Dialog>
        
        <ClearDataDialog onClearData={onClearData} />
      </div>
    </div>
  );
};

// Clear Data Dialog Component
interface ClearDataDialogProps {
  onClearData: () => void;
}

const ClearDataDialog = ({ onClearData }: ClearDataDialogProps) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="destructive" className="animate-fade-in-up animation-delay-400">
          <Trash2 className="h-4 w-4 mr-2" />
          Limpar Dados
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Apagar Todos os Dados</DialogTitle>
          <DialogDescription>
            Esta ação irá apagar todas as categorias e transações. Esta ação não pode ser revertida.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => {}}>Cancelar</Button>
          <Button variant="destructive" onClick={onClearData}>Apagar Dados</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DashboardHeader;
