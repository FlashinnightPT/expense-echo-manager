
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
    
    // Organizar transações por ano para facilitar consultas específicas por período
    const transactionsByYear = new Map<number, Transaction[]>();
    
    transactions.forEach(transaction => {
      const date = new Date(transaction.date);
      const year = date.getFullYear();
      
      if (!transactionsByYear.has(year)) {
        transactionsByYear.set(year, []);
      }
      
      transactionsByYear.get(year)?.push(transaction);
    });
    
    // Agrupa transações por categoria para gasto médio
    const categoryMap = new Map<string, { 
      total: number, 
      count: number,
      byYear: Map<number, { total: number, count: number }> 
    }>();
    
    transactions.forEach(transaction => {
      const key = transaction.categoryId;
      const date = new Date(transaction.date);
      const year = date.getFullYear();
      
      if (!categoryMap.has(key)) {
        categoryMap.set(key, { 
          total: 0, 
          count: 0, 
          byYear: new Map()
        });
      }
      
      const entry = categoryMap.get(key)!;
      
      // Adicionamos apenas as despesas para cálculos
      if (transaction.type === 'expense') {
        entry.total += transaction.amount;
        entry.count += 1;
        
        // Adicionar dados por ano
        if (!entry.byYear.has(year)) {
          entry.byYear.set(year, { total: 0, count: 0 });
        }
        
        const yearData = entry.byYear.get(year)!;
        yearData.total += transaction.amount;
        yearData.count += 1;
      }
    });
    
    // Formata os dados para texto
    let dataText = "Dados financeiros disponíveis:\n\n";
    
    // Adiciona informações sobre gastos por categoria
    dataText += "RESUMO DE GASTOS POR CATEGORIA:\n";
    categoryMap.forEach((value, key) => {
      if (value.count > 0) {
        const categoryName = transactions.find(t => t.categoryId === key)?.description.split(': ')[1] || key;
        const avgSpend = value.total / value.count;
        
        dataText += `Categoria ${categoryName} (${key}): Total gasto ${value.total.toFixed(2)}, média por transação ${avgSpend.toFixed(2)}, ${value.count} transações\n`;
        
        // Adicionar dados por ano para cada categoria
        dataText += "  Detalhe por ano:\n";
        value.byYear.forEach((yearData, year) => {
          const yearAvg = yearData.total / yearData.count;
          dataText += `    ${year}: Total ${yearData.total.toFixed(2)}, média ${yearAvg.toFixed(2)}, ${yearData.count} transações\n`;
        });
      }
    });
    
    // Adiciona anos disponíveis
    const availableYears = Array.from(transactionsByYear.keys()).sort();
    dataText += `\nAnos com dados disponíveis: ${availableYears.join(", ")}\n`;
    
    // Adiciona detalhes sobre um número limitado de transações mais recentes
    dataText += `\nDetalhes das ${limitedTransactions.length} transações mais recentes (de um total de ${transactions.length}):\n`;
    limitedTransactions.forEach(t => {
      const date = new Date(t.date).toLocaleDateString();
      const categoryName = t.description.split(': ')[1] || '';
      dataText += `Data: ${date}, Descrição: ${t.description}, Valor: ${t.amount.toFixed(2)}, Tipo: ${t.type}, Categoria: ${categoryName} (${t.categoryId})\n`;
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
          content: `Você é um assistente financeiro especializado em análise de dados de transações.
Use apenas os dados fornecidos para responder às perguntas. Seja conciso nas respostas.
Quando o usuário perguntar sobre categorias específicas, procure pelo nome da categoria ou palavras-chave relacionadas nas descrições das transações.
Informe o ano e os valores quando disponíveis.`
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
