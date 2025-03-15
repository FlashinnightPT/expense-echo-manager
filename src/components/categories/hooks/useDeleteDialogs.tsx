
import { useState } from "react";

export const useDeleteDialogs = () => {
  const [categoryToDelete, setCategoryToDelete] = useState<string | null>(null);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openClearTransactionsDialog, setOpenClearTransactionsDialog] = useState(false);

  const showDeleteDialog = (categoryId: string) => {
    setCategoryToDelete(categoryId);
    setOpenDeleteDialog(true);
  };

  const closeDeleteDialog = () => {
    setOpenDeleteDialog(false);
    setCategoryToDelete(null);
  };

  const showClearTransactionsDialog = () => {
    setOpenClearTransactionsDialog(true);
  };

  const closeClearTransactionsDialog = () => {
    setOpenClearTransactionsDialog(false);
  };

  return {
    categoryToDelete,
    openDeleteDialog,
    setOpenDeleteDialog,
    openClearTransactionsDialog,
    setOpenClearTransactionsDialog,
    showDeleteDialog,
    closeDeleteDialog,
    showClearTransactionsDialog,
    closeClearTransactionsDialog
  };
};
