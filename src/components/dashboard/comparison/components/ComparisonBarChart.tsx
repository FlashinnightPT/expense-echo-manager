
import React from "react";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Cell, 
  ResponsiveContainer
} from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { formatCurrency } from "@/utils/financialCalculations";

interface ComparisonBarChartProps {
  chartData: {
    category: string;
    amount: number;
    categoryId: string;
    fill: string;
  }[];
}

const ComparisonBarChart: React.FC<ComparisonBarChartProps> = ({ chartData }) => {
  if (!chartData || chartData.length === 0) return null;

  return (
    <div className="h-[300px]">
      <p className="text-sm text-muted-foreground mb-2 text-center">Comparação por valores</p>
      <ChartContainer config={{}}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart 
            data={chartData}
            layout="vertical"
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
            <XAxis 
              type="number" 
              tickFormatter={(value) => `€${value}`}
            />
            <YAxis 
              dataKey="category" 
              type="category" 
              width={100}
              tick={{ fontSize: 12 }}
            />
            <ChartTooltip
              content={
                <ChartTooltipContent 
                  formatter={(value) => [
                    `${formatCurrency(value as number)}`,
                    "Valor"
                  ]}
                />
              }
            />
            <Bar dataKey="amount" name="Valor">
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </ChartContainer>
    </div>
  );
};

export default ComparisonBarChart;
