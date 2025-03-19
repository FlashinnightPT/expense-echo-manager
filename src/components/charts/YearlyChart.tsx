
import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  ComposedChart,
  Bar,
} from "recharts";
import { Card, CardHeader, CardTitle } from "@/components/ui-custom/Card";
import { YearlyData } from "@/utils/mockData";
import { formatCurrency } from "@/utils/financialCalculations";

interface YearlyChartProps {
  data: YearlyData[];
  className?: string;
  showValues?: boolean;
}

interface ChartDataPoint {
  year: string;
  Income: number;
  Expenses: number;
  Difference: number;
}

const YearlyChart = ({ data, className, showValues = true }: YearlyChartProps) => {
  const [chartData, setChartData] = useState<ChartDataPoint[]>([]);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!data || data.length === 0) {
      // If no data, create a placeholder with the current year
      const currentYear = new Date().getFullYear();
      setChartData([{
        year: currentYear.toString(),
        Income: 0,
        Expenses: 0,
        Difference: 0
      }]);
      return;
    }

    const transformedData = data.map((item) => {
      const income = item.income || 0;
      const expense = item.expense || 0;
      return {
        year: item.year ? item.year.toString() : "",
        Income: income,
        Expenses: expense,
        Difference: income - expense
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
          {payload.length >= 2 && (
            <p className="text-sm mt-1 pt-1 border-t">
              {`Diferença: ${showValues ? formatCurrency(payload[0].payload.Difference) : "•••••••"}`}
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
        <CardTitle className="text-lg">Visão Anual</CardTitle>
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
              <Line
                type="monotone"
                dataKey="Income"
                stroke="hsl(var(--finance-income))"
                strokeWidth={3}
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
                animationDuration={1500}
              />
              <Line
                type="monotone"
                dataKey="Expenses"
                stroke="hsl(var(--finance-expense))"
                strokeWidth={3}
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
                animationDuration={1500}
                animationBegin={300}
              />
              <Bar
                dataKey="Difference"
                fill="hsl(var(--primary))"
                radius={[4, 4, 0, 0]}
                animationDuration={1500}
                animationBegin={600}
                opacity={0.7}
              />
            </ComposedChart>
          </ResponsiveContainer>
        )}
      </div>
    </Card>
  );
};

export default YearlyChart;
