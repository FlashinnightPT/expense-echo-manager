
import { useState, useEffect, useMemo } from "react";
import { monthlyData } from "@/utils/mockData";
import MonthlyChart from "@/components/charts/MonthlyChart";
import Header from "@/components/layout/Header";
import { Card } from "@/components/ui-custom/Card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import DataTable from "@/components/tables/DataTable";
import { formatCurrency, getMonthName } from "@/utils/financialCalculations";

const Monthly = () => {
  const currentYear = new Date().getFullYear();
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [transactions, setTransactions] = useState([]);
  
  // Carregar transações do localStorage
  useEffect(() => {
    const storedTransactions = localStorage.getItem('transactions');
    if (storedTransactions) {
      setTransactions(JSON.parse(storedTransactions));
    } else {
      // Se não houver transações no localStorage, definir array vazio
      setTransactions([]);
      localStorage.setItem('transactions', JSON.stringify([]));
    }
  }, []);
  
  // Extrair os anos disponíveis das transações
  const availableYears = useMemo(() => {
    const years = new Set<number>();
    
    // Se não houver transações, retornar apenas o ano atual
    if (transactions.length === 0) {
      years.add(currentYear);
      return Array.from(years).sort((a, b) => b - a); // Ordenar decrescente
    }
    
    // Extrair anos únicos das transações
    transactions.forEach(transaction => {
      const transactionYear = new Date(transaction.date).getFullYear();
      years.add(transactionYear);
    });
    
    // Converter Set para array e ordenar decrescente (mais recente primeiro)
    return Array.from(years).sort((a, b) => b - a);
  }, [transactions]);
  
  // Ajustar o ano selecionado se necessário
  useEffect(() => {
    if (availableYears.length > 0 && !availableYears.includes(selectedYear)) {
      setSelectedYear(availableYears[0]);
    }
  }, [availableYears, selectedYear]);
  
  // Filtrar os dados pelo ano selecionado
  const filteredData = monthlyData.filter(item => item.year === selectedYear);
  
  // Preparar os dados para a tabela - usando dados vazios se não houver no localStorage
  const tableData = filteredData.length > 0 ? filteredData.map(item => ({
    month: item.month,
    monthName: getMonthName(item.month),
    income: 0, // Definindo todos os valores financeiros como zero
    expense: 0,
    savings: 0,
    investment: 0,
    balance: 0,
    savingsRate: "0.00"
  })) : [];
  
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
                {availableYears.map(year => (
                  <SelectItem key={year} value={year.toString()}>{year}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div className="mb-8">
          <Card>
            <MonthlyChart data={[]} year={selectedYear} />
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
