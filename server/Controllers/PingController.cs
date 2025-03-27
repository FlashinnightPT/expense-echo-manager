
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace GFIN.API.Controllers
{
    [RoutePrefix("api/ping")]
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
