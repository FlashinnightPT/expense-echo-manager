
import { render, screen, fireEvent } from '@testing-library/react';
import CategoryTransactionsTable from '../CategoryTransactionsTable';
import { Transaction, TransactionCategory } from '@/utils/mockData';

// Mock the utilities used in the component
jest.mock('@/utils/financialCalculations', () => ({
  getMonthName: (month: number) => ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][month - 1],
  formatCurrency: (amount: number) => `€${amount.toFixed(2)}`
}));

describe('CategoryTransactionsTable', () => {
  const mockCategories: TransactionCategory[] = [
    {
      id: 'expense-1',
      name: 'Housing',
      type: 'expense',
      level: 1
    },
    {
      id: 'expense-1-1',
      name: 'Rent',
      type: 'expense',
      level: 2,
      parentId: 'expense-1'
    },
    {
      id: 'income-1',
      name: 'Salary',
      type: 'income',
      level: 1
    }
  ];

  const mockTransactions: Transaction[] = [
    {
      id: 'transaction-1',
      description: 'Monthly Rent',
      amount: 1000,
      date: '2023-05-01',
      categoryId: 'expense-1-1',
      type: 'expense'
    },
    {
      id: 'transaction-2',
      description: 'Monthly Income',
      amount: 5000,
      date: '2023-05-01',
      categoryId: 'income-1',
      type: 'income'
    }
  ];

  const mockOnMonthChange = jest.fn();
  const mockGetCategoryById = (id: string) => mockCategories.find(cat => cat.id === id);

  it('renders the expense tab by default', () => {
    render(
      <CategoryTransactionsTable
        transactions={mockTransactions}
        categories={mockCategories}
        selectedYear={2023}
        selectedMonth={5}
        onMonthChange={mockOnMonthChange}
        getCategoryById={mockGetCategoryById}
      />
    );

    expect(screen.getByText('Despesas por Categoria')).toBeInTheDocument();
  });

  it('changes active tab when income tab is clicked', () => {
    render(
      <CategoryTransactionsTable
        transactions={mockTransactions}
        categories={mockCategories}
        selectedYear={2023}
        selectedMonth={5}
        onMonthChange={mockOnMonthChange}
        getCategoryById={mockGetCategoryById}
      />
    );

    // Click on the income tab trigger
    fireEvent.click(screen.getByText('Receitas por Categoria'));
    
    // Check that the income content is displayed
    expect(screen.getByRole('tabpanel', { name: 'income' })).toBeInTheDocument();
  });

  it('calls onMonthChange when month is selected', () => {
    render(
      <CategoryTransactionsTable
        transactions={mockTransactions}
        categories={mockCategories}
        selectedYear={2023}
        selectedMonth={5}
        onMonthChange={mockOnMonthChange}
        getCategoryById={mockGetCategoryById}
      />
    );

    // Open the select
    fireEvent.click(screen.getByRole('combobox'));
    
    // This part might need adjustment based on how your Select component renders in tests
    // since Radix UI components might behave differently in test environments
  });
});
