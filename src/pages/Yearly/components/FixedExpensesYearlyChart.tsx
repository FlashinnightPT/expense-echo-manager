
import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { Card, CardHeader, CardTitle } from "@/components/ui-custom/Card";
import { formatCurrency } from "@/utils/financialCalculations";

interface FixedExpensesYearlyChartProps {
  filteredData: any[];
  showValues?: boolean;
}

interface ChartDataPoint {
  year: string;
  FixedIncome: number;
  FixedExpenses: number;
}

const FixedExpensesYearlyChart = ({ filteredData, showValues = true }: FixedExpensesYearlyChartProps) => {
  const [chartData, setChartData] = useState<ChartDataPoint[]>([]);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!filteredData || filteredData.length === 0) {
      // If no data, create a placeholder with the current year
      const currentYear = new Date().getFullYear();
      setChartData([{
        year: currentYear.toString(),
        FixedIncome: 0,
        FixedExpenses: 0
      }]);
      return;
    }

    const transformedData = filteredData.map((item) => {
      return {
        year: item.year ? item.year.toString() : "",
        FixedIncome: item.fixedIncome || 0,
        FixedExpenses: item.fixedExpense || 0
      };
    });
    setChartData(transformedData);
  }, [filteredData]);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="glass p-4 rounded-md border shadow-sm">
          <p className="font-medium">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={`item-${index}`} style={{ color: entry.color }} className="text-sm">
              {`${entry.name}: ${showValues ? formatCurrency(entry.value) : "•••••••"}`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Despesas e Receitas Fixas por Ano</CardTitle>
      </CardHeader>
      <div className="h-[300px] w-full">
        {isClient && (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{ top: 20, right: 30, left: 20, bottom: 30 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis 
                dataKey="year" 
                axisLine={false}
                tickLine={false}
                dy={10}
              />
              <YAxis 
                axisLine={false}
                tickLine={false}
                tickFormatter={(value) => showValues ? `${value}€` : "•••"}
                dx={-10}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ paddingTop: 10 }} />
              <Bar
                dataKey="FixedIncome"
                fill="hsl(var(--primary))"
                radius={[4, 4, 0, 0]}
                animationDuration={1500}
              />
              <Bar
                dataKey="FixedExpenses"
                fill="hsl(var(--destructive))"
                radius={[4, 4, 0, 0]}
                animationDuration={1500}
                animationBegin={300}
              />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </Card>
  );
};

export default FixedExpensesYearlyChart;
