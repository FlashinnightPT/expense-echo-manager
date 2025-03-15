
import { TableCell, TableRow } from "@/components/ui/table";
import { TransactionCategory } from "@/utils/mockData";
import { formatCurrency } from "@/utils/financialCalculations";

interface CategoryRowProps {
  category: TransactionCategory;
  amount: number;
  level: number;
}

const CategoryRow = ({ category, amount, level }: CategoryRowProps) => {
  // Usamos o nível passado como prop para determinar a indentação,
  // já que este nível representa a posição na hierarquia visual da tabela
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
