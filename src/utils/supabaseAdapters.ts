
import { Transaction, TransactionCategory } from './mockData';
import { UserData } from '@/services/api/users/UserData';
import { UserRole } from '@/hooks/auth';

// Transform database transaction record to application Transaction model
export function dbToTransactionModel(dbTransaction: any): Transaction {
  return {
    id: dbTransaction.id,
    description: dbTransaction.description,
    amount: dbTransaction.amount,
    date: dbTransaction.date,
    categoryId: dbTransaction.categoryid, // Map from db's categoryid to model's categoryId
    type: dbTransaction.type as "income" | "expense",
  };
}

// Transform application Transaction model to database record
export function transactionModelToDb(transaction: Partial<Transaction>): any {
  return {
    id: transaction.id,
    description: transaction.description,
    amount: transaction.amount,
    date: transaction.date,
    categoryid: transaction.categoryId, // Map from model's categoryId to db's categoryid
    type: transaction.type,
  };
}

// Transform database category record to application TransactionCategory model
export function dbToCategoryModel(dbCategory: any): TransactionCategory {
  console.log("Converting DB category to model:", dbCategory);
  
  // Explicitly handle boolean conversion
  const isActive = dbCategory.isactive !== false; // true if not explicitly false
  const isFixedExpense = dbCategory.isfixedexpense === true; // false if not explicitly true
  
  console.log("Values after conversion:", {
    isActive,
    isActive_type: typeof isActive,
    isFixedExpense,
    isFixedExpense_type: typeof isFixedExpense,
    original_isactive: dbCategory.isactive,
    original_isactive_type: typeof dbCategory.isactive
  });
  
  return {
    id: dbCategory.id,
    name: dbCategory.name,
    type: dbCategory.type as "income" | "expense",
    level: dbCategory.level,
    parentId: dbCategory.parentid, // Map from db's parentid to model's parentId
    isFixedExpense: isFixedExpense, // Ensure this is a boolean
    isActive: isActive, // Map from db's isactive to model's isActive, default to true if not specified
  };
}

// Transform application TransactionCategory model to database record
export function categoryModelToDb(category: Partial<TransactionCategory>): any {
  console.log("Converting category to DB format:", category);
  
  // Explicitly convert to boolean values using triple equals for strict comparison
  const isActive = category.isActive !== false; // true by default
  const isFixedExpense = category.isFixedExpense === true; // false by default
  
  console.log("Values for DB:", {
    isactive: isActive,
    isactive_type: typeof isActive,
    isfixedexpense: isFixedExpense,
    isfixedexpense_type: typeof isFixedExpense,
    original_isActive: category.isActive,
    original_isActive_type: typeof category.isActive
  });
  
  return {
    id: category.id,
    name: category.name,
    type: category.type,
    level: category.level,
    parentid: category.parentId, // Map from model's parentId to db's parentid
    isfixedexpense: isFixedExpense, // Explicitly boolean
    isactive: isActive, // Explicitly boolean
  };
}

// Transform database user record to application UserData model
export function dbToUserModel(dbUser: any): UserData {
  return {
    id: dbUser.id,
    name: dbUser.name,
    username: dbUser.username,
    password: dbUser.password,
    role: dbUser.role as UserRole,
    status: dbUser.status as 'active' | 'pending' | 'inactive',
    lastLogin: dbUser.last_login
  };
}

// Transform application UserData model to database record
export function userModelToDb(user: Partial<UserData>): any {
  return {
    id: user.id,
    name: user.name,
    username: user.username,
    password: user.password,
    role: user.role,
    status: user.status,
    last_login: user.lastLogin
  };
}
