
import { utils, write } from 'xlsx';

type ExcelRow = Record<string, any>;

/**
 * Configure column widths for the Excel worksheet
 */
export const configureColumnWidths = () => {
  return [
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
};

/**
 * Apply cell styles to the worksheet
 */
export const applyCellStyles = (worksheet: any) => {
  Object.keys(worksheet).forEach(cell => {
    if (cell[0] === '3' || cell === 'A8' || cell === 'A20') {
      if (!worksheet[cell].s) worksheet[cell].s = {};
      worksheet[cell].s.fill = { fgColor: { rgb: "A9D08E" } }; // Verde claro para receitas
      worksheet[cell].s.font = { bold: true };
    }
    
    if (cell === 'A4') {
      if (!worksheet[cell].s) worksheet[cell].s = {};
      worksheet[cell].s.fill = { fgColor: { rgb: "A9D08E" } }; // Verde claro para receitas
      worksheet[cell].s.font = { bold: true };
    }
    
    if (cell === 'A5') {
      if (!worksheet[cell].s) worksheet[cell].s = {};
      worksheet[cell].s.fill = { fgColor: { rgb: "F8CBAD" } }; // Laranja claro para despesas
      worksheet[cell].s.font = { bold: true };
    }
    
    if (cell === 'A6') {
      if (!worksheet[cell].s) worksheet[cell].s = {};
      worksheet[cell].s.fill = { fgColor: { rgb: "BDD7EE" } }; // Azul claro para diferença
      worksheet[cell].s.font = { bold: true };
    }
  });
};

/**
 * Generate an Excel file and trigger download
 */
export const generateExcelFile = (rows: ExcelRow[], fileName: string): void => {
  // Create workbook and worksheet
  const wb = utils.book_new();
  const ws = utils.json_to_sheet(rows, { skipHeader: true });
  
  // Configure column widths
  ws['!cols'] = configureColumnWidths();
  
  // Apply styles
  applyCellStyles(ws);
  
  // Add worksheet to workbook
  utils.book_append_sheet(wb, ws, "Relatorio Mensal");
  
  // Generate Excel file
  const excelBuffer = write(wb, { bookType: 'xlsx', type: 'array' });
  
  // Create Blob and trigger download
  const blob = new Blob([excelBuffer], { 
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
  });
  
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', `${fileName}.xlsx`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};
