
import { FC } from "react";
import YearlyChart from "@/components/charts/YearlyChart";
import { YearlyData } from "@/utils/mockData";

interface YearlyChartSectionProps {
  yearlyChartData: YearlyData[];
  showValues: boolean;
}

const YearlyChartSection: FC<YearlyChartSectionProps> = ({ yearlyChartData, showValues }) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
      <YearlyChart 
        data={yearlyChartData} 
        showValues={showValues}
        className="lg:col-span-3 animate-fade-in-up animation-delay-700" 
      />
    </div>
  );
};

export default YearlyChartSection;
