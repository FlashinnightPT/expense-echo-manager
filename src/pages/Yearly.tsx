
import { useState } from "react";
import { yearlyData } from "@/utils/mockData";
import YearlyChart from "@/components/charts/YearlyChart";
import Header from "@/components/layout/Header";
import { Card } from "@/components/ui-custom/Card";
import { formatCurrency } from "@/utils/financialCalculations";
import DataTable from "@/components/tables/DataTable";

const Yearly = () => {
  const availableYears = [2023, 2024];
  const [selectedYears, setSelectedYears] = useState<number[]>([2024]);
  
  const toggleYear = (year: number) => {
    if (selectedYears.includes(year)) {
      if (selectedYears.length > 1) {
        setSelectedYears(selectedYears.filter(y => y !== year));
      }
    } else {
      setSelectedYears([...selectedYears, year]);
    }
  };
  
  const filteredData = yearlyData.filter(item => selectedYears.includes(item.year));
  
  const totalIncome = filteredData.reduce((sum, item) => sum + item.income, 0);
  const totalExpenses = filteredData.reduce((sum, item) => sum + item.expense, 0);
  
  // Preparar os dados para a tabela
  const tableData = filteredData.map(item => ({
    year: item.year,
    income: item.income,
    expense: item.expense,
    balance: item.income - item.expense,
    savingsRate: ((item.income - item.expense) / item.income * 100).toFixed(2)
  }));
  
  // Definir as colunas da tabela
  const columns = [
    {
      id: "year",
      header: "Ano",
      accessorFn: (row) => row.year,
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
            <h1 className="text-3xl font-bold">Análise Anual</h1>
            <p className="text-muted-foreground mt-1">
              Compare os seus dados financeiros entre anos
            </p>
          </div>
          <div className="flex space-x-2">
            {availableYears.map(year => (
              <button
                key={year}
                className={`px-4 py-2 rounded-md border transition-colors ${
                  selectedYears.includes(year) 
                    ? 'bg-primary text-primary-foreground' 
                    : 'bg-background hover:bg-muted'
                }`}
                onClick={() => toggleYear(year)}
              >
                {year}
              </button>
            ))}
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <Card>
            <div className="p-6">
              <p className="text-sm text-muted-foreground">Receitas Totais</p>
              <p className="text-2xl font-bold mt-1">{formatCurrency(totalIncome)}</p>
            </div>
          </Card>
          <Card>
            <div className="p-6">
              <p className="text-sm text-muted-foreground">Despesas Totais</p>
              <p className="text-2xl font-bold mt-1">{formatCurrency(totalExpenses)}</p>
            </div>
          </Card>
        </div>
        
        <div className="mb-8">
          <Card>
            <YearlyChart data={filteredData} className="w-full" />
          </Card>
        </div>
        
        <div className="mb-8">
          <DataTable 
            data={tableData} 
            columns={columns} 
            title="Resumo Anual"
            emptyMessage="Selecione pelo menos um ano para ver os dados"
          />
        </div>
      </div>
    </div>
  );
};

export default Yearly;
