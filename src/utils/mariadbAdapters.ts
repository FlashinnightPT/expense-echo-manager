
import { Transaction, TransactionCategory } from './mockData';
import { UserData } from '@/services/api/users/UserData';
import { UserRole } from '@/hooks/auth';

// Transform database transaction record to application Transaction model
export function dbToTransactionModel(dbTransaction: any): Transaction {
  return {
    id: dbTransaction.id,
    description: dbTransaction.description,
    amount: parseFloat(dbTransaction.amount), // Ensure numeric conversion
    date: dbTransaction.date, // MySQL date format handling
    categoryId: dbTransaction.categoryid,
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
    categoryid: transaction.categoryId,
    type: transaction.type,
  };
}

// Transform database category record to application TransactionCategory model
export function dbToCategoryModel(dbCategory: any): TransactionCategory {
  console.log("Converting DB category to model:", dbCategory);
  
  // MariaDB returns 0/1 for boolean values, convert them properly
  const isActive = dbCategory.isactive === 1;
  const isFixedExpense = dbCategory.isfixedexpense === 1;
  
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
    parentId: dbCategory.parentid,
    isFixedExpense: isFixedExpense,
    isActive: isActive,
  };
}

// Transform application TransactionCategory model to database record
export function categoryModelToDb(category: Partial<TransactionCategory>): any {
  console.log("Converting category to DB format:", category);
  
  // MariaDB expects 0/1 for boolean values
  const isActive = category.isActive === true ? 1 : 0;
  const isFixedExpense = category.isFixedExpense === true ? 1 : 0;
  
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
    parentid: category.parentId,
    isfixedexpense: isFixedExpense,
    isactive: isActive,
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
