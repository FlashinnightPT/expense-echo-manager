
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
  Income: number;
  Expenses: number;
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
          Income: 0,
          Expenses: 0
        });
      }
      setChartData(emptyData);
      return;
    }
    
    // Transform the provided data
    const transformedData = data
      .filter((item) => item.year === year)
      .map((item) => ({
        month: getMonthName(item.month),
        Income: item.income || 0,
        Expenses: item.expense || 0
      }));
    
    // If filtered data is empty, create empty data
    if (transformedData.length === 0) {
      const emptyData: ChartDataPoint[] = [];
      for (let i = 1; i <= 12; i++) {
        emptyData.push({
          month: getMonthName(i),
          Income: 0,
          Expenses: 0
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
                dataKey="Income"
                fill="hsl(var(--finance-income))"
                radius={[4, 4, 0, 0]}
                animationDuration={1500}
              />
              <Bar
                dataKey="Expenses"
                fill="hsl(var(--finance-expense))"
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

export default MonthlyChart;
