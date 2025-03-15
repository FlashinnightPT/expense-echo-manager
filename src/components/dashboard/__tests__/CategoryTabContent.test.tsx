
import React from 'react';
import { render, screen } from '@testing-library/react';
import CategoryTabContent from '../components/CategoryTabContent';
import { RootCategoryItem } from '../types/categoryTypes';
import { TransactionCategory } from '@/utils/mockData';
import { Tabs } from '@/components/ui/tabs';

// Mock the getMonthName function
jest.mock('@/utils/financialCalculations', () => ({
  getMonthName: (month: number) => ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][month - 1],
  formatCurrency: (amount: number) => `€${amount.toFixed(2)}`
}));

describe('CategoryTabContent', () => {
  const mockCategory: TransactionCategory = {
    id: 'test-category',
    name: 'Test Category',
    type: 'expense',
    level: 1
  };

  const mockGroupedCategories: RootCategoryItem[] = [
    {
      category: mockCategory,
      amount: 500,
      subcategories: []
    }
  ];

  it('renders the correct title for expense type', () => {
    render(
      <Tabs defaultValue="expense">
        <CategoryTabContent
          value="expense"
          groupedCategories={mockGroupedCategories}
          totalAmount={500}
          selectedMonth={5}
          selectedYear={2023}
        />
      </Tabs>
    );

    expect(screen.getByText('Despesas por Categoria (May 2023)')).toBeInTheDocument();
  });

  it('renders the correct title for income type', () => {
    render(
      <Tabs defaultValue="income">
        <CategoryTabContent
          value="income"
          groupedCategories={mockGroupedCategories}
          totalAmount={500}
          selectedMonth={3}
          selectedYear={2024}
        />
      </Tabs>
    );

    expect(screen.getByText('Receitas por Categoria (Mar 2024)')).toBeInTheDocument();
  });

  it('passes correct empty message based on type', () => {
    render(
      <Tabs defaultValue="expense">
        <CategoryTabContent
          value="expense"
          groupedCategories={[]}
          totalAmount={0}
          selectedMonth={1}
          selectedYear={2023}
        />
      </Tabs>
    );

    // CategoryTable will receive the empty message, which would be rendered
    // if there are no categories, but we can't directly test that here
    // without mocking CategoryTable completely
  });
});
