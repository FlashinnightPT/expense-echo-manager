
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace expense_echo_manager_api.Controllers
{
    [RoutePrefix("ping")]
    public class PingController : ApiController
    {
        [HttpGet]
        [Route("")]
        public HttpResponseMessage Ping()
        {
            return Request.CreateResponse(HttpStatusCode.OK, new { message = "Server is running" });
        }
    }
}
