
import { useState, useEffect, useMemo } from "react";
import Header from "@/components/layout/Header";
import { Card } from "@/components/ui-custom/Card";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { pt } from "date-fns/locale";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { formatCurrency, getMonthName } from "@/utils/financialCalculations";
import { Transaction, TransactionCategory } from "@/utils/mockData";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Calculator, FileDown } from "lucide-react";

const CategoryAnalysis = () => {
  const [startDate, setStartDate] = useState<Date>(new Date(new Date().getFullYear(), 0, 1)); // Jan 1st of current year
  const [endDate, setEndDate] = useState<Date>(new Date());
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>("");
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [categories, setCategories] = useState<TransactionCategory[]>([]);
  
  // Load data from localStorage
  useEffect(() => {
    const loadData = () => {
      const storedTransactions = localStorage.getItem('transactions');
      if (storedTransactions) {
        setTransactions(JSON.parse(storedTransactions));
      }
      
      const storedCategories = localStorage.getItem('categories');
      if (storedCategories) {
        setCategories(JSON.parse(storedCategories));
      }
    };
    
    // Load initially
    loadData();
    
    // Add event listener for storage changes
    window.addEventListener('storage', loadData);
    
    // Cleanup
    return () => {
      window.removeEventListener('storage', loadData);
    };
  }, []);
  
  // Build category hierarchy for display in the select dropdown
  const categoryOptions = useMemo(() => {
    const result: { id: string; name: string; path: string; level: number }[] = [];
    
    // Helper function to get category path
    const getCategoryPath = (categoryId: string): string[] => {
      const path: string[] = [];
      let currentCategoryId = categoryId;
      
      while (currentCategoryId) {
        const category = categories.find(cat => cat.id === currentCategoryId);
        if (!category) break;
        
        path.unshift(category.name);
        currentCategoryId = category.parentId || "";
      }
      
      return path;
    };
    
    // Add all categories with their full paths
    categories.forEach(category => {
      const path = getCategoryPath(category.id);
      result.push({
        id: category.id,
        name: category.name,
        path: path.join(" > "),
        level: category.level
      });
    });
    
    return result.sort((a, b) => a.path.localeCompare(b.path));
  }, [categories]);
  
  // Calculate data for the selected category and date range
  const filteredData = useMemo(() => {
    if (!selectedCategoryId) return [];
    
    // Get selected category and its subcategories
    const getAllSubcategoryIds = (categoryId: string): string[] => {
      const subcatIds: string[] = [];
      
      const directSubcats = categories.filter(cat => cat.parentId === categoryId);
      for (const subcat of directSubcats) {
        subcatIds.push(subcat.id);
        
        // Get subsubcategories
        const subsubcats = getAllSubcategoryIds(subcat.id);
        for (const subsubcatId of subsubcats) {
          subcatIds.push(subsubcatId);
        }
      }
      
      return subcatIds;
    };
    
    const allCategoryIds = [selectedCategoryId, ...getAllSubcategoryIds(selectedCategoryId)];
    
    // Filter transactions for the selected category and time range
    const relevantTransactions = transactions.filter(t => {
      const transactionDate = new Date(t.date);
      return (
        allCategoryIds.includes(t.categoryId) &&
        transactionDate >= startDate &&
        transactionDate <= endDate
      );
    });
    
    // Group by month
    const monthlyData = new Map<string, number>();
    
    // Initialize all months in the range
    let currentMonth = new Date(startDate);
    while (currentMonth <= endDate) {
      const key = `${currentMonth.getFullYear()}-${currentMonth.getMonth() + 1}`;
      monthlyData.set(key, 0);
      currentMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1);
    }
    
    // Add transaction amounts to the months
    for (const transaction of relevantTransactions) {
      const transactionDate = new Date(transaction.date);
      const key = `${transactionDate.getFullYear()}-${transactionDate.getMonth() + 1}`;
      
      if (monthlyData.has(key)) {
        monthlyData.set(key, (monthlyData.get(key) || 0) + transaction.amount);
      }
    }
    
    // Convert to array for chart
    const result = Array.from(monthlyData.entries()).map(([key, amount]) => {
      const [year, month] = key.split('-').map(Number);
      return {
        month: getMonthName(month),
        year,
        monthKey: key,
        amount
      };
    });
    
    // Sort by year and month
    return result.sort((a, b) => {
      return a.monthKey.localeCompare(b.monthKey);
    });
  }, [selectedCategoryId, startDate, endDate, transactions, categories]);
  
  // Get the total amount for the filtered data
  const totalAmount = useMemo(() => {
    return filteredData.reduce((sum, item) => sum + item.amount, 0);
  }, [filteredData]);
  
  // Format the date range for display
  const dateRangeText = useMemo(() => {
    return `${format(startDate, "d 'de' MMMM 'de' yyyy", { locale: pt })} até ${format(endDate, "d 'de' MMMM 'de' yyyy", { locale: pt })}`;
  }, [startDate, endDate]);
  
  // Get the selected category name
  const selectedCategoryName = useMemo(() => {
    if (!selectedCategoryId) return "Todas as categorias";
    
    const category = categoryOptions.find(cat => cat.id === selectedCategoryId);
    return category ? category.path : "Categoria desconhecida";
  }, [selectedCategoryId, categoryOptions]);
  
  // Group transactions by subcategory
  const subcategoryData = useMemo(() => {
    if (!selectedCategoryId) return [];
    
    // Get direct subcategories of the selected category
    const directSubcats = categories.filter(cat => cat.parentId === selectedCategoryId);
    
    const result = directSubcats.map(subcat => {
      // Get all subcategories of this subcategory
      const getAllSubcategoryIds = (categoryId: string): string[] => {
        const subcatIds: string[] = [];
        
        const directSubcats = categories.filter(cat => cat.parentId === categoryId);
        for (const subcat of directSubcats) {
          subcatIds.push(subcat.id);
          
          // Get subsubcategories
          const subsubcats = getAllSubcategoryIds(subcat.id);
          for (const subsubcatId of subsubcats) {
            subcatIds.push(subsubcatId);
          }
        }
        
        return subcatIds;
      };
      
      const allCategoryIds = [subcat.id, ...getAllSubcategoryIds(subcat.id)];
      
      // Filter transactions for this subcategory and time range
      const relevantTransactions = transactions.filter(t => {
        const transactionDate = new Date(t.date);
        return (
          allCategoryIds.includes(t.categoryId) &&
          transactionDate >= startDate &&
          transactionDate <= endDate
        );
      });
      
      // Calculate total amount
      const amount = relevantTransactions.reduce((sum, t) => sum + t.amount, 0);
      
      return {
        category: subcat,
        amount,
        percentage: totalAmount > 0 ? (amount / totalAmount) * 100 : 0
      };
    });
    
    // Filter out subcategories with no transactions
    return result
      .filter(item => item.amount > 0)
      .sort((a, b) => b.amount - a.amount);
  }, [selectedCategoryId, startDate, endDate, transactions, categories, totalAmount]);
  
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-4 py-8 pt-24">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">Análise por Categoria</h1>
            <p className="text-muted-foreground mt-1">
              Analise gastos por categoria em um período específico
            </p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {/* Category Selection */}
          <Card className="p-4">
            <h2 className="font-semibold mb-2">Selecione uma Categoria</h2>
            <Select
              value={selectedCategoryId}
              onValueChange={setSelectedCategoryId}
            >
              <SelectTrigger>
                <SelectValue placeholder="Escolha uma categoria" />
              </SelectTrigger>
              <SelectContent className="max-h-[400px]">
                {categoryOptions.map(option => (
                  <SelectItem 
                    key={option.id} 
                    value={option.id}
                    className={`pl-${(option.level - 1) * 2}`}
                  >
                    {option.path}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Card>
          
          {/* Start Date Selection */}
          <Card className="p-4">
            <h2 className="font-semibold mb-2">Data Inicial</h2>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full justify-start text-left font-normal">
                  <span>{format(startDate, "d 'de' MMMM 'de' yyyy", { locale: pt })}</span>
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={startDate}
                  onSelect={(date) => date && setStartDate(date)}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </Card>
          
          {/* End Date Selection */}
          <Card className="p-4">
            <h2 className="font-semibold mb-2">Data Final</h2>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full justify-start text-left font-normal">
                  <span>{format(endDate, "d 'de' MMMM 'de' yyyy", { locale: pt })}</span>
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={endDate}
                  onSelect={(date) => date && setEndDate(date)}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </Card>
        </div>
        
        {selectedCategoryId && (
          <>
            {/* Summary */}
            <Card className="mb-8">
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <h2 className="text-xl font-bold">{selectedCategoryName}</h2>
                    <p className="text-muted-foreground">{dateRangeText}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button size="sm">
                      <FileDown className="h-4 w-4 mr-2" />
                      Exportar
                    </Button>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div className="bg-secondary/20 rounded-lg p-4">
                    <div className="flex items-center gap-2">
                      <Calculator className="h-5 w-5 text-primary" />
                      <span className="text-sm font-medium">Total Gasto</span>
                    </div>
                    <p className="text-2xl font-bold mt-1">{formatCurrency(totalAmount)}</p>
                  </div>
                </div>
                
                {/* Chart */}
                <div className="h-[300px] mb-6">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={filteredData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis 
                        dataKey="month" 
                        tick={{ fontSize: 12 }}
                        tickFormatter={(value, index) => {
                          const item = filteredData[index];
                          return `${value.substring(0, 3)}/${item.year % 100}`;
                        }}
                      />
                      <YAxis 
                        tickFormatter={(value) => `€${value}`}
                        width={80}
                      />
                      <Tooltip 
                        formatter={(value) => [`${formatCurrency(value as number)}`, "Valor"]}
                        labelFormatter={(label, items) => {
                          const item = filteredData.find(d => d.month === label);
                          return `${label} ${item?.year}`;
                        }}
                      />
                      <Legend />
                      <Bar dataKey="amount" name="Valor" fill="#8884d8" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                
                {/* Subcategories Table */}
                {subcategoryData.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold mb-3">Distribuição por Subcategorias</h3>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Subcategoria</TableHead>
                          <TableHead className="text-right">Valor</TableHead>
                          <TableHead className="text-right">% do Total</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {subcategoryData.map((item) => (
                          <TableRow key={item.category.id}>
                            <TableCell>{item.category.name}</TableCell>
                            <TableCell className="text-right tabular-nums">{formatCurrency(item.amount)}</TableCell>
                            <TableCell className="text-right tabular-nums">{item.percentage.toFixed(2)}%</TableCell>
                          </TableRow>
                        ))}
                        <TableRow className="font-bold">
                          <TableCell>TOTAL</TableCell>
                          <TableCell className="text-right tabular-nums">{formatCurrency(totalAmount)}</TableCell>
                          <TableCell className="text-right tabular-nums">100%</TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </div>
                )}
              </div>
            </Card>
          </>
        )}
      </div>
    </div>
  );
};

export default CategoryAnalysis;
