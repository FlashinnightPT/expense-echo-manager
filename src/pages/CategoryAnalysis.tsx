
import React, { useState, useEffect } from "react";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell
} from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui-custom/Card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { formatCurrency } from "@/utils/financialCalculations";
import CompareButton from "@/components/dashboard/components/CompareButton";
import CategoryComparison from "@/components/dashboard/comparison/CategoryComparison";
import Header from "@/components/layout/Header";
import { useCategoryData } from "@/hooks/useCategoryData";
import { useTransactionData } from "@/hooks/useTransactionData";

const CategoryAnalysis = () => {
  // Estados para os filtros
  const [activeTab, setActiveTab] = useState<"expense" | "income">("expense");
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState<number | null>(null);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState("");
  
  // State for showing/hiding values
  const [showValues, setShowValues] = useState(() => {
    const savedPreference = sessionStorage.getItem("showFinancialValues");
    return savedPreference ? savedPreference === "true" : false;
  });

  // Obter dados de categorias e transações
  const { categoryList: categories } = useCategoryData();
  const { transactionList: transactions, getFilteredTransactions } = useTransactionData();

  // Estado para subcategorias e totais
  const [selectedCategoryName, setSelectedCategoryName] = useState("");
  const [subcategoryData, setSubcategoryData] = useState<any[]>([]);
  const [totalAmount, setTotalAmount] = useState(0);

  // Datas para comparação
  const startDate = useState(new Date(selectedYear, selectedMonth || 0, 1))[0];
  const endDate = useState(new Date(selectedYear, (selectedMonth || 11) + 1, 0))[0];

  // Anos disponíveis para seleção
  const availableYears = Array.from(
    new Set(transactions.map(t => new Date(t.date).getFullYear()))
  ).sort((a, b) => b - a);

  // Se não houver anos nas transações, adicione o ano atual
  useEffect(() => {
    if (availableYears.length === 0) {
      const currentYear = new Date().getFullYear();
      setSelectedYear(currentYear);
    } else if (!availableYears.includes(selectedYear)) {
      setSelectedYear(availableYears[0]);
    }
  }, [availableYears, selectedYear]);

  // Atualizar dados quando os filtros mudarem
  useEffect(() => {
    if (!selectedCategoryId) {
      setSubcategoryData([]);
      setTotalAmount(0);
      setSelectedCategoryName("");
      return;
    }

    // Obter transações filtradas
    const filteredTransactions = getFilteredTransactions(
      selectedYear,
      selectedMonth || undefined,
      activeTab
    );

    // Obter a categoria selecionada
    const selectedCategory = categories.find(cat => cat.id === selectedCategoryId);
    if (!selectedCategory) {
      setSubcategoryData([]);
      setTotalAmount(0);
      setSelectedCategoryName("");
      return;
    }

    setSelectedCategoryName(selectedCategory.name);

    // Obter subcategorias
    const subcategories = categories.filter(cat => cat.parentId === selectedCategoryId);
    
    // Calcular valores para cada subcategoria
    const subcatData = subcategories.map(subcat => {
      // Obter todas as subcategorias (incluindo níveis mais profundos)
      const getAllSubcats = (parentId: string): string[] => {
        const directSubcats = categories.filter(c => c.parentId === parentId);
        const ids = directSubcats.map(c => c.id);
        const nestedIds = directSubcats.flatMap(c => getAllSubcats(c.id));
        return [...ids, ...nestedIds];
      };
      
      const allSubcatIds = [subcat.id, ...getAllSubcats(subcat.id)];
      
      // Calcular o valor total para esta subcategoria e suas subcategorias
      const amount = filteredTransactions
        .filter(t => allSubcatIds.includes(t.categoryId))
        .reduce((sum, t) => sum + t.amount, 0);
        
      return {
        category: subcat,
        amount,
        percentage: 0 // Será calculado após termos o total
      };
    });
    
    // Calcular transações diretamente vinculadas à categoria principal
    const directTransactions = filteredTransactions
      .filter(t => t.categoryId === selectedCategoryId)
      .reduce((sum, t) => sum + t.amount, 0);
      
    // Adicionar a própria categoria se tiver transações diretas
    if (directTransactions > 0) {
      subcatData.unshift({
        category: {
          ...selectedCategory,
          name: "(Diretamente nesta categoria)"
        },
        amount: directTransactions,
        percentage: 0
      });
    }
    
    // Calcular o total
    const total = subcatData.reduce((sum, item) => sum + item.amount, 0);
    setTotalAmount(total);
    
    // Calcular percentagens
    const dataWithPercentages = subcatData.map(item => ({
      ...item,
      percentage: total > 0 ? (item.amount / total) * 100 : 0
    }));
    
    setSubcategoryData(dataWithPercentages);
  }, [selectedCategoryId, selectedYear, selectedMonth, activeTab, categories, transactions, getFilteredTransactions]);

  // Filtrar categorias principais pelo tipo e pelo termo de pesquisa
  const filteredRootCategories = categories
    .filter(cat => 
      cat.type === activeTab && 
      cat.level === 2 && 
      (searchTerm === "" || cat.name.toLowerCase().includes(searchTerm.toLowerCase()))
    )
    .sort((a, b) => a.name.localeCompare(b.name));

  // Toggle function for showing/hiding values
  const toggleShowValues = () => {
    const newValue = !showValues;
    setShowValues(newValue);
    sessionStorage.setItem("showFinancialValues", String(newValue));
  };

  // Function to handle adding a category to comparison
  const handleAddToComparison = (categoryId, categoryPath) => {
    // Implementation of adding to comparison
    console.log("Adding to comparison:", categoryId, categoryPath);
  };

  // Render the component
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto py-4">
        {/* Filtros */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Tabs para tipo (Receitas/Despesas) */}
              <div>
                <Label htmlFor="type">Tipo</Label>
                <Tabs 
                  defaultValue={activeTab} 
                  className="w-full" 
                  onValueChange={(value) => setActiveTab(value as "expense" | "income")}
                >
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="expense">Despesas</TabsTrigger>
                    <TabsTrigger value="income">Receitas</TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>

              {/* Seletor de Ano */}
              <div>
                <Label htmlFor="year">Ano</Label>
                <Select 
                  value={selectedYear.toString()} 
                  onValueChange={(value) => setSelectedYear(Number(value))}
                >
                  <SelectTrigger id="year">
                    <SelectValue placeholder="Selecione o ano" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableYears.length === 0 ? (
                      <SelectItem value={new Date().getFullYear().toString()}>
                        {new Date().getFullYear()}
                      </SelectItem>
                    ) : (
                      availableYears.map((year) => (
                        <SelectItem key={year} value={year.toString()}>
                          {year}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
              </div>

              {/* Seletor de Mês */}
              <div>
                <Label htmlFor="month">Mês (opcional)</Label>
                <Select 
                  value={selectedMonth?.toString() ?? ""} 
                  onValueChange={(value) => setSelectedMonth(value ? Number(value) : null)}
                >
                  <SelectTrigger id="month">
                    <SelectValue placeholder="Todos os meses" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Todos os meses</SelectItem>
                    {Array.from({ length: 12 }, (_, i) => i + 1).map((month) => (
                      <SelectItem key={month} value={month.toString()}>
                        {new Date(2000, month - 1, 1).toLocaleString('pt-PT', { month: 'long' })}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Pesquisa de Categoria */}
              <div>
                <Label htmlFor="search">Pesquisar Categoria</Label>
                <Input
                  id="search"
                  placeholder="Digite para pesquisar..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            {/* Lista de Categorias Principais */}
            <div className="mt-6">
              <Label className="mb-2 block">Categorias</Label>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                {filteredRootCategories.length === 0 ? (
                  <div className="col-span-full text-center py-4 text-muted-foreground">
                    Nenhuma categoria encontrada
                  </div>
                ) : (
                  filteredRootCategories.map((category) => (
                    <div
                      key={category.id}
                      className={`p-2 border rounded-md cursor-pointer transition-colors hover:bg-accent hover:border-accent-foreground/20 ${
                        selectedCategoryId === category.id ? "bg-accent border-accent-foreground/20" : "bg-card"
                      }`}
                      onClick={() => setSelectedCategoryId(category.id)}
                    >
                      {category.name}
                    </div>
                  ))
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Toggle button for showing/hiding values */}
        <div className="flex justify-end mb-4">
          <button
            onClick={toggleShowValues}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-md"
          >
            {showValues ? "Ocultar Valores" : "Mostrar Valores"}
          </button>
        </div>

        {/* Subcategory Analysis Table */}
        {selectedCategoryId && (
          <div className="mb-8">
            <h2 className="text-xl font-bold mb-4">
              Análise de {selectedCategoryName}
            </h2>
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
                    <TableCell className="text-right tabular-nums">
                      {showValues ? formatCurrency(item.amount) : "•••••••"}
                    </TableCell>
                    <TableCell className="text-right tabular-nums">
                      {showValues ? `${item.percentage.toFixed(2)}%` : "•••••••"}
                    </TableCell>
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
                  <TableCell className="text-right tabular-nums">
                    {showValues ? formatCurrency(totalAmount) : "•••••••"}
                  </TableCell>
                  <TableCell className="text-right tabular-nums">
                    {showValues ? "100%" : "•••••••"}
                  </TableCell>
                  <TableCell></TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        )}

        {/* Category Comparison Section */}
        <CategoryComparison 
          categories={categories}
          transactions={transactions}
          startDate={startDate}
          endDate={endDate}
          activeTab={activeTab}
          showValues={showValues}
        />
      </main>
    </div>
  );
};

export default CategoryAnalysis;
