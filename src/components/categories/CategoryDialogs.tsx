
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface DeleteCategoryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
}

export const DeleteCategoryDialog = ({ open, onOpenChange, onConfirm }: DeleteCategoryDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Apagar Categoria</DialogTitle>
          <DialogDescription>
            Tem certeza que deseja apagar esta categoria? Esta ação não pode ser revertida.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancelar</Button>
          <Button variant="destructive" onClick={onConfirm}>Apagar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

interface ClearTransactionsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
}

export const ClearTransactionsDialog = ({ open, onOpenChange, onConfirm }: ClearTransactionsDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Apagar Todas as Transações</DialogTitle>
          <DialogDescription>
            Esta ação irá apagar todas as transações registradas. Esta ação não pode ser revertida.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancelar</Button>
          <Button variant="destructive" onClick={onConfirm}>Apagar Transações</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
