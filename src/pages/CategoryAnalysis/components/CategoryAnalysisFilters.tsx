
import React from "react";
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

interface CategoryAnalysisFiltersProps {
  activeTab: "expense" | "income";
  setActiveTab: (value: "expense" | "income") => void;
  selectedYear: number;
  setSelectedYear: (year: number) => void;
  selectedMonth: number | null;
  setSelectedMonth: (month: number | null) => void;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  availableYears: number[];
}

const CategoryAnalysisFilters = ({
  activeTab,
  setActiveTab,
  selectedYear,
  setSelectedYear,
  selectedMonth,
  setSelectedMonth,
  searchTerm,
  setSearchTerm,
  availableYears
}: CategoryAnalysisFiltersProps) => {
  return (
    <Card className="mb-6">
      <CardContent className="pt-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Tabs for type (Income/Expense) */}
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

          {/* Year Selector */}
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
                    <SelectItem key={year.toString()} value={year.toString()}>
                      {String(year)}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          </div>

          {/* Month Selector */}
          <div>
            <Label htmlFor="month">Mês (opcional)</Label>
            <Select 
              value={selectedMonth?.toString() ?? "null"} 
              onValueChange={(value) => setSelectedMonth(value === "null" ? null : Number(value))}
            >
              <SelectTrigger id="month">
                <SelectValue placeholder="Todos os meses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="null">Todos os meses</SelectItem>
                {Array.from({ length: 12 }, (_, i) => i + 1).map((month) => (
                  <SelectItem key={month.toString()} value={month.toString()}>
                    {new Date(2000, month - 1, 1).toLocaleString('pt-PT', { month: 'long' })}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Category Search */}
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
      </CardContent>
    </Card>
  );
};

export default CategoryAnalysisFilters;
