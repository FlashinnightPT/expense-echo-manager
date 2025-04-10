
// Mock implementation of supabase adapters (Supabase references removed)
import { Transaction, TransactionCategory } from './mockData';
import { UserData } from '@/services/api/users/UserData';
import { UserRole } from '@/hooks/auth';

// Mock adapters for transactions, categories, and users

// Convert mock DB transaction to application model
export function dbToTransactionModel(dbRecord: any): Transaction {
  // Verificar se o registro tem o formato esperado
  if (!dbRecord) {
    console.error("Registro de transação inválido:", dbRecord);
    throw new Error("Registro de transação inválido");
  }
  
  // Normalizar nomes de propriedades (API retorna com inicial maiúscula)
  const normalizedRecord = {
    id: dbRecord.Id || dbRecord.id,
    date: dbRecord.Date || dbRecord.date,
    createdAt: dbRecord.CreatedAt || dbRecord.createdAt,
    amount: dbRecord.Amount || dbRecord.amount,
    description: dbRecord.Description || dbRecord.description,
    categoryId: dbRecord.CategoryId || dbRecord.categoryId,
    type: dbRecord.Type || dbRecord.type
  };
  
  // Converter formato de data se necessário (a API retorna no formato DD-MM-YYYY)
  let formattedDate = normalizedRecord.date;
  if (formattedDate && formattedDate.includes("-") && !formattedDate.match(/^\d{4}-\d{2}-\d{2}/)) {
    // Se o formato for DD-MM-YYYY, converter para YYYY-MM-DD
    const parts = formattedDate.split(" ")[0].split("-");
    if (parts.length === 3) {
      formattedDate = `${parts[2]}-${parts[1]}-${parts[0]}`;
    }
  }
  
  console.log("Convertendo transação da API:", normalizedRecord, "Data formatada:", formattedDate);

  // Processar o valor da transação corretamente
  let amount: number;
  if (typeof normalizedRecord.amount === 'number') {
    amount = normalizedRecord.amount;
  } else if (typeof normalizedRecord.amount === 'string') {
    // Remove qualquer formatação de moeda e converte para número
    amount = parseFloat(normalizedRecord.amount.replace(/[^\d.-]/g, ''));
  } else {
    console.error("Formato de valor inválido:", normalizedRecord.amount);
    amount = 0;
  }

  console.log("Valor convertido:", amount);

  return {
    id: normalizedRecord.id,
    date: formattedDate,
    amount: amount,
    description: normalizedRecord.description || "",
    categoryId: normalizedRecord.categoryId,
    type: normalizedRecord.type as "income" | "expense",
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
