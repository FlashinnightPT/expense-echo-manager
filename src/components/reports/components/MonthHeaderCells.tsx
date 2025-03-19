
import { getMonthName } from "@/utils/financialCalculations";
import { TableHead } from "@/components/ui/table";

interface MonthHeaderCellsProps {
  months?: number[];
}

const MonthHeaderCells = ({ months = Array.from({ length: 12 }, (_, i) => i + 1) }: MonthHeaderCellsProps) => {
  return (
    <>
      {months.map(month => (
        <TableHead key={month} className="text-right min-w-[80px]">
          {getMonthName(month).substring(0, 3)}
        </TableHead>
      ))}
    </>
  );
};

export default MonthHeaderCells;
