
import React from 'react';
import { render, screen } from '@testing-library/react';
import CategoryRow from '../components/CategoryRow';
import { TransactionCategory } from '@/utils/mockData';
import { formatCurrency } from '@/utils/financialCalculations';

describe('CategoryRow', () => {
  const mockCategory: TransactionCategory = {
    id: 'test-category',
    name: 'Test Category',
    type: 'expense',
    level: 2
  };

  const amount = 1250.75;
  const level = 1;

  it('renders the category name', () => {
    render(<CategoryRow category={mockCategory} amount={amount} level={level} />);
    expect(screen.getByText('Test Category')).toBeInTheDocument();
  });

  it('renders the formatted amount', () => {
    render(<CategoryRow category={mockCategory} amount={amount} level={level} />);
    expect(screen.getByText(formatCurrency(amount))).toBeInTheDocument();
  });

  it('applies the correct indentation based on level', () => {
    render(<CategoryRow category={mockCategory} amount={amount} level={level} />);
    const levelClass = `pl-${level * 4}`;
    const cellElement = screen.getByText('Test Category').parentElement;
    expect(cellElement).toHaveClass(levelClass);
  });
});
