
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Trash2 } from "lucide-react";
import { ClearTransactionsDialog } from "./CategoryDialogs";

interface CategoryActionsProps {
  handleResetCategories: () => void;
  openClearTransactionsDialog: boolean;
  setOpenClearTransactionsDialog: (open: boolean) => void;
  confirmClearTransactions: () => void;
}

const CategoryActions = ({ 
  handleResetCategories, 
  openClearTransactionsDialog, 
  setOpenClearTransactionsDialog, 
  confirmClearTransactions 
}: CategoryActionsProps) => {
  return (
    <div className="flex gap-2">
      <Button variant="outline" onClick={handleResetCategories}>
        Reiniciar Categorias
      </Button>
      <ClearTransactionsDialog
        open={openClearTransactionsDialog}
        onOpenChange={setOpenClearTransactionsDialog}
        onConfirm={confirmClearTransactions}
      />
      <Button 
        variant="outline" 
        className="mr-2"
        onClick={() => setOpenClearTransactionsDialog(true)}
      >
        <Trash2 className="mr-2 h-4 w-4" />
        Apagar Todas as Transações
      </Button>
    </div>
  );
};

export default CategoryActions;
