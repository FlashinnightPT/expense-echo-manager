
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
import { CardHeader, CardTitle } from "@/components/ui-custom/Card";
import { getMonthName, formatCurrency } from "@/utils/financialCalculations";

interface ChartDataPoint {
  month: string;
  FixedIncome: number;
  FixedExpenses: number;
}

interface FixedExpensesChartProps {
  data: any[];
  year: number;
  showValues?: boolean;
}

const FixedExpensesChart = ({ data, year, showValues = true }: FixedExpensesChartProps) => {
  const [chartData, setChartData] = useState<ChartDataPoint[]>([]);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    // Transform the provided data
    const transformedData = data.map(item => {
      return {
        month: getMonthName(item.month),
        FixedIncome: item.fixedIncome || 0,
        FixedExpenses: item.fixedExpense || 0
      };
    });
    
    setChartData(transformedData);
  }, [data]);

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
    <>
      <CardHeader>
        <CardTitle className="text-lg">Despesas e Receitas Fixas {year}</CardTitle>
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
                dataKey="month" 
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
    </>
  );
};

export default FixedExpensesChart;
