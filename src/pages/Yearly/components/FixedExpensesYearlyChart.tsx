
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
import { formatCurrency } from "@/utils/financialCalculations";

interface FixedExpensesYearlyChartProps {
  filteredData: any[];
  showValues?: boolean;
}

interface ChartDataPoint {
  year: string;
  ReceitasFixas: number;
  DespesasFixas: number;
  Diferença: number;
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
        ReceitasFixas: 0,
        DespesasFixas: 0,
        Diferença: 0
      }]);
      return;
    }

    const transformedData = filteredData.map((item) => {
      const fixedIncome = item.fixedIncome || 0;
      const fixedExpenses = item.fixedExpense || 0;
      return {
        year: item.year ? item.year.toString() : "",
        ReceitasFixas: fixedIncome,
        DespesasFixas: fixedExpenses,
        Diferença: fixedIncome - fixedExpenses
      };
    });
    setChartData(transformedData);
  }, [filteredData]);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const fixedIncome = payload.find((p: any) => p.name === "ReceitasFixas")?.value || 0;
      const fixedExpenses = payload.find((p: any) => p.name === "DespesasFixas")?.value || 0;
      const difference = payload.find((p: any) => p.name === "Diferença")?.value || 0;
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
              <p className="text-sm mt-1 pt-1 border-t" style={{ color: "#facc15" }}>
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
        <CardTitle className="text-lg">Despesas e Receitas Fixas por Ano</CardTitle>
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
                dataKey="ReceitasFixas"
                fill="#4ade80" // Green color for fixed income
                radius={[4, 4, 0, 0]}
                animationDuration={1500}
              />
              <Bar
                dataKey="DespesasFixas"
                fill="#ef4444" // Red color for fixed expenses
                radius={[4, 4, 0, 0]}
                animationDuration={1500}
                animationBegin={300}
              />
              <Line
                type="monotone"
                dataKey="Diferença"
                stroke="#facc15" // Yellow color for difference
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

export default FixedExpensesYearlyChart;
