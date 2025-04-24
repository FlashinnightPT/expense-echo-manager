
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Transaction } from "@/utils/mockData";
import TransactionForm from "@/components/forms/TransactionForm";

interface EditTransactionDialogProps {
  isOpen: boolean;
  onClose: () => void;
  transaction: Transaction | null;
  onSave: (transaction: Partial<Transaction>) => void;
}

const EditTransactionDialog = ({
  isOpen,
  onClose,
  transaction,
  onSave
}: EditTransactionDialogProps) => {
  if (!transaction) return null;

  const handleSave = async (updatedTransaction: Partial<Transaction>) => {
    await onSave({
      ...updatedTransaction,
      id: transaction.id // Ensure we keep the original ID
    });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Editar Transação</DialogTitle>
        </DialogHeader>
        <TransactionForm 
          transaction={transaction}
          onSave={handleSave}
          className="mt-4"
        />
      </DialogContent>
    </Dialog>
  );
};

export default EditTransactionDialog;
