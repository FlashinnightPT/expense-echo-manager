
using System;
using System.Configuration;
using System.IO;
using Microsoft.Owin.Hosting;
using Microsoft.Owin.Hosting.Engine;

namespace GFIN.API
{
    public class Program
    {
        public static void Main()
        {
            // This Main method provides an entry point for the application
            // When running in IIS, this won't actually be used
            // but it satisfies the compiler requirement for an entry point
            
            Console.WriteLine("Starting GFIN API...");
            Console.WriteLine("This console window is for development purposes only.");
            Console.WriteLine("In production, the application will run under IIS.");
            
            // Check if running in development environment
            bool isDevelopment = Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT") == "Development";
            
            // Force load the configuration file
            string configPath = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "Web.config");
            if (File.Exists(configPath))
            {
                Console.WriteLine($"Loading configuration from: {configPath}");
                var configMap = new ExeConfigurationFileMap { ExeConfigFilename = configPath };
                Configuration config = ConfigurationManager.OpenMappedExeConfiguration(configMap, ConfigurationUserLevel.None);
                ConfigurationManager.RefreshSection("appSettings");
            }
            else
            {
                Console.WriteLine($"Warning: Configuration file not found at {configPath}");
            }
            
            // Log the loaded AppSettings
            Console.WriteLine("AppSettings Contents:");
            foreach (string key in ConfigurationManager.AppSettings.AllKeys)
            {
                Console.WriteLine($"{key} = {ConfigurationManager.AppSettings[key]}");
            }
            
            if (isDevelopment)
            {
                // Only start self-hosting in development environment
                string port = ConfigurationManager.AppSettings["PORT"] ?? "5000";
                string baseUrl = $"http://localhost:{port}/";
                
                try
                {
                    // Create startup options with explicit server specification
                    var options = new StartOptions(baseUrl)
                    {
                        ServerFactory = "Microsoft.Owin.Host.HttpListener"
                    };
                    
                    using (WebApp.Start<Startup>(options))
                    {
                        Console.WriteLine($"Server running at {baseUrl}");
                        Console.WriteLine("Press Enter to stop the server...");
                        Console.ReadLine();
                    }
                }
                catch (Exception ex)
                {
                    Console.ForegroundColor = ConsoleColor.Red;
                    Console.WriteLine($"Error starting server: {ex.Message}");
                    Console.WriteLine(ex.StackTrace);
                    Console.ResetColor();
                    Console.WriteLine("Press Enter to exit...");
                    Console.ReadLine();
                }
            }
            else
            {
                // In production, just log that the application has started
                // The actual hosting is handled by IIS
                Console.WriteLine("Application started in production mode.");
            }
        }
    }
}
