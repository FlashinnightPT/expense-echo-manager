
import { useState } from "react";
import { monthlyData } from "@/utils/mockData";
import MonthlyChart from "@/components/charts/MonthlyChart";
import Header from "@/components/layout/Header";
import { Card } from "@/components/ui-custom/Card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import DataTable from "@/components/tables/DataTable";
import { formatCurrency, getMonthName } from "@/utils/financialCalculations";

const Monthly = () => {
  const [selectedYear, setSelectedYear] = useState(2024);
  
  // Filtrar os dados pelo ano selecionado
  const filteredData = monthlyData.filter(item => item.year === selectedYear);
  
  // Preparar os dados para a tabela
  const tableData = filteredData.map(item => ({
    month: item.month,
    monthName: getMonthName(item.month),
    income: item.income,
    expense: item.expense,
    savings: item.savings,
    investment: item.investment,
    balance: item.income - item.expense,
    savingsRate: ((item.savings + item.investment) / item.income * 100).toFixed(2)
  }));
  
  // Definir as colunas da tabela
  const columns = [
    {
      id: "monthName",
      header: "Mês",
      accessorFn: (row) => row.monthName,
      sortable: true,
    },
    {
      id: "income",
      header: "Receitas",
      accessorFn: (row) => formatCurrency(row.income),
      sortable: true,
      className: "text-right",
    },
    {
      id: "expense",
      header: "Despesas",
      accessorFn: (row) => formatCurrency(row.expense),
      sortable: true,
      className: "text-right",
    },
    {
      id: "balance",
      header: "Saldo",
      accessorFn: (row) => formatCurrency(row.balance),
      sortable: true,
      className: "text-right",
    },
    {
      id: "savings",
      header: "Poupanças",
      accessorFn: (row) => formatCurrency(row.savings),
      sortable: true,
      className: "text-right",
    },
    {
      id: "investment",
      header: "Investimentos",
      accessorFn: (row) => formatCurrency(row.investment),
      sortable: true,
      className: "text-right",
    },
    {
      id: "savingsRate",
      header: "Taxa de Poupança",
      accessorFn: (row) => `${row.savingsRate}%`,
      sortable: true,
      className: "text-right",
    },
  ];
  
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-4 py-8 pt-24">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">Análise Mensal</h1>
            <p className="text-muted-foreground mt-1">
              Visualize seus dados financeiros mês a mês
            </p>
          </div>
          <div>
            <Select
              value={selectedYear.toString()}
              onValueChange={(value) => setSelectedYear(parseInt(value))}
            >
              <SelectTrigger className="w-[100px]">
                <SelectValue placeholder="Ano" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="2023">2023</SelectItem>
                <SelectItem value="2024">2024</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div className="mb-8">
          <Card>
            <MonthlyChart data={monthlyData} year={selectedYear} />
          </Card>
        </div>
        
        <div className="mb-8">
          <DataTable 
            data={tableData} 
            columns={columns} 
            title={`Dados Mensais de ${selectedYear}`}
            emptyMessage="Não há dados disponíveis para este ano"
          />
        </div>
      </div>
    </div>
  );
};

export default Monthly;
