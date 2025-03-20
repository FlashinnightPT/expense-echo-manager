
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
  
  // FIXED: Ensure we handle boolean values correctly
  // Using explicit comparison to convert values - this is more reliable than double negation
  const isActive = dbCategory.isactive === true;
  const isFixedExpense = dbCategory.isfixedexpense === true;
  
  console.log("Boolean conversion results:", {
    isactive_original: dbCategory.isactive,
    isactive_original_type: typeof dbCategory.isactive,
    isActive_converted: isActive,
    isActive_converted_type: typeof isActive,
    isfixedexpense_original: dbCategory.isfixedexpense,
    isfixedexpense_original_type: typeof dbCategory.isfixedexpense,
    isFixedExpense_converted: isFixedExpense,
    isFixedExpense_converted_type: typeof isFixedExpense
  });
  
  return {
    id: dbCategory.id,
    name: dbCategory.name,
    type: dbCategory.type as "income" | "expense",
    level: dbCategory.level,
    parentId: dbCategory.parentid, // Map from db's parentid to model's parentId
    isFixedExpense: isFixedExpense, // Ensure this is a boolean
    isActive: isActive, // Map from db's isactive to model's isActive
  };
}

// Transform application TransactionCategory model to database record
export function categoryModelToDb(category: Partial<TransactionCategory>): any {
  console.log("Converting category to DB format:", category);
  
  // FIXED: Use explicit boolean conversion for database
  // These are explicitly set to true/false to avoid any type issues
  const isActive = category.isActive === true ? true : false;
  const isFixedExpense = category.isFixedExpense === true ? true : false;
  
  console.log("Boolean conversion for DB:", {
    isActive_original: category.isActive,
    isActive_original_type: typeof category.isActive,
    isactive_converted: isActive,
    isactive_converted_type: typeof isActive,
    isFixedExpense_original: category.isFixedExpense,
    isFixedExpense_original_type: typeof category.isFixedExpense,
    isfixedexpense_converted: isFixedExpense,
    isfixedexpense_converted_type: typeof isFixedExpense
  });
  
  return {
    id: category.id,
    name: category.name,
    type: category.type,
    level: category.level,
    parentid: category.parentId, // Map from model's parentId to db's parentid
    isfixedexpense: isFixedExpense, // Explicit boolean for database
    isactive: isActive, // Explicit boolean for database
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
