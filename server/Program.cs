
using System;
using Microsoft.Owin.Hosting;

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
            
            // You could add self-hosting capabilities here if desired
            // string baseUrl = "http://localhost:5000/";
            // WebApp.Start<Startup>(baseUrl);
            // Console.WriteLine($"Server running at {baseUrl}");
            // Console.ReadLine();
        }
    }
}
