
import { toast } from "sonner";
import { Transaction } from "@/utils/mockData";

interface UseTransactionHandlersProps {
  canEdit: boolean;
  handleSaveTransaction: (transaction: Partial<Transaction>) => void;
  handleDeleteTransaction: (transactionId: string) => void;
}

export const useTransactionHandlers = ({ 
  canEdit, 
  handleSaveTransaction, 
  handleDeleteTransaction 
}: UseTransactionHandlersProps) => {
  
  const handleSaveTransactionWithToast = (transaction: Partial<Transaction>) => {
    if (!canEdit) {
      toast.error("Não tem permissões para adicionar transações");
      return;
    }
    handleSaveTransaction(transaction);
    toast.success("Transação adicionada com sucesso");
  };

  const handleDeleteTransactionWithToast = (transactionId: string) => {
    if (!canEdit) {
      toast.error("Não tem permissões para excluir transações");
      return;
    }
    handleDeleteTransaction(transactionId);
    toast.success("Transação excluída com sucesso");
  };

  return {
    handleSaveTransactionWithToast,
    handleDeleteTransactionWithToast
  };
};
