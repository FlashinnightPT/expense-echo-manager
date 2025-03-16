import { utils, write, read } from 'xlsx';
import { formatCurrency, getMonthName } from "./financialCalculations";
import { Transaction, TransactionCategory } from "./mockData";

/**
 * Exports data to an Excel file and triggers a download
 * @param data The data to export
 * @param filename The name of the file to download
 */
export const exportToExcel = (data: any[], filename: string) => {
  // Return early if no data
  if (!data || data.length === 0) {
    console.error("No data to export");
    return;
  }

  try {
    // Create a new workbook
    const worksheet = utils.json_to_sheet(data);
    const workbook = utils.book_new();
    utils.book_append_sheet(workbook, worksheet, 'Data');
    
    // Generate the Excel file as a binary string
    const excelBuffer = write(workbook, { bookType: 'xlsx', type: 'binary' });
    
    // Convert binary string to ArrayBuffer
    const arrayBuffer = new ArrayBuffer(excelBuffer.length);
    const view = new Uint8Array(arrayBuffer);
    for (let i = 0; i < excelBuffer.length; i++) {
      view[i] = excelBuffer.charCodeAt(i) & 0xFF;
    }
    
    // Create a Blob with the Excel content
    const blob = new Blob([arrayBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    
    // Create a download URL for the Blob
    const url = URL.createObjectURL(blob);
    
    // Create a temporary link element to trigger the download
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${filename}.xlsx`);
    document.body.appendChild(link);
    
    // Trigger the download
    link.click();
    
    // Clean up
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error("Error exporting data to Excel:", error);
  }
};

/**
 * Creates and exports an Excel template for categories
 */
export const exportCategoryTemplate = () => {
  // Create a workbook with headers matching the image
  const wb = utils.book_new();
  
  // Format the headers and sample data to match the image
  const headers = ["Tipo", "Nivel 1", "Nivel 2", "Nivel 3", "Nivel 4"];
  
  // Sample data based on the image
  const data = [
    // Headers
    headers,
    // First section - Receita > Pessoal > Salarios > (Carlos, Leandro, Antonio, Isabel, Ana Paula)
    ["Receita", "", "Pessoal", "", ""],
    ["", "", "", "Salarios", ""],
    ["", "", "", "", "Carlos"],
    ["", "", "", "", "Leandro"],
    ["", "", "", "", "Antonio"],
    ["", "", "", "", "Isabel"],
    ["", "", "", "", "Ana Paula"],
    
    // Second section - Receita > Pessoal > Impostos > (IRC, Segurança Social)
    ["Receita", "", "Pessoal", "", ""],
    ["", "", "", "Impostos", ""],
    ["", "", "", "", "IRC"],
    ["", "", "", "", "Segurança Social"],
    
    // Third section - Receita > Contabilista > Avença > Impostos
    ["Receita", "", "Contabilista", "", ""],
    ["", "", "", "Avença", ""],
    ["", "", "", "Impostos", ""],
  ];
  
  // Create worksheet
  const ws = utils.aoa_to_sheet(data);
  
  // Add worksheet to workbook
  utils.book_append_sheet(wb, ws, "Template Categorias");
  
  // Generate Excel binary
  const excelBuffer = write(wb, { bookType: 'xlsx', type: 'binary' });
  
  // Convert to array buffer
  const arrayBuffer = new ArrayBuffer(excelBuffer.length);
  const view = new Uint8Array(arrayBuffer);
  for (let i = 0; i < excelBuffer.length; i++) {
    view[i] = excelBuffer.charCodeAt(i) & 0xFF;
  }
  
  // Create blob and download
  const blob = new Blob([arrayBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', 'template_categorias.xlsx');
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

/**
 * Validates and processes input data for category import
 */
const validateAndProcessCategoryData = (data: any[]): {
  valid: boolean;
  categories?: Partial<TransactionCategory>[];
  errors?: string[];
} => {
  const errors: string[] = [];
  
  if (!data || data.length === 0) {
    return { valid: false, errors: ["O arquivo está vazio"] };
  }
  
  try {
    // Transform the Excel format into categories
    const categories: Partial<TransactionCategory>[] = [];
    const nivel1Map = new Map<string, string>(); // name -> tempId
    const nivel2Map = new Map<string, string>(); // name -> tempId
    const nivel3Map = new Map<string, string>(); // name -> tempId
    
    // Process each row
    for (let i = 0; i < data.length; i++) {
      const row = data[i];
      
      // Skip header row or empty rows
      if (!row.Tipo || row.Tipo === "Tipo") continue;
      
      // Determine the highest level filled in this row (from right to left)
      let highestLevel = 0;
      let categoryName = "";
      
      if (row["Nivel 4"] && row["Nivel 4"].trim()) {
        highestLevel = 4;
        categoryName = row["Nivel 4"].trim();
      } else if (row["Nivel 3"] && row["Nivel 3"].trim()) {
        highestLevel = 3;
        categoryName = row["Nivel 3"].trim();
      } else if (row["Nivel 2"] && row["Nivel 2"].trim()) {
        highestLevel = 2;
        categoryName = row["Nivel 2"].trim();
      } else if (row["Nivel 1"] && row["Nivel 1"].trim()) {
        highestLevel = 1;
        categoryName = row["Nivel 1"].trim();
      }
      
      // Skip if no valid category found
      if (highestLevel === 0 || !categoryName) continue;
      
      // Get the type
      const type = row.Tipo.toLowerCase() === "receita" ? "income" : "expense";
      
      // Create parent relationships
      let parentId: string | undefined;
      let parentName: string | undefined;
      
      if (highestLevel === 4 && row["Nivel 3"] && row["Nivel 3"].trim()) {
        parentName = row["Nivel 3"].trim();
        parentId = nivel3Map.get(parentName);
      } else if (highestLevel === 3 && row["Nivel 2"] && row["Nivel 2"].trim()) {
        parentName = row["Nivel 2"].trim();
        parentId = nivel2Map.get(parentName);
      } else if (highestLevel === 2 && row["Nivel 1"] && row["Nivel 1"].trim()) {
        parentName = row["Nivel 1"].trim();
        parentId = nivel1Map.get(parentName);
      }
      
      // Create category
      const category: Partial<TransactionCategory> = {
        name: categoryName,
        type,
        level: highestLevel + 1, // Adjust level for the app (app uses level 2, 3, 4)
        parentId,
        parentName
      };
      
      // Store in map for parent relationships
      const tempId = `temp-${type}-${categoryName}-${Date.now()}-${Math.random()}`;
      if (highestLevel === 1) {
        nivel1Map.set(categoryName, tempId);
      } else if (highestLevel === 2) {
        nivel2Map.set(categoryName, tempId);
      } else if (highestLevel === 3) {
        nivel3Map.set(categoryName, tempId);
      }
      
      categories.push(category);
    }
    
    return {
      valid: categories.length > 0,
      categories: categories.length > 0 ? categories : undefined,
      errors: categories.length === 0 ? ["Nenhuma categoria válida encontrada no arquivo"] : undefined
    };
  } catch (error) {
    console.error("Error processing Excel data:", error);
    return {
      valid: false,
      errors: ["Erro ao processar dados do Excel: " + (error instanceof Error ? error.message : String(error))]
    };
  }
};

/**
 * Imports categories from an Excel file
 * @param file The Excel file to import
 * @returns A promise that resolves to the imported categories or rejects with errors
 */
export const importCategoriesFromExcel = (file: File): Promise<Partial<TransactionCategory>[]> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        if (!e.target || !e.target.result) {
          reject(["Erro ao ler arquivo"]);
          return;
        }
        
        const data = e.target.result;
        const workbook = read(data, { type: 'binary' });
        
        if (workbook.SheetNames.length === 0) {
          reject(["Arquivo Excel sem planilhas"]);
          return;
        }
        
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        const jsonData = utils.sheet_to_json(worksheet);
        
        const result = validateAndProcessCategoryData(jsonData);
        
        if (result.valid && result.categories) {
          resolve(result.categories);
        } else {
          reject(result.errors);
        }
      } catch (error) {
        console.error("Error importing categories:", error);
        reject(["Erro ao processar arquivo Excel"]);
      }
    };
    
    reader.onerror = () => {
      reject(["Erro ao ler arquivo"]);
    };
    
    reader.readAsBinaryString(file);
  });
};

/**
 * Formats category transactions for export
 */
export const prepareCategoryDataForExport = (
  transactions: Transaction[],
  categoryName: string,
  dateRange: string
) => {
  return transactions.map(t => ({
    Description: t.description,
    Amount: formatCurrency(t.amount).replace(/[€$]/g, '').trim(),
    Date: new Date(t.date).toLocaleDateString(),
    Category: categoryName,
    Type: t.type === 'income' ? 'Receita' : 'Despesa',
    DateRange: dateRange
  }));
};

/**
 * Formats monthly data for export
 */
export const prepareMonthlyDataForExport = (
  monthlyData: any[],
  year: number
) => {
  return monthlyData.map(data => ({
    Month: getMonthName(data.month),
    Year: year,
    Income: formatCurrency(data.income).replace(/[€$]/g, '').trim(),
    Expense: formatCurrency(data.expense).replace(/[€$]/g, '').trim(),
    Balance: formatCurrency(data.income - data.expense).replace(/[€$]/g, '').trim()
  }));
};

/**
 * Formats transaction data for export
 */
export const prepareTransactionsForExport = (
  transactions: Transaction[]
) => {
  return transactions.map(t => {
    // Fix: Transaction type doesn't have a 'category' property, it uses 'categoryId'
    // We need to look up the category name another way, but for now we'll just use the categoryId
    const categoryName = t.categoryId || '';
    
    return {
      Description: t.description,
      Amount: formatCurrency(t.amount).replace(/[€$]/g, '').trim(),
      Date: new Date(t.date).toLocaleDateString(),
      Type: t.type === 'income' ? 'Receita' : 'Despesa',
      Category: categoryName
    };
  });
};

/**
 * Prepara dados de categorias por mês para exportação
 */
export const prepareCategoryMonthlyReport = (
  categoryData: any[],
  year: number,
  type: 'income' | 'expense'
) => {
  const result = [];
  
  // Adicionar linha de cabeçalho
  const headerRow = {
    Categoria: type === 'income' ? 'RECEITAS' : 'DESPESAS',
    Jan: '', Fev: '', Mar: '', Abr: '', Mai: '', Jun: '',
    Jul: '', Ago: '', Set: '', Out: '', Nov: '', Dez: '',
    Total: '', Media: ''
  };
  result.push(headerRow);
  
  // Adicionar linhas de categorias
  categoryData.forEach(cat => {
    const row = {
      Categoria: cat.category.name,
      Jan: formatCurrency(cat.monthlyAmounts[1] || 0).replace(/[€$]/g, '').trim(),
      Fev: formatCurrency(cat.monthlyAmounts[2] || 0).replace(/[€$]/g, '').trim(),
      Mar: formatCurrency(cat.monthlyAmounts[3] || 0).replace(/[€$]/g, '').trim(),
      Abr: formatCurrency(cat.monthlyAmounts[4] || 0).replace(/[€$]/g, '').trim(),
      Mai: formatCurrency(cat.monthlyAmounts[5] || 0).replace(/[€$]/g, '').trim(),
      Jun: formatCurrency(cat.monthlyAmounts[6] || 0).replace(/[€$]/g, '').trim(),
      Jul: formatCurrency(cat.monthlyAmounts[7] || 0).replace(/[€$]/g, '').trim(),
      Ago: formatCurrency(cat.monthlyAmounts[8] || 0).replace(/[€$]/g, '').trim(),
      Set: formatCurrency(cat.monthlyAmounts[9] || 0).replace(/[€$]/g, '').trim(),
      Out: formatCurrency(cat.monthlyAmounts[10] || 0).replace(/[€$]/g, '').trim(),
      Nov: formatCurrency(cat.monthlyAmounts[11] || 0).replace(/[€$]/g, '').trim(),
      Dez: formatCurrency(cat.monthlyAmounts[12] || 0).replace(/[€$]/g, '').trim(),
      Total: formatCurrency(cat.yearlyTotal).replace(/[€$]/g, '').trim(),
      Media: formatCurrency(cat.monthlyAverage).replace(/[€$]/g, '').trim(),
    };
    result.push(row);
  });
  
  return result;
};

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

/**
 * Função auxiliar para preparar dados por tipo (receita ou despesa)
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
 * Função auxiliar para preparar dados de diferença (receitas - despesas)
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
 * Função auxiliar para obter todos os IDs de subcategorias
 */
function getAllSubcategoryIds(categoryId: string, categories: any[]): string[] {
  const directChildren = categories.filter(cat => cat.parentId === categoryId).map(cat => cat.id);
  
  if (directChildren.length === 0) {
    return [];
  }
  
  const nestedChildren = directChildren.flatMap(childId => getAllSubcategoryIds(childId, categories));
  
  return [...directChildren, ...nestedChildren];
}
