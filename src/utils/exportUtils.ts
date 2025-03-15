
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
  const template = [
    {
      "Type": "expense",
      "Level": 2,
      "Name": "Alimentação",
      "ParentName": ""
    },
    {
      "Type": "expense",
      "Level": 3,
      "Name": "Supermercado",
      "ParentName": "Alimentação"
    },
    {
      "Type": "expense", 
      "Level": 4,
      "Name": "Carne",
      "ParentName": "Supermercado"
    },
    {
      "Type": "income",
      "Level": 2,
      "Name": "Salário",
      "ParentName": ""
    }
  ];
  
  exportToExcel(template, "categories_template");
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
  
  // Check for required columns
  const requiredColumns = ["Type", "Level", "Name"];
  const sampleRow = data[0];
  
  for (const column of requiredColumns) {
    if (!(column in sampleRow)) {
      return { valid: false, errors: [`Coluna obrigatória "${column}" não encontrada`] };
    }
  }
  
  // Process and validate each row
  const categories: Partial<TransactionCategory>[] = [];
  const levelTwoCategories = new Map<string, string>(); // name -> id
  const levelThreeCategories = new Map<string, string>(); // name -> id
  
  for (let i = 0; i < data.length; i++) {
    const row = data[i];
    const rowNum = i + 1;
    
    // Validate type
    if (row.Type !== "income" && row.Type !== "expense") {
      errors.push(`Linha ${rowNum}: Tipo inválido "${row.Type}". Deve ser "income" ou "expense"`);
      continue;
    }
    
    // Validate level
    const level = Number(row.Level);
    if (isNaN(level) || level < 2 || level > 4) {
      errors.push(`Linha ${rowNum}: Nível inválido "${row.Level}". Deve ser 2, 3 ou 4`);
      continue;
    }
    
    // Validate name
    if (!row.Name || row.Name.trim() === "") {
      errors.push(`Linha ${rowNum}: Nome da categoria não pode estar vazio`);
      continue;
    }
    
    // Validate parent relationship
    if (level > 2) {
      if (!row.ParentName || row.ParentName.trim() === "") {
        errors.push(`Linha ${rowNum}: Categorias de nível ${level} precisam ter um pai (ParentName)`);
        continue;
      }
      
      // For level 3, parent must be a level 2 category
      if (level === 3 && !levelTwoCategories.has(row.ParentName)) {
        errors.push(`Linha ${rowNum}: Categoria pai "${row.ParentName}" não encontrada ou não é de nível 2`);
        continue;
      }
      
      // For level 4, parent must be a level 3 category
      if (level === 4 && !levelThreeCategories.has(row.ParentName)) {
        errors.push(`Linha ${rowNum}: Categoria pai "${row.ParentName}" não encontrada ou não é de nível 3`);
        continue;
      }
    }
    
    // Create category object
    const category: Partial<TransactionCategory> = {
      name: row.Name.trim(),
      type: row.Type,
      level: level,
    };
    
    // Set parentId for child categories
    if (level === 3) {
      category.parentId = levelTwoCategories.get(row.ParentName);
    } else if (level === 4) {
      category.parentId = levelThreeCategories.get(row.ParentName);
    }
    
    // Store category for parent lookups
    const tempId = `temp-${category.type}-${category.name}-${Date.now()}-${Math.random()}`;
    if (level === 2) {
      levelTwoCategories.set(category.name, tempId);
    } else if (level === 3) {
      levelThreeCategories.set(category.name, tempId);
    }
    
    categories.push(category);
  }
  
  return {
    valid: errors.length === 0,
    categories: errors.length === 0 ? categories : undefined,
    errors: errors.length > 0 ? errors : undefined
  };
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
