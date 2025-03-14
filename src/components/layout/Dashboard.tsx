
import { useState } from "react";
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown, 
  PiggyBank, 
  Landmark,
  CircleDollarSign,
  Plus
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  transactions, 
  flattenedCategories,
  Transaction,
  getCategoryById
} from "@/utils/mockData";
import { 
  formatCurrency, 
  calculateMonthlySummary,
  calculateYearlySummary,
  getMonthName
} from "@/utils/financialCalculations";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";

const Dashboard = () => {
  const [selectedYear, setSelectedYear] = useState(2024);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  
  // Get current month and year data
  const currentMonthData = monthlyData.find(
    (data) => data.year === selectedYear && data.month === selectedMonth
  );
  
  const currentYearData = yearlyData.find(
    (data) => data.year === selectedYear
  );
  
  // Calculate financial summaries
  const monthlySummary = currentMonthData 
    ? calculateMonthlySummary(currentMonthData)
    : {
        income: 0,
        expense: 0,
        savings: 0,
        investment: 0,
        balance: 0,
        savingsRate: 0
      };
    
  const yearlySummary = currentYearData
    ? calculateYearlySummary(currentYearData)
    : {
        income: 0,
        expense: 0,
        savings: 0,
        investment: 0,
        balance: 0,
        savingsRate: 0
      };
  
  // Recent transactions for the table
  const recentTransactions = [...transactions]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);
  
  // Table columns definition
  const transactionColumns = [
    {
      id: "date",
      header: "Date",
      accessorFn: (row: Transaction) => (
        <span>{new Date(row.date).toLocaleDateString("pt-PT")}</span>
      ),
      sortable: true
    },
    {
      id: "description",
      header: "Description",
      accessorFn: (row: Transaction) => (
        <span className="font-medium">{row.description}</span>
      ),
      sortable: true
    },
    {
      id: "category",
      header: "Category",
      accessorFn: (row: Transaction) => {
        const category = getCategoryById(row.categoryId);
        return <span>{category?.name || "Uncategorized"}</span>;
      },
      sortable: true
    },
    {
      id: "type",
      header: "Type",
      accessorFn: (row: Transaction) => {
        const badgeClasses = {
          income: "bg-finance-income/10 text-finance-income border-finance-income/20",
          expense: "bg-finance-expense/10 text-finance-expense border-finance-expense/20",
          savings: "bg-finance-savings/10 text-finance-savings border-finance-savings/20",
          investment: "bg-finance-investment/10 text-finance-investment border-finance-investment/20"
        };
        
        return (
          <span className={`px-2 py-1 rounded-full text-xs font-medium border ${badgeClasses[row.type]}`}>
            {row.type.charAt(0).toUpperCase() + row.type.slice(1)}
          </span>
        );
      },
      sortable: true
    },
    {
      id: "amount",
      header: "Amount",
      accessorFn: (row: Transaction) => (
        <span className="font-semibold tabular-nums">
          {formatCurrency(row.amount)}
        </span>
      ),
      sortable: true,
      className: "text-right"
    }
  ];

  return (
    <div className="container mx-auto px-4 py-8 pt-24">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold animate-fade-in-up">Dashboard</h1>
          <p className="text-muted-foreground mt-1 animate-fade-in-up animation-delay-100">
            Overview of your financial data
          </p>
        </div>
        
        <div className="flex space-x-2 mt-4 md:mt-0">
          <Dialog>
            <DialogTrigger asChild>
              <Button className="animate-fade-in-up animation-delay-200">
                <Plus className="h-4 w-4 mr-2" />
                Add Transaction
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[550px]">
              <TransactionForm />
            </DialogContent>
          </Dialog>
          
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" className="animate-fade-in-up animation-delay-300">
                <Plus className="h-4 w-4 mr-2" />
                Add Category
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[550px]">
              <CategoryForm />
            </DialogContent>
          </Dialog>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card animate animationDelay={100} glassEffect>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <CardDescription>Income</CardDescription>
                <div className="text-2xl font-bold mt-2">
                  <AnimatedNumber 
                    value={monthlySummary.income} 
                    formatter={(val) => formatCurrency(val)} 
                  />
                </div>
                <CardDescription className="mt-1">
                  This month
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
                <CardDescription>Expenses</CardDescription>
                <div className="text-2xl font-bold mt-2">
                  <AnimatedNumber 
                    value={monthlySummary.expense} 
                    formatter={(val) => formatCurrency(val)} 
                  />
                </div>
                <CardDescription className="mt-1">
                  This month
                </CardDescription>
              </div>
              <div className="h-12 w-12 rounded-full bg-finance-expense/10 flex items-center justify-center">
                <TrendingDown className="h-6 w-6 text-finance-expense" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card animate animationDelay={300} glassEffect>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <CardDescription>Savings</CardDescription>
                <div className="text-2xl font-bold mt-2">
                  <AnimatedNumber 
                    value={monthlySummary.savings} 
                    formatter={(val) => formatCurrency(val)} 
                  />
                </div>
                <CardDescription className="mt-1">
                  This month
                </CardDescription>
              </div>
              <div className="h-12 w-12 rounded-full bg-finance-savings/10 flex items-center justify-center">
                <PiggyBank className="h-6 w-6 text-finance-savings" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card animate animationDelay={400} glassEffect>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <CardDescription>Investments</CardDescription>
                <div className="text-2xl font-bold mt-2">
                  <AnimatedNumber 
                    value={monthlySummary.investment} 
                    formatter={(val) => formatCurrency(val)} 
                  />
                </div>
                <CardDescription className="mt-1">
                  This month
                </CardDescription>
              </div>
              <div className="h-12 w-12 rounded-full bg-finance-investment/10 flex items-center justify-center">
                <Landmark className="h-6 w-6 text-finance-investment" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        <Card className="lg:col-span-2 animate-fade-in-up animation-delay-500" glassEffect>
          <CardHeader>
            <CardTitle>Monthly Summary</CardTitle>
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
                    <SelectValue placeholder="Month" />
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
                    <SelectValue placeholder="Year" />
                  </SelectTrigger>
                  <SelectContent>
                    {[2023, 2024].map((year) => (
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
                  <CardDescription>Balance</CardDescription>
                  <div className="text-3xl font-bold tabular-nums">
                    <AnimatedNumber 
                      value={monthlySummary.balance} 
                      formatter={(val) => formatCurrency(val)} 
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <CardDescription>Savings Rate</CardDescription>
                  <div className="text-3xl font-bold tabular-nums">
                    <AnimatedNumber 
                      value={monthlySummary.savingsRate} 
                      formatter={(val) => `${val.toFixed(1)}%`} 
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <CardDescription>Yearly Projection</CardDescription>
                  <div className="text-3xl font-bold tabular-nums">
                    <AnimatedNumber 
                      value={monthlySummary.balance * 12} 
                      formatter={(val) => formatCurrency(val)} 
                    />
                  </div>
                </div>
              </div>
              
              <Separator />
              
              <MonthlyChart data={monthlyData} year={selectedYear} />
            </div>
          </CardContent>
        </Card>
        
        <Card className="animate-fade-in-up animation-delay-600" glassEffect>
          <CardHeader>
            <CardTitle>Yearly Summary</CardTitle>
            <CardDescription>{selectedYear}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <CardDescription>Income</CardDescription>
                    <span className="text-sm font-medium text-finance-income">
                      {formatCurrency(yearlySummary.income)}
                    </span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-finance-income rounded-full transition-all duration-500"
                      style={{ width: '100%' }}
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <CardDescription>Expenses</CardDescription>
                    <span className="text-sm font-medium text-finance-expense">
                      {formatCurrency(yearlySummary.expense)}
                    </span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-finance-expense rounded-full transition-all duration-500"
                      style={{ 
                        width: `${yearlySummary.income > 0 
                          ? (yearlySummary.expense / yearlySummary.income) * 100 
                          : 0}%` 
                      }}
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <CardDescription>Savings</CardDescription>
                    <span className="text-sm font-medium text-finance-savings">
                      {formatCurrency(yearlySummary.savings)}
                    </span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-finance-savings rounded-full transition-all duration-500"
                      style={{ 
                        width: `${yearlySummary.income > 0 
                          ? (yearlySummary.savings / yearlySummary.income) * 100 
                          : 0}%` 
                      }}
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <CardDescription>Investments</CardDescription>
                    <span className="text-sm font-medium text-finance-investment">
                      {formatCurrency(yearlySummary.investment)}
                    </span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-finance-investment rounded-full transition-all duration-500"
                      style={{ 
                        width: `${yearlySummary.income > 0 
                          ? (yearlySummary.investment / yearlySummary.income) * 100 
                          : 0}%` 
                      }}
                    />
                  </div>
                </div>
              </div>
              
              <Separator />
              
              <div className="space-y-4">
                <div>
                  <CardDescription>Balance</CardDescription>
                  <div className="text-3xl font-bold tabular-nums mt-1">
                    <AnimatedNumber 
                      value={yearlySummary.balance} 
                      formatter={(val) => formatCurrency(val)} 
                    />
                  </div>
                </div>
                
                <div>
                  <CardDescription>Savings Rate</CardDescription>
                  <div className="text-3xl font-bold tabular-nums mt-1">
                    <AnimatedNumber 
                      value={yearlySummary.savingsRate} 
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
        <YearlyChart data={yearlyData} className="lg:col-span-2 animate-fade-in-up animation-delay-700" />
        
        <Card className="animate-fade-in-up animation-delay-800">
          <CardHeader>
            <CardTitle>Categories</CardTitle>
            <CardDescription>Top-level categories</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {flattenedCategories
                .filter(category => category.level === 1)
                .map(category => (
                  <div key={category.id} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">{category.name}</span>
                      <span className="text-xs text-muted-foreground capitalize">
                        {category.type}
                      </span>
                    </div>
                    <div 
                      className="h-1 rounded-full"
                      style={{
                        background: `hsl(var(--finance-${category.type}))`
                      }}
                    />
                  </div>
                ))}
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full">
              <Plus className="h-4 w-4 mr-2" />
              Manage Categories
            </Button>
          </CardFooter>
        </Card>
      </div>
      
      <div className="animate-fade-in-up animation-delay-900">
        <Tabs defaultValue="recent">
          <div className="flex justify-between items-center mb-4">
            <TabsList>
              <TabsTrigger value="recent">Recent Transactions</TabsTrigger>
              <TabsTrigger value="all">All Transactions</TabsTrigger>
            </TabsList>
            <Button size="sm">
              <CircleDollarSign className="h-4 w-4 mr-2" />
              Export Data
            </Button>
          </div>
          
          <TabsContent value="recent" className="m-0">
            <DataTable 
              data={recentTransactions}
              columns={transactionColumns}
              searchable
              cardClassName="animate-fade-in-up animation-delay-1000 glass"
            />
          </TabsContent>
          
          <TabsContent value="all" className="m-0">
            <DataTable 
              data={transactions}
              columns={transactionColumns}
              searchable
              cardClassName="animate-fade-in-up animation-delay-1000 glass"
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Dashboard;
