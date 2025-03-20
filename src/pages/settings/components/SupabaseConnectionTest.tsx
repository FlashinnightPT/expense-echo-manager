
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { testSupabaseConnection, printConnectionInfo } from "@/utils/supabaseTestUtil";
import { DatabaseIcon, RefreshCw } from "lucide-react";

interface SupabaseConnectionTestProps {
  className?: string;
}

const SupabaseConnectionTest = ({ className }: SupabaseConnectionTestProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [lastTestTime, setLastTestTime] = useState<string | null>(null);

  const handleTestConnection = async () => {
    setIsLoading(true);
    try {
      // Testar conexão com o Supabase
      await testSupabaseConnection();
      
      // Imprimir informações detalhadas no console
      printConnectionInfo();
      
      // Atualizar o horário do último teste
      setLastTestTime(new Date().toLocaleTimeString());
    } catch (error) {
      console.error("Erro ao testar conexão:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <DatabaseIcon className="h-5 w-5" />
          Teste de Conexão Supabase
        </CardTitle>
        <CardDescription>
          Teste a comunicação com o banco de dados Supabase
        </CardDescription>
      </CardHeader>
      <Separator />
      <CardContent className="pt-6">
        <p className="text-sm text-muted-foreground mb-4">
          Use esta função para verificar se a aplicação está conectada corretamente ao Supabase.
          Os resultados serão exibidos como notificações e detalhes adicionais no console do navegador.
        </p>
        {lastTestTime && (
          <p className="text-xs text-muted-foreground mt-2">
            Último teste: {lastTestTime}
          </p>
        )}
      </CardContent>
      <CardFooter>
        <Button 
          variant="outline" 
          onClick={handleTestConnection} 
          disabled={isLoading}
          className="w-full"
        >
          {isLoading ? (
            <>
              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
              Testando conexão...
            </>
          ) : (
            <>
              <DatabaseIcon className="h-4 w-4 mr-2" />
              Testar Conexão com Supabase
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default SupabaseConnectionTest;
