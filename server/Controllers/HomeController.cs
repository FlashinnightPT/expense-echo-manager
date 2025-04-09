using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Http;

namespace expense_echo_manager_api.Controllers
{
    public class HomeController : ApiController
    {
        [HttpGet]
        //[Route("api/home")]
        [Route("home")]
        public IHttpActionResult Get()
        {
            return Ok("Hello from OWIN Web API!");
        }
    }
}