
import React from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui-custom/Card";
import { formatCurrency } from "@/utils/financialCalculations";

interface TableDataItem {
  year: number;
  income: number;
  expense: number;
  balance: number;
  differenceRate: string;
  fixedIncome?: number;
  fixedExpense?: number;
}

interface YearlyTableProps {
  tableData: TableDataItem[];
  showValues: boolean;
}

const YearlyTable = ({ tableData, showValues }: YearlyTableProps) => {
  const hiddenValue = "•••••••";

  return (
    <Card>
      <CardHeader>
        <CardTitle>Dados Anuais</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Ano</TableHead>
                <TableHead className="text-right">Receitas</TableHead>
                <TableHead className="text-right">Despesas</TableHead>
                <TableHead className="text-right">Saldo</TableHead>
                <TableHead className="text-right">Diferença</TableHead>
                <TableHead className="text-right">Receitas Fixas</TableHead>
                <TableHead className="text-right">Despesas Fixas</TableHead>
                <TableHead className="text-right">Saldo Fixo</TableHead>
                <TableHead className="text-right">Diferença Fixa</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tableData.map((row) => {
                // Calculate fixed balance and fixed difference
                const fixedBalance = (row.fixedIncome || 0) - (row.fixedExpense || 0);
                const fixedDifferenceRate = row.fixedIncome && row.fixedIncome > 0 
                  ? ((fixedBalance / row.fixedIncome) * 100).toFixed(2) 
                  : "0.00";
                
                return (
                  <TableRow key={row.year}>
                    <TableCell className="font-medium">{row.year}</TableCell>
                    <TableCell className="text-right text-finance-income">
                      {showValues ? formatCurrency(row.income) : hiddenValue}
                    </TableCell>
                    <TableCell className="text-right text-finance-expense">
                      {showValues ? formatCurrency(row.expense) : hiddenValue}
                    </TableCell>
                    <TableCell className={`text-right ${row.balance >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                      {showValues ? formatCurrency(row.balance) : hiddenValue}
                    </TableCell>
                    <TableCell className={`text-right ${parseFloat(row.differenceRate) >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                      {showValues ? `${row.differenceRate}%` : hiddenValue}
                    </TableCell>
                    <TableCell className="text-right text-finance-income">
                      {showValues ? formatCurrency(row.fixedIncome || 0) : hiddenValue}
                    </TableCell>
                    <TableCell className="text-right text-finance-expense">
                      {showValues ? formatCurrency(row.fixedExpense || 0) : hiddenValue}
                    </TableCell>
                    <TableCell className={`text-right ${fixedBalance >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                      {showValues ? formatCurrency(fixedBalance) : hiddenValue}
                    </TableCell>
                    <TableCell className={`text-right ${parseFloat(fixedDifferenceRate) >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                      {showValues ? `${fixedDifferenceRate}%` : hiddenValue}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default YearlyTable;
