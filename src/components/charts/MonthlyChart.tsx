
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
import { Card, CardHeader, CardTitle } from "@/components/ui-custom/Card";
import { MonthlyData } from "@/utils/mockData";
import { getMonthName, formatCurrency } from "@/utils/financialCalculations";

interface MonthlyChartProps {
  data: MonthlyData[];
  year: number;
  className?: string;
  showValues?: boolean;
}

interface ChartDataPoint {
  month: string;
  Receitas: number;
  Despesas: number;
  Diferença: number;
}

const MonthlyChart = ({ data, year, className, showValues = true }: MonthlyChartProps) => {
  const [chartData, setChartData] = useState<ChartDataPoint[]>([]);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    // If no data or empty array, create empty data for all 12 months
    if (!data || data.length === 0) {
      const emptyData: ChartDataPoint[] = [];
      for (let i = 1; i <= 12; i++) {
        emptyData.push({
          month: getMonthName(i),
          Receitas: 0,
          Despesas: 0,
          Diferença: 0
        });
      }
      setChartData(emptyData);
      return;
    }
    
    // Transform the provided data
    const transformedData = data
      .filter((item) => item.year === year)
      .map((item) => {
        const income = item.income || 0;
        const expense = item.expense || 0;
        return {
          month: getMonthName(item.month),
          Receitas: income,
          Despesas: expense,
          Diferença: income - expense
        };
      });
    
    // If filtered data is empty, create empty data
    if (transformedData.length === 0) {
      const emptyData: ChartDataPoint[] = [];
      for (let i = 1; i <= 12; i++) {
        emptyData.push({
          month: getMonthName(i),
          Receitas: 0,
          Despesas: 0,
          Diferença: 0
        });
      }
      setChartData(emptyData);
    } else {
      setChartData(transformedData);
    }
  }, [data, year]);

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
          {payload.length >= 2 && (
            <p className="text-sm mt-1 pt-1 border-t">
              {`Diferença: ${showValues ? formatCurrency(payload[0].payload.Diferença) : "•••••••"}`}
            </p>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="text-lg">Visão Mensal {year}</CardTitle>
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
                dataKey="Receitas"
                fill="#4ade80" // Green color for income
                radius={[4, 4, 0, 0]}
                animationDuration={1500}
              />
              <Bar
                dataKey="Despesas"
                fill="#ef4444" // Red color for expenses
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
    </Card>
  );
};

export default MonthlyChart;
