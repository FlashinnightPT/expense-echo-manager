
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { FileDown } from "lucide-react";
import { getMonthName } from "@/utils/financialCalculations";
import { TabsList, TabsTrigger } from "@/components/ui/tabs";

interface CategoryTableHeaderProps {
  selectedMonth: number;
  onMonthChange: (month: number) => void;
  onExportData: () => void;
  activeTab: "expense" | "income";
}

const CategoryTableHeader = ({
  selectedMonth,
  onMonthChange,
  onExportData,
  activeTab
}: CategoryTableHeaderProps) => {
  return (
    <div className="flex justify-between items-center mb-4">
      <TabsList>
        <TabsTrigger value="expense">Despesas por Categoria</TabsTrigger>
        <TabsTrigger value="income">Receitas por Categoria</TabsTrigger>
      </TabsList>
      <div className="flex items-center gap-2">
        <Select
          value={selectedMonth.toString()}
          onValueChange={(value) => onMonthChange(parseInt(value))}
        >
          <SelectTrigger className="w-[120px]">
            <SelectValue placeholder="Mês" />
          </SelectTrigger>
          <SelectContent>
            {Array.from({ length: 12 }, (_, i) => i + 1).map((month) => (
              <SelectItem key={month} value={month.toString()}>
                {getMonthName(month)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button size="sm" onClick={onExportData}>
          <FileDown className="h-4 w-4 mr-2" />
          Exportar
        </Button>
      </div>
    </div>
  );
};

export default CategoryTableHeader;
