
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
  Line,
  ComposedChart,
} from "recharts";
import { CardHeader, CardTitle } from "@/components/ui-custom/Card";
import { getMonthName, formatCurrency } from "@/utils/financialCalculations";

interface ChartDataPoint {
  month: string;
  FixedIncome: number;
  FixedExpenses: number;
  Difference: number;
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
      const fixedIncome = item.fixedIncome || 0;
      const fixedExpenses = item.fixedExpense || 0;
      return {
        month: getMonthName(item.month),
        FixedIncome: fixedIncome,
        FixedExpenses: fixedExpenses,
        Difference: fixedIncome - fixedExpenses
      };
    });
    
    setChartData(transformedData);
  }, [data]);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const fixedIncome = payload.find((p: any) => p.name === "FixedIncome")?.value || 0;
      const fixedExpenses = payload.find((p: any) => p.name === "FixedExpenses")?.value || 0;
      const difference = payload.find((p: any) => p.name === "Difference")?.value || 0;
      const percentage = fixedIncome > 0 ? ((difference / fixedIncome) * 100).toFixed(2) : "0.00";
      
      return (
        <div className="glass p-4 rounded-md border shadow-sm">
          <p className="font-medium">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={`item-${index}`} style={{ color: entry.color }} className="text-sm">
              {`${entry.name}: ${showValues ? formatCurrency(entry.value) : "•••••••"}`}
            </p>
          ))}
          {payload.length >= 2 && (
            <>
              <p className="text-sm mt-1 pt-1 border-t" style={{ color: "hsl(var(--primary))" }}>
                {`Diferença: ${showValues ? formatCurrency(difference) : "•••••••"}`}
              </p>
              <p className="text-sm" style={{ color: difference >= 0 ? "hsl(var(--success))" : "hsl(var(--destructive))" }}>
                {`Percentagem: ${showValues ? `${percentage}%` : "•••••••"}`}
              </p>
            </>
          )}
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
            <ComposedChart
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
              <Line
                type="monotone"
                dataKey="Difference"
                stroke="hsl(var(--success))"
                strokeWidth={2}
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
                animationDuration={1500}
                animationBegin={600}
              />
            </ComposedChart>
          </ResponsiveContainer>
        )}
      </div>
    </>
  );
};

export default FixedExpensesChart;
