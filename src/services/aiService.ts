
import { Transaction } from "@/utils/mockData";
import { toast } from "sonner";

export class AiService {
  private static instance: AiService;
  private apiKey: string | null;

  private constructor() {
    this.apiKey = localStorage.getItem('openai_api_key') || null;
  }

  public static getInstance(): AiService {
    if (!AiService.instance) {
      AiService.instance = new AiService();
    }
    return AiService.instance;
  }

  // Método para definir a chave da API
  public setApiKey(key: string): void {
    this.apiKey = key;
    // Salvar no localStorage para persistência
    localStorage.setItem('openai_api_key', key);
  }

  // Método para verificar se a API key está configurada
  public hasApiKey(): boolean {
    return !!this.apiKey && this.apiKey !== "sua-chave-api-openai-aqui";
  }

  // Método para preparar os dados financeiros para consulta com limite de tokens
  private prepareFinancialData(transactions: Transaction[]): string {
    // Limitar o número de transações para economizar tokens
    const MAX_TRANSACTIONS = 50;
    const limitedTransactions = transactions.slice(-MAX_TRANSACTIONS);
    
    // Agrupa transações por categoria para gasto médio
    const categoryMap = new Map<string, { total: number, count: number }>();
    
    transactions.forEach(transaction => {
      const key = transaction.categoryId;
      const entry = categoryMap.get(key) || { total: 0, count: 0 };
      
      // Adicionamos apenas as despesas para cálculos
      if (transaction.type === 'expense') {
        entry.total += transaction.amount;
        entry.count += 1;
      }
      
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
    
    // Adiciona detalhes sobre um número limitado de transações mais recentes
    dataText += `\nDetalhes das ${limitedTransactions.length} transações mais recentes (de um total de ${transactions.length}):\n`;
    limitedTransactions.forEach(t => {
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
        throw new Error("A chave da API da OpenAI não está configurada");
      }
      
      const financialData = this.prepareFinancialData(transactions);
      
      const messages = [
        {
          role: "system",
          content: "Você é um assistente financeiro especializado em análise de dados de transações. Use apenas os dados fornecidos para responder às perguntas. Seja conciso nas respostas."
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
          "Authorization": `Bearer ${this.apiKey}`
        },
        body: JSON.stringify({
          model: "gpt-4o-mini", // Usando o modelo mais leve para economizar tokens
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
      return "Desculpe, não foi possível processar sua consulta. Por favor, tente novamente mais tarde ou contacte o suporte.";
    }
  }
}

// Exporta a instância singleton
export const aiService = AiService.getInstance();
