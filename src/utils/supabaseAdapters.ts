
// Mock implementation of supabase adapters (Supabase references removed)
import { Transaction, TransactionCategory } from './mockData';
import { UserData } from '@/services/api/users/UserData';
import { UserRole } from '@/hooks/auth';

// Mock adapters for transactions, categories, and users

// Convert mock DB transaction to application model
export function dbToTransactionModel(dbTransaction: any): Transaction {
  return {
    id: dbTransaction.id || `mock-${Date.now()}`,
    description: dbTransaction.description || '',
    amount: dbTransaction.amount || 0,
    date: dbTransaction.date || new Date().toISOString().split('T')[0],
    categoryId: dbTransaction.categoryid || '',
    type: (dbTransaction.type as "income" | "expense") || "expense",
  };
}

// Convert application model to mock DB format
export function transactionModelToDb(transaction: Partial<Transaction>): any {
  return {
    id: transaction.id || `mock-${Date.now()}`,
    description: transaction.description || '',
    amount: transaction.amount || 0,
    date: transaction.date || new Date().toISOString().split('T')[0],
    categoryid: transaction.categoryId || '',
    type: transaction.type || "expense",
  };
}

// Convert mock DB category to application model
export function dbToCategoryModel(dbCategory: any): TransactionCategory {
  return {
    id: dbCategory.id || `mock-${Date.now()}`,
    name: dbCategory.name || '',
    type: (dbCategory.type as "income" | "expense") || "expense",
    level: dbCategory.level || 1,
    parentId: dbCategory.parentid || null,
    isFixedExpense: Boolean(dbCategory.isfixedexpense),
    isActive: dbCategory.isactive !== false,
  };
}

// Convert application model to mock DB format
export function categoryModelToDb(category: Partial<TransactionCategory>): any {
  return {
    id: category.id || `mock-${Date.now()}`,
    name: category.name || '',
    type: category.type || "expense",
    level: category.level || 1,
    parentid: category.parentId || null,
    isfixedexpense: Boolean(category.isFixedExpense),
    isactive: category.isActive !== false,
  };
}

// Convert mock DB user to application model
export function dbToUserModel(dbUser: any): UserData {
  // Map the role from the database to a valid UserRole
  // If the role is 'regular', map it to 'viewer' which is a valid UserRole
  let role: UserRole;
  if (dbUser.role === 'regular') {
    role = 'viewer';
  } else if (dbUser.role === 'editor' || dbUser.role === 'viewer') {
    role = dbUser.role as UserRole;
  } else {
    // Default to 'viewer' for any other unrecognized role
    role = 'viewer';
  }
  
  return {
    id: dbUser.id || `mock-${Date.now()}`,
    name: dbUser.name || '',
    username: dbUser.username || '',
    password: dbUser.password || '',
    role: role,
    status: (dbUser.status as 'active' | 'pending' | 'inactive') || 'active',
    lastLogin: dbUser.last_login || null
  };
}

// Convert application model to mock DB format
export function userModelToDb(user: Partial<UserData>): any {
  return {
    id: user.id || `mock-${Date.now()}`,
    name: user.name || '',
    username: user.username || '',
    password: user.password || '',
    role: user.role || 'viewer',
    status: user.status || 'active',
    last_login: user.lastLogin || null
  };
}
