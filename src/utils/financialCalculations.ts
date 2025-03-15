
// Função para formatar valores monetários
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('pt-PT', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount);
};

// Nomes dos meses em português
export const getMonthName = (monthNumber: number): string => {
  const months = [
    "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
    "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
  ];
  return months[monthNumber - 1] || "";
};

// Função para calcular o resumo mensal
export const calculateMonthlySummary = (monthData: any) => {
  const income = monthData.income || 0;
  const expense = monthData.expense || 0;
  
  const balance = income - expense;
  const differenceRate = income > 0 ? ((income - expense) / income) * 100 : 0;
  
  return {
    income,
    expense,
    balance,
    differenceRate
  };
};

// Função para calcular o resumo anual
export const calculateYearlySummary = (yearData: any) => {
  const income = yearData.income || 0;
  const expense = yearData.expense || 0;
  
  const balance = income - expense;
  const differenceRate = income > 0 ? ((income - expense) / income) * 100 : 0;
  
  return {
    income,
    expense,
    balance,
    differenceRate
  };
};

// Nova função para calcular o total de transações para uma categoria, incluindo todas as subcategorias
export const calculateCategoryTotal = (
  categoryId: string, 
  transactions: any[], 
  categories: any[]
): number => {
  // Crie um mapa de categorias por ID para fácil acesso
  const categoryMap = new Map();
  categories.forEach(cat => {
    categoryMap.set(cat.id, cat);
  });
  
  // Função recursiva para obter todos os IDs de categorias filhas
  const getAllChildCategoryIds = (parentId: string): string[] => {
    const childIds: string[] = [];
    categories.forEach(cat => {
      if (cat.parentId === parentId) {
        childIds.push(cat.id);
        getAllChildCategoryIds(cat.id).forEach(id => childIds.push(id));
      }
    });
    return childIds;
  };
  
  // Obtenha todos os IDs de categorias filhas, incluindo a categoria atual
  const categoryIds = [categoryId, ...getAllChildCategoryIds(categoryId)];
  
  // Filtre as transações que pertencem a esta categoria ou suas subcategorias
  const categoryTransactions = transactions.filter(t => categoryIds.includes(t.categoryId));
  
  // Calcule o total
  return categoryTransactions.reduce((sum, transaction) => sum + transaction.amount, 0);
};

// Função para obter o caminho completo de uma categoria (incluindo categorias pai)
export const getCategoryPath = (
  categoryId: string,
  categories: any[]
): string[] => {
  const path: string[] = [];
  let currentCategoryId = categoryId;
  
  // Crie um mapa de categorias por ID para fácil acesso
  const categoryMap = new Map();
  categories.forEach(cat => {
    categoryMap.set(cat.id, cat);
  });
  
  // Construa o caminho da categoria atual até a raiz
  while (currentCategoryId) {
    const category = categoryMap.get(currentCategoryId);
    if (!category) break;
    
    path.unshift(category.name);
    currentCategoryId = category.parentId;
  }
  
  return path;
};

// Função para agrupar transações por categoria considerando a hierarquia
export const groupTransactionsByCategory = (
  transactions: any[],
  categories: any[],
  type?: 'income' | 'expense'
) => {
  const result: Record<string, {
    categoryId: string,
    categoryName: string,
    categoryLevel: number,
    amount: number,
    path: string[]
  }> = {};
  
  // Crie um mapa de categorias por ID para fácil acesso
  const categoryMap = new Map();
  categories.forEach(cat => {
    categoryMap.set(cat.id, cat);
  });
  
  // Filtrar transações por tipo, se especificado
  const filteredTransactions = type 
    ? transactions.filter(t => t.type === type)
    : transactions;
  
  // Calcular totais para cada categoria
  categories.forEach(category => {
    // Filtrar por tipo, se especificado
    if (type && category.type !== type) return;
    
    const total = calculateCategoryTotal(category.id, filteredTransactions, categories);
    if (total > 0) {
      result[category.id] = {
        categoryId: category.id,
        categoryName: category.name,
        categoryLevel: category.level,
        amount: total,
        path: getCategoryPath(category.id, categories)
      };
    }
  });
  
  return Object.values(result);
};

// Função para obter todas as subcategorias de uma categoria
export const getSubcategories = (
  categoryId: string,
  categories: any[]
): any[] => {
  return categories.filter(cat => cat.parentId === categoryId);
};

// Constrói uma estrutura hierárquica de categorias com seus totais
export const buildCategoryHierarchy = (
  categories: any[],
  transactions: any[],
  type?: 'income' | 'expense'
) => {
  // Filtrar categorias de nível 2 (raiz)
  const rootCategories = categories.filter(cat => 
    cat.level === 2 && (type ? cat.type === type : true)
  );
  
  // Função recursiva para construir a hierarquia
  const buildHierarchy = (category: any) => {
    const amount = calculateCategoryTotal(category.id, transactions, categories);
    const children = getSubcategories(category.id, categories).map(buildHierarchy);
    
    return {
      ...category,
      amount,
      children
    };
  };
  
  return rootCategories.map(buildHierarchy);
};
