
import { TrendingUp, TrendingDown } from "lucide-react";
import { Card, CardContent, CardDescription } from "@/components/ui-custom/Card";
import AnimatedNumber from "@/components/ui-custom/AnimatedNumber";
import { formatCurrency } from "@/utils/financialCalculations";

interface SummaryCardsProps {
  monthlySummary: {
    income: number;
    expense: number;
    balance: number;
    differenceRate: number;
  };
}

const SummaryCards = ({ monthlySummary }: SummaryCardsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
      <Card animate animationDelay={100} glassEffect>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <CardDescription>Receitas</CardDescription>
              <div className="text-2xl font-bold mt-2">
                <AnimatedNumber 
                  value={monthlySummary.income} 
                  formatter={(val) => formatCurrency(val)} 
                />
              </div>
              <CardDescription className="mt-1">
                Este mês
              </CardDescription>
            </div>
            <div className="h-12 w-12 rounded-full bg-finance-income/10 flex items-center justify-center">
              <TrendingUp className="h-6 w-6 text-finance-income" />
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card animate animationDelay={200} glassEffect>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <CardDescription>Despesas</CardDescription>
              <div className="text-2xl font-bold mt-2">
                <AnimatedNumber 
                  value={monthlySummary.expense} 
                  formatter={(val) => formatCurrency(val)} 
                />
              </div>
              <CardDescription className="mt-1">
                Este mês
              </CardDescription>
            </div>
            <div className="h-12 w-12 rounded-full bg-finance-expense/10 flex items-center justify-center">
              <TrendingDown className="h-6 w-6 text-finance-expense" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SummaryCards;
