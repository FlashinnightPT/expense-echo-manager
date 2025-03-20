
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui-custom/Card";
import { formatCurrency } from "@/utils/financialCalculations";

interface YearlyHeaderProps {
  availableYears: number[];
  selectedYears: number[];
  toggleYear: (year: number) => void;
  totalIncome: number;
  totalExpenses: number;
  totalFixedIncome: number;
  totalFixedExpenses: number;
  showValues: boolean;
}

const YearlyHeader = ({
  availableYears,
  selectedYears,
  toggleYear,
  totalIncome,
  totalExpenses,
  totalFixedIncome,
  totalFixedExpenses,
  showValues
}: YearlyHeaderProps) => {
  const hiddenValue = "•••••••";
  
  return (
    <div className="mb-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold">Visão Anual</h1>
          <p className="text-muted-foreground mt-1">
            Compare receitas e despesas ao longo dos anos
          </p>
        </div>
        
        <div className="flex flex-wrap gap-2">
          {availableYears.map((year) => (
            <Button
              key={year}
              variant={selectedYears.includes(year) ? "default" : "outline"}
              onClick={() => toggleYear(year)}
              size="sm"
            >
              {year}
            </Button>
          ))}
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Receitas Totais
            </CardTitle>
            <CardDescription>
              {selectedYears.length > 1 
                ? `${selectedYears[0]} - ${selectedYears[selectedYears.length - 1]}` 
                : selectedYears[0]}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-finance-income">
              {showValues ? formatCurrency(totalIncome) : hiddenValue}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Despesas Totais
            </CardTitle>
            <CardDescription>
              {selectedYears.length > 1 
                ? `${selectedYears[0]} - ${selectedYears[selectedYears.length - 1]}` 
                : selectedYears[0]}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-finance-expense">
              {showValues ? formatCurrency(totalExpenses) : hiddenValue}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Receitas Fixas
            </CardTitle>
            <CardDescription>
              {selectedYears.length > 1 
                ? `${selectedYears[0]} - ${selectedYears[selectedYears.length - 1]}` 
                : selectedYears[0]}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">
              {showValues ? formatCurrency(totalFixedIncome) : hiddenValue}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Despesas Fixas
            </CardTitle>
            <CardDescription>
              {selectedYears.length > 1 
                ? `${selectedYears[0]} - ${selectedYears[selectedYears.length - 1]}` 
                : selectedYears[0]}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">
              {showValues ? formatCurrency(totalFixedExpenses) : hiddenValue}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default YearlyHeader;
