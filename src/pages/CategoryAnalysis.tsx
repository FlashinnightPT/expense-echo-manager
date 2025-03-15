import { useState, useEffect, useMemo } from "react";
import Header from "@/components/layout/Header";
import { Card } from "@/components/ui-custom/Card";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { pt } from "date-fns/locale";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { formatCurrency, getMonthName } from "@/utils/financialCalculations";
import { Transaction, TransactionCategory } from "@/utils/mockData";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Calculator, FileDown, Home, ArrowRightLeft, Plus } from "lucide-react";
import { exportToExcel, prepareCategoryDataForExport } from "@/utils/exportUtils";
import { toast } from "sonner";
import CategoryComparison from "@/components/dashboard/CategoryComparison";
import CompareButton from "@/components/dashboard/components/CompareButton";
import { useComparisonData } from "@/components/dashboard/comparison/hooks/useComparisonData";

const RecentCategoriesForComparison = ({ 
  categories, 
  selectedCategoriesHistory, 
  onSelectCategory,
  type
}: { 
  categories: any[], 
  selectedCategoriesHistory: string[], 
  onSelectCategory: (categoryId: string, categoryPath: string) => void,
  type: "expense" | "income"
}) => {
  if (selectedCategoriesHistory.length === 0) return null;
  
  const uniqueIds = [...new Set(selectedCategoriesHistory)];
  
  const recentIds = uniqueIds.slice(-10);
  
  const categoryOptions = categories
    .filter(cat => recentIds.includes(cat.id) && cat.type === type)
    .map(cat => {
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
      
      return {
        ...cat,
        path: getCategoryPath(cat.id).join(" > ")
      };
    });
    
  if (categoryOptions.length === 0) return null;
  
  return (
    <Card className="p-4 mb-4">
      <h3 className="text-sm font-medium mb-2">Categorias exploradas recentemente</h3>
      <div className="flex flex-wrap gap-2">
        {categoryOptions.map(cat => (
          <Button 
            key={cat.id} 
            variant="outline"
            size="sm"
            className="flex items-center gap-1 text-xs"
            onClick={() => onSelectCategory(cat.id, cat.path)}
          >
            <Plus className="h-3 w-3" />
            {cat.name}
          </Button>
        ))}
      </div>
    </Card>
  );
};

const CategoryAnalysis = () => {
  const [startDate, setStartDate] = useState<Date>(new Date(new Date().getFullYear(), 0, 1)); // Jan 1st of current year
  const [endDate, setEndDate] = useState<Date>(new Date());
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>("");
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [categories, setCategories] = useState<TransactionCategory[]>([]);
  const [activeTab, setActiveTab] = useState<"expense" | "income">("expense");
  
  const [categoryPath, setCategoryPath] = useState<string[]>([]);
  const [availableCategories, setAvailableCategories] = useState<TransactionCategory[]>([]);
  const [categoryLevel, setCategoryLevel] = useState<number>(2); // Start at level 2 to match TransactionForm
  
  const [selectedCategoryForComparison, setSelectedCategoryForComparison] = useState<string | null>(null);
  const [selectedCategoriesHistory, setSelectedCategoriesHistory] = useState<string[]>([]);
  
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
    
    loadData();
    
    window.addEventListener('storage', loadData);
    
    return () => {
      window.removeEventListener('storage', loadData);
    };
  }, []);
  
  const {
    selectedCategories,
    comparisonData,
    totalAmount: comparisonTotalAmount,
    chartData,
    addCategoryToComparison,
    removeCategoryFromComparison,
    handleExportComparison,
    setScrollToComparison
  } = useComparisonData(categories, transactions, startDate, endDate, activeTab);
  
  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const categoryParam = searchParams.get('categoryId');
    const compareMode = searchParams.get('compareMode');
    
    if (categoryParam && compareMode === 'true') {
      const category = categories.find(cat => cat.id === categoryParam);
      if (category) {
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
        
        const pathArray = getCategoryPath(categoryParam);
        const pathString = pathArray.join(" > ");
        
        const event = new CustomEvent("addCategoryToComparison", {
          detail: { categoryId: categoryParam, categoryPath: pathString }
        });
        window.dispatchEvent(event);
        
        window.history.replaceState({}, document.title, window.location.pathname);
      }
    }
  }, [categories]);
  
  useEffect(() => {
    setScrollToComparison(false);
  }, []);
  
  useEffect(() => {
    setSelectedCategoryId("");
    setCategoryPath([]);
    
    const rootCategories = categories.filter(cat => cat.level === 2 && cat.type === activeTab);
    setAvailableCategories(rootCategories);
    setCategoryLevel(2);
  }, [categories, activeTab]);
  
  const categoryOptions = useMemo(() => {
    const result: { id: string; name: string; path: string; level: number; type: string }[] = [];
    
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
    
    categories.forEach(category => {
      const path = getCategoryPath(category.id);
      result.push({
        id: category.id,
        name: category.name,
        path: path.join(" > "),
        level: category.level,
        type: category.type
      });
    });
    
    return result.sort((a, b) => a.path.localeCompare(b.path));
  }, [categories]);
  
  const handleCategorySelect = (categoryId: string) => {
    const selectedCategory = categories.find(cat => cat.id === categoryId);
    
    if (selectedCategory) {
      setSelectedCategoryId(categoryId);
      
      setSelectedCategoriesHistory(prev => [...prev, categoryId]);
      
      const childCategories = categories.filter(cat => cat.parentId === categoryId);
      
      if (childCategories.length > 0) {
        setCategoryPath([...categoryPath, categoryId]);
        setAvailableCategories(childCategories);
        setCategoryLevel(selectedCategory.level + 1);
      } else {
        setCategoryPath([...categoryPath, categoryId]);
      }
    }
  };
  
  const handleResetCategoryPath = (index: number) => {
    if (index === -1) {
      setCategoryPath([]);
      const rootCategories = categories.filter(cat => cat.level === 2 && cat.type === activeTab);
      setAvailableCategories(rootCategories);
      setCategoryLevel(2);
      setSelectedCategoryId("");
      return;
    }
    
    const newPath = categoryPath.slice(0, index + 1);
    setCategoryPath(newPath);
    
    if (newPath.length === 0) {
      const rootCategories = categories.filter(cat => cat.level === 2 && cat.type === activeTab);
      setAvailableCategories(rootCategories);
      setCategoryLevel(2);
    } else {
      const parentId = newPath[newPath.length - 1];
      const childCategories = categories.filter(cat => cat.parentId === parentId);
      setAvailableCategories(childCategories);
      
      setSelectedCategoryId(parentId);
      
      const parentCategory = categories.find(cat => cat.id === parentId);
      if (parentCategory) {
        setCategoryLevel(parentCategory.level + 1);
      }
    }
  };
  
  const getCategoryPathNames = () => {
    return categoryPath.map(id => {
      const category = categories.find(cat => cat.id === id);
      return category?.name || "";
    });
  };
  
  const filteredData = useMemo(() => {
    if (!selectedCategoryId) return [];
    
    const getAllSubcategoryIds = (categoryId: string): string[] => {
      const subcatIds: string[] = [];
      
      const directSubcats = categories.filter(cat => cat.parentId === categoryId);
      for (const subcat of directSubcats) {
        subcatIds.push(subcat.id);
        
        const subsubcats = getAllSubcategoryIds(subcat.id);
        for (const subsubcatId of subsubcats) {
          subcatIds.push(subsubcatId);
        }
      }
      
      return subcatIds;
    };
    
    const allCategoryIds = [selectedCategoryId, ...getAllSubcategoryIds(selectedCategoryId)];
    
    const relevantTransactions = transactions.filter(t => {
      const transactionDate = new Date(t.date);
      return (
        allCategoryIds.includes(t.categoryId) &&
        transactionDate >= startDate &&
        transactionDate <= endDate
      );
    });
    
    const monthlyData = new Map<string, number>();
    
    let currentMonth = new Date(startDate);
    while (currentMonth <= endDate) {
      const key = `${currentMonth.getFullYear()}-${currentMonth.getMonth() + 1}`;
      monthlyData.set(key, 0);
      currentMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1);
    }
    
    for (const transaction of relevantTransactions) {
      const transactionDate = new Date(transaction.date);
      const key = `${transactionDate.getFullYear()}-${transactionDate.getMonth() + 1}`;
      
      if (monthlyData.has(key)) {
        monthlyData.set(key, (monthlyData.get(key) || 0) + transaction.amount);
      }
    }
    
    const result = Array.from(monthlyData.entries()).map(([key, amount]) => {
      const [year, month] = key.split('-').map(Number);
      return {
        month: getMonthName(month),
        year,
        monthKey: key,
        amount
      };
    });
    
    return result.sort((a, b) => {
      return a.monthKey.localeCompare(b.monthKey);
    });
  }, [selectedCategoryId, startDate, endDate, transactions, categories]);
  
  const totalAmount = useMemo(() => {
    return filteredData.reduce((sum, item) => sum + item.amount, 0);
  }, [filteredData]);
  
  const dateRangeText = useMemo(() => {
    return `${format(startDate, "d 'de' MMMM 'de' yyyy", { locale: pt })} até ${format(endDate, "d 'de' MMMM 'de' yyyy", { locale: pt })}`;
  }, [startDate, endDate]);
  
  const selectedCategoryName = useMemo(() => {
    if (!selectedCategoryId) return "Todas as categorias";
    
    const category = categoryOptions.find(cat => cat.id === selectedCategoryId);
    return category ? category.path : "Categoria desconhecida";
  }, [selectedCategoryId, categoryOptions]);
  
  const subcategoryData = useMemo(() => {
    if (!selectedCategoryId) return [];
    
    const directSubcats = categories.filter(cat => cat.parentId === selectedCategoryId);
    
    const result = directSubcats.map(subcat => {
      const getAllSubcategoryIds = (categoryId: string): string[] => {
        const subcatIds: string[] = [];
        
        const directSubcats = categories.filter(cat => cat.parentId === categoryId);
        for (const subcat of directSubcats) {
          subcatIds.push(subcat.id);
          
          const subsubcats = getAllSubcategoryIds(subcat.id);
          for (const subsubcatId of subsubcats) {
            subcatIds.push(subsubcatId);
          }
        }
        
        return subcatIds;
      };
      
      const allCategoryIds = [subcat.id, ...getAllSubcategoryIds(subcat.id)];
      
      const relevantTransactions = transactions.filter(t => {
        const transactionDate = new Date(t.date);
        return (
          allCategoryIds.includes(t.categoryId) &&
          transactionDate >= startDate &&
          transactionDate <= endDate
        );
      });
      
      const amount = relevantTransactions.reduce((sum, t) => sum + t.amount, 0);
      
      return {
        category: subcat,
        amount,
        percentage: totalAmount > 0 ? (amount / totalAmount) * 100 : 0
      };
    });
    
    return result
      .filter(item => item.amount > 0)
      .sort((a, b) => b.amount - a.amount);
  }, [selectedCategoryId, startDate, endDate, transactions, categories, totalAmount]);
  
  const handleExportData = () => {
    try {
      if (!selectedCategoryId) {
        toast.error("Selecione uma categoria para exportar");
        return;
      }
      
      if (filteredData.length === 0) {
        toast.error("Não há dados para exportar");
        return;
      }
      
      const exportData = filteredData.map(item => ({
        Month: item.month,
        Year: item.year,
        Amount: formatCurrency(item.amount).replace(/[€$]/g, '').trim()
      }));
      
      exportToExcel(
        exportData, 
        `categoria_${selectedCategoryName.replace(/\s+/g, '_').replace(/>/g, '-')}_${startDate.toISOString().split('T')[0]}_a_${endDate.toISOString().split('T')[0]}`
      );
      
      toast.success("Dados exportados com sucesso");
    } catch (error) {
      console.error("Error exporting data:", error);
      toast.error("Erro ao exportar dados");
    }
  };
  
  const handleExportSubcategoryData = () => {
    try {
      if (!selectedCategoryId) {
        toast.error("Selecione uma categoria para exportar");
        return;
      }
      
      if (subcategoryData.length === 0) {
        toast.error("Não há dados de subcategorias para exportar");
        return;
      }
      
      const exportData = subcategoryData.map(item => ({
        Subcategory: item.category.name,
        Amount: formatCurrency(item.amount).replace(/[€$]/g, '').trim(),
        Percentage: `${item.percentage.toFixed(2)}%`
      }));
      
      exportToExcel(
        exportData, 
        `subcategorias_${selectedCategoryName.replace(/\s+/g, '_').replace(/>/g, '-')}_${startDate.toISOString().split('T')[0]}_a_${endDate.toISOString().split('T')[0]}`
      );
      
      toast.success("Dados de subcategorias exportados com sucesso");
    } catch (error) {
      console.error("Error exporting subcategory data:", error);
      toast.error("Erro ao exportar dados de subcategorias");
    }
  };
  
  const handleAddToComparison = (categoryId: string, categoryPath: string) => {
    console.log("Dispatching add category to comparison event:", categoryId, categoryPath);
    addCategoryToComparison(categoryId, categoryPath, false);
  };
  
  const selectedCategoryPathForComparison = useMemo(() => {
    if (!selectedCategoryForComparison) return "";
    
    const category = categoryOptions.find(cat => cat.id === selectedCategoryForComparison);
    return category ? category.path : "";
  }, [selectedCategoryForComparison, categoryOptions]);
  
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-4 py-8 pt-24">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">Análise por Categoria</h1>
            <p className="text-muted-foreground mt-1">
              Analise receitas e despesas por categoria em um período específico
            </p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card className="p-4">
            <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as "expense" | "income")}>
              <TabsList className="mb-3 w-full">
                <TabsTrigger value="expense" className="flex-1">Despesas</TabsTrigger>
                <TabsTrigger value="income" className="flex-1">Receitas</TabsTrigger>
              </TabsList>
            </Tabs>
            
            <h2 className="font-semibold mb-2">Selecione uma Categoria</h2>
            
            <div className="flex flex-wrap gap-1 mb-3">
              <button 
                type="button"
                className="text-xs bg-muted hover:bg-muted/80 px-2 py-1 rounded flex items-center"
                onClick={() => handleResetCategoryPath(-1)}
              >
                <Home className="h-3 w-3 mr-1" />
                Início
              </button>
              
              {getCategoryPathNames().map((name, index) => (
                <div key={index} className="flex items-center">
                  <span className="text-xs text-muted-foreground mx-1">/</span>
                  <button 
                    type="button"
                    className="text-xs bg-muted hover:bg-muted/80 px-2 py-1 rounded"
                    onClick={() => handleResetCategoryPath(index)}
                  >
                    {name}
                  </button>
                </div>
              ))}
            </div>
            
            <Select
              value={selectedCategoryId}
              onValueChange={handleCategorySelect}
            >
              <SelectTrigger>
                <SelectValue placeholder={`Selecione uma ${categoryLevel === 2 ? 'categoria' : 'subcategoria'}`} />
              </SelectTrigger>
              <SelectContent className="max-h-[400px]">
                {availableCategories.length === 0 ? (
                  <SelectItem value="no-categories" disabled>
                    Nenhuma categoria disponível
                  </SelectItem>
                ) : (
                  availableCategories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
            
            <RecentCategoriesForComparison 
              categories={categories}
              selectedCategoriesHistory={selectedCategoriesHistory}
              onSelectCategory={(categoryId, categoryPath) => handleAddToComparison(categoryId, categoryPath)}
              type={activeTab}
            />
          </Card>
          
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
            <Card className="mb-8">
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <h2 className="text-xl font-bold">{selectedCategoryName}</h2>
                    <p className="text-muted-foreground">{dateRangeText}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button 
                      size="sm" 
                      onClick={() => {
                        handleAddToComparison(selectedCategoryId, selectedCategoryName);
                        const comparisonElement = document.getElementById('category-comparison-section');
                        if (comparisonElement) {
                          comparisonElement.scrollIntoView({ behavior: 'smooth' });
                        }
                      }}
                      className="flex items-center gap-1"
                    >
                      <ArrowRightLeft className="h-4 w-4 mr-1" />
                      Comparar
                    </Button>
                    <Button size="sm" onClick={handleExportData}>
                      <FileDown className="h-4 w-4 mr-2" />
                      Exportar
                    </Button>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div className={`rounded-lg p-4 ${activeTab === "expense" ? "bg-red-100/20" : "bg-green-100/20"}`}>
                    <div className="flex items-center gap-2">
                      <Calculator className={`h-5 w-5 ${activeTab === "expense" ? "text-red-500" : "text-green-500"}`} />
                      <span className="text-sm font-medium">
                        {activeTab === "expense" ? "Total Gasto" : "Total Recebido"}
                      </span>
                    </div>
                    <p className="text-2xl font-bold mt-1">{formatCurrency(totalAmount)}</p>
                  </div>
                </div>
                
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
                      <Bar 
                        dataKey="amount" 
                        name="Valor" 
                        fill={activeTab === "expense" ? "#ef4444" : "#22c55e"} 
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                
                {subcategoryData.length > 0 && (
                  <div>
                    <div className="flex justify-between items-center mb-3">
                      <h3 className="text-lg font-semibold">Distribuição por Subcategorias</h3>
                      <Button size="sm" onClick={handleExportSubcategoryData}>
                        <FileDown className="h-4 w-4 mr-2" />
                        Exportar Subcategorias
                      </Button>
                    </div>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Subcategoria</TableHead>
                          <TableHead className="text-right">Valor</TableHead>
                          <TableHead className="text-right">% do Total</TableHead>
                          <TableHead className="w-[50px]"></TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {subcategoryData.map((item) => (
                          <TableRow key={item.category.id}>
                            <TableCell>{item.category.name}</TableCell>
                            <TableCell className="text-right tabular-nums">{formatCurrency(item.amount)}</TableCell>
                            <TableCell className="text-right tabular-nums">{item.percentage.toFixed(2)}%</TableCell>
                            <TableCell>
                              <CompareButton 
                                onClick={() => handleAddToComparison(item.category.id, `${selectedCategoryName} > ${item.category.name}`)}
                                categoryId={item.category.id}
                                categoryPath={`${selectedCategoryName} > ${item.category.name}`}
                              />
                            </TableCell>
                          </TableRow>
                        ))}
                        <TableRow className="font-bold">
                          <TableCell>TOTAL</TableCell>
                          <TableCell className="text-right tabular-nums">{formatCurrency(totalAmount)}</TableCell>
                          <TableCell className="text-right tabular-nums">100%</TableCell>
                          <TableCell></TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </div>
                )}
              </div>
            </Card>
            
            <CategoryComparison
              categories={categories}
              transactions={transactions}
              startDate={startDate}
              endDate={endDate}
              activeTab={activeTab}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default CategoryAnalysis;
