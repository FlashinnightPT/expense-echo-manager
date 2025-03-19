
import { ArrowUpDown, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface TableHeaderProps<T> {
  columns: {
    id: string;
    header: string;
    accessorFn: (row: T) => React.ReactNode;
    sortable?: boolean;
    className?: string;
  }[];
  sortBy: string | null;
  sortOrder: "asc" | "desc";
  onSort: (columnId: string) => void;
}

const TableHeaderComponent = <T extends Record<string, any>>({
  columns,
  sortBy,
  sortOrder,
  onSort,
}: TableHeaderProps<T>) => {
  return (
    <TableHeader>
      <TableRow>
        {columns.map((column) => (
          <TableHead key={column.id} className={column.className}>
            {column.sortable ? (
              <Button
                variant="ghost"
                onClick={() => onSort(column.id)}
                className="px-0 font-medium flex items-center hover:bg-transparent"
              >
                {column.header}
                {sortBy === column.id ? (
                  sortOrder === "asc" ? (
                    <ChevronUp className="ml-2 h-4 w-4" />
                  ) : (
                    <ChevronDown className="ml-2 h-4 w-4" />
                  )
                ) : (
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                )}
              </Button>
            ) : (
              column.header
            )}
          </TableHead>
        ))}
      </TableRow>
    </TableHeader>
  );
};

export default TableHeaderComponent;
