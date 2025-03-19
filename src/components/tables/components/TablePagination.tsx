
import { Button } from "@/components/ui/button";

interface TablePaginationProps {
  currentPage: number;
  totalPages: number;
  itemsPerPage: number;
  totalItems: number;
  visibleItems: number;
  onPageChange: (page: number) => void;
  show: boolean;
}

const TablePagination = ({
  currentPage,
  totalPages,
  itemsPerPage,
  totalItems,
  visibleItems,
  onPageChange,
  show,
}: TablePaginationProps) => {
  if (!show || totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-end space-x-2 py-4 px-4">
      <div className="flex-1 text-sm text-muted-foreground">
        Showing {visibleItems} of {totalItems} entries
      </div>
      <div className="flex items-center space-x-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Previous
        </Button>
        {Array.from({ length: totalPages }).map((_, index) => (
          <Button
            key={index}
            variant={currentPage === index + 1 ? "default" : "outline"}
            size="sm"
            onClick={() => onPageChange(index + 1)}
          >
            {index + 1}
          </Button>
        ))}
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          Next
        </Button>
      </div>
    </div>
  );
};

export default TablePagination;
