
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
 * Imprime informações detalhadas do estado de conexão
 */
export const printConnectionInfo = () => {
  const isOnline = navigator.onLine;
  console.log("Estado de conexão à Internet:", isOnline ? "Online" : "Offline");
  
  // Verificar informações do projeto Supabase
  // Não podemos acessar supabaseUrl diretamente pois é protegido
  console.log("Projeto Supabase:", "iqxesudkiapkhrursghh");
  
  // Executar teste de conexão
  testSupabaseConnection().then(isConnected => {
    console.log("Resultado do teste de conexão:", isConnected ? "Conectado" : "Desconectado");
  });
};
