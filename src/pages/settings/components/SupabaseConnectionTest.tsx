
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { testSupabaseConnection, printConnectionInfo, testUserConnection } from "@/utils/supabaseTestUtil";
import { DatabaseIcon, RefreshCw, UsersIcon, AlertTriangle } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface SupabaseConnectionTestProps {
  className?: string;
}

const SupabaseConnectionTest = ({ className }: SupabaseConnectionTestProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isUserLoading, setIsUserLoading] = useState(false);
  const [lastTestTime, setLastTestTime] = useState<string | null>(null);
  const [userCount, setUserCount] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleTestConnection = async () => {
    setIsLoading(true);
    setError(null);
    try {
      // Mock Supabase connection test (using our mock implementation)
      await testSupabaseConnection();
      
      // Print mock information
      printConnectionInfo();
      
      // Update last test time
      setLastTestTime(new Date().toLocaleTimeString());
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error testing connection");
      console.error("Error testing connection:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTestUserConnection = async () => {
    setIsUserLoading(true);
    setError(null);
    try {
      // Test mock user table connection
      const count = await testUserConnection();
      setUserCount(count);
      setLastTestTime(new Date().toLocaleTimeString());
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error testing user connection");
      console.error("Error testing user connection:", err);
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
          Test Mock Database Connection
        </CardTitle>
        <CardDescription>
          Test the connection to the mock database (Supabase references removed)
        </CardDescription>
      </CardHeader>
      <Separator />
      <CardContent className="pt-6">
        <Tabs defaultValue="general">
          <TabsList className="mb-4">
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
          </TabsList>
          
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          <TabsContent value="general">
            <p className="text-sm text-muted-foreground mb-4">
              This function tests if the application is properly connected to the mock database.
              Results will be displayed as notifications and additional details in the browser console.
            </p>
            {lastTestTime && (
              <p className="text-xs text-muted-foreground mt-2">
                Last test: {lastTestTime}
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
                  Testing connection...
                </>
              ) : (
                <>
                  <DatabaseIcon className="h-4 w-4 mr-2" />
                  Test Mock Database Connection
                </>
              )}
            </Button>
          </TabsContent>
          
          <TabsContent value="users">
            <p className="text-sm text-muted-foreground mb-4">
              This function tests the communication with the mock user table.
              Results will show the mock user count.
            </p>
            {userCount !== null && (
              <div className={`p-3 rounded-md mb-4 ${userCount > 0 ? "bg-green-100 dark:bg-green-900/20" : "bg-yellow-100 dark:bg-yellow-900/20"}`}>
                <p className="font-medium">Mock User Information:</p>
                <p className="text-sm mt-1">
                  {userCount > 0 
                    ? `Total mock users: ${userCount}`
                    : "No mock users found."}
                </p>
              </div>
            )}
            {lastTestTime && (
              <p className="text-xs text-muted-foreground mt-2">
                Last test: {lastTestTime}
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
                  Checking mock users...
                </>
              ) : (
                <>
                  <UsersIcon className="h-4 w-4 mr-2" />
                  Check Mock Users
                </>
              )}
            </Button>
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="flex flex-col gap-2">
        <p className="text-xs text-muted-foreground w-full text-center">
          This is a mock implementation for development. Supabase references removed.
        </p>
      </CardFooter>
    </Card>
  );
};

export default SupabaseConnectionTest;
