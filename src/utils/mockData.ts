// Mock data to represent financial data from spreadsheets

export type TransactionCategory = {
  id: string;
  name: string;
  type: "income" | "expense";
  level: number;
  parentId?: string;
  parentName?: string; // Used for Excel import
};

export type Transaction = {
  id: string;
  description: string;
  amount: number;
  date: string;
  categoryId: string;
  type: "income" | "expense";
};

export type MonthlyData = {
  year: number;
  month: number;
  income: number;
  expense: number;
  categories: {
    categoryId: string;
    amount: number;
  }[];
};

export type YearlyData = {
  year: number;
  income: number;
  expense: number;
  categories: {
    categoryId: string;
    amount: number;
  }[];
};

// Sample categories based on the requested structure
export const categories: TransactionCategory[] = [
  // INCOME CATEGORIES
  // Level 2 categories (income)
  {
    id: 'income-1',
    name: 'Salário',
    type: 'income',
    level: 2
  },
  {
    id: 'income-2',
    name: 'Investimentos',
    type: 'income',
    level: 2
  },
  
  // EXPENSE CATEGORIES
  // Level 2 - Pessoal
  {
    id: 'expense-pessoal',
    name: 'Pessoal',
    type: 'expense',
    level: 2
  },
  
  // Level 3 - Subcategories under Pessoal
  {
    id: 'expense-pessoal-salarios',
    name: 'Salarios',
    type: 'expense',
    parentId: 'expense-pessoal',
    level: 3
  },
  {
    id: 'expense-pessoal-impostos',
    name: 'Impostos',
    type: 'expense',
    parentId: 'expense-pessoal',
    level: 3
  },
  {
    id: 'expense-pessoal-seguros',
    name: 'Seguros',
    type: 'expense',
    parentId: 'expense-pessoal',
    level: 3
  },
  {
    id: 'expense-pessoal-diversos',
    name: 'Diversos',
    type: 'expense',
    parentId: 'expense-pessoal',
    level: 3
  },
  {
    id: 'expense-pessoal-comida',
    name: 'Comida escritorio',
    type: 'expense',
    parentId: 'expense-pessoal',
    level: 3
  },
  
  // Level 4 - Items under Salarios subcategory
  {
    id: 'expense-pessoal-salarios-carlos',
    name: 'Carlos',
    type: 'expense',
    parentId: 'expense-pessoal-salarios',
    level: 4
  },
  {
    id: 'expense-pessoal-salarios-leandro',
    name: 'Leandro',
    type: 'expense',
    parentId: 'expense-pessoal-salarios',
    level: 4
  },
  {
    id: 'expense-pessoal-salarios-anapaula',
    name: 'Ana Paula',
    type: 'expense',
    parentId: 'expense-pessoal-salarios',
    level: 4
  },
  {
    id: 'expense-pessoal-salarios-isabel',
    name: 'Isabel',
    type: 'expense',
    parentId: 'expense-pessoal-salarios',
    level: 4
  },
  {
    id: 'expense-pessoal-salarios-morais',
    name: 'Morais',
    type: 'expense',
    parentId: 'expense-pessoal-salarios',
    level: 4
  },
  
  // Keep some original categories for variety
  {
    id: 'expense-housing',
    name: 'Housing',
    type: 'expense',
    level: 2
  },
  {
    id: 'expense-food', 
    name: 'Food',
    type: 'expense',
    level: 2
  }
];

// Generate monthly data for 2023 and 2024
export const monthlyData: MonthlyData[] = Array.from({ length: 24 }, (_, i) => {
  const year = 2023 + Math.floor(i / 12);
  const month = (i % 12) + 1;
  
  // Generate some realistic values with variation
  const baseIncome = 5000 + Math.random() * 1000;
  const baseExpense = 3500 + Math.random() * 800;
  
  // Seasonal variations
  const seasonalFactor = Math.sin((month - 1) * Math.PI / 6) * 0.15;
  
  return {
    year,
    month,
    income: Math.round(baseIncome * (1 + seasonalFactor) * 100) / 100,
    expense: Math.round(baseExpense * (1 + seasonalFactor * 0.8) * 100) / 100,
    categories: categories
      .filter(c => c.level === 2) // Only top-level categories
      .map(category => ({
        categoryId: category.id,
        amount: Math.round((category.type === 'income' ? baseIncome : baseExpense) * 
                          (0.3 + Math.random() * 0.7) * 100) / 100
      }))
  };
});

// Generate yearly data based on monthly data
export const yearlyData: YearlyData[] = Array.from({ length: 2 }, (_, i) => {
  const year = 2023 + i;
  const yearMonths = monthlyData.filter(m => m.year === year);
  
  return {
    year,
    income: Math.round(yearMonths.reduce((sum, month) => sum + month.income, 0) * 100) / 100,
    expense: Math.round(yearMonths.reduce((sum, month) => sum + month.expense, 0) * 100) / 100,
    categories: categories
      .filter(c => c.level === 2) // Only top-level categories
      .map(category => {
        const relevantMonths = yearMonths.map(m => {
          const categoryData = m.categories.find(c => c.categoryId === category.id);
          return categoryData ? categoryData.amount : 0;
        });
        
        return {
          categoryId: category.id,
          amount: Math.round(relevantMonths.reduce((sum, amount) => sum + amount, 0) * 100) / 100
        };
      })
  };
});

// Sample transactions with the new categories
export const transactions: Transaction[] = Array.from({ length: 30 }, (_, i) => {
  const types = ['income', 'expense'] as const;
  const type = types[Math.floor(Math.random() * types.length)];
  
  // Get a random category of the selected type with level >= 3
  const typeCategories = categories.filter(c => c.type === type && c.level >= 3);
  
  // Check if we have categories available
  if (typeCategories.length === 0) {
    // Fallback to level 2 if no level 3+ categories
    const fallbackCategories = categories.filter(c => c.type === type);
    if (fallbackCategories.length === 0) {
      // Use default category if no categories of this type
      return {
        id: `transaction-${i}`,
        description: `${type === 'income' ? 'Receita' : 'Despesa'} - Item ${i+1}`,
        amount: Math.round((type === 'income' ? 500 : 200) * (0.5 + Math.random()) * 100) / 100,
        date: new Date().toISOString().split('T')[0],
        categoryId: type === 'income' ? 'income-1' : 'expense-pessoal',
        type
      };
    }
    const category = fallbackCategories[Math.floor(Math.random() * fallbackCategories.length)];
    return {
      id: `transaction-${i}`,
      description: `${type === 'income' ? 'Receita' : 'Despesa'} - ${category.name}`,
      amount: Math.round((type === 'income' ? 500 : 200) * (0.5 + Math.random()) * 100) / 100,
      date: new Date().toISOString().split('T')[0],
      categoryId: category.id,
      type
    };
  }
  
  const category = typeCategories[Math.floor(Math.random() * typeCategories.length)];
  
  // Generate a date within the last 30 days
  const date = new Date();
  date.setDate(date.getDate() - Math.floor(Math.random() * 30));
  
  return {
    id: `transaction-${i}`,
    description: `${type === 'income' ? 'Receita' : 'Despesa'} - ${category.name}`,
    amount: Math.round((type === 'income' ? 500 : 200) * (0.5 + Math.random()) * 100) / 100,
    date: date.toISOString().split('T')[0],
    categoryId: category.id,
    type
  };
});

// Helper function to flatten categories for easier search
export const flattenCategories = (categories: TransactionCategory[]): TransactionCategory[] => {
  let result: TransactionCategory[] = [];
  
  for (const category of categories) {
    result.push(category);
    
    if (category.children && category.children.length > 0) {
      result = [...result, ...flattenCategories(category.children)];
    }
  }
  
  return result;
};

export const flattenedCategories = flattenCategories(categories);

// Function to get a category by ID
export const getCategoryById = (id: string): TransactionCategory | undefined => {
  return flattenedCategories.find(c => c.id === id);
};

// Function to build a hierarchical structure of categories
export const buildCategoryHierarchy = () => {
  const rootCategories = categories.filter(cat => cat.level === 2);
  const result = [...rootCategories];
  
  // Create a map for easier access
  const categoriesMap = new Map<string, TransactionCategory>();
  categories.forEach(cat => {
    categoriesMap.set(cat.id, { ...cat, children: [] });
  });
  
  // Add children to their parents
  categories.forEach(cat => {
    if (cat.parentId) {
      const parent = categoriesMap.get(cat.parentId);
      if (parent && parent.children) {
        parent.children.push(categoriesMap.get(cat.id) || cat);
      }
    }
  });
  
  // Return only root categories with their full hierarchy
  return result.map(cat => categoriesMap.get(cat.id) || cat);
};

// Function to filter transactions by period (month and year)
export const filterTransactionsByPeriod = (
  transactions: Transaction[],
  year: number,
  month?: number
): Transaction[] => {
  return transactions.filter(transaction => {
    const transactionDate = new Date(transaction.date);
    const transactionYear = transactionDate.getFullYear();
    const transactionMonth = transactionDate.getMonth() + 1;
    
    if (month) {
      return transactionYear === year && transactionMonth === month;
    }
    
    return transactionYear === year;
  });
};

// Get all available periods from transactions
export const getAvailablePeriods = (transactions: Transaction[]) => {
  const periods = new Set<string>();
  
  transactions.forEach(transaction => {
    const date = new Date(transaction.date);
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    
    periods.add(`${year}-${month}`);
  });
  
  return Array.from(periods).map(period => {
    const [year, month] = period.split('-').map(Number);
    return { year, month };
  });
};

// Get all available years from transactions
export const getAvailableYears = (transactions: Transaction[]) => {
  const years = new Set<number>();
  
  if (transactions.length === 0) {
    const currentYear = new Date().getFullYear();
    years.add(currentYear);
    return Array.from(years).sort((a, b) => b - a);
  }
  
  transactions.forEach(transaction => {
    const date = new Date(transaction.date);
    const year = date.getFullYear();
    years.add(year);
  });
  
  return Array.from(years).sort((a, b) => b - a);
};

// Calculate totals for a specific period
export const calculatePeriodTotals = (
  transactions: Transaction[],
  year: number,
  month?: number
) => {
  const filteredTransactions = filterTransactionsByPeriod(transactions, year, month);
  
  const income = filteredTransactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);
    
  const expense = filteredTransactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);
    
  return {
    income,
    expense,
    balance: income - expense,
    differenceRate: income > 0 ? ((income - expense) / income) * 100 : 0
  };
};
