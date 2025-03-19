
import { createClient } from '@supabase/supabase-js';

// Obtenha as credenciais do ambiente Supabase
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Verifique se as variáveis de ambiente estão definidas
if (!supabaseUrl || !supabaseKey) {
  console.error('Supabase URL ou chave não definidos. Verifique suas variáveis de ambiente.');
}

// Crie o cliente do Supabase apenas se tivermos as credenciais
export const supabase = supabaseUrl && supabaseKey 
  ? createClient(supabaseUrl, supabaseKey)
  : createClient('https://placeholder-url.supabase.co', 'placeholder-key');

// Função útil para verificar se o Supabase está conectado
export const checkSupabaseConnection = async (): Promise<boolean> => {
  try {
    if (!supabaseUrl || !supabaseKey) {
      return false;
    }
    
    const { data, error } = await supabase.from('categories').select('count');
    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Erro ao conectar com o Supabase:', error);
    return false;
  }
};
