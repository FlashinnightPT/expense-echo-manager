
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

  // Método melhorado para preparar os dados financeiros para consulta
  private prepareFinancialData(transactions: Transaction[]): string {
    if (transactions.length === 0) {
      return "Não há dados de transações disponíveis.";
    }
    
    // Limitar o número de transações para economizar tokens
    const MAX_TRANSACTIONS = 50;
    const limitedTransactions = transactions.slice(-MAX_TRANSACTIONS);
    
    // Extrair categorias únicas das transações para facilitar a busca
    const uniqueCategories = new Set<string>();
    const categoryNameMap = new Map<string, string>();
    
    transactions.forEach(transaction => {
      uniqueCategories.add(transaction.categoryId);
      
      // Extrair nome da categoria da descrição (se disponível)
      const descParts = transaction.description.split(': ');
      if (descParts.length > 1) {
        categoryNameMap.set(transaction.categoryId, descParts[1]);
      }
    });
    
    // Organizar transações por ano e categoria
    const transactionsByYear = new Map<number, Map<string, Transaction[]>>();
    
    transactions.forEach(transaction => {
      const date = new Date(transaction.date);
      const year = date.getFullYear();
      
      if (!transactionsByYear.has(year)) {
        transactionsByYear.set(year, new Map<string, Transaction[]>());
      }
      
      const yearData = transactionsByYear.get(year)!;
      
      if (!yearData.has(transaction.categoryId)) {
        yearData.set(transaction.categoryId, []);
      }
      
      yearData.get(transaction.categoryId)!.push(transaction);
    });
    
    // Formatar dados para texto
    let dataText = "DADOS FINANCEIROS DISPONÍVEIS:\n\n";
    
    // Adicionar informações sobre categorias
    dataText += "LISTA DE CATEGORIAS:\n";
    const categoriesList: string[] = [];
    
    uniqueCategories.forEach(categoryId => {
      const categoryName = categoryNameMap.get(categoryId) || categoryId;
      categoriesList.push(`- ${categoryName} (id: ${categoryId})`);
    });
    
    dataText += categoriesList.join("\n") + "\n\n";
    
    // Adicionar resumo por ano e categoria
    dataText += "RESUMO POR ANO E CATEGORIA:\n";
    const sortedYears = Array.from(transactionsByYear.keys()).sort((a, b) => b - a);
    
    sortedYears.forEach(year => {
      dataText += `\nANO: ${year}\n`;
      const yearData = transactionsByYear.get(year)!;
      
      const categorySummaries: string[] = [];
      yearData.forEach((transactions, categoryId) => {
        const categoryName = categoryNameMap.get(categoryId) || categoryId;
        
        // Separe por tipo (receita/despesa)
        const incomes = transactions.filter(t => t.type === 'income');
        const expenses = transactions.filter(t => t.type === 'expense');
        
        const totalIncome = incomes.reduce((sum, t) => sum + t.amount, 0);
        const totalExpense = expenses.reduce((sum, t) => sum + t.amount, 0);
        
        if (incomes.length > 0) {
          categorySummaries.push(`  Receitas de ${categoryName}: Total ${totalIncome.toFixed(2)}, ${incomes.length} transações`);
        }
        
        if (expenses.length > 0) {
          categorySummaries.push(`  Despesas de ${categoryName}: Total ${totalExpense.toFixed(2)}, ${expenses.length} transações`);
        }
      });
      
      dataText += categorySummaries.join("\n") + "\n";
    });
    
    // Adicionar detalhes sobre algumas transações recentes
    dataText += `\nDETALHES DAS ${limitedTransactions.length} TRANSAÇÕES MAIS RECENTES:\n`;
    limitedTransactions.forEach(t => {
      const date = new Date(t.date).toLocaleDateString();
      const categoryName = categoryNameMap.get(t.categoryId) || t.categoryId;
      const tipo = t.type === 'income' ? 'Receita' : 'Despesa';
      dataText += `- Data: ${date}, ${tipo}: ${t.description}, Valor: ${t.amount.toFixed(2)}, Categoria: ${categoryName}\n`;
    });
    
    return dataText;
  }

  // Método para consultar a OpenAI
  public async queryOpenAI(
    prompt: string, 
    transactions: Transaction[], 
    maxTokens: number = 500
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
Use apenas os dados fornecidos para responder às perguntas. Seja conciso e direto nas respostas.
Quando o usuário perguntar sobre categorias específicas, procure pelo nome da categoria ou palavras-chave relacionadas nas descrições ou na lista de categorias.
Se uma pergunta mencionar "combustível", "gasolina", "diesel" ou termos similares, procure por categorias relacionadas a transporte ou combustíveis.
Se uma pergunta mencionar "salários", procure por categorias relacionadas a funcionários, folha de pagamento ou nomes de pessoas.
Informe explicitamente quando os dados não contêm a informação solicitada.
Use valores numéricos nas respostas quando disponíveis.`
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
          model: "gpt-4o-mini", // Modelo mais leve para economizar tokens
          messages,
          max_tokens: maxTokens,
          temperature: 0.2 // Temperatura mais baixa para respostas mais diretas e factuais
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
