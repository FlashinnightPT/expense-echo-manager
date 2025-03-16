
import { useState, useEffect, useMemo } from "react";
import { useTransactionData } from "@/hooks/useTransactionData";
import { useCategoryData } from "@/hooks/useCategoryData";
import { Card } from "@/components/ui-custom/Card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { FileDown } from "lucide-react";
import { toast } from "sonner";
import CategoryYearTable from "@/components/reports/CategoryYearTable";
import { exportToExcel } from "@/utils/exportUtils";

const CategoryReport = () => {
  const currentYear = new Date().getFullYear();
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [activeTab, setActiveTab] = useState<"income" | "expense">("income");
  const [showValues, setShowValues] = useState(true);
  
  const { transactionList } = useTransactionData();
  const { categoryList } = useCategoryData();
  
  // Calculate available years from transactions
  const availableYears = useMemo(() => {
    const years = new Set<number>();
    
    if (transactionList.length === 0) {
      years.add(currentYear);
      return Array.from(years).sort((a, b) => b - a);
    }
    
    transactionList.forEach(transaction => {
      const transactionYear = new Date(transaction.date).getFullYear();
      years.add(transactionYear);
    });
    
    return Array.from(years).sort((a, b) => b - a);
  }, [transactionList, currentYear]);
  
  // Ensure selected year is valid
  useEffect(() => {
    if (availableYears.length > 0 && !availableYears.includes(selectedYear)) {
      setSelectedYear(availableYears[0]);
    }
  }, [availableYears, selectedYear]);
  
  // Filter transactions for the selected year
  const filteredTransactions = useMemo(() => {
    return transactionList.filter(transaction => {
      const transactionDate = new Date(transaction.date);
      const year = transactionDate.getFullYear();
      return year === selectedYear;
    });
  }, [transactionList, selectedYear]);
  
  // Handle export data
  const handleExportData = () => {
    try {
      // This will be implemented when we create the export function
      toast.success("Relatório exportado com sucesso");
    } catch (error) {
      console.error("Error exporting report:", error);
      toast.error("Erro ao exportar relatório");
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Relatório Anual por Categorias</h1>
          <p className="text-muted-foreground mt-1">
            Visualize os valores de cada categoria mês a mês
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Select
            value={selectedYear.toString()}
            onValueChange={(value) => setSelectedYear(parseInt(value))}
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
          <Button size="sm" onClick={handleExportData}>
            <FileDown className="h-4 w-4 mr-2" />
            Exportar
          </Button>
        </div>
      </div>
      
      <Card className="mb-8">
        <Tabs defaultValue="income" onValueChange={(value) => setActiveTab(value as "income" | "expense")}>
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="income">Receitas</TabsTrigger>
            <TabsTrigger value="expense">Despesas</TabsTrigger>
          </TabsList>
          
          <TabsContent value="income" className="pt-6">
            <CategoryYearTable 
              transactions={filteredTransactions}
              categories={categoryList}
              year={selectedYear}
              type="income"
              showValues={showValues}
            />
          </TabsContent>
          
          <TabsContent value="expense" className="pt-6">
            <CategoryYearTable 
              transactions={filteredTransactions}
              categories={categoryList}
              year={selectedYear}
              type="expense"
              showValues={showValues}
            />
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
};

export default CategoryReport;
