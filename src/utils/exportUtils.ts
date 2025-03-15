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
