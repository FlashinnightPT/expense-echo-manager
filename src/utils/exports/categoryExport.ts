
import { utils, write } from 'xlsx';
import { Transaction, TransactionCategory } from "../mockData";
import { formatCurrency, getMonthName } from "../financialCalculations";

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
