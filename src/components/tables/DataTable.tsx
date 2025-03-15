
import { useState } from "react";
import { ArrowUpDown, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui-custom/Card";
import { cn } from "@/lib/utils";

interface DataTableProps<T> {
  data: T[];
  columns: {
    id: string;
    header: string;
    accessorFn: (row: T) => React.ReactNode;
    sortable?: boolean;
    className?: string;
  }[];
  title?: string;
  searchable?: boolean;
  searchPlaceholder?: string;
  className?: string;
  cardClassName?: string;
  tableClassName?: string;
  emptyMessage?: string;
  onRowClick?: (row: T) => void;
  pagination?: boolean;
  itemsPerPage?: number;
}

const DataTable = <T extends Record<string, any>>({
  data,
  columns,
  title,
  searchable = false,
  searchPlaceholder = "Search...",
  className,
  cardClassName,
  tableClassName,
  emptyMessage = "No data available",
  onRowClick,
  pagination = false,
  itemsPerPage = 10,
}: DataTableProps<T>) => {
  const [sortBy, setSortBy] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const handleSort = (columnId: string) => {
    if (sortBy === columnId) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(columnId);
      setSortOrder("asc");
    }
  };

  const sortedData = [...data].sort((a, b) => {
    if (!sortBy) return 0;

    const column = columns.find((col) => col.id === sortBy);
    if (!column) return 0;

    const aValue = a[sortBy];
    const bValue = b[sortBy];

    if (aValue === bValue) return 0;
    if (aValue === null || aValue === undefined) return 1;
    if (bValue === null || bValue === undefined) return -1;

    if (typeof aValue === "string" && typeof bValue === "string") {
      return sortOrder === "asc"
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    }

    return sortOrder === "asc" ? (aValue > bValue ? 1 : -1) : aValue > bValue ? -1 : 1;
  });

  const filteredData = sortedData.filter((row) => {
    if (!searchQuery) return true;
    
    return Object.values(row).some((value) => {
      if (value === null || value === undefined) return false;
      return value.toString().toLowerCase().includes(searchQuery.toLowerCase());
    });
  });

  // Pagination logic
  const totalPages = pagination ? Math.ceil(filteredData.length / itemsPerPage) : 1;
  const paginatedData = pagination 
    ? filteredData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
    : filteredData;

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <Card className={cn(cardClassName)}>
      {title && (
        <CardHeader>
          <CardTitle className="text-lg">{title}</CardTitle>
        </CardHeader>
      )}
      <CardContent className={cn("px-0", className)}>
        {searchable && (
          <div className="px-4 pb-4">
            <Input
              placeholder={searchPlaceholder}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="max-w-sm"
            />
          </div>
        )}
        <div className="overflow-x-auto">
          <Table className={cn(tableClassName)}>
            <TableHeader>
              <TableRow>
                {columns.map((column) => (
                  <TableHead key={column.id} className={column.className}>
                    {column.sortable ? (
                      <Button
                        variant="ghost"
                        onClick={() => handleSort(column.id)}
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
            <TableBody>
              {paginatedData.length > 0 ? (
                paginatedData.map((row, rowIndex) => (
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
          </Table>
        </div>
        
        {pagination && totalPages > 1 && (
          <div className="flex items-center justify-end space-x-2 py-4 px-4">
            <div className="flex-1 text-sm text-muted-foreground">
              Showing {paginatedData.length} of {filteredData.length} entries
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
              >
                Previous
              </Button>
              {Array.from({ length: totalPages }).map((_, index) => (
                <Button
                  key={index}
                  variant={currentPage === index + 1 ? "default" : "outline"}
                  size="sm"
                  onClick={() => handlePageChange(index + 1)}
                >
                  {index + 1}
                </Button>
              ))}
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default DataTable;
