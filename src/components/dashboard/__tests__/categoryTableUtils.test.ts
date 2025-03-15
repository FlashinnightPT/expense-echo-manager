
import { 
  calculateCategoryTotal, 
  calculateCategoryTransactionAmount, 
  getSubcategories 
} from '../utils/categoryTableUtils';
import { Transaction, TransactionCategory } from '@/utils/mockData';

describe('categoryTableUtils', () => {
  const mockCategories: TransactionCategory[] = [
    { id: 'parent', name: 'Parent', type: 'expense', level: 1 },
    { id: 'child1', name: 'Child 1', type: 'expense', level: 2, parentId: 'parent' },
    { id: 'child2', name: 'Child 2', type: 'expense', level: 2, parentId: 'parent' },
    { id: 'grandchild1', name: 'Grandchild 1', type: 'expense', level: 3, parentId: 'child1' }
  ];

  const mockTransactions: Transaction[] = [
    { id: 'tx1', description: 'Transaction 1', amount: 100, date: '2023-01-01', categoryId: 'parent', type: 'expense' },
    { id: 'tx2', description: 'Transaction 2', amount: 200, date: '2023-01-01', categoryId: 'child1', type: 'expense' },
    { id: 'tx3', description: 'Transaction 3', amount: 300, date: '2023-01-01', categoryId: 'child2', type: 'expense' },
    { id: 'tx4', description: 'Transaction 4', amount: 400, date: '2023-01-01', categoryId: 'grandchild1', type: 'expense' }
  ];

  describe('calculateCategoryTotal', () => {
    it('calculates total including all subcategories', () => {
      const total = calculateCategoryTotal('parent', mockTransactions, mockCategories);
      // Should include parent (100) + child1 (200) + child2 (300) + grandchild1 (400)
      expect(total).toBe(1000);
    });

    it('calculates total for a leaf category', () => {
      const total = calculateCategoryTotal('grandchild1', mockTransactions, mockCategories);
      expect(total).toBe(400);
    });

    it('returns 0 for a category with no transactions', () => {
      const total = calculateCategoryTotal('nonexistent', mockTransactions, mockCategories);
      expect(total).toBe(0);
    });
  });

  describe('calculateCategoryTransactionAmount', () => {
    it('calculates amount for direct transactions only', () => {
      const amount = calculateCategoryTransactionAmount('parent', mockTransactions);
      expect(amount).toBe(100);
    });

    it('returns 0 for a category with no direct transactions', () => {
      const amount = calculateCategoryTransactionAmount('nonexistent', mockTransactions);
      expect(amount).toBe(0);
    });
  });

  describe('getSubcategories', () => {
    it('returns direct subcategories of a parent', () => {
      const subcats = getSubcategories('parent', mockCategories);
      expect(subcats).toHaveLength(2);
      expect(subcats[0].id).toBe('child1');
      expect(subcats[1].id).toBe('child2');
    });

    it('returns an empty array for a category with no subcategories', () => {
      const subcats = getSubcategories('grandchild1', mockCategories);
      expect(subcats).toHaveLength(0);
    });

    it('returns an empty array for a nonexistent category', () => {
      const subcats = getSubcategories('nonexistent', mockCategories);
      expect(subcats).toHaveLength(0);
    });
  });
});
