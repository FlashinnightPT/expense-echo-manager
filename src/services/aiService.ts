
import { Transaction } from "@/utils/mockData";
import { toast } from "sonner";

export class AiService {
  private static instance: AiService;
  private apiKey: string | null = null;

  private constructor() {}

  public static getInstance(): AiService {
    if (!AiService.instance) {
      AiService.instance = new AiService();
    }
    return AiService.instance;
  }

  // Método para definir a API key
  public setApiKey(key: string): void {
    this.apiKey = key;
    // Guarda a chave no localStorage para uso futuro
    localStorage.setItem('openai_api_key', key);
    toast.success("Chave da API da OpenAI configurada com sucesso");
  }

  // Método para verificar se a API key está configurada
  public hasApiKey(): boolean {
    if (this.apiKey) return true;
    
    // Verifica no localStorage
    const savedKey = localStorage.getItem('openai_api_key');
    if (savedKey) {
      this.apiKey = savedKey;
      return true;
    }
    
    return false;
  }

  // Método para recuperar a API key
  public getApiKey(): string | null {
    if (this.apiKey) return this.apiKey;
    
    // Tenta recuperar do localStorage
    return localStorage.getItem('openai_api_key');
  }

  // Método para preparar os dados financeiros para consulta
  private prepareFinancialData(transactions: Transaction[]): string {
    // Agrupa transações por categoria para gasto médio
    const categoryMap = new Map<string, { total: number, count: number, transactions: Transaction[] }>();
    
    transactions.forEach(transaction => {
      const key = transaction.categoryId;
      const entry = categoryMap.get(key) || { total: 0, count: 0, transactions: [] };
      
      // Adicionamos apenas as despesas para cálculos
      if (transaction.type === 'expense') {
        entry.total += transaction.amount;
        entry.count += 1;
      }
      
      entry.transactions.push(transaction);
      categoryMap.set(key, entry);
    });
    
    // Formata os dados para texto
    let dataText = "Dados financeiros disponíveis:\n\n";
    
    // Adiciona informações sobre gastos por categoria
    categoryMap.forEach((value, key) => {
      if (value.count > 0) {
        const avgSpend = value.total / value.count;
        dataText += `Categoria ${key}: Total gasto ${value.total.toFixed(2)}, média por transação ${avgSpend.toFixed(2)}, ${value.count} transações\n`;
      }
    });
    
    // Adiciona detalhes sobre as transações
    dataText += "\nDetalhes das transações:\n";
    transactions.forEach(t => {
      const date = new Date(t.date).toLocaleDateString();
      dataText += `Data: ${date}, Descrição: ${t.description}, Valor: ${t.amount.toFixed(2)}, Tipo: ${t.type}, Categoria: ${t.categoryId}\n`;
    });
    
    return dataText;
  }

  // Método para consultar a OpenAI
  public async queryOpenAI(
    prompt: string, 
    transactions: Transaction[], 
    maxTokens: number = 150
  ): Promise<string> {
    try {
      if (!this.hasApiKey()) {
        throw new Error("API key da OpenAI não configurada");
      }
      
      const apiKey = this.getApiKey();
      const financialData = this.prepareFinancialData(transactions);
      
      const messages = [
        {
          role: "system",
          content: "Você é um assistente financeiro especializado em análise de dados de transações. Use apenas os dados fornecidos para responder às perguntas."
        },
        {
          role: "user",
          content: `Dados financeiros:\n${financialData}\n\nPergunta: ${prompt}`
        }
      ];
      
      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: "gpt-4o",
          messages,
          max_tokens: maxTokens,
          temperature: 0.3 // Menor temperatura para respostas mais precisas
        })
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Erro na API da OpenAI: ${errorData.error?.message || response.statusText}`);
      }
      
      const data = await response.json();
      return data.choices[0].message.content;
      
    } catch (error) {
      console.error("Erro ao consultar a OpenAI:", error);
      toast.error(`Erro na consulta: ${error instanceof Error ? error.message : String(error)}`);
      return "Desculpe, não foi possível processar sua consulta. Por favor, verifique sua conexão e a chave da API.";
    }
  }
}

// Exporta a instância singleton
export const aiService = AiService.getInstance();
