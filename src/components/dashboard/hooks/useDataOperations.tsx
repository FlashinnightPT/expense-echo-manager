
import { useState } from "react";
import { Transaction, TransactionCategory } from "@/utils/mockData";
import { apiService } from "@/services/apiService";
import { toast } from "sonner";

export const useDataOperations = (
  setTransactions: React.Dispatch<React.SetStateAction<Transaction[]>>,
  setCategories: React.Dispatch<React.SetStateAction<TransactionCategory[]>>
) => {
  const handleSaveCategory = async (category: Partial<TransactionCategory>) => {
    try {
      const newCategory = await apiService.saveCategory(category);
      setCategories(prev => [...prev, newCategory]);
      toast.success(`Categoria "${category.name}" adicionada com sucesso`);
      return newCategory;
    } catch (error) {
      console.error('Erro ao salvar categoria:', error);
      toast.error("Erro ao salvar categoria. Tente novamente.");
      return null;
    }
  };

  const handleSaveTransaction = async (transaction: Partial<Transaction>) => {
    try {
      const newTransaction = await apiService.saveTransaction(transaction);
      setTransactions(prev => [...prev, newTransaction]);
      return newTransaction;
    } catch (error) {
      console.error('Erro ao salvar transação:', error);
      toast.error("Erro ao salvar transação. Tente novamente.");
      return null;
    }
  };

  const handleDeleteTransaction = async (transactionId: string) => {
    try {
      await apiService.deleteTransaction(transactionId);
      setTransactions(prev => prev.filter(t => t.id !== transactionId));
      return true;
    } catch (error) {
      console.error('Erro ao excluir transação:', error);
      toast.error("Erro ao excluir transação. Tente novamente.");
      return false;
    }
  };

  const handleClearAllData = () => {
    if (window.confirm("Tem certeza que deseja limpar todos os dados? Esta ação não pode ser desfeita.")) {
      setTransactions([]);
      setCategories([]);
      localStorage.setItem('transactions', JSON.stringify([]));
      localStorage.setItem('categories', JSON.stringify([]));
      window.dispatchEvent(new Event('storage'));
      toast.success("Todos os dados foram limpos com sucesso");
    }
  };

  return {
    handleSaveCategory,
    handleSaveTransaction,
    handleDeleteTransaction,
    handleClearAllData
  };
};
