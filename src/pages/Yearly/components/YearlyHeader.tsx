
import { Button } from "@/components/ui/button";
import { FileDown, Table } from "lucide-react";
import { toast } from "sonner";
import { exportToExcel, prepareMonthlyCategoryReport, prepareMonthlyDataForExport } from "@/utils/exports";

interface YearlyHeaderProps {
  availableYears: number[];
  selectedYears: number[];
  toggleYear: (year: number) => void;
  totalIncome: number;
  totalExpenses: number;
  totalFixedIncome: number;
  totalFixedExpenses: number;
  showValues: boolean;
  tableData: any[];
}

const YearlyHeader = ({
  availableYears,
  selectedYears,
  toggleYear,
  totalIncome,
  totalExpenses,
  totalFixedIncome,
  totalFixedExpenses,
  showValues,
  tableData
}: YearlyHeaderProps) => {
  const handleExportData = () => {
    try {
      if (tableData.length === 0) {
        toast.error("Não há dados para exportar");
        return;
      }
      
      exportToExcel(tableData, `dados_anuais_${selectedYears.join('_')}`);
      toast.success("Dados exportados com sucesso");
    } catch (error) {
      console.error("Error exporting data:", error);
      toast.error("Erro ao exportar dados");
    }
  };

  return (
    <div className="flex items-center justify-between mb-8">
      <div>
        <h1 className="text-3xl font-bold">Análise Anual</h1>
        <p className="text-muted-foreground mt-1">
          Compare receitas e despesas ao longo dos anos
        </p>
      </div>
      <div className="flex items-center gap-2">
        <div className="flex gap-2">
          {availableYears.map(year => (
            <Button
              key={year}
              variant={selectedYears.includes(year) ? "default" : "outline"}
              size="sm"
              onClick={() => toggleYear(year)}
            >
              {year}
            </Button>
          ))}
        </div>
        <Button size="sm" variant="outline" onClick={handleExportData}>
          <FileDown className="h-4 w-4 mr-2" />
          Exportar Tabela
        </Button>
        <Button size="sm">
          <Table className="h-4 w-4 mr-2" />
          Relatório Anual
        </Button>
      </div>
    </div>
  );
};

export default YearlyHeader;
