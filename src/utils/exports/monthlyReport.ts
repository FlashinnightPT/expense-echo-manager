
import { utils, write } from 'xlsx';
import { formatCurrency } from "../financialCalculations";

/**
 * Helper function to get all subcategory IDs
 */
function getAllSubcategoryIds(categoryId: string, categories: any[]): string[] {
  const directChildren = categories.filter(cat => cat.parentId === categoryId).map(cat => cat.id);
  
  if (directChildren.length === 0) {
    return [];
  }
  
  const nestedChildren = directChildren.flatMap(childId => getAllSubcategoryIds(childId, categories));
  
  return [...directChildren, ...nestedChildren];
}

/**
 * Helper function to prepare data by type (income or expense)
 */
function prepareTypeData(type: "income" | "expense", label: string, year: number, categories: any[], transactions: any[]) {
  // Obter categorias raiz do tipo específico
  const rootCategories = categories.filter(cat => cat.level === 1 && cat.type === type);
  
  // Inicializar somas mensais
  const monthlyTotals: { [key: string]: number } = {};
  for (let i = 1; i <= 12; i++) {
    monthlyTotals[i] = 0;
  }
  
  // Calcular total mensal para cada mês
  transactions.forEach(transaction => {
    const date = new Date(transaction.date);
    const transactionYear = date.getFullYear();
    const month = date.getMonth() + 1;
    
    if (transactionYear === year && transaction.type === type) {
      monthlyTotals[month] += transaction.amount;
    }
  });
  
  // Calcular total anual e média mensal
  const totalYear = Object.values(monthlyTotals).reduce((sum, value) => sum + value, 0);
  const monthsWithValues = Object.values(monthlyTotals).filter(value => value > 0).length || 12;
  const monthlyAverage = totalYear / monthsWithValues;
  
  // Preparar linha de resumo
  const summary: { [key: string]: string } = {
    B: formatCurrency(monthlyTotals[1]).replace(/[€$]/g, '').trim(),
    C: formatCurrency(monthlyTotals[2]).replace(/[€$]/g, '').trim(),
    D: formatCurrency(monthlyTotals[3]).replace(/[€$]/g, '').trim(),
    E: formatCurrency(monthlyTotals[4]).replace(/[€$]/g, '').trim(), 
    F: formatCurrency(monthlyTotals[5]).replace(/[€$]/g, '').trim(),
    G: formatCurrency(monthlyTotals[6]).replace(/[€$]/g, '').trim(),
    H: formatCurrency(monthlyTotals[7]).replace(/[€$]/g, '').trim(),
    I: formatCurrency(monthlyTotals[8]).replace(/[€$]/g, '').trim(),
    J: formatCurrency(monthlyTotals[9]).replace(/[€$]/g, '').trim(),
    K: formatCurrency(monthlyTotals[10]).replace(/[€$]/g, '').trim(),
    L: formatCurrency(monthlyTotals[11]).replace(/[€$]/g, '').trim(),
    M: formatCurrency(monthlyTotals[12]).replace(/[€$]/g, '').trim(),
    N: formatCurrency(totalYear).replace(/[€$]/g, '').trim(),
    O: formatCurrency(monthlyAverage).replace(/[€$]/g, '').trim()
  };
  
  // Preparar detalhes por categoria
  const details: { [key: string]: string }[] = [];
  
  if (rootCategories.length === 0) {
    details.push({
      A: label,
      B: "0,00",
      C: "0,00",
      D: "0,00",
      E: "0,00",
      F: "0,00",
      G: "0,00",
      H: "0,00",
      I: "0,00",
      J: "0,00",
      K: "0,00",
      L: "0,00",
      M: "0,00",
      N: "0,00",
      O: "0,00"
    });
  }
  
  rootCategories.forEach(rootCat => {
    const categoryMonthlyTotals: { [key: string]: number } = {};
    for (let i = 1; i <= 12; i++) {
      categoryMonthlyTotals[i] = 0;
    }
    
    // Obter todas as subcategorias desta categoria
    const allSubCategories = getAllSubcategoryIds(rootCat.id, categories);
    allSubCategories.push(rootCat.id);
    
    // Calcular valores para a categoria e suas subcategorias
    transactions.forEach(transaction => {
      const date = new Date(transaction.date);
      const transactionYear = date.getFullYear();
      const month = date.getMonth() + 1;
      
      if (transactionYear === year && 
          transaction.type === type && 
          allSubCategories.includes(transaction.categoryId)) {
        categoryMonthlyTotals[month] += transaction.amount;
      }
    });
    
    // Calcular total anual e média mensal para categoria
    const catTotalYear = Object.values(categoryMonthlyTotals).reduce((sum, value) => sum + value, 0);
    const catMonthsWithValues = Object.values(categoryMonthlyTotals).filter(value => value > 0).length || 12;
    const catMonthlyAverage = catTotalYear / catMonthsWithValues;
    
    details.push({
      A: rootCat.name,
      B: formatCurrency(categoryMonthlyTotals[1]).replace(/[€$]/g, '').trim(),
      C: formatCurrency(categoryMonthlyTotals[2]).replace(/[€$]/g, '').trim(),
      D: formatCurrency(categoryMonthlyTotals[3]).replace(/[€$]/g, '').trim(),
      E: formatCurrency(categoryMonthlyTotals[4]).replace(/[€$]/g, '').trim(),
      F: formatCurrency(categoryMonthlyTotals[5]).replace(/[€$]/g, '').trim(),
      G: formatCurrency(categoryMonthlyTotals[6]).replace(/[€$]/g, '').trim(),
      H: formatCurrency(categoryMonthlyTotals[7]).replace(/[€$]/g, '').trim(),
      I: formatCurrency(categoryMonthlyTotals[8]).replace(/[€$]/g, '').trim(),
      J: formatCurrency(categoryMonthlyTotals[9]).replace(/[€$]/g, '').trim(),
      K: formatCurrency(categoryMonthlyTotals[10]).replace(/[€$]/g, '').trim(),
      L: formatCurrency(categoryMonthlyTotals[11]).replace(/[€$]/g, '').trim(),
      M: formatCurrency(categoryMonthlyTotals[12]).replace(/[€$]/g, '').trim(),
      N: formatCurrency(catTotalYear).replace(/[€$]/g, '').trim(),
      O: formatCurrency(catMonthlyAverage).replace(/[€$]/g, '').trim()
    });
  });
  
  return { summary, details };
}

/**
 * Helper function to prepare difference data (income - expense)
 */
function prepareDifferenceData(incomeData: any, expenseData: any) {
  const months = ['B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O'];
  const result: { [key: string]: string } = {};
  
  months.forEach(month => {
    const incomeValue = parseFloat(incomeData.summary[month].replace(/\./g, '').replace(',', '.')) || 0;
    const expenseValue = parseFloat(expenseData.summary[month].replace(/\./g, '').replace(',', '.')) || 0;
    const difference = incomeValue - expenseValue;
    
    result[month] = formatCurrency(difference).replace(/[€$]/g, '').trim();
  });
  
  return result;
}

/**
 * Prepara dados para exportação em formato de relatório mensal por categoria
 * Seguindo o modelo específico de relatório mensal
 */
export const prepareMonthlyCategoryReport = async (
  year: number,
  categories: any[],
  transactions: any[]
) => {
  // Criar workbook com múltiplas planilhas
  const wb = utils.book_new();

  // Preparar dados para receitas
  const incomeData = prepareTypeData("income", "Receitas", year, categories, transactions);
  
  // Preparar dados para despesas  
  const expenseData = prepareTypeData("expense", "Despesas", year, categories, transactions);

  // Preparar dados para diferença (receitas - despesas)
  const differenceData = prepareDifferenceData(incomeData, expenseData);

  // Exportar em formato Excel
  const exportData = [
    // Informações de cabeçalho
    { A: `${year}`, B: "", C: "", D: "", E: "", F: "", G: "Relatorio de contas Mensal", H: "" },
    // Linha em branco
    {},
    // Cabeçalho da tabela principal
    { A: "Descrição", B: "Jan", C: "Fev", D: "Mar", E: "Abr", F: "Mai", G: "Jun", H: "Jul", I: "Ago", J: "Set", K: "Out", L: "Nov", M: "Dez", N: "Total acumulado do Ano", O: "Média Mensal" },
    // Dados de receitas
    { A: "Receitas", ...incomeData.summary },
    // Dados de despesas
    { A: "Despesas", ...expenseData.summary },
    // Diferença (receitas - despesas)
    { A: "Diferença", ...differenceData },
    // Linha em branco
    {},
    // Cabeçalho de receitas
    { A: "RECEITAS", B: "", C: "", D: "", E: "", F: "", G: "", H: "", I: "", J: "", K: "", L: "", M: "", N: "", O: "" },
    // Detalhamento de receitas por categoria
    ...incomeData.details,
    // Linha em branco
    {},
    // Total de receitas
    { A: "Total", ...incomeData.summary },
    // Linha em branco
    {},
    // Cabeçalho de despesas
    { A: "DESPESAS", B: "", C: "", D: "", E: "", F: "", G: "", H: "", I: "", J: "", K: "", L: "", M: "", N: "", O: "" },
    // Detalhamento de despesas por categoria
    ...expenseData.details,
    // Linha em branco
    {},
    // Total de despesas
    { A: "Total", ...expenseData.summary },
  ];

  // Criar planilha e adicionar ao workbook
  const ws = utils.json_to_sheet(exportData, { skipHeader: true });

  // Configurar larguras de coluna
  ws['!cols'] = [
    { width: 25 }, // A - Descrição
    { width: 15 }, // B - Jan
    { width: 15 }, // C - Fev
    { width: 15 }, // D - Mar
    { width: 15 }, // E - Abr
    { width: 15 }, // F - Mai
    { width: 15 }, // G - Jun
    { width: 15 }, // H - Jul
    { width: 15 }, // I - Ago
    { width: 15 }, // J - Set
    { width: 15 }, // K - Out
    { width: 15 }, // L - Nov
    { width: 15 }, // M - Dez
    { width: 25 }, // N - Total acumulado
    { width: 15 }, // O - Média Mensal
  ];

  // Aplicar estilos para as células de cabeçalho
  Object.keys(ws).forEach(cell => {
    if (cell[0] === '3' || cell === 'A8' || cell === 'A15') {
      if (!ws[cell].s) ws[cell].s = {};
      ws[cell].s.fill = { fgColor: { rgb: "A9D08E" } }; // Verde claro para receitas
      ws[cell].s.font = { bold: true };
    }
    
    if (cell === 'A4') {
      if (!ws[cell].s) ws[cell].s = {};
      ws[cell].s.fill = { fgColor: { rgb: "A9D08E" } }; // Verde claro para receitas
      ws[cell].s.font = { bold: true };
    }
    
    if (cell === 'A5') {
      if (!ws[cell].s) ws[cell].s = {};
      ws[cell].s.fill = { fgColor: { rgb: "F8CBAD" } }; // Laranja claro para despesas
      ws[cell].s.font = { bold: true };
    }
    
    if (cell === 'A6') {
      if (!ws[cell].s) ws[cell].s = {};
      ws[cell].s.fill = { fgColor: { rgb: "BDD7EE" } }; // Azul claro para diferença
      ws[cell].s.font = { bold: true };
    }
  });

  utils.book_append_sheet(wb, ws, "Relatorio Mensal");

  // Exportar workbook como arquivo Excel
  const fileName = `relatorio_mensal_${year}`;
  const excelBuffer = write(wb, { bookType: 'xlsx', type: 'array' });
  
  // Criar Blob e iniciar download
  const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', `${fileName}.xlsx`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};
