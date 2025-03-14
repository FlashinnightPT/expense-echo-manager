
// Mock data to represent financial data from spreadsheets

export type TransactionCategory = {
  id: string;
  name: string;
  type: 'income' | 'expense' | 'savings' | 'investment';
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
  type: 'income' | 'expense' | 'savings' | 'investment';
};

export type MonthlyData = {
  year: number;
  month: number;
  income: number;
  expense: number;
  savings: number;
  investment: number;
  categories: {
    categoryId: string;
    amount: number;
  }[];
};

export type YearlyData = {
  year: number;
  income: number;
  expense: number;
  savings: number;
  investment: number;
  categories: {
    categoryId: string;
    amount: number;
  }[];
};

// Sample categories with up to 4 levels
export const categories: TransactionCategory[] = [
  // Income categories
  {
    id: 'income-1',
    name: 'Salary',
    type: 'income',
    level: 1,
    children: [
      {
        id: 'income-1-1',
        name: 'Base Salary',
        type: 'income',
        parentId: 'income-1',
        level: 2,
      },
      {
        id: 'income-1-2',
        name: 'Bonuses',
        type: 'income',
        parentId: 'income-1',
        level: 2,
      }
    ]
  },
  {
    id: 'income-2',
    name: 'Investments',
    type: 'income',
    level: 1,
    children: [
      {
        id: 'income-2-1',
        name: 'Dividends',
        type: 'income',
        parentId: 'income-2',
        level: 2,
      },
      {
        id: 'income-2-2',
        name: 'Interest',
        type: 'income',
        parentId: 'income-2',
        level: 2,
      }
    ]
  },
  
  // Expense categories
  {
    id: 'expense-1',
    name: 'Housing',
    type: 'expense',
    level: 1,
    children: [
      {
        id: 'expense-1-1',
        name: 'Rent',
        type: 'expense',
        parentId: 'expense-1',
        level: 2,
      },
      {
        id: 'expense-1-2',
        name: 'Utilities',
        type: 'expense',
        parentId: 'expense-1',
        level: 2,
        children: [
          {
            id: 'expense-1-2-1',
            name: 'Electricity',
            type: 'expense',
            parentId: 'expense-1-2',
            level: 3,
          },
          {
            id: 'expense-1-2-2',
            name: 'Water',
            type: 'expense',
            parentId: 'expense-1-2',
            level: 3,
          },
          {
            id: 'expense-1-2-3',
            name: 'Internet',
            type: 'expense',
            parentId: 'expense-1-2',
            level: 3,
            children: [
              {
                id: 'expense-1-2-3-1',
                name: 'Home Internet',
                type: 'expense',
                parentId: 'expense-1-2-3',
                level: 4,
              },
              {
                id: 'expense-1-2-3-2',
                name: 'Mobile Data',
                type: 'expense',
                parentId: 'expense-1-2-3',
                level: 4,
              }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'expense-2',
    name: 'Food',
    type: 'expense',
    level: 1,
    children: [
      {
        id: 'expense-2-1',
        name: 'Groceries',
        type: 'expense',
        parentId: 'expense-2',
        level: 2,
      },
      {
        id: 'expense-2-2',
        name: 'Dining Out',
        type: 'expense',
        parentId: 'expense-2',
        level: 2,
      }
    ]
  },
  
  // Savings categories
  {
    id: 'savings-1',
    name: 'Emergency Fund',
    type: 'savings',
    level: 1,
  },
  {
    id: 'savings-2',
    name: 'Future Purchases',
    type: 'savings',
    level: 1,
    children: [
      {
        id: 'savings-2-1',
        name: 'Home',
        type: 'savings',
        parentId: 'savings-2',
        level: 2,
      },
      {
        id: 'savings-2-2',
        name: 'Vehicle',
        type: 'savings',
        parentId: 'savings-2',
        level: 2,
      }
    ]
  },
  
  // Investment categories
  {
    id: 'investment-1',
    name: 'Stocks',
    type: 'investment',
    level: 1,
  },
  {
    id: 'investment-2',
    name: 'Real Estate',
    type: 'investment',
    level: 1,
  }
];

// Generate monthly data for 2023 and 2024
export const monthlyData: MonthlyData[] = Array.from({ length: 24 }, (_, i) => {
  const year = 2023 + Math.floor(i / 12);
  const month = (i % 12) + 1;
  
  // Generate some realistic values with variation
  const baseIncome = 5000 + Math.random() * 1000;
  const baseExpense = 3500 + Math.random() * 800;
  const baseSavings = 800 + Math.random() * 300;
  const baseInvestment = 500 + Math.random() * 200;
  
  // Seasonal variations
  const seasonalFactor = Math.sin((month - 1) * Math.PI / 6) * 0.15;
  
  return {
    year,
    month,
    income: Math.round(baseIncome * (1 + seasonalFactor) * 100) / 100,
    expense: Math.round(baseExpense * (1 + seasonalFactor * 0.8) * 100) / 100,
    savings: Math.round(baseSavings * (1 - seasonalFactor) * 100) / 100,
    investment: Math.round(baseInvestment * (1 + seasonalFactor * 0.5) * 100) / 100,
    categories: categories
      .filter(c => !c.parentId) // Only top-level categories
      .map(category => ({
        categoryId: category.id,
        amount: Math.round((category.type === 'income' ? baseIncome : 
                            category.type === 'expense' ? baseExpense :
                            category.type === 'savings' ? baseSavings : 
                            baseInvestment) * (0.3 + Math.random() * 0.7) * 100) / 100
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
    savings: Math.round(yearMonths.reduce((sum, month) => sum + month.savings, 0) * 100) / 100,
    investment: Math.round(yearMonths.reduce((sum, month) => sum + month.investment, 0) * 100) / 100,
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
  const types = ['income', 'expense', 'savings', 'investment'] as const;
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
    amount: Math.round((type === 'income' || type === 'savings' || type === 'investment' ? 500 : 200) * (0.5 + Math.random()) * 100) / 100,
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
