
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
    percentage?: number;
  }[];
  showValues?: boolean;
}

const ComparisonBarChart: React.FC<ComparisonBarChartProps> = ({ 
  chartData,
  showValues = true
}) => {
  if (!chartData || chartData.length === 0) return null;

  // Calculate percentages if not provided
  const totalAmount = chartData.reduce((sum, item) => sum + item.amount, 0);
  const dataWithPercentages = chartData.map(item => ({
    ...item,
    percentage: item.percentage || ((item.amount / totalAmount) * 100)
  }));

  // Create a config object for the chart with proper typing
  const chartConfig = dataWithPercentages.reduce((config, item) => {
    config[item.categoryId] = { color: item.fill };
    return config;
  }, {} as Record<string, { color: string }>);

  return (
    <div className="h-[300px]">
      <p className="text-sm text-muted-foreground mb-2 text-center">Comparação por valores</p>
      <ChartContainer config={chartConfig}>
        <BarChart 
          data={dataWithPercentages}
          layout="vertical"
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
          <XAxis 
            type="number" 
            tickFormatter={(value) => showValues ? `€${value}` : "•••"}
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
                formatter={(value, name, item) => {
                  if (!showValues) return ["•••••••", name];
                  
                  const amount = formatCurrency(value as number);
                  const percentage = item.payload.percentage?.toFixed(2);
                  
                  return [
                    <span>
                      {amount} <span className="text-muted-foreground">({percentage}%)</span>
                    </span>,
                    "Valor"
                  ];
                }}
              />
            }
          />
          <Bar dataKey="amount" name="Valor">
            {dataWithPercentages.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.fill} />
            ))}
          </Bar>
        </BarChart>
      </ChartContainer>
    </div>
  );
};

export default ComparisonBarChart;
