
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
  console.log("Convertendo categoria do BD:", dbCategory);
  
  // Converter explicitamente para booleanos usando dupla negação para garantir valores booleanos
  const isActive = dbCategory.isactive !== false; // true por defeito se for null/undefined
  const isFixedExpense = dbCategory.isfixedexpense === true; // false por defeito se for null/undefined
  
  console.log("Valores após conversão:", {
    isActive: isActive,
    isActive_type: typeof isActive,
    isFixedExpense: isFixedExpense,
    isFixedExpense_type: typeof isFixedExpense
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
  console.log("Convertendo categoria para BD:", category);
  
  // Valores booleanos explícitos para isActive e isFixedExpense
  const isActive = category.isActive !== false; // true por defeito 
  const isFixedExpense = category.isFixedExpense === true; // false por defeito
  
  console.log("Valores após processamento:", {
    isactive: isActive,
    isactive_type: typeof isActive,
    isfixedexpense: isFixedExpense,
    isfixedexpense_type: typeof isFixedExpense
  });
  
  return {
    id: category.id,
    name: category.name,
    type: category.type,
    level: category.level,
    parentid: category.parentId, // Map from model's parentId to db's parentid
    isfixedexpense: isFixedExpense, // Explicitamente booleano
    isactive: isActive, // Explicitamente booleano
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
