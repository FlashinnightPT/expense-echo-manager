
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
        Expenses: 0
      }]);
      return;
    }

    const transformedData = data.map((item) => ({
      year: item.year ? item.year.toString() : "",
      Income: item.income || 0,
      Expenses: item.expense || 0
    }));
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
    <Card className={className}>
      <CardHeader>
        <CardTitle className="text-lg">Visão Anual</CardTitle>
      </CardHeader>
      <div className="h-[300px] w-full">
        {isClient && (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
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
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>
    </Card>
  );
};

export default YearlyChart;
