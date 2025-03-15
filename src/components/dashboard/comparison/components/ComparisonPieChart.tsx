
import React, { useState } from "react";
import { 
  PieChart, 
  Pie, 
  Cell, 
  Sector, 
  ResponsiveContainer
} from "recharts";
import {
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { formatCurrency } from "@/utils/financialCalculations";

interface ComparisonPieChartProps {
  chartData: {
    category: string;
    amount: number;
    categoryId: string;
    fill: string;
  }[];
  totalAmount: number;
}

const ComparisonPieChart: React.FC<ComparisonPieChartProps> = ({ 
  chartData,
  totalAmount 
}) => {
  const [activeIndex, setActiveIndex] = useState<number>(0);

  // Custom active shape for the PieChart
  const renderActiveShape = (props: any) => {
    const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill, payload, percent, value } = props;
  
    return (
      <g>
        <text x={cx} y={cy - 10} dy={8} textAnchor="middle" fill={fill} className="text-lg font-semibold">
          {payload.category}
        </text>
        <text x={cx} y={cy + 15} textAnchor="middle" fill="#999" className="text-sm">
          {formatCurrency(value)}
        </text>
        <text x={cx} y={cy + 35} textAnchor="middle" fill="#999" className="text-xs">
          {`${(percent * 100).toFixed(2)}%`}
        </text>
        <Sector
          cx={cx}
          cy={cy}
          innerRadius={innerRadius}
          outerRadius={outerRadius + 10}
          startAngle={startAngle}
          endAngle={endAngle}
          fill={fill}
        />
        <Sector
          cx={cx}
          cy={cy}
          innerRadius={innerRadius - 5}
          outerRadius={innerRadius - 1}
          startAngle={startAngle}
          endAngle={endAngle}
          fill={fill}
        />
      </g>
    );
  };

  const onPieEnter = (_: any, index: number) => {
    setActiveIndex(index);
  };

  if (!chartData || chartData.length === 0) return null;

  return (
    <div className="h-[300px]">
      <p className="text-sm text-muted-foreground mb-2 text-center">Distribuição percentual</p>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            activeIndex={activeIndex}
            activeShape={renderActiveShape}
            data={chartData}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={80}
            fill="#8884d8"
            dataKey="amount"
            onMouseEnter={onPieEnter}
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.fill} />
            ))}
          </Pie>
          <ChartTooltip
            content={
              <ChartTooltipContent 
                formatter={(value, name, entry) => {
                  const percent = entry && entry.payload ? 
                    ((entry.payload.amount / totalAmount) * 100).toFixed(2) + '%' : '';
                  return [`${formatCurrency(value as number)} (${percent})`, entry.payload.category];
                }}
              />
            }
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ComparisonPieChart;
