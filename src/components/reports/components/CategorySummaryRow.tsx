
import { TableRow, TableCell } from "@/components/ui/table";
import { formatCurrency } from "@/utils/financialCalculations";

interface CategorySummaryRowProps {
  type: 'income' | 'expense';
  monthlyTotals: Record<number, number>;
  yearlyTotal: number;
  monthlyAverage: number;
  showValues: boolean;
}

const CategorySummaryRow = ({
  type,
  monthlyTotals,
  yearlyTotal,
  monthlyAverage,
  showValues
}: CategorySummaryRowProps) => {
  // Different background colors for income vs expense
  const bgColor = type === 'income' 
    ? "bg-green-100/50" 
    : "bg-orange-100/50";
  
  return (
    <TableRow className={`font-bold ${bgColor}`}>
      <TableCell className={`sticky left-0 ${bgColor}`}>
        {type === 'income' ? 'RECEITAS' : 'DESPESAS'}
      </TableCell>
      {Array.from({ length: 12 }, (_, i) => i + 1).map(month => (
        <TableCell key={month} className="text-right tabular-nums">
          {showValues ? formatCurrency(monthlyTotals[month] || 0) : "•••••••"}
        </TableCell>
      ))}
      <TableCell className="text-right tabular-nums">
        {showValues ? formatCurrency(yearlyTotal) : "•••••••"}
      </TableCell>
      <TableCell className="text-right tabular-nums">
        {showValues ? formatCurrency(monthlyAverage) : "•••••••"}
      </TableCell>
    </TableRow>
  );
};

export default CategorySummaryRow;
