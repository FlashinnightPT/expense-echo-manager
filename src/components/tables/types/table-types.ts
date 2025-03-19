
export interface Column<T> {
  id: string;
  header: string;
  accessorFn: (row: T) => React.ReactNode;
  sortable?: boolean;
  className?: string;
}

export interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
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
