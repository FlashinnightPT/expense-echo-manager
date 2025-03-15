
import { TableCell, TableRow } from "@/components/ui/table";
import { TransactionCategory } from "@/utils/mockData";
import { formatCurrency } from "@/utils/financialCalculations";

interface CategoryRowProps {
  category: TransactionCategory;
  amount: number;
  level: number;
}

const CategoryRow = ({ category, amount, level }: CategoryRowProps) => {
  // Calculate the appropriate padding based on the level
  // Each level increases the padding by 4 units
  const indentClass = `pl-${level * 4}`;

  return (
    <TableRow>
      <TableCell className={indentClass}>
        <span className="font-medium">{category.name}</span>
      </TableCell>
      <TableCell className="text-right tabular-nums">
        {formatCurrency(amount)}
      </TableCell>
    </TableRow>
  );
};

export default CategoryRow;
