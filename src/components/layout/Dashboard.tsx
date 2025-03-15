import { useState, useEffect, useMemo } from "react";
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown, 
  CircleDollarSign,
  Plus,
  Trash2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui-custom/Card";
import AnimatedNumber from "@/components/ui-custom/AnimatedNumber";
import MonthlyChart from "@/components/charts/MonthlyChart";
import YearlyChart from "@/components/charts/YearlyChart";
import DataTable from "@/components/tables/DataTable";
import CategoryForm from "@/components/forms/CategoryForm";
import TransactionForm from "@/components/forms/TransactionForm";
import { 
  monthlyData, 
  yearlyData, 
  flattenedCategories,
  Transaction,
  TransactionCategory
} from "@/utils/mockData";
import { 
  formatCurrency, 
  calculateMonthlySummary,
  calculateYearlySummary,
  getMonthName
} from "@/utils/financialCalculations";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "sonner";

const Dashboard = () => {
  const currentDate = new Date();
  const [selectedYear, setSelectedYear] = useState(currentDate.getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(currentDate.getMonth() + 1);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [openClearDialog, setOpenClearDialog] = useState(false);
  
  useEffect(() => {
    const storedTransactions = localStorage.getItem('transactions');
    if (storedTransactions) {
      setTransactions(JSON.parse(storedTransactions));
    } else {
      localStorage.setItem('transactions', JSON.stringify([]));
    }
    
    const storedCategories = localStorage.getItem('categories');
    if (storedCategories) {
      setCategories(JSON.parse(storedCategories));
    } else {
      localStorage.setItem('categories', JSON.stringify([]));
    }
  }, []);
  
  const availableYears = useMemo(() => {
    const years = new Set<number>();
    
    if (transactions.length === 0) {
      years.add(currentDate.getFullYear());
      return Array.from(years).sort((a, b) => b - a);
    }
    
    transactions.forEach(transaction => {
      const transactionYear = new Date(transaction.date).getFullYear();
      years.add(transactionYear);
    });
    
    return Array.from(years).sort((a, b) => b - a);
  }, [transactions]);
  
  useEffect(() => {
    if (availableYears.length > 0 && !availableYears.includes(selectedYear)) {
      setSelectedYear(availableYears[0]);
    }
  }, [availableYears, selectedYear]);
  
  const emptySummary = {
    income: 0,
    expense: 0,
    balance: 0,
    differenceRate: 0
  };
  
  const getCategoryById = (categoryId: string) => {
    return categories.find(cat => cat.id === categoryId);
  };
  
  const getCategoryPath = (categoryId: string, categories: any[]) => {
    const category = categories.find(cat => cat.id === categoryId);
    if (!category) return [];
    
    const path = [category.name];
    let currentCategory = category;
    
    while (currentCategory.parentId) {
      const parentCategory = categories.find(cat => cat.id === currentCategory.parentId);
      if (!parentCategory) break;
      
      path.unshift(parentCategory.name);
      currentCategory = parentCategory;
    }
    
    return path;
  };
  
  const transactionColumns = [
    {
      id: "date",
      header: "Data",
      accessorFn: (row: Transaction) => (
        <span>{new Date(row.date).toLocaleDateString("pt-PT")}</span>
      ),
      sortable: true
    },
    {
      id: "description",
      header: "Descrição",
      accessorFn: (row: Transaction) => (
        <span className="font-medium">{row.description}</span>
      ),
      sortable: true
    },
    {
      id: "category",
      header: "Categoria",
      accessorFn: (row: Transaction) => {
        const category = getCategoryById(row.categoryId);
        if (!category) return <span>Sem Categoria</span>;
        
        const path = getCategoryPath(row.categoryId, categories);
        return <span>{path.join(' > ')}</span>;
      },
      sortable: true
    },
    {
      id: "type",
      header: "Tipo",
      accessorFn: (row: Transaction) => {
        const badgeClasses = {
          income: "bg-finance-income/10 text-finance-income border-finance-income/20",
          expense: "bg-finance-expense/10 text-finance-expense border-finance-expense/20"
        };
        
        const typeNames = {
          income: "Receita",
          expense: "Despesa"
        };
        
        return (
          <span className={`px-2 py-1 rounded-full text-xs font-medium border ${badgeClasses[row.type]}`}>
            {typeNames[row.type]}
          </span>
        );
      },
      sortable: true
    },
    {
      id: "amount",
      header: "Valor",
      accessorFn: (row: Transaction) => (
        <span className="font-semibold tabular-nums">
          {formatCurrency(row.amount)}
        </span>
      ),
      sortable: true,
      className: "text-right"
    }
  ];

  const handleClearAllData = () => {
    setTransactions([]);
    setCategories([]);
    localStorage.setItem('transactions', JSON.stringify([]));
    localStorage.setItem('categories', JSON.stringify([]));
    setOpenClearDialog(false);
    toast.success("Todos os dados foram apagados com sucesso!");
  };

  const handleSaveCategory = (category: Partial<TransactionCategory>) => {
    const newCategory: TransactionCategory = {
      id: `${category.type}-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      name: category.name || "",
      type: category.type || "expense",
      level: category.level || 1,
      parentId: category.parentId,
    };

    const updatedCategories = [...categories, newCategory];
    
    localStorage.setItem('categories', JSON.stringify(updatedCategories));
    setCategories(updatedCategories);
    
    console.log("Categories saved to localStorage:", updatedCategories);
    
    toast.success("Categoria adicionada com sucesso");
  };

  const handleSaveTransaction = (transaction: Partial<Transaction>) => {
    const newTransaction: Transaction = {
      id: `transaction-${Date.now()}`,
      description: transaction.description || (transaction.type === "income" ? "Receita" : "Despesa"),
      amount: transaction.amount || 0,
      date: transaction.date || new Date().toISOString().split('T')[0],
      categoryId: transaction.categoryId || "",
      type: transaction.type || "expense"
    };

    const updatedTransactions = [...transactions, newTransaction];
    
    localStorage.setItem('transactions', JSON.stringify(updatedTransactions));
    setTransactions(updatedTransactions);
    
    toast.success("Transação adicionada com sucesso");
  };

  const filteredTransactions = useMemo(() => {
    return transactions.filter(transaction => {
      const transactionDate = new Date(transaction.date);
      const transactionYear = transactionDate.getFullYear();
      const transactionMonth = transactionDate.getMonth() + 1;
      
      return transactionYear === selectedYear && transactionMonth === selectedMonth;
    });
  }, [transactions, selectedYear, selectedMonth]);

  const monthlySummary = useMemo(() => {
    const income = filteredTransactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
      
    const expense = filteredTransactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);
      
    const balance = income - expense;
    const differenceRate = income > 0 ? ((income - expense) / income) * 100 : 0;
    
    return {
      income,
      expense,
      balance,
      differenceRate
    };
  }, [filteredTransactions]);

  const yearlySummary = useMemo(() => {
    const yearTransactions = transactions.filter(transaction => {
      const transactionDate = new Date(transaction.date);
      const transactionYear = transactionDate.getFullYear();
      
      return transactionYear === selectedYear;
    });
    
    const income = yearTransactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
      
    const expense = yearTransactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);
      
    const balance = income - expense;
    const differenceRate = income > 0 ? ((income - expense) / income) * 100 : 0;
    
    return {
      income,
      expense,
      balance,
      differenceRate
    };
  }, [transactions, selectedYear]);

  return (
    <div className="container mx-auto px-4 py-8 pt-24">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold animate-fade-in-up">Painel</h1>
          <p className="text-muted-foreground mt-1 animate-fade-in-up animation-delay-100">
            Visão geral dos seus dados financeiros
          </p>
        </div>
        
        <div className="flex space-x-2 mt-4 md:mt-0">
          <Dialog>
            <DialogTrigger asChild>
              <Button className="animate-fade-in-up animation-delay-200">
                <Plus className="h-4 w-4 mr-2" />
                Adicionar Transação
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[550px]">
              <DialogHeader>
                <DialogTitle>Adicionar Nova Transação</DialogTitle>
                <DialogDescription>
                  Preencha os campos abaixo para adicionar uma nova transação.
                </DialogDescription>
              </DialogHeader>
              <TransactionForm onSave={handleSaveTransaction} />
            </DialogContent>
          </Dialog>
          
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" className="animate-fade-in-up animation-delay-300">
                <Plus className="h-4 w-4 mr-2" />
                Adicionar Categoria
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[550px]">
              <DialogHeader>
                <DialogTitle>Adicionar Nova Categoria</DialogTitle>
                <DialogDescription>
                  Adicione uma nova categoria para organizar suas transações.
                </DialogDescription>
              </DialogHeader>
              <CategoryForm onSave={handleSaveCategory} categoryList={categories} />
            </DialogContent>
          </Dialog>
          
          <Dialog open={openClearDialog} onOpenChange={setOpenClearDialog}>
            <DialogTrigger asChild>
              <Button variant="destructive" className="animate-fade-in-up animation-delay-400">
                <Trash2 className="h-4 w-4 mr-2" />
                Limpar Dados
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Apagar Todos os Dados</DialogTitle>
                <DialogDescription>
                  Esta ação irá apagar todas as categorias e transações. Esta ação não pode ser revertida.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button variant="outline" onClick={() => setOpenClearDialog(false)}>Cancelar</Button>
                <Button variant="destructive" onClick={handleClearAllData}>Apagar Dados</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <Card animate animationDelay={100} glassEffect>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <CardDescription>Receitas</CardDescription>
                <div className="text-2xl font-bold mt-2">
                  <AnimatedNumber 
                    value={monthlySummary.income} 
                    formatter={(val) => formatCurrency(val)} 
                  />
                </div>
                <CardDescription className="mt-1">
                  Este mês
                </CardDescription>
              </div>
              <div className="h-12 w-12 rounded-full bg-finance-income/10 flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-finance-income" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card animate animationDelay={200} glassEffect>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <CardDescription>Despesas</CardDescription>
                <div className="text-2xl font-bold mt-2">
                  <AnimatedNumber 
                    value={monthlySummary.expense} 
                    formatter={(val) => formatCurrency(val)} 
                  />
                </div>
                <CardDescription className="mt-1">
                  Este mês
                </CardDescription>
              </div>
              <div className="h-12 w-12 rounded-full bg-finance-expense/10 flex items-center justify-center">
                <TrendingDown className="h-6 w-6 text-finance-expense" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        <Card className="lg:col-span-2 animate-fade-in-up animation-delay-500" glassEffect>
          <CardHeader>
            <CardTitle>Resumo Mensal</CardTitle>
            <div className="flex items-center justify-between">
              <CardDescription>
                {getMonthName(selectedMonth)} {selectedYear}
              </CardDescription>
              <div className="flex space-x-2">
                <Select
                  value={selectedMonth.toString()}
                  onValueChange={(value) => setSelectedMonth(parseInt(value))}
                >
                  <SelectTrigger className="w-[120px]">
                    <SelectValue placeholder="Mês" />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from({ length: 12 }, (_, i) => i + 1).map((month) => (
                      <SelectItem key={month} value={month.toString()}>
                        {getMonthName(month)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                <Select
                  value={selectedYear.toString()}
                  onValueChange={(value) => setSelectedYear(parseInt(value))}
                >
                  <SelectTrigger className="w-[100px]">
                    <SelectValue placeholder="Ano" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableYears.map((year) => (
                      <SelectItem key={year} value={year.toString()}>
                        {year}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <CardDescription>Saldo</CardDescription>
                  <div className="text-3xl font-bold tabular-nums">
                    <AnimatedNumber 
                      value={monthlySummary.balance} 
                      formatter={(val) => formatCurrency(val)} 
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <CardDescription>Diferença</CardDescription>
                  <div className="text-3xl font-bold tabular-nums">
                    <AnimatedNumber 
                      value={monthlySummary.differenceRate} 
                      formatter={(val) => `${val.toFixed(1)}%`} 
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <CardDescription>Projeção Anual</CardDescription>
                  <div className="text-3xl font-bold tabular-nums">
                    <AnimatedNumber 
                      value={monthlySummary.balance * 12} 
                      formatter={(val) => formatCurrency(val)} 
                    />
                  </div>
                </div>
              </div>
              
              <Separator />
              
              <MonthlyChart data={filteredTransactions} year={selectedYear} />
            </div>
          </CardContent>
        </Card>
        
        <Card className="animate-fade-in-up animation-delay-600" glassEffect>
          <CardHeader>
            <CardTitle>Resumo Anual</CardTitle>
            <CardDescription>{selectedYear}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <CardDescription>Receitas</CardDescription>
                    <span className="text-sm font-medium text-finance-income">
                      {formatCurrency(yearlySummary.income)}
                    </span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-finance-income rounded-full transition-all duration-500"
                      style={{ width: `${yearlySummary.income > 0 ? (yearlySummary.income / Math.max(yearlySummary.income, yearlySummary.expense)) * 100 : 0}%` }}
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <CardDescription>Despesas</CardDescription>
                    <span className="text-sm font-medium text-finance-expense">
                      {formatCurrency(yearlySummary.expense)}
                    </span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-finance-expense rounded-full transition-all duration-500"
                      style={{ width: `${yearlySummary.expense > 0 ? (yearlySummary.expense / Math.max(yearlySummary.income, yearlySummary.expense)) * 100 : 0}%` }}
                    />
                  </div>
                </div>
              </div>
              
              <Separator />
              
              <div className="space-y-4">
                <div>
                  <CardDescription>Saldo</CardDescription>
                  <div className="text-3xl font-bold tabular-nums mt-1">
                    <AnimatedNumber 
                      value={yearlySummary.balance} 
                      formatter={(val) => formatCurrency(val)} 
                    />
                  </div>
                </div>
                
                <div>
                  <CardDescription>Diferença</CardDescription>
                  <div className="text-3xl font-bold tabular-nums mt-1">
                    <AnimatedNumber 
                      value={yearlySummary.differenceRate} 
                      formatter={(val) => `${val.toFixed(1)}%`} 
                    />
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        <YearlyChart data={transactions} className="lg:col-span-3 animate-fade-in-up animation-delay-700" />
      </div>
      
      <div className="animate-fade-in-up animation-delay-900">
        <Tabs defaultValue="recent">
          <div className="flex justify-between items-center mb-4">
            <TabsList>
              <TabsTrigger value="recent">Transações Recentes</TabsTrigger>
              <TabsTrigger value="all">Todas as Transações</TabsTrigger>
            </TabsList>
            <Button size="sm">
              <CircleDollarSign className="h-4 w-4 mr-2" />
              Exportar Dados
            </Button>
          </div>
          
          <TabsContent value="recent" className="m-0">
            <DataTable 
              data={transactions.slice(0, 5)}
              columns={transactionColumns}
              searchable
              searchPlaceholder="Pesquisar..."
              cardClassName="animate-fade-in-up animation-delay-1000 glass"
              emptyMessage="Não há transações recentes"
            />
          </TabsContent>
          
          <TabsContent value="all" className="m-0">
            <DataTable 
              data={transactions}
              columns={transactionColumns}
              searchable
              searchPlaceholder="Pesquisar..."
              cardClassName="animate-fade-in-up animation-delay-1000 glass"
              emptyMessage="Não há transações cadastradas"
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Dashboard;
