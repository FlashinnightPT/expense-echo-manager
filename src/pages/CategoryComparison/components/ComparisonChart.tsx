
import React, { useMemo } from "react";
import { 
  Bar, 
  BarChart, 
  Cell, 
  Legend, 
  Pie, 
  PieChart, 
  ResponsiveContainer, 
  Tooltip,
  XAxis,
  YAxis,
  CartesianGrid
} from "recharts";
import { ComparisonItem } from "@/components/dashboard/comparison/utils/comparisonDataUtils";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { formatCurrency } from "@/utils/financialCalculations";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

// Define chart colors
const CHART_COLORS = [
  "#8884d8", "#82ca9d", "#ffc658", "#ff8042", "#0088fe"
];

interface ComparisonChartProps {
  comparisonItems: ComparisonItem[];
  visualizationMode: "absolute" | "percentage";
  showValues: boolean;
  onRemoveItem?: (itemId: string) => void;
}

const ComparisonChart: React.FC<ComparisonChartProps> = ({
  comparisonItems,
  visualizationMode,
  showValues,
  onRemoveItem
}) => {
  // Calculate total amount
  const totalAmount = comparisonItems.reduce((sum, item) => sum + item.amount, 0);
  
  // Format data for charts
  const chartData = useMemo(() => {
    return comparisonItems.map((item, index) => {
      const percentage = totalAmount > 0 ? (item.amount / totalAmount) * 100 : 0;
      
      return {
        name: item.name.split(" (")[0], // Remove date range for cleaner display
        value: visualizationMode === "absolute" ? item.amount : percentage,
        color: CHART_COLORS[index % CHART_COLORS.length],
        percentage,
        amount: item.amount,
        id: item.id // Add id for removal
      };
    });
  }, [comparisonItems, visualizationMode, totalAmount]);
  
  // Create a config object for the chart
  const chartConfig = chartData.reduce((config, item, index) => {
    config[index.toString()] = { color: item.color };
    return config;
  }, {} as Record<string, { color: string }>);
  
  // Format the tooltip value based on visualization mode
  const formatTooltip = (value: number, name: string, entry: any) => {
    if (!showValues) return ["•••••", name];
    
    if (visualizationMode === "absolute") {
      return [formatCurrency(value), name];
    } else {
      return [`${value.toFixed(2)}%`, name];
    }
  };

  // If no data, return a message
  if (chartData.length === 0) {
    return <div className="text-center py-10 text-muted-foreground">Nenhum dado para exibir</div>;
  }
  
  return (
    <div className="space-y-4">
      <div className="h-[400px] w-full">
        <ChartContainer config={chartConfig}>
          {visualizationMode === "absolute" ? (
            <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="name" 
                angle={-45} 
                textAnchor="end" 
                height={80} 
                interval={0}
                tick={{ fontSize: 12 }}
              />
              <YAxis 
                tickFormatter={(value) => showValues ? 
                  (value >= 1000 ? `${(value / 1000).toFixed(0)}k` : value.toString()) : 
                  "•••"
                }
              />
              <ChartTooltip
                content={
                  <ChartTooltipContent
                    formatter={formatTooltip}
                  />
                }
              />
              <Bar dataKey="value">
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          ) : (
            <PieChart margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={150}
                innerRadius={80}
                fill="#8884d8"
                dataKey="value"
                nameKey="name"
                label={({ name, percent }) => showValues ? 
                  `${name}: ${(percent * 100).toFixed(0)}%` : 
                  name
                }
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <ChartTooltip
                content={
                  <ChartTooltipContent
                    formatter={formatTooltip}
                  />
                }
              />
            </PieChart>
          )}
        </ChartContainer>
      </div>
      
      {/* Categoria legend with remove buttons */}
      {onRemoveItem && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 mt-4">
          {chartData.map(item => (
            <div 
              key={item.id} 
              className="flex items-center justify-between p-2 rounded-md border"
            >
              <div className="flex items-center gap-2">
                <div 
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: item.color }}
                ></div>
                <span className="text-sm font-medium truncate">{item.name}</span>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onRemoveItem(item.id)}
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

export default ComparisonChart;
