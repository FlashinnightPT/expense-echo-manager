// Mock data to represent financial data from spreadsheets

export type TransactionCategory = {
  id: string;
  name: string;
  type: 'income' | 'expense';
  parentId?: string;
  level: number;
  children?: TransactionCategory[];
};

export type Transaction = {
  id: string;
  description: string;
  amount: number;
  date: string;
  categoryId: string;
  type: 'income' | 'expense';
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

// Sample categories
export const categories: TransactionCategory[] = [
  // Level 2 categories (income)
  {
    id: 'income-1',
    name: 'Salary',
    type: 'income',
    level: 2
  },
  {
    id: 'income-2',
    name: 'Investments',
    type: 'income',
    level: 2
  },
  
  // Level 3 subcategories (income)
  {
    id: 'income-1-1',
    name: 'Base Salary',
    type: 'income',
    parentId: 'income-1',
    level: 3
  },
  {
    id: 'income-1-2',
    name: 'Bonuses',
    type: 'income',
    parentId: 'income-1',
    level: 3
  },
  {
    id: 'income-2-1',
    name: 'Dividends',
    type: 'income',
    parentId: 'income-2',
    level: 3
  },
  {
    id: 'income-2-2',
    name: 'Interest',
    type: 'income',
    parentId: 'income-2',
    level: 3
  },
  
  // Level 2 categories (expense)
  {
    id: 'expense-1',
    name: 'Housing',
    type: 'expense',
    level: 2
  },
  {
    id: 'expense-2', 
    name: 'Food',
    type: 'expense',
    level: 2
  },
  
  // Level 3 subcategories (expense)
  {
    id: 'expense-1-1',
    name: 'Rent',
    type: 'expense',
    parentId: 'expense-1',
    level: 3
  },
  {
    id: 'expense-1-2',
    name: 'Utilities',
    type: 'expense',
    parentId: 'expense-1',
    level: 3
  },
  {
    id: 'expense-2-1',
    name: 'Groceries',
    type: 'expense',
    parentId: 'expense-2',
    level: 3
  },
  {
    id: 'expense-2-2',
    name: 'Dining Out',
    type: 'expense',
    parentId: 'expense-2',
    level: 3
  },
  
  // Level 4 items (expense)
  {
    id: 'expense-1-2-1',
    name: 'Electricity',
    type: 'expense',
    parentId: 'expense-1-2',
    level: 4
  },
  {
    id: 'expense-1-2-2',
    name: 'Water',
    type: 'expense',
    parentId: 'expense-1-2',
    level: 4
  },
  {
    id: 'expense-1-2-3',
    name: 'Internet',
    type: 'expense',
    parentId: 'expense-1-2',
    level: 4
  },
  {
    id: 'expense-1-2-3-1',
    name: 'Home Internet',
    type: 'expense',
    parentId: 'expense-1-2-3',
    level: 4
  },
  {
    id: 'expense-1-2-3-2',
    name: 'Mobile Data',
    type: 'expense',
    parentId: 'expense-1-2-3',
    level: 4
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
      .filter(c => !c.parentId) // Only top-level categories
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
      .filter(c => !c.parentId) // Only top-level categories
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

// Sample transactions (recent ones)
export const transactions: Transaction[] = Array.from({ length: 30 }, (_, i) => {
  const types = ['income', 'expense'] as const;
  const type = types[Math.floor(Math.random() * types.length)];
  
  // Get a random category of the selected type
  const typeCategories = categories.filter(c => c.type === type);
  const category = typeCategories[Math.floor(Math.random() * typeCategories.length)];
  
  // Generate a date within the last 30 days
  const date = new Date();
  date.setDate(date.getDate() - Math.floor(Math.random() * 30));
  
  return {
    id: `transaction-${i}`,
    description: `${type.charAt(0).toUpperCase() + type.slice(1)} transaction ${i+1}`,
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
