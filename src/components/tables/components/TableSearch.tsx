
import { Input } from "@/components/ui/input";

interface TableSearchProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  placeholder: string;
  showSearch: boolean;
}

const TableSearch = ({
  searchQuery,
  onSearchChange,
  placeholder,
  showSearch,
}: TableSearchProps) => {
  if (!showSearch) return null;

  return (
    <div className="px-4 pb-4">
      <Input
        placeholder={placeholder}
        value={searchQuery}
        onChange={(e) => onSearchChange(e.target.value)}
        className="max-w-sm"
      />
    </div>
  );
};

export default TableSearch;
