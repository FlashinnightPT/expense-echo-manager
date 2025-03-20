
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

/**
 * Função para testar a comunicação com o Supabase
 * @returns Promise<boolean> - true se a comunicação estiver ativa, false caso contrário
 */
export const testSupabaseConnection = async (): Promise<boolean> => {
  try {
    // Tentar buscar a contagem de transações
    const { data, error } = await supabase
      .from('transactions')
      .select('count');
    
    if (error) {
      console.error("Erro na comunicação com Supabase:", error);
      toast.error(`Erro na comunicação com Supabase: ${error.message}`);
      return false;
    }
    
    // Tentar buscar a contagem de categorias
    const { data: catData, error: catError } = await supabase
      .from('categories')
      .select('count');
    
    if (catError) {
      console.error("Erro na comunicação com Supabase (categorias):", catError);
      toast.error(`Erro na comunicação com Supabase: ${catError.message}`);
      return false;
    }
    
    console.log("Teste de comunicação com Supabase bem-sucedido:", { 
      transactionsData: data, 
      categoriesData: catData 
    });
    
    toast.success("Comunicação com Supabase estabelecida com sucesso!");
    return true;
  } catch (error) {
    console.error("Erro ao testar comunicação com Supabase:", error);
    toast.error(`Erro ao testar comunicação com Supabase: ${error instanceof Error ? error.message : String(error)}`);
    return false;
  }
};

/**
 * Função para testar a conexão com a tabela de utilizadores
 * @returns Promise<number> - Número de utilizadores na base de dados
 */
export const testUserConnection = async (): Promise<number> => {
  try {
    const { data, error, count } = await supabase
      .from('users')
      .select('*', { count: 'exact' });
    
    if (error) {
      console.error("Erro na comunicação com tabela de utilizadores:", error);
      toast.error(`Erro ao acessar utilizadores: ${error.message}`);
      throw error;
    }
    
    if (data) {
      console.log("Utilizadores encontrados:", data);
      toast.success(`Conexão com tabela de utilizadores bem-sucedida! Total: ${data.length} utilizadores.`);
      
      // Exibir mais detalhes no console para diagnóstico
      data.forEach((user, index) => {
        console.log(`Utilizador ${index + 1}:`, {
          id: user.id,
          username: user.username,
          name: user.name,
          role: user.role,
          status: user.status,
          lastLogin: user.last_login
        });
      });
      
      return data.length;
    }
    
    return 0;
  } catch (error) {
    console.error("Erro ao testar conexão com utilizadores:", error);
    toast.error(`Erro ao testar conexão com utilizadores: ${error instanceof Error ? error.message : String(error)}`);
    throw error;
  }
};

/**
 * Imprime informações detalhadas do estado de conexão
 */
export const printConnectionInfo = () => {
  const isOnline = navigator.onLine;
  console.log("Estado de conexão à Internet:", isOnline ? "Online" : "Offline");
  
  // Verificar informações do projeto Supabase
  console.log("Projeto Supabase:", "iqxesudkiapkhrursghh");
  
  // Executar teste de conexão
  testSupabaseConnection().then(isConnected => {
    console.log("Resultado do teste de conexão:", isConnected ? "Conectado" : "Desconectado");
  });
};
