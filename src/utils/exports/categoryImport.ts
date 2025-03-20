import { read, utils } from 'xlsx';
import { TransactionCategory } from "../mockData";

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
        parentId
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
