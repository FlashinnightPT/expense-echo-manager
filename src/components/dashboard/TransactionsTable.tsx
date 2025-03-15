
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CircleDollarSign } from "lucide-react";
import DataTable from "@/components/tables/DataTable";
import { Transaction } from "@/utils/mockData";
import { ReactNode } from "react";
import { exportToCSV, prepareTransactionsForExport } from "@/utils/exportUtils";
import { toast } from "sonner";

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
  // Estado local para acompanhar as transações mais recentes
  const [recentTransactions, setRecentTransactions] = useState<Transaction[]>([]);
  const [allTransactions, setAllTransactions] = useState<Transaction[]>([]);

  // Atualiza os dados quando as transações mudam
  useEffect(() => {
    // Ordenar transações por data (mais recentes primeiro)
    const sortedTransactions = [...transactions].sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    );
    
    // Definir as transações mais recentes (5 mais recentes)
    setRecentTransactions(sortedTransactions.slice(0, 5));
    
    // Definir todas as transações
    setAllTransactions(sortedTransactions);
    
    console.log("Transações atualizadas:", sortedTransactions.length);
  }, [transactions]);
  
  // Handle export transactions
  const handleExportTransactions = (transactionsToExport: Transaction[]) => {
    try {
      const exportData = prepareTransactionsForExport(transactionsToExport);
      exportToCSV(exportData, `transacoes_${new Date().toISOString().split('T')[0]}`);
      toast.success("Transações exportadas com sucesso");
    } catch (error) {
      console.error("Error exporting transactions:", error);
      toast.error("Erro ao exportar transações");
    }
  };

  return (
    <div className="animate-fade-in-up animation-delay-900 mb-8">
      <Tabs defaultValue="recent">
        <div className="flex justify-between items-center mb-4">
          <TabsList>
            <TabsTrigger value="recent">Transações Recentes</TabsTrigger>
            <TabsTrigger value="all">Todas as Transações</TabsTrigger>
          </TabsList>
          <Button 
            size="sm" 
            onClick={() => handleExportTransactions(allTransactions)}
          >
            <CircleDollarSign className="h-4 w-4 mr-2" />
            Exportar Dados
          </Button>
        </div>
        
        <TabsContent value="recent" className="m-0">
          <DataTable 
            data={recentTransactions}
            columns={transactionColumns}
            searchable
            searchPlaceholder="Pesquisar..."
            cardClassName="animate-fade-in-up animation-delay-1000 glass"
            emptyMessage="Não há transações recentes"
          />
        </TabsContent>
        
        <TabsContent value="all" className="m-0">
          <DataTable 
            data={allTransactions}
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
