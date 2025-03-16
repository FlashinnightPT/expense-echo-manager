
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
 * Apply cell styles to the worksheet based on category level
 */
export const applyCellStyles = (worksheet: any) => {
  Object.keys(worksheet).forEach(cell => {
    // Check if the cell is in column A (category names)
    if (cell[0] === 'A' && cell !== 'A1') {
      const value = worksheet[cell].v || '';
      
      // Determine indentation level by counting leading spaces
      const leadingSpaces = value.match(/^\s*/)[0].length;
      const level = leadingSpaces / 4;
      
      if (!worksheet[cell].s) worksheet[cell].s = {};
      
      // Style based on indentation level
      if (level === 0) {
        // Root level - Bold text
        worksheet[cell].s.font = { bold: true };
      } else if (level === 1) {
        // Level 2 - Slight indent + different color
        worksheet[cell].s.fill = { fgColor: { rgb: "E6F2FF" } };
      } else if (level === 2) {
        // Level 3 - More indent + different color
        worksheet[cell].s.fill = { fgColor: { rgb: "F5F5F5" } };
      } else if (level === 3) {
        // Level 4 - Most indent + different color
        worksheet[cell].s.fill = { fgColor: { rgb: "FAFAFA" } };
      }
    }
    
    // Apply special styles for header rows
    if (cell === 'A1' || cell[0] === '3' || cell === 'A8' || cell === 'A20') {
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
