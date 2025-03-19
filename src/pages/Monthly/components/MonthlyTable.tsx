
import DataTable from "@/components/tables/DataTable";
import { formatCurrency } from "@/utils/financialCalculations";
import { ReactNode } from "react";

interface MonthlyTableProps {
  tableData: {
    month: number;
    monthName: string;
    income: number;
    expense: number;
    balance: number;
    differenceRate: string;
  }[];
  showValues: boolean;
  selectedYear: number;
}

const MonthlyTable = ({ tableData, showValues, selectedYear }: MonthlyTableProps) => {
  const columns = [
    {
      id: "monthName",
      header: "Mês",
      accessorFn: (row: any) => row.monthName,
      sortable: true,
      className: "text-center",
    },
    {
      id: "income",
      header: "Receitas",
      accessorFn: (row: any) => showValues ? formatCurrency(row.income) : "•••••••",
      sortable: true,
      className: "text-center",
    },
    {
      id: "expense",
      header: "Despesas",
      accessorFn: (row: any) => showValues ? formatCurrency(row.expense) : "•••••••",
      sortable: true,
      className: "text-center",
    },
    {
      id: "balance",
      header: "Saldo",
      accessorFn: (row: any) => showValues ? formatCurrency(row.balance) : "•••••••",
      sortable: true,
      className: "text-center",
    },
    {
      id: "differenceRate",
      header: "Diferença",
      accessorFn: (row: any): ReactNode => {
        if (!showValues) return "•••••••";
        
        // Display both the value and percentage
        return (
          <>
            {formatCurrency(row.balance)} <span className="text-muted-foreground">({row.differenceRate}%)</span>
          </>
        );
      },
      sortable: true,
      className: "text-center",
    },
  ];

  return (
    <div className="mb-8">
      <DataTable 
        data={tableData} 
        columns={columns} 
        title={`Dados Mensais de ${selectedYear}`}
        emptyMessage="Não há dados disponíveis para este ano"
      />
    </div>
  );
};

export default MonthlyTable;
