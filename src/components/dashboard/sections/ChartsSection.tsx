
import { FC } from "react";
import MonthlyOverview from "@/components/dashboard/MonthlyOverview";
import YearlyOverview from "@/components/dashboard/YearlyOverview";
import { MonthlyData } from "@/utils/mockData";

interface ChartsSectionProps {
  monthlySummary: {
    income: number;
    expense: number;
    balance: number;
    differenceRate: number;
  };
  yearlySummary: {
    income: number;
    expense: number;
    balance: number;
    differenceRate: number;
  };
  monthlyChartData: MonthlyData[];
  selectedMonth: number;
  selectedYear: number;
  availableYears: number[];
  showValues: boolean;
  onMonthChange: (month: number) => void;
  onYearChange: (year: number) => void;
}

const ChartsSection: FC<ChartsSectionProps> = ({
  monthlySummary,
  yearlySummary,
  monthlyChartData,
  selectedMonth,
  selectedYear,
  availableYears,
  showValues,
  onMonthChange,
  onYearChange
}) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
      <MonthlyOverview 
        monthlySummary={monthlySummary}
        monthlyChartData={monthlyChartData}
        selectedMonth={selectedMonth}
        selectedYear={selectedYear}
        availableYears={availableYears}
        onMonthChange={onMonthChange}
        onYearChange={onYearChange}
        showValues={showValues}
      />
      
      <YearlyOverview 
        yearlySummary={yearlySummary}
        selectedYear={selectedYear}
        showValues={showValues}
      />
    </div>
  );
};

export default ChartsSection;
