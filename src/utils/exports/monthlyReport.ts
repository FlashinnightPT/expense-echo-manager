
import { utils, write } from 'xlsx';
import { formatCurrency } from "../financialCalculations";
import { 
  prepareCategoryHierarchyForReport, 
  calculateMonthlyTotalsByType 
} from "./dataFormatters";

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
  
  // Estruturar hierarquia de categorias para o relatório
  const categoryHierarchy = prepareCategoryHierarchyForReport(categories, transactions, year, type);
  
  // Processar cada categoria raiz
  categoryHierarchy.forEach(rootCat => {
    // Adicionar linha para a categoria raiz
    const rootCatRow = {
      A: rootCat.category.name,
      B: formatCurrency(rootCat.monthlyValues[1] || 0).replace(/[€$]/g, '').trim(),
      C: formatCurrency(rootCat.monthlyValues[2] || 0).replace(/[€$]/g, '').trim(),
      D: formatCurrency(rootCat.monthlyValues[3] || 0).replace(/[€$]/g, '').trim(),
      E: formatCurrency(rootCat.monthlyValues[4] || 0).replace(/[€$]/g, '').trim(),
      F: formatCurrency(rootCat.monthlyValues[5] || 0).replace(/[€$]/g, '').trim(),
      G: formatCurrency(rootCat.monthlyValues[6] || 0).replace(/[€$]/g, '').trim(),
      H: formatCurrency(rootCat.monthlyValues[7] || 0).replace(/[€$]/g, '').trim(),
      I: formatCurrency(rootCat.monthlyValues[8] || 0).replace(/[€$]/g, '').trim(),
      J: formatCurrency(rootCat.monthlyValues[9] || 0).replace(/[€$]/g, '').trim(),
      K: formatCurrency(rootCat.monthlyValues[10] || 0).replace(/[€$]/g, '').trim(),
      L: formatCurrency(rootCat.monthlyValues[11] || 0).replace(/[€$]/g, '').trim(),
      M: formatCurrency(rootCat.monthlyValues[12] || 0).replace(/[€$]/g, '').trim(),
      N: formatCurrency(Object.values(rootCat.monthlyValues).reduce((sum, value) => sum + value, 0)).replace(/[€$]/g, '').trim(),
      O: formatCurrency(Object.values(rootCat.monthlyValues).reduce((sum, value) => sum + value, 0) / 12).replace(/[€$]/g, '').trim()
    };
    details.push(rootCatRow);
    
    // Processar subcategorias
    rootCat.subcategories.forEach(subCat => {
      // Adicionar linha para a subcategoria
      const subCatRow = {
        A: `    ${subCat.category.name}`,
        B: formatCurrency(subCat.monthlyValues[1] || 0).replace(/[€$]/g, '').trim(),
        C: formatCurrency(subCat.monthlyValues[2] || 0).replace(/[€$]/g, '').trim(),
        D: formatCurrency(subCat.monthlyValues[3] || 0).replace(/[€$]/g, '').trim(),
        E: formatCurrency(subCat.monthlyValues[4] || 0).replace(/[€$]/g, '').trim(),
        F: formatCurrency(subCat.monthlyValues[5] || 0).replace(/[€$]/g, '').trim(),
        G: formatCurrency(subCat.monthlyValues[6] || 0).replace(/[€$]/g, '').trim(),
        H: formatCurrency(subCat.monthlyValues[7] || 0).replace(/[€$]/g, '').trim(),
        I: formatCurrency(subCat.monthlyValues[8] || 0).replace(/[€$]/g, '').trim(),
        J: formatCurrency(subCat.monthlyValues[9] || 0).replace(/[€$]/g, '').trim(),
        K: formatCurrency(subCat.monthlyValues[10] || 0).replace(/[€$]/g, '').trim(),
        L: formatCurrency(subCat.monthlyValues[11] || 0).replace(/[€$]/g, '').trim(),
        M: formatCurrency(subCat.monthlyValues[12] || 0).replace(/[€$]/g, '').trim(),
        N: formatCurrency(Object.values(subCat.monthlyValues).reduce((sum, value) => sum + value, 0)).replace(/[€$]/g, '').trim(),
        O: formatCurrency(Object.values(subCat.monthlyValues).reduce((sum, value) => sum + value, 0) / 12).replace(/[€$]/g, '').trim()
      };
      details.push(subCatRow);
      
      // Processar subcategorias de nível 3 (se existirem)
      subCat.subcategories.forEach(level3Cat => {
        const level3CatRow = {
          A: `        ${level3Cat.category.name}`,
          B: formatCurrency(level3Cat.monthlyValues[1] || 0).replace(/[€$]/g, '').trim(),
          C: formatCurrency(level3Cat.monthlyValues[2] || 0).replace(/[€$]/g, '').trim(),
          D: formatCurrency(level3Cat.monthlyValues[3] || 0).replace(/[€$]/g, '').trim(),
          E: formatCurrency(level3Cat.monthlyValues[4] || 0).replace(/[€$]/g, '').trim(),
          F: formatCurrency(level3Cat.monthlyValues[5] || 0).replace(/[€$]/g, '').trim(),
          G: formatCurrency(level3Cat.monthlyValues[6] || 0).replace(/[€$]/g, '').trim(),
          H: formatCurrency(level3Cat.monthlyValues[7] || 0).replace(/[€$]/g, '').trim(),
          I: formatCurrency(level3Cat.monthlyValues[8] || 0).replace(/[€$]/g, '').trim(),
          J: formatCurrency(level3Cat.monthlyValues[9] || 0).replace(/[€$]/g, '').trim(),
          K: formatCurrency(level3Cat.monthlyValues[10] || 0).replace(/[€$]/g, '').trim(),
          L: formatCurrency(level3Cat.monthlyValues[11] || 0).replace(/[€$]/g, '').trim(),
          M: formatCurrency(level3Cat.monthlyValues[12] || 0).replace(/[€$]/g, '').trim(),
          N: formatCurrency(Object.values(level3Cat.monthlyValues).reduce((sum, value) => sum + value, 0)).replace(/[€$]/g, '').trim(),
          O: formatCurrency(Object.values(level3Cat.monthlyValues).reduce((sum, value) => sum + value, 0) / 12).replace(/[€$]/g, '').trim()
        };
        details.push(level3CatRow);
      });
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
