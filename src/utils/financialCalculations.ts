
// Função para formatar valores monetários
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('pt-PT', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount);
};

// Nomes dos meses em português
export const getMonthName = (monthNumber: number): string => {
  const months = [
    "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
    "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
  ];
  return months[monthNumber - 1] || "";
};

// Função para calcular o resumo mensal
export const calculateMonthlySummary = (monthData: any) => {
  const income = monthData.income || 0;
  const expense = monthData.expense || 0;
  
  const balance = income - expense;
  const differenceRate = income > 0 ? ((income - expense) / income) * 100 : 0;
  
  return {
    income,
    expense,
    balance,
    differenceRate
  };
};

// Função para calcular o resumo anual
export const calculateYearlySummary = (yearData: any) => {
  const income = yearData.income || 0;
  const expense = yearData.expense || 0;
  
  const balance = income - expense;
  const differenceRate = income > 0 ? ((income - expense) / income) * 100 : 0;
  
  return {
    income,
    expense,
    balance,
    differenceRate
  };
};
