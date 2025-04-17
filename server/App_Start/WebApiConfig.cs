using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Web.Http;
using System.Web.Http.Cors;
using System.Web.Http.Routing;

namespace expense_echo_manager_api
{
    public static class WebApiConfig
    {
        public static void Register(HttpConfiguration config)
        {
            // Web API configuration and services

            // Web API routes
            config.MapHttpAttributeRoutes();

            config.Routes.MapHttpRoute(
                name: "DefaultApi",
                routeTemplate: "api/{controller}/{id}",
                defaults: new { id = RouteParameter.Optional }
            );

            /*
            config.Routes.MapHttpRoute(
              name: "DefaultApi",
              routeTemplate: "{controller}/{id}",
              defaults: new { id = RouteParameter.Optional }
           );
            */

            // CORS
            var cors = new EnableCorsAttribute("http://localhost:8081", "*", "*");
            //var cors = new EnableCorsAttribute("*", "*", "*");
            config.EnableCors(cors);

            

            // Allow OPTIONS method for CORS preflight
            config.Routes.MapHttpRoute(
                name: "Options",
                routeTemplate: "{controller}",
                defaults: null,
                constraints: new { httpMethod = new HttpMethodConstraint(HttpMethod.Options) }
            );
        }
    }
}
