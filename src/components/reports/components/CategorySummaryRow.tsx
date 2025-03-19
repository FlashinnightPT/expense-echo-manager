
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
  return (
    <TableRow className="font-bold bg-muted/30">
      <TableCell className="sticky left-0 bg-muted/30">
        {type === 'income' ? 'RECEITAS' : 'DESPESAS'}
      </TableCell>
      {Array.from({ length: 12 }, (_, i) => i + 1).map(month => (
        <TableCell key={month} className="text-right tabular-nums">
          {showValues ? formatCurrency(monthlyTotals[month]) : "•••••••"}
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
