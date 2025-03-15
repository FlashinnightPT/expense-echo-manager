
import { TableCell, TableRow } from "@/components/ui/table";
import { TransactionCategory } from "@/utils/mockData";
import { formatCurrency } from "@/utils/financialCalculations";

interface CategoryRowProps {
  category: TransactionCategory;
  amount: number;
  level: number;
}

const CategoryRow = ({ category, amount, level }: CategoryRowProps) => {
  // Calculamos a indentação baseada no nível da categoria diretamente
  // Cada nível deve corresponder à hierarquia real na estrutura de dados
  const indentClass = `pl-${(category.level - 1) * 4}`;

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
