
using System.Web.Http;
using Microsoft.Owin;
using Owin;
using System.Web.Http.Cors;

[assembly: OwinStartup(typeof(GFIN.API.Startup))]
namespace GFIN.API
{
    public class Startup
    {
        public void Configuration(IAppBuilder app)
        {
            // Configure Web API
            var config = new HttpConfiguration();
            
            // Enable CORS
            var cors = new EnableCorsAttribute("*", "*", "*");
            config.EnableCors(cors);
            
            // Configure routes
            config.MapHttpAttributeRoutes();
            config.Routes.MapHttpRoute(
                name: "DefaultApi",
                routeTemplate: "api/{controller}/{id}",
                defaults: new { id = RouteParameter.Optional }
            );
            
            // Use Web API with OWIN
            app.UseWebApi(config);
        }
    }
}
