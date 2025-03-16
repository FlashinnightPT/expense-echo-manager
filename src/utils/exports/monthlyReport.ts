
import { utils, write } from 'xlsx';
import { formatCurrency } from "../financialCalculations";
import { 
  prepareCategoryHierarchyForReport, 
  calculateMonthlyTotalsByType 
} from "./dataFormatters";

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

  // Calcular totais mensais para receitas e despesas
  const incomeMonthlyTotals = calculateMonthlyTotalsByType(transactions, year, "income");
  const expenseMonthlyTotals = calculateMonthlyTotalsByType(transactions, year, "expense");
  
  // Calcular totais anuais
  const incomeYearlyTotal = Object.values(incomeMonthlyTotals).reduce((sum, val) => sum + val, 0);
  const expenseYearlyTotal = Object.values(expenseMonthlyTotals).reduce((sum, val) => sum + val, 0);
  
  // Calcular médias mensais (usando meses com valores ou 12 se não houver)
  const incomeMonthsWithValues = Object.values(incomeMonthlyTotals).filter(v => v > 0).length || 12;
  const expenseMonthsWithValues = Object.values(expenseMonthlyTotals).filter(v => v > 0).length || 12;
  const incomeMonthlyAverage = incomeYearlyTotal / incomeMonthsWithValues;
  const expenseMonthlyAverage = expenseYearlyTotal / expenseMonthsWithValues;

  // Preparar hierarquia de categorias
  const incomeHierarchy = prepareCategoryHierarchyForReport(categories, transactions, year, "income");
  const expenseHierarchy = prepareCategoryHierarchyForReport(categories, transactions, year, "expense");

  // Exportar em formato Excel
  const exportData = [
    // Informações de cabeçalho
    { A: `${year}`, B: "", C: "", D: "", E: "", F: "", G: "Relatorio de contas Mensal", H: "" },
    // Linha em branco
    {},
    // Cabeçalho da tabela principal
    { A: "Descrição", B: "Jan", C: "Fev", D: "Mar", E: "Abr", F: "Mai", G: "Jun", H: "Jul", I: "Ago", J: "Set", K: "Out", L: "Nov", M: "Dez", N: "Total acumulado do Ano", O: "Média Mensal" },
    
    // Dados de receitas (resumo)
    { 
      A: "Receitas", 
      B: formatCurrency(incomeMonthlyTotals[1]).replace(/[€$]/g, '').trim(),
      C: formatCurrency(incomeMonthlyTotals[2]).replace(/[€$]/g, '').trim(),
      D: formatCurrency(incomeMonthlyTotals[3]).replace(/[€$]/g, '').trim(),
      E: formatCurrency(incomeMonthlyTotals[4]).replace(/[€$]/g, '').trim(),
      F: formatCurrency(incomeMonthlyTotals[5]).replace(/[€$]/g, '').trim(),
      G: formatCurrency(incomeMonthlyTotals[6]).replace(/[€$]/g, '').trim(),
      H: formatCurrency(incomeMonthlyTotals[7]).replace(/[€$]/g, '').trim(),
      I: formatCurrency(incomeMonthlyTotals[8]).replace(/[€$]/g, '').trim(),
      J: formatCurrency(incomeMonthlyTotals[9]).replace(/[€$]/g, '').trim(),
      K: formatCurrency(incomeMonthlyTotals[10]).replace(/[€$]/g, '').trim(),
      L: formatCurrency(incomeMonthlyTotals[11]).replace(/[€$]/g, '').trim(),
      M: formatCurrency(incomeMonthlyTotals[12]).replace(/[€$]/g, '').trim(),
      N: formatCurrency(incomeYearlyTotal).replace(/[€$]/g, '').trim(),
      O: formatCurrency(incomeMonthlyAverage).replace(/[€$]/g, '').trim(),
    },
    
    // Dados de despesas (resumo)
    {
      A: "Despesas",
      B: formatCurrency(expenseMonthlyTotals[1]).replace(/[€$]/g, '').trim(),
      C: formatCurrency(expenseMonthlyTotals[2]).replace(/[€$]/g, '').trim(),
      D: formatCurrency(expenseMonthlyTotals[3]).replace(/[€$]/g, '').trim(),
      E: formatCurrency(expenseMonthlyTotals[4]).replace(/[€$]/g, '').trim(),
      F: formatCurrency(expenseMonthlyTotals[5]).replace(/[€$]/g, '').trim(),
      G: formatCurrency(expenseMonthlyTotals[6]).replace(/[€$]/g, '').trim(),
      H: formatCurrency(expenseMonthlyTotals[7]).replace(/[€$]/g, '').trim(),
      I: formatCurrency(expenseMonthlyTotals[8]).replace(/[€$]/g, '').trim(),
      J: formatCurrency(expenseMonthlyTotals[9]).replace(/[€$]/g, '').trim(),
      K: formatCurrency(expenseMonthlyTotals[10]).replace(/[€$]/g, '').trim(),
      L: formatCurrency(expenseMonthlyTotals[11]).replace(/[€$]/g, '').trim(),
      M: formatCurrency(expenseMonthlyTotals[12]).replace(/[€$]/g, '').trim(),
      N: formatCurrency(expenseYearlyTotal).replace(/[€$]/g, '').trim(),
      O: formatCurrency(expenseMonthlyAverage).replace(/[€$]/g, '').trim(),
    },
    
    // Diferença (receitas - despesas)
    {
      A: "Diferença",
      B: formatCurrency(incomeMonthlyTotals[1] - expenseMonthlyTotals[1]).replace(/[€$]/g, '').trim(),
      C: formatCurrency(incomeMonthlyTotals[2] - expenseMonthlyTotals[2]).replace(/[€$]/g, '').trim(),
      D: formatCurrency(incomeMonthlyTotals[3] - expenseMonthlyTotals[3]).replace(/[€$]/g, '').trim(),
      E: formatCurrency(incomeMonthlyTotals[4] - expenseMonthlyTotals[4]).replace(/[€$]/g, '').trim(),
      F: formatCurrency(incomeMonthlyTotals[5] - expenseMonthlyTotals[5]).replace(/[€$]/g, '').trim(),
      G: formatCurrency(incomeMonthlyTotals[6] - expenseMonthlyTotals[6]).replace(/[€$]/g, '').trim(),
      H: formatCurrency(incomeMonthlyTotals[7] - expenseMonthlyTotals[7]).replace(/[€$]/g, '').trim(),
      I: formatCurrency(incomeMonthlyTotals[8] - expenseMonthlyTotals[8]).replace(/[€$]/g, '').trim(),
      J: formatCurrency(incomeMonthlyTotals[9] - expenseMonthlyTotals[9]).replace(/[€$]/g, '').trim(),
      K: formatCurrency(incomeMonthlyTotals[10] - expenseMonthlyTotals[10]).replace(/[€$]/g, '').trim(),
      L: formatCurrency(incomeMonthlyTotals[11] - expenseMonthlyTotals[11]).replace(/[€$]/g, '').trim(),
      M: formatCurrency(incomeMonthlyTotals[12] - expenseMonthlyTotals[12]).replace(/[€$]/g, '').trim(),
      N: formatCurrency(incomeYearlyTotal - expenseYearlyTotal).replace(/[€$]/g, '').trim(),
      O: formatCurrency((incomeYearlyTotal - expenseYearlyTotal) / 12).replace(/[€$]/g, '').trim(),
    },
    
    // Linha em branco
    {},
  ];
  
  // Adicionar cabeçalho de RECEITAS
  exportData.push({ A: "RECEITAS", B: "", C: "", D: "", E: "", F: "", G: "", H: "", I: "", J: "", K: "", L: "", M: "", N: "", O: "" });

  // Adicionar detalhes de categorias de receita
  if (incomeHierarchy.length === 0) {
    exportData.push({ 
      A: "Receitas", 
      B: "0,00", C: "0,00", D: "0,00", E: "0,00", F: "0,00", G: "0,00", 
      H: "0,00", I: "0,00", J: "0,00", K: "0,00", L: "0,00", M: "0,00",
      N: "0,00", O: "0,00"
    });
  } else {
    // Processar hierarquia de receitas
    incomeHierarchy.forEach(rootCat => {
      // Adicionar linha para categoria raiz
      const rootValues = {
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
      exportData.push(rootValues);
      
      // Adicionar subcategorias (nível 2)
      rootCat.subcategories.forEach(subCat => {
        const subValues = {
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
        exportData.push(subValues);
        
        // Adicionar subcategorias de nível 3
        subCat.subcategories.forEach(level3Cat => {
          const level3Values = {
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
          exportData.push(level3Values);
        });
      });
    });
  }
  
  // Linha em branco
  exportData.push({});
  
  // Total de receitas
  exportData.push({
    A: "Total",
    B: formatCurrency(incomeMonthlyTotals[1]).replace(/[€$]/g, '').trim(),
    C: formatCurrency(incomeMonthlyTotals[2]).replace(/[€$]/g, '').trim(),
    D: formatCurrency(incomeMonthlyTotals[3]).replace(/[€$]/g, '').trim(),
    E: formatCurrency(incomeMonthlyTotals[4]).replace(/[€$]/g, '').trim(),
    F: formatCurrency(incomeMonthlyTotals[5]).replace(/[€$]/g, '').trim(),
    G: formatCurrency(incomeMonthlyTotals[6]).replace(/[€$]/g, '').trim(),
    H: formatCurrency(incomeMonthlyTotals[7]).replace(/[€$]/g, '').trim(),
    I: formatCurrency(incomeMonthlyTotals[8]).replace(/[€$]/g, '').trim(),
    J: formatCurrency(incomeMonthlyTotals[9]).replace(/[€$]/g, '').trim(),
    K: formatCurrency(incomeMonthlyTotals[10]).replace(/[€$]/g, '').trim(),
    L: formatCurrency(incomeMonthlyTotals[11]).replace(/[€$]/g, '').trim(),
    M: formatCurrency(incomeMonthlyTotals[12]).replace(/[€$]/g, '').trim(),
    N: formatCurrency(incomeYearlyTotal).replace(/[€$]/g, '').trim(),
    O: formatCurrency(incomeMonthlyAverage).replace(/[€$]/g, '').trim(),
  });
  
  // Linha em branco
  exportData.push({});
  
  // Adicionar cabeçalho de DESPESAS
  exportData.push({ A: "DESPESAS", B: "", C: "", D: "", E: "", F: "", G: "", H: "", I: "", J: "", K: "", L: "", M: "", N: "", O: "" });
  
  // Adicionar detalhes de categorias de despesa
  if (expenseHierarchy.length === 0) {
    exportData.push({ 
      A: "Despesas", 
      B: "0,00", C: "0,00", D: "0,00", E: "0,00", F: "0,00", G: "0,00", 
      H: "0,00", I: "0,00", J: "0,00", K: "0,00", L: "0,00", M: "0,00",
      N: "0,00", O: "0,00"
    });
  } else {
    // Processar hierarquia de despesas
    expenseHierarchy.forEach(rootCat => {
      // Adicionar linha para categoria raiz
      const rootValues = {
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
      exportData.push(rootValues);
      
      // Adicionar subcategorias (nível 2)
      rootCat.subcategories.forEach(subCat => {
        const subValues = {
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
        exportData.push(subValues);
        
        // Adicionar subcategorias de nível 3
        subCat.subcategories.forEach(level3Cat => {
          const level3Values = {
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
          exportData.push(level3Values);
        });
      });
    });
  }
  
  // Linha em branco
  exportData.push({});
  
  // Total de despesas
  exportData.push({
    A: "Total",
    B: formatCurrency(expenseMonthlyTotals[1]).replace(/[€$]/g, '').trim(),
    C: formatCurrency(expenseMonthlyTotals[2]).replace(/[€$]/g, '').trim(),
    D: formatCurrency(expenseMonthlyTotals[3]).replace(/[€$]/g, '').trim(),
    E: formatCurrency(expenseMonthlyTotals[4]).replace(/[€$]/g, '').trim(),
    F: formatCurrency(expenseMonthlyTotals[5]).replace(/[€$]/g, '').trim(),
    G: formatCurrency(expenseMonthlyTotals[6]).replace(/[€$]/g, '').trim(),
    H: formatCurrency(expenseMonthlyTotals[7]).replace(/[€$]/g, '').trim(),
    I: formatCurrency(expenseMonthlyTotals[8]).replace(/[€$]/g, '').trim(),
    J: formatCurrency(expenseMonthlyTotals[9]).replace(/[€$]/g, '').trim(),
    K: formatCurrency(expenseMonthlyTotals[10]).replace(/[€$]/g, '').trim(),
    L: formatCurrency(expenseMonthlyTotals[11]).replace(/[€$]/g, '').trim(),
    M: formatCurrency(expenseMonthlyTotals[12]).replace(/[€$]/g, '').trim(),
    N: formatCurrency(expenseYearlyTotal).replace(/[€$]/g, '').trim(),
    O: formatCurrency(expenseMonthlyAverage).replace(/[€$]/g, '').trim(),
  });

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
    if (cell[0] === '3' || cell === 'A8' || cell === 'A20') {
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
