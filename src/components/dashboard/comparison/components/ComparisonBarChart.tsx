
import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  Cell
} from "recharts";
import { formatCurrency } from "@/utils/financialCalculations";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

interface ChartDataItem {
  category: string;
  amount: number;
  categoryId: string;
  fill: string;
  percentage: number;
}

interface ComparisonBarChartProps {
  chartData: ChartDataItem[];
  showValues: boolean;
  onRemoveCategory?: (categoryId: string) => void;
}

const ComparisonBarChart: React.FC<ComparisonBarChartProps> = ({ 
  chartData, 
  showValues,
  onRemoveCategory
}) => {
  // Create a config object for the chart
  const chartConfig = chartData.reduce((config, item, index) => {
    config[index.toString()] = { color: item.fill };
    return config;
  }, {} as Record<string, { color: string }>);

  // Custom tick formatter for Y axis
  const tickFormatter = (value: number) => {
    if (!showValues) return "•••••";
    return value >= 1000 ? `${(value / 1000).toFixed(0)}k` : value.toString();
  };

  // Format the tooltip value
  const formatTooltip = (value: number, name: string, entry: any) => {
    if (!showValues) return ["•••••", ""];
    return [formatCurrency(value), name];
  };

  return (
    <div className="space-y-4">
      <div className="h-[300px] w-full">
        <ChartContainer config={chartConfig}>
          <BarChart
            data={chartData}
            margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="category" 
              angle={-45} 
              textAnchor="end" 
              height={80} 
              interval={0}
            />
            <YAxis tickFormatter={tickFormatter} />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  formatter={formatTooltip}
                />
              }
            />
            <Bar dataKey="amount">
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
              ))}
            </Bar>
          </BarChart>
        </ChartContainer>
      </div>

      {/* Legend with remove buttons */}
      {onRemoveCategory && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 mt-4">
          {chartData.map(item => (
            <div 
              key={item.categoryId} 
              className="flex items-center justify-between p-2 rounded-md border"
            >
              <div className="flex items-center gap-2">
                <div 
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: item.fill }}
                ></div>
                <span className="text-sm font-medium truncate">{item.category}</span>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onRemoveCategory(item.categoryId)}
                title="Remover categoria"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ComparisonBarChart;
