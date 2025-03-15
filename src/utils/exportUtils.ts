
import { formatCurrency, getMonthName } from "./financialCalculations";
import { Transaction } from "./mockData";

/**
 * Exports data to a CSV file and triggers a download
 * @param data The data to export
 * @param filename The name of the file to download
 */
export const exportToCSV = (data: any[], filename: string) => {
  // Return early if no data
  if (!data || data.length === 0) {
    console.error("No data to export");
    return;
  }

  try {
    // Get the headers from the first object
    const headers = Object.keys(data[0]);
    
    // Create CSV header row
    const headerRow = headers.join(',');
    
    // Create CSV content rows
    const rows = data.map(obj => {
      return headers.map(header => {
        // Convert value to string and handle commas by wrapping in quotes
        let value = obj[header] != null ? obj[header].toString() : '';
        
        // If value contains commas or quotes, wrap it in quotes
        if (value.includes(',') || value.includes('"')) {
          value = `"${value.replace(/"/g, '""')}"`;
        }
        return value;
      }).join(',');
    });
    
    // Combine header row and content rows
    const csvContent = [headerRow, ...rows].join('\n');
    
    // Create a Blob with the CSV content
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    
    // Create a download URL for the Blob
    const url = URL.createObjectURL(blob);
    
    // Create a temporary link element to trigger the download
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${filename}.csv`);
    document.body.appendChild(link);
    
    // Trigger the download
    link.click();
    
    // Clean up
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error("Error exporting data to CSV:", error);
  }
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
  return transactions.map(t => ({
    Description: t.description,
    Amount: formatCurrency(t.amount).replace(/[€$]/g, '').trim(),
    Date: new Date(t.date).toLocaleDateString(),
    Type: t.type === 'income' ? 'Receita' : 'Despesa',
    Category: t.categoryName || ''
  }));
};
