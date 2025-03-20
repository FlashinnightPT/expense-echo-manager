
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { testSupabaseConnection, printConnectionInfo, testUserConnection } from "@/utils/supabaseTestUtil";
import { DatabaseIcon, RefreshCw, UsersIcon } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface SupabaseConnectionTestProps {
  className?: string;
}

const SupabaseConnectionTest = ({ className }: SupabaseConnectionTestProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isUserLoading, setIsUserLoading] = useState(false);
  const [lastTestTime, setLastTestTime] = useState<string | null>(null);
  const [userCount, setUserCount] = useState<number | null>(null);

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

  const handleTestUserConnection = async () => {
    setIsUserLoading(true);
    try {
      // Testar conexão com a tabela de utilizadores
      const count = await testUserConnection();
      setUserCount(count);
      setLastTestTime(new Date().toLocaleTimeString());
    } catch (error) {
      console.error("Erro ao testar conexão com utilizadores:", error);
      setUserCount(null);
    } finally {
      setIsUserLoading(false);
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
        <Tabs defaultValue="general">
          <TabsList className="mb-4">
            <TabsTrigger value="general">Geral</TabsTrigger>
            <TabsTrigger value="users">Utilizadores</TabsTrigger>
          </TabsList>
          
          <TabsContent value="general">
            <p className="text-sm text-muted-foreground mb-4">
              Use esta função para verificar se a aplicação está conectada corretamente ao Supabase.
              Os resultados serão exibidos como notificações e detalhes adicionais no console do navegador.
            </p>
            {lastTestTime && (
              <p className="text-xs text-muted-foreground mt-2">
                Último teste: {lastTestTime}
              </p>
            )}
            <Button 
              variant="outline" 
              onClick={handleTestConnection} 
              disabled={isLoading}
              className="w-full mt-4"
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
          </TabsContent>
          
          <TabsContent value="users">
            <p className="text-sm text-muted-foreground mb-4">
              Use esta função para verificar a comunicação com a tabela de utilizadores no Supabase.
              Os resultados mostrarão a contagem de utilizadores cadastrados.
            </p>
            {userCount !== null && (
              <div className="p-3 bg-muted rounded-md mb-4">
                <p className="font-medium">Informações de Utilizadores:</p>
                <p className="text-sm mt-1">Total de utilizadores: {userCount}</p>
              </div>
            )}
            {lastTestTime && (
              <p className="text-xs text-muted-foreground mt-2">
                Último teste: {lastTestTime}
              </p>
            )}
            <Button 
              variant="outline" 
              onClick={handleTestUserConnection} 
              disabled={isUserLoading}
              className="w-full mt-4"
            >
              {isUserLoading ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Verificando utilizadores...
                </>
              ) : (
                <>
                  <UsersIcon className="h-4 w-4 mr-2" />
                  Verificar Utilizadores
                </>
              )}
            </Button>
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="flex flex-col gap-2">
        <p className="text-xs text-muted-foreground w-full text-center">
          Para consultas mais detalhadas, use o SQL Editor no painel administrativo do Supabase.
        </p>
      </CardFooter>
    </Card>
  );
};

export default SupabaseConnectionTest;
