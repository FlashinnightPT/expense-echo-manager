
using System;
using System.Configuration;
using MySql.Data.MySqlClient;

namespace GFIN.API.Database
{
    public class DbConnection
    {
        private static string ConnectionString
        {
            get
            {
                string host = ConfigurationManager.AppSettings["DB_HOST"] ?? "94.46.168.180";
                string user = ConfigurationManager.AppSettings["DB_USER"] ?? "gfin_admin";
                string password = ConfigurationManager.AppSettings["DB_PASSWORD"] ?? "P@gu89_lo#";
                string database = ConfigurationManager.AppSettings["DB_NAME"] ?? "GFIN_DB";
                string port = ConfigurationManager.AppSettings["DB_PORT"] ?? "3306";
                
                return $"Server={host};Database={database};User ID={user};Password={password};Port={port};";
            }
        }
        
        public static MySqlConnection GetConnection()
        {
            try
            {
                var connection = new MySqlConnection(ConnectionString);
                return connection;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error creating database connection: {ex.Message}");
                throw;
            }
        }
        
        public static bool TestConnection()
        {
            try
            {
                using (var connection = GetConnection())
                {
                    connection.Open();
                    connection.Close();
                    return true;
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Database connection test failed: {ex.Message}");
                return false;
            }
        }
    }
}
