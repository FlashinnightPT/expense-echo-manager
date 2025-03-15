
import { render, screen } from '@testing-library/react';
import CategoryTable from '../components/CategoryTable';
import { TransactionCategory } from '@/utils/mockData';
import { RootCategoryItem } from '../types/categoryTypes';

describe('CategoryTable', () => {
  const mockCategory: TransactionCategory = {
    id: 'root-category',
    name: 'Root Category',
    type: 'expense',
    level: 1
  };

  const mockSubcategory: TransactionCategory = {
    id: 'sub-category',
    name: 'Sub Category',
    type: 'expense',
    level: 2,
    parentId: 'root-category'
  };

  it('renders empty message when no categories provided', () => {
    const emptyMessage = 'No categories available';
    render(
      <CategoryTable 
        groupedCategories={[]} 
        totalAmount={0} 
        showEmptyMessage={emptyMessage} 
      />
    );
    
    expect(screen.getByText(emptyMessage)).toBeInTheDocument();
  });

  it('renders categories with correct hierarchy', () => {
    const groupedCategories: RootCategoryItem[] = [
      {
        category: mockCategory,
        amount: 1000,
        subcategories: [
          {
            category: mockSubcategory,
            amount: 500,
            subcategories: []
          }
        ]
      }
    ];

    render(
      <CategoryTable 
        groupedCategories={groupedCategories} 
        totalAmount={1000} 
        showEmptyMessage="No categories available" 
      />
    );
    
    expect(screen.getByText('Root Category')).toBeInTheDocument();
    expect(screen.getByText('Sub Category')).toBeInTheDocument();
    expect(screen.getByText('TOTAL')).toBeInTheDocument();
  });

  it('renders the total amount correctly', () => {
    const totalAmount = 1500.25;
    const groupedCategories: RootCategoryItem[] = [
      {
        category: mockCategory,
        amount: 1000,
        subcategories: []
      }
    ];

    render(
      <CategoryTable 
        groupedCategories={groupedCategories} 
        totalAmount={totalAmount} 
        showEmptyMessage="No categories available" 
      />
    );
    
    // Check if the formatted total amount is rendered
    const formattedAmount = new Intl.NumberFormat('pt-PT', {
      style: 'currency',
      currency: 'EUR'
    }).format(totalAmount);
    
    expect(screen.getByText(formattedAmount)).toBeInTheDocument();
  });
});
