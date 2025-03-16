
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Transaction } from "@/utils/mockData";

export const useTransactionData = () => {
  const initTransactions = () => {
    const storedTransactions = localStorage.getItem('transactions');
    try {
      return storedTransactions ? JSON.parse(storedTransactions) : [];
    } catch (error) {
      console.error("Error parsing transactions from localStorage:", error);
      return [];
    }
  };

  const [transactionList, setTransactionList] = useState(initTransactions());

  // Escutar por eventos de storage para atualizar dados quando importar/exportar
  useEffect(() => {
    const handleStorageChange = () => {
      console.log("Storage changed, updating transaction list");
      setTransactionList(initTransactions());
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem('transactions', JSON.stringify(transactionList));
    } catch (error) {
      console.error("Error saving transactions to localStorage:", error);
    }
  }, [transactionList]);

  const isCategoryUsedInTransactions = (categoryId: string) => {
    return transactionList.some(transaction => transaction.categoryId === categoryId);
  };

  const confirmClearTransactions = () => {
    if (window.confirm("Tem certeza que deseja apagar todas as transações? Esta ação não pode ser desfeita.")) {
      setTransactionList([]);
      localStorage.setItem('transactions', JSON.stringify([]));
      toast.success("Todas as transações foram apagadas com sucesso");
      return true;
    }
    return false;
  };

  // Nova função para obter transações filtradas por período
  const getFilteredTransactions = (year?: number, month?: number, type?: 'income' | 'expense') => {
    return transactionList.filter(transaction => {
      const transactionDate = new Date(transaction.date);
      const transactionYear = transactionDate.getFullYear();
      const transactionMonth = transactionDate.getMonth() + 1;
      
      // Filtrar por ano se especificado
      if (year && transactionYear !== year) return false;
      
      // Filtrar por mês se especificado
      if (month && transactionMonth !== month) return false;
      
      // Filtrar por tipo se especificado
      if (type && transaction.type !== type) return false;
      
      return true;
    });
  };

  // Nova função para gerar transações de teste
  const generateTestTransactions = (categoryList: any[]) => {
    try {
      // Verificar se há categorias disponíveis
      if (!categoryList || categoryList.length === 0) {
        toast.error("Não existem categorias para gerar transações");
        return false;
      }

      // Obter apenas categorias de nível mais profundo (folhas)
      const leafCategories = categoryList.filter(cat => {
        // É uma categoria folha se não tiver filhos
        return !categoryList.some(potentialChild => potentialChild.parentId === cat.id);
      });

      if (leafCategories.length === 0) {
        toast.error("Não existem categorias folha para gerar transações");
        return false;
      }

      // Configurações para as transações de teste
      const currentYear = new Date().getFullYear();
      const currentMonth = new Date().getMonth() + 1;
      const startDate = new Date(currentYear, currentMonth - 3, 1); // 3 meses atrás
      const endDate = new Date(currentYear, currentMonth, 0); // Último dia do mês atual
      
      // Contador para acompanhar quantas transações foram criadas
      let transactionsCreated = 0;
      const newTransactions: Transaction[] = [];

      // Para cada categoria folha, criar algumas transações
      leafCategories.forEach(category => {
        // Determinar quantas transações criar para esta categoria (entre 1 e 5)
        const numTransactions = Math.floor(Math.random() * 5) + 1;
        
        for (let i = 0; i < numTransactions; i++) {
          // Gerar data aleatória entre startDate e endDate
          const randomDate = new Date(
            startDate.getTime() + Math.random() * (endDate.getTime() - startDate.getTime())
          );
          
          // Formatar a data como string YYYY-MM-DD
          const dateString = randomDate.toISOString().split('T')[0];
          
          // Gerar valor aleatório entre 10 e 1000
          const randomAmount = Math.round(Math.random() * 990 + 10);
          
          // Criar descrição baseada no tipo e nome da categoria
          const description = category.type === 'income' 
            ? `Receita: ${category.name}` 
            : `Despesa: ${category.name}`;
          
          // Criar a nova transação
          const newTransaction: Transaction = {
            id: `transaction-${Date.now()}-${Math.floor(Math.random() * 10000)}`,
            description,
            amount: randomAmount,
            date: dateString,
            categoryId: category.id,
            type: category.type
          };
          
          newTransactions.push(newTransaction);
          transactionsCreated++;
        }
      });

      // Adicionar as novas transações à lista existente
      setTransactionList(prev => [...prev, ...newTransactions]);
      
      // Informar o usuário sobre as transações criadas
      toast.success(`${transactionsCreated} transações de teste foram criadas com sucesso`);
      return true;
    } catch (error) {
      console.error("Erro ao gerar transações de teste:", error);
      toast.error("Ocorreu um erro ao gerar transações de teste");
      return false;
    }
  };

  return {
    transactionList,
    isCategoryUsedInTransactions,
    confirmClearTransactions,
    getFilteredTransactions,
    generateTestTransactions
  };
};
