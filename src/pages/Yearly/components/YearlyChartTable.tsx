
import React from "react";
import { Card } from "@/components/ui-custom/Card";
import YearlyChart from "@/components/charts/YearlyChart";
import DataTable from "@/components/tables/DataTable";

interface YearlyChartTableProps {
  filteredData: any[];
  tableData: any[];
  columns: any[];
  showValues: boolean;
}

const YearlyChartTable: React.FC<YearlyChartTableProps> = ({
  filteredData,
  tableData,
  columns,
  showValues
}) => {
  return (
    <>
      <div className="mb-8">
        <Card>
          <YearlyChart data={filteredData} className="w-full" showValues={showValues} />
        </Card>
      </div>
      
      <div className="mb-8">
        <DataTable 
          data={tableData} 
          columns={columns} 
          title="Resumo Anual"
          emptyMessage="Selecione pelo menos um ano para ver os dados"
        />
      </div>
    </>
  );
};

export default YearlyChartTable;
