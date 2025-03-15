
import { TransactionCategory } from "./mockData";

// Simplified categories - only level 2 main categories
export const defaultCategories: TransactionCategory[] = [
  // RECEITAS - Nível 2 - Categoria principal
  {
    id: 'income-comissoes',
    name: 'Comissões',
    type: 'income',
    level: 2
  },
  
  // DESPESAS - Categorias de nível 2
  {
    id: 'expense-pessoal',
    name: 'Pessoal',
    type: 'expense',
    level: 2
  },
  {
    id: 'expense-impostos',
    name: 'Impostos',
    type: 'expense',
    level: 2
  },
  {
    id: 'expense-seguros',
    name: 'Seguros',
    type: 'expense',
    level: 2
  },
  {
    id: 'expense-diversos',
    name: 'Diversos',
    type: 'expense',
    level: 2
  },
  {
    id: 'expense-comida-escritorio',
    name: 'Comida escritório',
    type: 'expense',
    level: 2
  },
  {
    id: 'expense-automoveis',
    name: 'Automóveis',
    type: 'expense',
    level: 2
  },
  {
    id: 'expense-escritorio',
    name: 'Escritório',
    type: 'expense',
    level: 2
  },
  {
    id: 'expense-impostos-gerais',
    name: 'Impostos',
    type: 'expense',
    level: 2
  },
  {
    id: 'expense-outras-despesas',
    name: 'Outras despesas',
    type: 'expense',
    level: 2
  }
];
