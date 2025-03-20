
import { toast } from "sonner";
import { Transaction, TransactionCategory } from "@/utils/mockData";
import { supabase } from "@/integrations/supabase/client";
import { dbToCategoryModel, dbToTransactionModel, categoryModelToDb, transactionModelToDb, dbToUserModel, userModelToDb } from "./supabaseAdapters";

type DatabaseBackup = {
  transactions: Transaction[];
  categories: TransactionCategory[];
  users: any[]; // Adicionando users ao tipo de backup
  timestamp: number;
  version: string;
};

/**
 * Exporta todos os dados para um arquivo JSON
 */
export const exportDatabase = async () => {
  try {
    // Obter dados do Supabase
    const { data: transactionsData, error: transError } = await supabase
      .from('transactions')
      .select('*');
    
    const { data: categoriesData, error: catError } = await supabase
      .from('categories')
      .select('*');
    
    const { data: usersData, error: usersError } = await supabase
      .from('users')
      .select('*');
    
    if (transError) {
      console.error("Erro ao buscar transações:", transError);
      toast.error("Erro ao buscar transações do Supabase");
      return false;
    }
    
    if (catError) {
      console.error("Erro ao buscar categorias:", catError);
      toast.error("Erro ao buscar categorias do Supabase");
      return false;
    }
    
    if (usersError) {
      console.error("Erro ao buscar usuários:", usersError);
      toast.error("Erro ao buscar usuários do Supabase");
      return false;
    }
    
    // Transform database records to application models
    const transactions = (transactionsData || []).map(dbToTransactionModel);
    const categories = (categoriesData || []).map(dbToCategoryModel);
    const users = (usersData || []).map(dbToUserModel);
    
    // Criar o objeto de backup
    const backup: DatabaseBackup = {
      transactions: transactions,
      categories: categories,
      users: users,
      timestamp: Date.now(),
      version: "1.0"
    };
    
    // Converter para string JSON
    const jsonString = JSON.stringify(backup, null, 2);
    
    // Criar o blob e gerar URL
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    // Criar elemento de link para download
    const link = document.createElement('a');
    link.href = url;
    const date = new Date();
    const dateStr = date.toISOString().split('T')[0];
    link.setAttribute('download', `gestor-financeiro-backup-${dateStr}.json`);
    document.body.appendChild(link);
    
    // Disparar o download
    link.click();
    
    // Limpar
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    toast.success("Backup exportado com sucesso");
    return true;
    
  } catch (error) {
    console.error("Erro ao exportar dados:", error);
    toast.error("Erro ao exportar dados: " + (error instanceof Error ? error.message : String(error)));
    return false;
  }
};

/**
 * Importa dados de um arquivo JSON para o Supabase
 */
export const importDatabase = async (file: File): Promise<boolean> => {
  return new Promise((resolve, reject) => {
    try {
      const reader = new FileReader();
      
      reader.onload = async (e) => {
        try {
          if (!e.target || !e.target.result) {
            toast.error("Erro ao ler arquivo");
            reject(false);
            return;
          }
          
          const data = e.target.result as string;
          const backup = JSON.parse(data) as DatabaseBackup;
          
          // Validar o formato do backup
          if (!backup.transactions || !backup.categories || !backup.timestamp || !backup.version) {
            toast.error("Formato de arquivo de backup inválido");
            reject(false);
            return;
          }
          
          toast.info("Importando dados para o Supabase...");
          
          // Limpar tabelas existentes
          await supabase.from('transactions').delete().neq('id', 'dummy');
          await supabase.from('categories').delete().neq('id', 'dummy');
          await supabase.from('users').delete().neq('id', 'dummy');
          
          // Convert application models to database format
          const dbCategories = backup.categories.map(categoryModelToDb);
          
          // Importar categorias
          if (dbCategories.length > 0) {
            const { error: catError } = await supabase
              .from('categories')
              .insert(dbCategories);
            
            if (catError) {
              console.error("Erro ao importar categorias:", catError);
              toast.error("Erro ao importar categorias para o Supabase");
            }
          }
          
          // Convert application models to database format
          const dbTransactions = backup.transactions.map(transactionModelToDb);
          
          // Importar transações
          if (dbTransactions.length > 0) {
            const { error: transError } = await supabase
              .from('transactions')
              .insert(dbTransactions);
            
            if (transError) {
              console.error("Erro ao importar transações:", transError);
              toast.error("Erro ao importar transações para o Supabase");
            }
          }
          
          // Importar dados de usuários
          if (backup.users && Array.isArray(backup.users)) {
            const dbUsers = backup.users.map(userModelToDb);
            
            if (dbUsers.length > 0) {
              const { error: usersError } = await supabase
                .from('users')
                .insert(dbUsers);
              
              if (usersError) {
                console.error("Erro ao importar usuários:", usersError);
                toast.error("Erro ao importar usuários para o Supabase");
              }
            }
            
            // Armazenar também no localStorage para acesso offline
            localStorage.setItem('app_users', JSON.stringify(backup.users));
          }
          
          // Disparar evento de storage para atualizar a aplicação
          window.dispatchEvent(new Event('storage'));
          
          toast.success("Dados importados com sucesso");
          resolve(true);
          
        } catch (error) {
          console.error("Erro ao processar arquivo:", error);
          toast.error("Erro ao processar arquivo: " + (error instanceof Error ? error.message : String(error)));
          reject(false);
        }
      };
      
      reader.onerror = () => {
        toast.error("Erro ao ler arquivo");
        reject(false);
      };
      
      reader.readAsText(file);
      
    } catch (error) {
      console.error("Erro ao importar dados:", error);
      toast.error("Erro ao importar dados: " + (error instanceof Error ? error.message : String(error)));
      reject(false);
    }
  });
};

/**
 * Limpa todos os dados do Supabase
 */
export const clearAllData = async (): Promise<boolean> => {
  try {
    toast.info("Limpando todos os dados...");
    
    // Limpar todas as transações
    const { error: transDeleteError } = await supabase
      .from('transactions')
      .delete()
      .neq('id', 'dummy');
    
    if (transDeleteError) {
      console.error("Erro ao limpar transações:", transDeleteError);
      toast.error("Erro ao limpar transações do Supabase");
      return false;
    }
    
    // Limpar todas as categorias
    const { error: catDeleteError } = await supabase
      .from('categories')
      .delete()
      .neq('id', 'dummy');
    
    if (catDeleteError) {
      console.error("Erro ao limpar categorias:", catDeleteError);
      toast.error("Erro ao limpar categorias do Supabase");
      return false;
    }
    
    // Limpar todos os usuários (exceto o administrador, se necessário)
    const { error: usersDeleteError } = await supabase
      .from('users')
      .delete()
      .neq('username', 'admin');
    
    if (usersDeleteError) {
      console.error("Erro ao limpar usuários:", usersDeleteError);
      toast.error("Erro ao limpar usuários do Supabase");
      return false;
    }
    
    // Limpar o localStorage
    localStorage.removeItem('app_users');
    
    // Disparar evento para outros componentes atualizarem
    window.dispatchEvent(new Event('storage'));
    
    toast.success("Todos os dados foram limpos com sucesso");
    return true;
    
  } catch (error) {
    console.error("Erro ao limpar todos os dados:", error);
    toast.error("Erro ao limpar dados: " + (error instanceof Error ? error.message : String(error)));
    return false;
  }
};
