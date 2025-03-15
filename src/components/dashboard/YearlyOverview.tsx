
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui-custom/Card";
import AnimatedNumber from "@/components/ui-custom/AnimatedNumber";
import { formatCurrency } from "@/utils/financialCalculations";

interface YearlyOverviewProps {
  yearlySummary: {
    income: number;
    expense: number;
    balance: number;
    differenceRate: number;
  };
  selectedYear: number;
  showValues?: boolean;
}

const YearlyOverview = ({ yearlySummary, selectedYear, showValues = true }: YearlyOverviewProps) => {
  // Hidden value placeholder
  const hiddenValue = "•••••••";

  return (
    <Card className="animate-fade-in-up animation-delay-600" glassEffect>
      <CardHeader>
        <CardTitle>Resumo Anual</CardTitle>
        <CardDescription>{selectedYear}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <CardDescription>Receitas</CardDescription>
                <span className="text-sm font-medium text-finance-income">
                  {showValues ? formatCurrency(yearlySummary.income) : hiddenValue}
                </span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div 
                  className="h-full bg-finance-income rounded-full transition-all duration-500"
                  style={{ width: `${yearlySummary.income > 0 ? (yearlySummary.income / Math.max(yearlySummary.income, yearlySummary.expense)) * 100 : 0}%` }}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <CardDescription>Despesas</CardDescription>
                <span className="text-sm font-medium text-finance-expense">
                  {showValues ? formatCurrency(yearlySummary.expense) : hiddenValue}
                </span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div 
                  className="h-full bg-finance-expense rounded-full transition-all duration-500"
                  style={{ width: `${yearlySummary.expense > 0 ? (yearlySummary.expense / Math.max(yearlySummary.income, yearlySummary.expense)) * 100 : 0}%` }}
                />
              </div>
            </div>
          </div>
          
          <Separator />
          
          <div className="space-y-4">
            <div>
              <CardDescription>Saldo</CardDescription>
              <div className="text-3xl font-bold tabular-nums mt-1">
                {showValues ? (
                  <AnimatedNumber 
                    value={yearlySummary.balance} 
                    formatter={(val) => formatCurrency(val)} 
                  />
                ) : (
                  <span>{hiddenValue}</span>
                )}
              </div>
            </div>
            
            <div>
              <CardDescription>Diferença</CardDescription>
              <div className="text-3xl font-bold tabular-nums mt-1">
                {showValues ? (
                  <AnimatedNumber 
                    value={yearlySummary.differenceRate} 
                    formatter={(val) => `${val.toFixed(1)}%`} 
                  />
                ) : (
                  <span>{hiddenValue}</span>
                )}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default YearlyOverview;
