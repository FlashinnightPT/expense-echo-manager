
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui-custom/Card";
import AnimatedNumber from "@/components/ui-custom/AnimatedNumber";
import MonthlyChart from "@/components/charts/MonthlyChart";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { formatCurrency, getMonthName } from "@/utils/financialCalculations";
import { MonthlyData } from "@/utils/mockData";

interface MonthlyOverviewProps {
  monthlySummary: {
    income: number;
    expense: number;
    balance: number;
    differenceRate: number;
  };
  monthlyChartData: MonthlyData[];
  selectedMonth: number;
  selectedYear: number;
  availableYears: number[];
  onMonthChange: (month: number) => void;
  onYearChange: (year: number) => void;
  showValues: boolean;
}

const MonthlyOverview = ({
  monthlySummary,
  monthlyChartData,
  selectedMonth,
  selectedYear,
  availableYears,
  onMonthChange,
  onYearChange,
  showValues
}: MonthlyOverviewProps) => {
  const hiddenValue = "•••••••";

  return (
    <Card className="lg:col-span-2 animate-fade-in-up animation-delay-500" glassEffect>
      <CardHeader>
        <CardTitle>Resumo Mensal</CardTitle>
        <div className="flex items-center justify-between">
          <CardDescription>
            {getMonthName(selectedMonth)} {selectedYear}
          </CardDescription>
          <div className="flex space-x-2">
            <Select
              value={selectedMonth.toString()}
              onValueChange={(value) => onMonthChange(parseInt(value))}
            >
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="Mês" />
              </SelectTrigger>
              <SelectContent>
                {Array.from({ length: 12 }, (_, i) => i + 1).map((month) => (
                  <SelectItem key={month} value={month.toString()}>
                    {getMonthName(month)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Select
              value={selectedYear.toString()}
              onValueChange={(value) => onYearChange(parseInt(value))}
            >
              <SelectTrigger className="w-[100px]">
                <SelectValue placeholder="Ano" />
              </SelectTrigger>
              <SelectContent>
                {availableYears.map((year) => (
                  <SelectItem key={year} value={year.toString()}>
                    {year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <CardDescription>Saldo</CardDescription>
              <div className="text-3xl font-bold tabular-nums">
                {showValues ? (
                  <AnimatedNumber 
                    value={monthlySummary.balance} 
                    formatter={(val) => formatCurrency(val)} 
                  />
                ) : (
                  <span>{hiddenValue}</span>
                )}
              </div>
            </div>
            
            <div className="space-y-2">
              <CardDescription>Diferença</CardDescription>
              <div className="text-3xl font-bold tabular-nums">
                {showValues ? (
                  <AnimatedNumber 
                    value={monthlySummary.differenceRate} 
                    formatter={(val) => `${val.toFixed(1)}%`} 
                  />
                ) : (
                  <span>{hiddenValue}</span>
                )}
              </div>
            </div>
            
            <div className="space-y-2">
              <CardDescription>Projeção Anual</CardDescription>
              <div className="text-3xl font-bold tabular-nums">
                {showValues ? (
                  <AnimatedNumber 
                    value={monthlySummary.balance * 12} 
                    formatter={(val) => formatCurrency(val)} 
                  />
                ) : (
                  <span>{hiddenValue}</span>
                )}
              </div>
            </div>
          </div>
          
          <Separator />
          
          <MonthlyChart data={monthlyChartData} year={selectedYear} />
        </div>
      </CardContent>
    </Card>
  );
};

export default MonthlyOverview;
