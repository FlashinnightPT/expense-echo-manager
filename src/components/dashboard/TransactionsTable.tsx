
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CircleDollarSign } from "lucide-react";
import DataTable from "@/components/tables/DataTable";
import { Transaction } from "@/utils/mockData";
import { ReactNode } from "react";

interface TransactionsTableProps {
  transactions: Transaction[];
  transactionColumns: {
    id: string;
    header: string;
    accessorFn: (row: Transaction) => ReactNode;
    sortable?: boolean;
    className?: string;
  }[];
}

const TransactionsTable = ({ 
  transactions, 
  transactionColumns 
}: TransactionsTableProps) => {
  return (
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
            pagination
            itemsPerPage={10}
            searchPlaceholder="Pesquisar..."
            cardClassName="animate-fade-in-up animation-delay-1000 glass"
            emptyMessage="Não há transações cadastradas"
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TransactionsTable;
