
import { Table } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui-custom/Card";
import { cn } from "@/lib/utils";
import TableHeaderComponent from "./components/TableHeader";
import TableBodyComponent from "./components/TableBody";
import TablePagination from "./components/TablePagination";
import TableSearch from "./components/TableSearch";
import { useTableData } from "./hooks/useTableData";

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
  const {
    sortBy,
    sortOrder,
    searchQuery,
    currentPage,
    totalPages,
    filteredData,
    paginatedData,
    handleSort,
    handlePageChange,
    handleSearchChange
  } = useTableData<T>(data, itemsPerPage, pagination);

  return (
    <Card className={cn(cardClassName)}>
      {title && (
        <CardHeader>
          <CardTitle className="text-lg">{title}</CardTitle>
        </CardHeader>
      )}
      <CardContent className={cn("px-0", className)}>
        <TableSearch 
          searchQuery={searchQuery}
          onSearchChange={handleSearchChange}
          placeholder={searchPlaceholder}
          showSearch={searchable}
        />
        <div className="overflow-x-auto">
          <Table className={cn(tableClassName)}>
            <TableHeaderComponent
              columns={columns}
              sortBy={sortBy}
              sortOrder={sortOrder}
              onSort={handleSort}
            />
            <TableBodyComponent
              data={paginatedData}
              columns={columns}
              onRowClick={onRowClick}
              emptyMessage={emptyMessage}
            />
          </Table>
        </div>
        
        <TablePagination
          currentPage={currentPage}
          totalPages={totalPages}
          itemsPerPage={itemsPerPage}
          totalItems={filteredData.length}
          visibleItems={paginatedData.length}
          onPageChange={handlePageChange}
          show={pagination}
        />
      </CardContent>
    </Card>
  );
};

export default DataTable;
