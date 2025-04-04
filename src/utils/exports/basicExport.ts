
import { utils, write } from 'xlsx';

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
