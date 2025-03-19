
import { TableBody, TableCell, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";

interface TableBodyProps<T> {
  data: T[];
  columns: {
    id: string;
    header: string;
    accessorFn: (row: T) => React.ReactNode;
    sortable?: boolean;
    className?: string;
  }[];
  onRowClick?: (row: T) => void;
  emptyMessage: string;
}

const TableBodyComponent = <T extends Record<string, any>>({
  data,
  columns,
  onRowClick,
  emptyMessage,
}: TableBodyProps<T>) => {
  return (
    <TableBody>
      {data.length > 0 ? (
        data.map((row, rowIndex) => (
          <TableRow
            key={rowIndex}
            className={cn(
              "transition-colors hover:bg-accent/50 data-[state=selected]:bg-muted",
              onRowClick ? "cursor-pointer" : ""
            )}
            onClick={onRowClick ? () => onRowClick(row) : undefined}
          >
            {columns.map((column) => (
              <TableCell key={column.id} className={column.className}>
                {column.accessorFn(row)}
              </TableCell>
            ))}
          </TableRow>
        ))
      ) : (
        <TableRow>
          <TableCell colSpan={columns.length} className="text-center h-24">
            {emptyMessage}
          </TableCell>
        </TableRow>
      )}
    </TableBody>
  );
};

export default TableBodyComponent;
