
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { DatabaseIcon, RefreshCw, UsersIcon, AlertTriangle } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { testConnection, query } from "@/integrations/mariadb/client";
import { toast } from "sonner";

interface DatabaseConnectionTestProps {
  className?: string;
}

const DatabaseConnectionTest = ({ className }: DatabaseConnectionTestProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isUserLoading, setIsUserLoading] = useState(false);
  const [lastTestTime, setLastTestTime] = useState<string | null>(null);
  const [userCount, setUserCount] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleTestConnection = async () => {
    setIsLoading(true);
    setError(null);
    try {
      // Test connection with MariaDB
      const result = await testConnection();
      
      // Print detailed information in console
      console.log("Database connection test result:", result);
      
      if (result) {
        toast.success("Database connection successful");
      } else {
        toast.error("Failed to connect to database");
        setError("Could not connect to the database");
      }
      
      // Update last test time
      setLastTestTime(new Date().toLocaleTimeString());
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Unknown error testing connection";
      setError(errorMessage);
      console.error("Connection test error:", err);
      toast.error("Connection test failed: " + errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTestUserConnection = async () => {
    setIsUserLoading(true);
    setError(null);
    try {
      // Test connection with users table
      const users = await query(`SELECT * FROM users`);
      const count = users ? users.length : 0;
      
      setUserCount(count);
      setLastTestTime(new Date().toLocaleTimeString());
      
      toast.success(`Successfully connected to users table. Found ${count} users.`);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Unknown error testing user connection";
      setError(errorMessage);
      console.error("User connection test error:", err);
      toast.error("User connection test failed: " + errorMessage);
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
          Database Connection Test
        </CardTitle>
        <CardDescription>
          Test communication with the database
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
              Use this function to verify if the application is correctly connected to the database.
              {import.meta.env.DEV && (
                <span className="block mt-2 p-2 bg-yellow-100 dark:bg-yellow-900/20 rounded text-yellow-800 dark:text-yellow-200">
                  Development Mode: Using browser-compatible mock database.
                </span>
              )}
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
                  Test Database Connection
                </>
              )}
            </Button>
          </TabsContent>
          
          <TabsContent value="users">
            <p className="text-sm text-muted-foreground mb-4">
              Use this function to verify communication with the users table.
              Results will show the count of registered users.
            </p>
            {userCount !== null && (
              <div className={`p-3 rounded-md mb-4 ${userCount > 0 ? "bg-green-100 dark:bg-green-900/20" : "bg-yellow-100 dark:bg-yellow-900/20"}`}>
                <p className="font-medium">User Information:</p>
                <p className="text-sm mt-1">
                  {userCount > 0 
                    ? `Total users: ${userCount}`
                    : "No users found in table. The table exists, but has no records."}
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
                  Checking users...
                </>
              ) : (
                <>
                  <UsersIcon className="h-4 w-4 mr-2" />
                  Verify Users
                </>
              )}
            </Button>
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="flex flex-col gap-2">
        <p className="text-xs text-muted-foreground w-full text-center">
          {import.meta.env.DEV 
            ? "Using browser-compatible mock database in development mode." 
            : "For more detailed queries, use a dedicated database client."}
        </p>
      </CardFooter>
    </Card>
  );
};

export default DatabaseConnectionTest;
