
import { useState, useMemo } from "react";

export function useTableData<T extends Record<string, any>>(
  data: T[],
  itemsPerPage: number,
  pagination: boolean
) {
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

  const sortedData = useMemo(() => {
    return [...data].sort((a, b) => {
      if (!sortBy) return 0;

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
  }, [data, sortBy, sortOrder]);

  const filteredData = useMemo(() => {
    return sortedData.filter((row) => {
      if (!searchQuery) return true;
      
      return Object.values(row).some((value) => {
        if (value === null || value === undefined) return false;
        return value.toString().toLowerCase().includes(searchQuery.toLowerCase());
      });
    });
  }, [sortedData, searchQuery]);

  // Pagination logic
  const totalPages = pagination ? Math.ceil(filteredData.length / itemsPerPage) : 1;
  const paginatedData = pagination 
    ? filteredData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
    : filteredData;

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1); // Reset to first page on search
  };

  return {
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
  };
}
