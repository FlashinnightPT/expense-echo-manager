
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import TransactionForm from "@/components/forms/TransactionForm";
import { Transaction } from "@/utils/mockData";

interface DashboardHeaderProps {
  onSaveTransaction: (transaction: Partial<Transaction>) => void;
}

const DashboardHeader = ({ 
  onSaveTransaction
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
      </div>
    </div>
  );
};

export default DashboardHeader;
