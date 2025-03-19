
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FileDown, Table } from "lucide-react";
import { toast } from "sonner";
import { exportToExcel, prepareMonthlyDataForExport, prepareMonthlyCategoryReport } from "@/utils/exports";
import { TransactionCategory } from "@/utils/mockData";

interface MonthlyHeaderProps {
  selectedYear: number;
  availableYears: number[];
  onYearChange: (year: number) => void;
  tableData: any[];
  transactions: any[];
  categories: TransactionCategory[];
}

const MonthlyHeader = ({
  selectedYear,
  availableYears,
  onYearChange,
  tableData,
  transactions,
  categories
}: MonthlyHeaderProps) => {
  const handleExportData = () => {
    try {
      if (tableData.length === 0) {
        toast.error("Não há dados para exportar neste período");
        return;
      }
      
      const exportData = prepareMonthlyDataForExport(tableData, selectedYear);
      exportToExcel(exportData, `dados_mensais_${selectedYear}`);
      toast.success("Dados exportados com sucesso");
    } catch (error) {
      console.error("Error exporting data:", error);
      toast.error("Erro ao exportar dados");
    }
  };
  
  const handleExportDetailedReport = async () => {
    try {
      if (transactions.length === 0) {
        toast.error("Não há dados para exportar neste período");
        return;
      }
      
      toast.info("Preparando relatório mensal detalhado...");
      await prepareMonthlyCategoryReport(selectedYear, categories, transactions);
      toast.success("Relatório mensal exportado com sucesso");
    } catch (error) {
      console.error("Error exporting detailed report:", error);
      toast.error("Erro ao exportar relatório mensal detalhado");
    }
  };

  return (
    <div className="flex items-center justify-between mb-8">
      <div>
        <h1 className="text-3xl font-bold">Análise Mensal</h1>
        <p className="text-muted-foreground mt-1">
          Visualize seus dados financeiros mês a mês
        </p>
      </div>
      <div className="flex items-center gap-2">
        <Select
          value={selectedYear.toString()}
          onValueChange={(value) => onYearChange(parseInt(value))}
        >
          <SelectTrigger className="w-[100px]">
            <SelectValue placeholder="Ano" />
          </SelectTrigger>
          <SelectContent>
            {availableYears.map(year => (
              <SelectItem key={year} value={year.toString()}>{year}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button size="sm" variant="outline" onClick={handleExportData}>
          <FileDown className="h-4 w-4 mr-2" />
          Exportar Tabela
        </Button>
        <Button size="sm" onClick={handleExportDetailedReport}>
          <Table className="h-4 w-4 mr-2" />
          Relatório Mensal
        </Button>
      </div>
    </div>
  );
};

export default MonthlyHeader;
