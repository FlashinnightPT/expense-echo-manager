
import { useState } from "react";
import { monthlyData } from "@/utils/mockData";
import MonthlyChart from "@/components/charts/MonthlyChart";
import Header from "@/components/layout/Header";
import { Card } from "@/components/ui-custom/Card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const Monthly = () => {
  const [selectedYear, setSelectedYear] = useState(2024);
  
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-4 py-8 pt-24">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">Análise Mensal</h1>
            <p className="text-muted-foreground mt-1">
              Visualize seus dados financeiros mês a mês
            </p>
          </div>
          <div>
            <Select
              value={selectedYear.toString()}
              onValueChange={(value) => setSelectedYear(parseInt(value))}
            >
              <SelectTrigger className="w-[100px]">
                <SelectValue placeholder="Ano" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="2023">2023</SelectItem>
                <SelectItem value="2024">2024</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div className="mb-8">
          <Card>
            <MonthlyChart data={monthlyData} year={selectedYear} />
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Monthly;
