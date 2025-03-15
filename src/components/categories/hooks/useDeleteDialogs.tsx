
import { useState } from "react";

export const useDeleteDialogs = () => {
  const [categoryToDelete, setCategoryToDelete] = useState<string | null>(null);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

  const showDeleteDialog = (categoryId: string) => {
    setCategoryToDelete(categoryId);
    setOpenDeleteDialog(true);
  };

  const closeDeleteDialog = () => {
    setOpenDeleteDialog(false);
    setCategoryToDelete(null);
  };

  return {
    categoryToDelete,
    openDeleteDialog,
    setOpenDeleteDialog,
    showDeleteDialog,
    closeDeleteDialog
  };
};
