
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { DatabaseIcon, RefreshCw, UsersIcon, AlertTriangle, CheckCircle, ServerIcon } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { testConnection, query, isDatabaseMock } from "@/integrations/mariadb/client";
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
  const [connectionSuccess, setConnectionSuccess] = useState<boolean | null>(null);
  const [serverInfo, setServerInfo] = useState<string>('94.46.168.180:3306/GFIN_DB');

  const handleTestConnection = async () => {
    setIsLoading(true);
    setError(null);
    setConnectionSuccess(null);
    
    try {
      console.log("Starting database connection test...");
      
      // Test connection with MariaDB
      const result = await testConnection();
      
      // Print detailed information in console
      console.log("Database connection test result:", result, "Using mock:", isDatabaseMock);
      
      if (result) {
        setConnectionSuccess(true);
        toast.success(isDatabaseMock 
          ? "Browser simulation: Database connection successful" 
          : "Database connection successful");
      } else {
        setConnectionSuccess(false);
        toast.error("Failed to connect to database");
        setError("Could not connect to the database");
      }
      
      // Update last test time
      setLastTestTime(new Date().toLocaleTimeString());
    } catch (err) {
      setConnectionSuccess(false);
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
          Test communication with MariaDB ({serverInfo})
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
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <ServerIcon className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Database Server</p>
                  <p className="text-xs text-muted-foreground">94.46.168.180:3306</p>
                </div>
              </div>
              
              <p className="text-sm text-muted-foreground">
                Use this function to verify if the application is correctly connected to the database.
                {isDatabaseMock && (
                  <span className="block mt-2 p-2 bg-yellow-100 dark:bg-yellow-900/20 rounded text-yellow-800 dark:text-yellow-200">
                    Browser Environment: Using simulated API call to test connection. In production, this would connect directly to MariaDB.
                  </span>
                )}
              </p>
              
              {connectionSuccess !== null && (
                <div className={`p-3 rounded-md ${connectionSuccess ? "bg-green-100 dark:bg-green-900/20" : "bg-red-100 dark:bg-red-900/20"}`}>
                  <p className="flex items-center gap-2 font-medium">
                    {connectionSuccess ? (
                      <>
                        <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
                        Connection Successful
                      </>
                    ) : (
                      <>
                        <AlertTriangle className="h-4 w-4 text-red-600 dark:text-red-400" />
                        Connection Failed
                      </>
                    )}
                  </p>
                  <p className="text-xs mt-1 text-muted-foreground">
                    {connectionSuccess 
                      ? "The application can connect to the database server." 
                      : "Could not establish a connection to the database server."}
                  </p>
                </div>
              )}
              
              {lastTestTime && (
                <p className="text-xs text-muted-foreground">
                  Last test: {lastTestTime}
                </p>
              )}
            </div>
            
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
              {isDatabaseMock && (
                <span className="block mt-2 p-2 bg-yellow-100 dark:bg-yellow-900/20 rounded text-yellow-800 dark:text-yellow-200">
                  Browser Environment: Using in-memory mock database.
                </span>
              )}
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
          {isDatabaseMock 
            ? "Browser environment detected. Using simulated connection test." 
            : "For more detailed queries, use a dedicated database client."}
        </p>
      </CardFooter>
    </Card>
  );
};

export default DatabaseConnectionTest;
