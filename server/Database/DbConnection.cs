
using System;
using System.Configuration;
using System.IO;
using MySql.Data.MySqlClient;

namespace expense_echo_manager_api.Database
{
    public class DbConnection
    {
        private static string ConnectionString
        {
            get
            {
                //ConfigurationManager.AppSettings

                string basePath = AppDomain.CurrentDomain.BaseDirectory;
                string configPath = Path.Combine(basePath, "Web.config");

                ExeConfigurationFileMap configMap = new ExeConfigurationFileMap { ExeConfigFilename = configPath };
                Configuration config = ConfigurationManager.OpenMappedExeConfiguration(configMap, ConfigurationUserLevel.None);

                string host = config.AppSettings.Settings["DB_HOST"]?.Value;
                string user = config.AppSettings.Settings["DB_USER"]?.Value;
                string password = config.AppSettings.Settings["DB_PASSWORD"]?.Value;
                string database = config.AppSettings.Settings["DB_NAME"]?.Value;
                string port = config.AppSettings.Settings["DB_PORT"]?.Value;

                /*
                string host = ConfigurationManager.AppSettings["DB_HOST"] ?? "94.46.168.180";
                string user = ConfigurationManager.AppSettings["DB_USER"] ?? "gfin_admin";
                string password = ConfigurationManager.AppSettings["DB_PASSWORD"] ?? "P@gu89_lo#";
                string database = ConfigurationManager.AppSettings["DB_NAME"] ?? "GFIN_DB";
                string port = ConfigurationManager.AppSettings["DB_PORT"] ?? "3306";
                */

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
