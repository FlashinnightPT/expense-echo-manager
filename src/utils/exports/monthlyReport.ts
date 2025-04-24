
import { Transaction, TransactionCategory } from "../mockData";
import { 
  prepareCategoryHierarchyForReport, 
  calculateMonthlyTotalsByType 
} from "./dataFormatters";
import { createReportHeaders, createSummarySection } from "./excel/reportHeaders";
import { processCategoryHierarchy, createCategoryTotalRow } from "./excel/categoryReportGenerator";
import { generateExcelFile } from "./excel/excelExporter";
import { calculateYearlyTotal, calculateMonthlyAverage } from "./excel/formatters";

/**
 * Prepara dados para exportação em formato de relatório mensal por categoria
 * Seguindo o modelo específico de relatório mensal
 */
export const prepareMonthlyCategoryReport = async (
  year: number,
  categories: TransactionCategory[],
  transactions: Transaction[]
) => {
  // Calcular totais mensais para receitas e despesas
  const incomeMonthlyTotals = calculateMonthlyTotalsByType(transactions, year, "income");
  const expenseMonthlyTotals = calculateMonthlyTotalsByType(transactions, year, "expense");
  
  // Calcular totais anuais
  const incomeYearlyTotal = calculateYearlyTotal(incomeMonthlyTotals);
  const expenseYearlyTotal = calculateYearlyTotal(expenseMonthlyTotals);
  
  // Calcular médias mensais (usando meses com valores ou 12 se não houver)
  const incomeMonthsWithValues = Object.values(incomeMonthlyTotals).filter(v => typeof v === 'number' && v > 0).length || 12;
  const expenseMonthsWithValues = Object.values(expenseMonthlyTotals).filter(v => typeof v === 'number' && v > 0).length || 12;
  const incomeMonthlyAverage = calculateMonthlyAverage(incomeYearlyTotal, incomeMonthsWithValues);
  const expenseMonthlyAverage = calculateMonthlyAverage(expenseYearlyTotal, expenseMonthsWithValues);

  // Preparar hierarquia de categorias
  const incomeHierarchy = prepareCategoryHierarchyForReport(categories, transactions, year, "income");
  const expenseHierarchy = prepareCategoryHierarchyForReport(categories, transactions, year, "expense");

  // Inicializar array de dados para exportação
  const exportData = [
    // Adicionar cabeçalhos
    ...createReportHeaders(year),
    
    // Adicionar seção de resumo (receitas, despesas, diferença)
    ...createSummarySection(
      incomeMonthlyTotals,
      expenseMonthlyTotals,
      incomeYearlyTotal,
      expenseYearlyTotal,
      incomeMonthlyAverage,
      expenseMonthlyAverage
    ),
  ];
  
  // Processar categorias de receita
  const incomeRows = processCategoryHierarchy(incomeHierarchy, "income");
  exportData.push(...incomeRows);
  
  // Adicionar total de receitas
  exportData.push(createCategoryTotalRow(
    incomeMonthlyTotals,
    incomeYearlyTotal,
    incomeMonthlyAverage
  ));
  
  // Linha em branco
  exportData.push({});
  
  // Processar categorias de despesa
  const expenseRows = processCategoryHierarchy(expenseHierarchy, "expense");
  exportData.push(...expenseRows);
  
  // Adicionar total de despesas
  exportData.push(createCategoryTotalRow(
    expenseMonthlyTotals,
    expenseYearlyTotal,
    expenseMonthlyAverage
  ));

  // Gerar e baixar o arquivo Excel
  const fileName = `relatorio_mensal_${year}`;
  generateExcelFile(exportData, fileName);
};
