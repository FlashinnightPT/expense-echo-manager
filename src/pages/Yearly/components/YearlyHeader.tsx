
import React from "react";
import { Card } from "@/components/ui-custom/Card";
import { formatCurrency } from "@/utils/financialCalculations";

interface YearlyHeaderProps {
  availableYears: number[];
  selectedYears: number[];
  toggleYear: (year: number) => void;
  totalIncome: number;
  totalExpenses: number;
  showValues: boolean;
}

const YearlyHeader: React.FC<YearlyHeaderProps> = ({
  availableYears,
  selectedYears,
  toggleYear,
  totalIncome,
  totalExpenses,
  showValues
}) => {
  return (
    <>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Análise Anual</h1>
          <p className="text-muted-foreground mt-1">
            Compare os seus dados financeiros entre anos
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
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
            <p className="text-2xl font-bold mt-1">{showValues ? formatCurrency(totalIncome) : "•••••••"}</p>
          </div>
        </Card>
        <Card>
          <div className="p-6">
            <p className="text-sm text-muted-foreground">Despesas Totais</p>
            <p className="text-2xl font-bold mt-1">{showValues ? formatCurrency(totalExpenses) : "•••••••"}</p>
          </div>
        </Card>
      </div>
    </>
  );
};

export default YearlyHeader;
