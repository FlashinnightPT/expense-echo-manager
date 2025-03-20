
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
  // Garantir que os valores booleanos são convertidos corretamente
  const isActive = dbCategory.isactive !== undefined ? Boolean(dbCategory.isactive) : true;
  const isFixedExpense = dbCategory.isfixedexpense !== undefined ? Boolean(dbCategory.isfixedexpense) : false;
  
  console.log("Convertendo categoria da BD para modelo:", {
    original: dbCategory,
    convertido: {
      isActive: isActive,
      isFixedExpense: isFixedExpense
    }
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
  // Primeiro, garantir que temos valores booleanos explícitos
  // Verificar se os valores estão definidos e convertê-los explicitamente para boolean
  const isCategoryActive = category.isActive !== undefined ? Boolean(category.isActive) : true;
  const isFixedExp = category.isFixedExpense !== undefined ? Boolean(category.isFixedExpense) : false;
  
  console.log("Convertendo para formato da BD:", {
    original: category,
    convertido: {
      isactive: isCategoryActive,
      isfixedexpense: isFixedExp
    }
  });
  
  return {
    id: category.id,
    name: category.name,
    type: category.type,
    level: category.level,
    parentid: category.parentId, // Map from model's parentId to db's parentid
    isfixedexpense: isFixedExp, // Make sure to convert to boolean
    isactive: isCategoryActive, // Map from model's isActive to db's isactive, ensure it's a boolean
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
